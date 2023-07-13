<script setup>
import { reactive } from "vue";
// import
import axios from "axios";
import { SERVER_ENDPOINT } from "@/config.js";

const registerState = reactive({
  username: "",
  email: "",
  password: "",
  password2: "",
});

const register = async () => {
  const { username, email, password, password2 } = registerState;

  if (password !== password2) {
    alert("Passwords do not match");
    return;
  }
  try {
    const res = await axios.post(SERVER_ENDPOINT + "/api/register", {
      name : username,
      email,
      password,
    });

    const user = JSON.stringify(res.data.data);
    localStorage.setItem("user",user);
    window.location.reload();

  } catch (err) {
    console.log(err);
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
      <button type="submit" @click="register">Register</button>
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
