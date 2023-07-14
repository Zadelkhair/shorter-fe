<script setup>
import { reactive } from "vue";
import axios from "axios";
import { SERVER_ENDPOINT } from "@/config.js";
// import router
import { useRouter } from "vue-router";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.min.css";

const loginState = reactive({
  username: "",
  password: "",
});

const validateState = reactive({
  username: "",
  password: "",
});

const loaderState = reactive({
  login: false,
});

// validators
const validateUsername = () => {
  // email regix
  const emailRegex = /\S+@\S+\.\S+/;

  // username
  if (!loginState.username) {
    validateState.username = "Username is required";
    return false;
  } else if (!emailRegex.test(loginState.username)) {
    validateState.username = "Username is invalid";
    return false;
  } else {
    validateState.username = "";
    return true;
  }
};

const validatePassword = () => {
  // password
  if (!loginState.password) {
    validateState.password = "Password is required";
    return false;
  } else {
    validateState.password = "";
    return true;
  }
};

const router = useRouter();

const login = async () => {
  const { username, password } = loginState;

  // validate
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  if (!isUsernameValid || !isPasswordValid) {

    // show error message
    // new Notify({
    //   status: "error",
    //   title: "Error",
    //   text: "Invalid username or password",
    //   effect: "fade",
    //   autotimeout: 5000,
    //   autoclose: true,
    //   position: "bottom right",
    // });
    
    for( const key in validateState ) {
      if( validateState[key] ) {
        new Notify({
          status: "error",
          title: "Error",
          text: validateState[key],
          effect: "fade",
          autotimeout: 5000,
          autoclose: true,
          position: "bottom right",
        });

        return;
      }
    }

    return;
  }

  try {

    // show loader
    loaderState.login = true;

    const res = await axios.post(SERVER_ENDPOINT + "/api/login", {
      email: username,
      password,
    });

    // hide loader
    loaderState.login = false;

    const user = JSON.stringify(res.data.data);
    localStorage.setItem("user", user);

    // redirect to homepage '/'
    // router.push("/");
    window.location.href = "/";
  } catch (err) {

    // hide loader
    loaderState.login = false;
    
    console.log(err);

    // show error message
    new Notify({
      status: "error",
      title: "Error",
      text: "Invalid username or password",
      effect: "fade",
      autotimeout: 5000,
      autoclose: true,
      position: "bottom right",
    });
  }
};
</script>

<template>
  <!-- auth -->
  <div class="app-auth">
    <div class="register-form">
      <h1>Login</h1>
      <div class="form-control">
        <label for="username">Email</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          :class="validateState.username ? 'is-invalid' : ''"
          v-model="loginState.username"
        />
        <small>Error message</small>
      </div>
      <div class="form-control">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          :class="validateState.password ? 'is-invalid' : ''"
          v-model="loginState.password"
        />
        <small>Error message</small>
      </div>
      <button type="submit" @click="login">
        Login
        <!-- bootstrap loader -->
        <div
          class="spinner-border spinner-border-sm"
          role="status"
          v-if="loaderState.login"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
      <p>
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/auth.scss";
</style>
