<script setup>
import { reactive } from "vue";
// import
import axios from "axios";
import { SERVER_ENDPOINT } from "@/config.js";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.min.css";

const registerState = reactive({
  username: "",
  email: "",
  password: "",
  password2: "",
});

const validateState = reactive({
  username: "",
  email: "",
  password: "",
  password2: "",
});

const loaderState = reactive({
  register: false,
});

// validators
const validateUsername = () => {
  // username
  if (!registerState.username) {
    validateState.username = "Username is required";
    return false;
  } else {
    validateState.username = "";
    return true;
  }
};

const validateEmail = () => {
  // email regix
  const emailRegex = /\S+@\S+\.\S+/;

  // email
  if (!registerState.email) {
    validateState.email = "Email is required";
    return false;
  } else if (!emailRegex.test(registerState.email)) {
    validateState.email = "Email is invalid";
    return false;
  } else {
    validateState.email = "";
    return true;
  }
};

const validatePassword = () => {
  // password
  if (!registerState.password) {
    validateState.password = "Password is required";
    return false;
  } else {
    validateState.password = "";
    return true;
  }
};

const validatePassword2 = () => {
  // password2
  if (!registerState.password2) {
    validateState.password2 = "Password is required";
    return false;
  } else {
    validateState.password2 = "";
    return true;
  }
};

const register = async () => {
  const { username, email, password, password2 } = registerState;

  // validate
  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isPassword2Valid = validatePassword2();

  if (
    !isUsernameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isPassword2Valid
  ) {

    for (const key in validateState) {
      if (validateState[key]) {

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

  if (password !== password2) {
    
    new Notify({
      status: "error",
      title: "Error",
      text: "Passwords do not match",
      effect: "fade",
      autotimeout: 5000,
      autoclose: true,
      position: "bottom right",
    });

    return;
  }
  try {

    loaderState.register = true;

    const res = await axios.post(SERVER_ENDPOINT + "/api/register", {
      name : username,
      email,
      password,
    });

    loaderState.register = false;

    const user = JSON.stringify(res.data.data);
    localStorage.setItem("user",user);
    window.location.reload();

  } catch (err) {
    console.log(err);

    loaderState.register = false;

    console.log(err.response.data?.error)

    for(const key in err.response.data.error)
      new Notify({
        status: "error",
        title: "Error in " + key,
        text:  err.response.data?.error[key][0],
        effect: "fade",
        autotimeout: 5000,
        autoclose: true,
        position: "bottom right",
      });
  }
};

</script>

<template>
  <div class="app-auth">
    <!-- register form using white and red and black -->
    <div class="register-form">
      <h1>Register</h1>
      <div class="form-control">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          v-model="registerState.username"
        />
        <small>Error message</small>
      </div>
      <div class="form-control">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter email"
          v-model="registerState.email"
        />
        <small>Error message</small>
      </div>
      <div class="form-control">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          v-model="registerState.password"
        />
        <small>Error message</small>
      </div>
      <div class="form-control">
        <label for="password2">Confirm Password</label>
        <input
          type="password"
          id="password2"
          placeholder="Enter password again"
          v-model="registerState.password2"
        />
        <small>Error message</small>
      </div>
      <button type="submit" @click="register">
        Register
        <!-- bootstrap loader -->
        <div
          class="spinner-border spinner-border-sm"
          role="status"
          v-if="loaderState.register"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
      <p>
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/auth.scss";
</style>
