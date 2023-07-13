<script setup>
import axios from "axios";
import { SERVER_ENDPOINT } from "@/config.js";
const user = window.user;

const logout = async () => {

  // log out api
  try {
    const res = await axios.post(SERVER_ENDPOINT + "/api/logout", {
      headers: {
        "Authorization": "Bearer " + user.token,
        "Accept": "application/json"
      },
    });
    console.log(res);
    window.location.href = "/";
    localStorage.removeItem("user");
  } catch (err) {
    console.log(err);
    window.location.href = "/";
    localStorage.removeItem("user");
  }

};

</script>

<template>
  <div class="app-navbar">
    <div class="app-logo">
      <router-link to="/">
        <img src="../assets/shortlink.png" alt="logo" />
      </router-link>
    </div>

    <div class="app-nav">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About Us</router-link></li>
        <li><router-link to="/services">Services</router-link></li>
        <li><router-link to="/contact">Contact Us</router-link></li>
      </ul>
    </div>

    <!-- auth -->
    <div class="app-auth">
      <ul v-if="!user">
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
      </ul>
    </div>

    <div v-if="user" class="dropdown">
      <a
        class="btn dropdown-toggle"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="fa fa-user me-2"></i>
        {{ user.name }}
      </a>

      <ul class="dropdown-menu">
        <!-- logout button -->
        <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
      </ul>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;

  ul {
    margin: 0;

    li {
      margin: 0;

      a {
        &.router-link-exact-active {
          color: #f00 !important;
          text-decoration: underline !important;
        }
      }
    }
  }

  .app-logo {
    img {
      width: 3rem;
    }
  }

  .app-nav {
    ul {
      display: flex;
      list-style: none;

      li {
        margin-left: 1rem;

        a {
          text-decoration: none;
          color: #000;
          font-weight: 600;
          transition: all 0.3s ease-in-out;

          &:hover {
            color: #f00;
          }
        }
      }
    }
  }

  .app-auth {
    ul {
      display: flex;
      list-style: none;

      li {
        margin-left: 1rem;

        a {
          text-decoration: none;
          color: #000;
          font-weight: 600;
          transition: all 0.3s ease-in-out;

          &:hover {
            color: #f00;
          }
        }
      }
    }
  }
}
</style>
