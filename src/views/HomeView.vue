<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { SERVER_ENDPOINT } from "@/config.js";
import axios from "axios";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.min.css";

const state = reactive({
  shortlinks: [
    // {
    //   id: 2,
    //   url: "https://google.com",
    //   short_url: "7fnJzt",
    //   clicks: 0,
    //   created_at: "2023-07-12T22:33:06.000000Z",
    //   updated_at: "2023-07-12T22:33:06.000000Z",
    //   duration: 172800,
    //   expires_in: 172800,
    //   user_id: null,
    //   nonloggedinuser_id: "ksqljqkjfqlsj",
    //   visits: [],
    // },
  ],
  shortlinksPagination: {
    current_page: 1,
    form: 1,
    to: 5,
    last_page: 1,
  },
  views: [
    // {
    //   "id": 16,
    //   "url_id": 16,
    //   "ip": "127.0.0.1",
    //   "country": "United States (US)",
    //   "city": "New Haven",
    //   "browser": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    //   "device": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    //   "created_at": "2023-07-13T13:59:12.000000Z",
    //   "updated_at": "2023-07-13T13:59:12.000000Z"
    //   },
  ],
  viewsPagination: {
    // current_page: 1,
    // form: 1,
    // to: 5,
    // last_page: 1,
  },
  url: "",
  counter: 0,
});

const loadersState = reactive({
  creatingShortlink: false,
  loadingShortlinks: false,
  loadingViews: false,
});

const errorsState = reactive({
  url: "",
});

// start the counter
setInterval(() => {
  state.counter++;
}, 1000);

// countdown filter
const countdown = (duration) => {
  if (duration < 0) {
    return "Expired";
  }

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}h ${minutes < 10 ? "0" + minutes : minutes}m ${
    seconds < 10 ? "0" + seconds : seconds
  }s`;
};

// extruct country code
const extractCountryCode = (country) => {
  if (!country) {
    return "";
  }

  // the country code is between ()
  const countryCode = country.match(/\(([^)]+)\)/)[1];

  return countryCode;
};

// validators
const validateUrl = (url = state.url) => {
  if (!url) {
    errorsState.url = "Please enter a url";
    return false;
  }

  // regix check url is valid
  const urlRegex = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + //port
      "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  if (!urlRegex.test(url)) {
    errorsState.url = "Please enter a valid url";
    return false;
  }

  errorsState.url = "";
  return true;
};

computed(() => {
  console.log("counter", state.counter);
});

onMounted(async () => {
  loadUrls(1);
});

// loadUrls
const loadUrls = async (page) => {
  // if user is not logged in,
  if (window.user) {
    try {
      loadersState.loadingShortlinks = true;

      // get shortlinks from server
      const res = await axios.get(SERVER_ENDPOINT + "/api/urls", {
        headers: {
          Authorization: `Bearer ${window.user.token}`,
        },
        params: {
          page,
        },
      });

      loadersState.loadingShortlinks = false;

      state.shortlinks = res.data.data.urls.data;

      // set pagination info
      state.shortlinksPagination.current_page = res.data.data.urls.current_page;
      state.shortlinksPagination.from = res.data.data.urls.from;
      state.shortlinksPagination.to = res.data.data.urls.to;
      state.shortlinksPagination.last_page = res.data.data.urls.last_page;
    } catch (e) {
      console.log(e);

      loadersState.loadingShortlinks = false;

      new Notify({
        status: "error",
        title: "Shortlinks loading failed",
        text: "Failed to load your shortlinks",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    }
  } else {
    let nonloggedinuser_id = localStorage.getItem("nonloggedinuser_id");
    // check if non loggedinuser_id exists in logged in
    if (!nonloggedinuser_id) {
      // if not, create a new one
      nonloggedinuser_id = uuidv4();
      localStorage.setItem("nonloggedinuser_id", nonloggedinuser_id);
    }

    loadersState.loadingShortlinks = true;

    try {
      // get shortlinks from server
      const res = await axios.get(
        SERVER_ENDPOINT + "/api/nonloggedinuser/urls",
        {
          params: {
            nonloggedinuser_id,
            page,
          },
        }
      );

      loadersState.loadingShortlinks = false;

      state.shortlinks = res.data.data.urls.data;

      // set pagination info
      state.shortlinksPagination.current_page = res.data.data.urls.current_page;
      state.shortlinksPagination.from = res.data.data.urls.from;
      state.shortlinksPagination.to = res.data.data.urls.to;
      state.shortlinksPagination.last_page = res.data.data.urls.last_page;
    } catch (e) {
      console.log(e);

      loadersState.loadingShortlinks = false;
    }
  }
};

// loadViews
const loadViews = async (shortlink_id, page = 1) => {
  if (window.user) {
    try {
      loadersState.loadingViews = true;

      // get views from server
      const res = await axios.get(
        SERVER_ENDPOINT + `/api/urls/${shortlink_id}/views`,
        {
          headers: {
            Authorization: `Bearer ${window.user.token}`,
          },
          params: {
            page,
          },
        }
      );

      loadersState.loadingViews = false;

      state.views = res.data.data.visits.data;

      // set pagination info
      state.viewsPagination.current_page = res.data.data.visits.current_page;
      state.viewsPagination.from = res.data.data.visits.from;
      state.viewsPagination.to = res.data.data.visits.to;
      state.viewsPagination.last_page = res.data.data.visits.last_page;
    } catch (e) {
      console.log(e);

      loadersState.loadingViews = false;
    }
  } else {
    let nonloggedinuser_id = localStorage.getItem("nonloggedinuser_id");
    // check if non loggedinuser_id exists in logged in
    if (!nonloggedinuser_id) {
      // if not, create a new one
      nonloggedinuser_id = uuidv4();
      localStorage.setItem("nonloggedinuser_id", nonloggedinuser_id);
    }

    try {
      loadersState.loadingViews = true;

      // get views from server
      const res = await axios.get(
        SERVER_ENDPOINT + `/api/nonloggedinuser/urls/${shortlink_id}/views`,
        {
          params: {
            nonloggedinuser_id,
            page,
          },
        }
      );

      loadersState.loadingViews = false;

      state.views = res.data.data.visits.data;

      // set pagination info
      state.viewsPagination.current_page = res.data.data.visits.current_page;
      state.viewsPagination.from = res.data.data.visits.from;
      state.viewsPagination.to = res.data.data.visits.to;
      state.viewsPagination.last_page = res.data.data.visits.last_page;
    } catch (e) {
      console.log(e);

      loadersState.loadingViews = false;
    }
  }
};

const createShortLink = async () => {
  // /api/shorten
  // params : url and duration
  // if user is not logged in get/create nonloggedinuser_id

  // validate url
  if (!validateUrl(state.url)) {
    new Notify({
      status: "error",
      title: "Url validation",
      text: errorsState.url,
      effect: "fade",
      autotimeout: 5000,
      autoclose: true,
      position: "bottom right",
    });
    return;
  }

  if (window.user) {
    // if user is logged in

    try {
      loadersState.creatingShortlink = true;

      const res = await axios.post(
        SERVER_ENDPOINT + "/api/shorten",
        {
          url: state.url,
          duration: 172800,
        },
        {
          headers: {
            Authorization: `Bearer ${window.user.token}`,
          },
        }
      );

      loadersState.creatingShortlink = false;

      state.shortlinks.unshift(res.data.data.url);

      new Notify({
        status: "success",
        title: "Shortlink created",
        text: "Your shortlink has been created",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    } catch (e) {
      console.log(e);

      loadersState.creatingShortlink = false;

      new Notify({
        status: "error",
        title: "Shortlink creation failed",
        text: "Your shortlink could not be created",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    }
  } else {
    // if user is not logged in
    // create shortlink with nonloggedinuser_id

    let nonloggedinuser_id = localStorage.getItem("nonloggedinuser_id");
    // check if non loggedinuser_id exists in logged in
    if (!nonloggedinuser_id) {
      // if not, create a new one
      nonloggedinuser_id = uuidv4();
      localStorage.setItem("nonloggedinuser_id", nonloggedinuser_id);
    }

    try {
      loadersState.creatingShortlink = true;

      const res = await axios.post(
        SERVER_ENDPOINT + "/api/nonloggedinuser/shorten",
        {
          url: state.url,
          duration: 172800,
          nonloggedinuser_id,
        }
      );

      loadersState.creatingShortlink = false;

      state.shortlinks.unshift(res.data.data.url);

      new Notify({
        status: "success",
        title: "Shortlink created",
        text: "Your shortlink has been created",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    } catch (e) {
      console.log(e);

      loadersState.creatingShortlink = false;

      new Notify({
        status: "error",
        title: "Shortlink creation failed",
        text: "Your shortlink could not be created",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    }
  }
};

// see views, display the modal
const seeViews = async (shortlink_id) => {
  // reset views
  state.views = [];

  const myModal = document.getElementById("viewsModal");

  const modal = new bootstrap.Modal(myModal, {
    keyboard: false,
  });

  modal.show();

  // get views
  await loadViews(shortlink_id);
};

const copyLink = (url) => {
  // copy link to clipboard
  navigator.clipboard.writeText(url);

  new Notify({
    status: "success",
    title: "Link copied",
    text: "Your link has been copied to clipboard",
    effect: "fade",
    autotimeout: 5000,
    autoclose: true,
    position: "bottom right",
  });
};

const deleteLink = async (id) => {
  // Delete link functionality

  // Route::delete('/urls/{id}'

  if (window.user) {
    try {
      await axios.delete(SERVER_ENDPOINT + "/api/urls/" + id, {
        headers: {
          Authorization: `Bearer ${window.user.token}`,
        },
      });

      state.shortlinks = state.shortlinks.filter((link) => link.id !== id);

      new Notify({
        status: "success",
        title: "Link deleted",
        text: "Your link has been deleted",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    } catch (e) {
      console.log(e);

      new Notify({
        status: "error",
        title: "Link deletion failed",
        text: "Your link could not be deleted",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    }
  } else {
    let nonloggedinuser_id = localStorage.getItem("nonloggedinuser_id");
    // check if non loggedinuser_id exists in logged in
    if (!nonloggedinuser_id) {
      // if not, create a new one
      nonloggedinuser_id = uuidv4();
      localStorage.setItem("nonloggedinuser_id", nonloggedinuser_id);
    }

    try {
      await axios.delete(SERVER_ENDPOINT + "/api/nonloggedinuser/urls/" + id, {
        params: {
          nonloggedinuser_id,
        },
      });

      state.shortlinks = state.shortlinks.filter((link) => link.id !== id);

      new Notify({
        status: "success",
        title: "Link deleted",
        text: "Your link has been deleted",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    } catch (e) {
      console.log(e);

      new Notify({
        status: "error",
        title: "Link deletion failed",
        text: "Your link could not be deleted",
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
    }
  }
};
</script>

<template>
  <div class="app-home">
    <div class="shortlink-form">
      <center>
        <h1 class="mb-4 text-uppercase">Shorten your link</h1>
      </center>
      <div class="form-control" :class="errorsState.url ? 'is-invalid' : ''">
        <input
          type="text"
          id="link"
          placeholder="Enter your link ( https://example.com )"
          v-model="state.url"
          :disabled="loadersState.creatingShortlink"
        />
      </div>
      <button type="submit" class="btn btn-primary" @click="createShortLink">
        <!-- bootstrap loader -->
        <span
          v-if="loadersState.creatingShortlink"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <template v-else>
          Shorten
          <i class="fas fa-link"></i>
        </template>
      </button>
    </div>

    <!-- loading -->
    <div v-if="loadersState.loadingShortlinks" class="shortlink-list loading">
      <center>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </center>
    </div>
    <template v-else>
      <div v-if="state.shortlinks.length" class="shortlink-list mb-4">
        <!-- <center> -->
        <h2>Your Shortlinks :</h2>
        <!-- </center> -->
        <div
          class="shortlink-item row"
          v-for="link in state.shortlinks"
          :key="link.id"
        >
          <div class="shortlink-item-left col-12 mx-auto col-md-8">
            <div class="shortlink-item-url shortlink-item-url mx-auto d-flex justify-content-center justify-content-md-start">
              <a
                :href="`${SERVER_ENDPOINT}/${link.short_url}`"
                target="_blank"
                @click="link.clicks++"
                >{{ `${SERVER_ENDPOINT}/${link.short_url}` }}</a
              >
              <i class="mx-2 fas fa-arrow-right"></i>
              <a :href="link.url" target="_blank">{{ link.url }}</a>
            </div>
          </div>
          <div class="shortlink-item-right col-12 mt-2 mt-md-0 mx-auto col-md-4 justify-content-center justify-content-md-start">
            <div class="shortlink-item-stats ms-md-auto">
              <div class="shortlink-item-stats-left">
                <div
                  class="shortlink-item-stats-left-item"
                  @click="seeViews(link.id)"
                >
                  <i class="fas fa-eye"></i>
                  <span>
                    {{ link.clicks }}
                  </span>
                </div>
                <div class="shortlink-item-stats-left-item">
                  <i class="fas fa-hourglass-half"></i>
                  <span>{{ countdown(link.expires_in - state.counter) }}</span>
                </div>
              </div>
            </div>

            <button
              class="copy-button"
              @click="copyLink(`${SERVER_ENDPOINT}/${link.short_url}`)"
            >
              <i class="fas fa-copy"></i>
            </button>
            <button class="delete-button" @click="deleteLink(link.id)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- pagination -->
        <div
          v-if="state.shortlinksPagination"
          class="pagination d-flex justify-content-center align-items-center mt-4"
        >
          <button
            class="btn me-2 border-0"
            :disabled="state.shortlinksPagination.current_page == 1"
            @click="loadUrls(state.shortlinksPagination.current_page - 1)"
          >
            <i class="fas fa-arrow-left"></i>
          </button>

          <!-- pages -->
          <button
            class="btn me-2 border-0 btn-danger btn-sm"
            v-for="page in state.shortlinksPagination.last_page"
            :key="page"
            :disabled="state.shortlinksPagination.current_page === page"
            :class="
              state.shortlinksPagination.current_page === page ? 'bold' : ''
            "
            @click="loadUrls(page)"
          >
            {{ page }}
          </button>

          <button
            class="btn border-0"
            :disabled="
              state.shortlinksPagination.current_page ==
              state.shortlinksPagination.last_page
            "
            @click="loadUrls(state.shortlinksPagination.current_page + 1)"
          >
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div v-else class="shortlink-list">
        <center>
          <h2>You don't have any shortlinks yet</h2>
        </center>
      </div>
    </template>

    <!-- bootstrap 5 modal to display the views of a url in an array -->
    <div
      class="modal fade modal-lg"
      id="viewsModal"
      tabindex="-1"
      aria-labelledby="viewsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewsModalLabel">
              <i class="fa fa-eye small" />
              {{ state.views.length }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="loadersState.loadingViews" class="loading">
              <center>
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </center>
            </div>
            <template v-else>
              <div v-if="state.views.length" class="views-list">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th scope="col">IP</th>
                      <th scope="col" colspan="2">Country</th>
                      <th scope="col">City</th>
                      <th scope="col">Browser</th>
                      <th scope="col">Device</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="view in state.views" :key="view.id">
                      <th scope="row">{{ view.ip }}</th>
                      <td>
                        <img
                          class="country-flag"
                          height="15"
                          width="20"
                          :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${extractCountryCode(
                            view.country
                          )}.svg`"
                          alt="country flag"
                        />
                      </td>
                      <td>{{ view.country }}</td>
                      <td>{{ view.city }}</td>
                      <td>{{ view.browser }}</td>
                      <td>{{ view.device }}</td>
                      <td>{{ view.created_at }}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- pagination -->
                <div
                  v-if="state.viewsPagination"
                  class="pagination d-flex justify-content-center align-items-center mt-4"
                >
                  <button
                    class="btn me-2 border-0"
                    :disabled="state.viewsPagination.current_page == 1"
                    @click="loadViews(state.viewsPagination.current_page - 1)"
                  >
                    <i class="fas fa-arrow-left"></i>
                  </button>

                  <!-- pages -->
                  <button
                    class="btn me-2 border-0 btn-danger btn-sm"
                    v-for="page in state.viewsPagination.last_page"
                    :key="page"
                    :disabled="state.viewsPagination.current_page === page"
                    :class="
                      state.viewsPagination.current_page === page ? 'bold' : ''
                    "
                    @click="loadViews(page)"
                  >
                    {{ page }}
                  </button>

                  <button
                    class="btn border-0"
                    :disabled="
                      state.viewsPagination.current_page ==
                      state.viewsPagination.last_page
                    "
                    @click="loadViews(state.viewsPagination.current_page + 1)"
                  >
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              <div v-else class="views-list">
                <center>
                  <h2>No views yet</h2>
                </center>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/home.scss";
</style>
