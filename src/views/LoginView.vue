<script setup>
import { reactive } from "vue";
import axios from "axios";
import { SERVER_ENDPOINT } from "@/config.js";
// import router
import { useRouter } from "vue-router";

const loginState = reactive({
  username: "",
  password: "",
});

const router = useRouter();

const login = async () => {
  const { username, password } = loginState;

  try {
    const res = await axios.post(SERVER_ENDPOINT + "/api/login", {
      email: username,
      password,
    });

    const user = JSON.stringify(res.data.data);
    localStorage.setItem("user", user);

    // redirect to homepage '/'
    // router.push("/");
    window.location.href = "/";

  } catch (err) {
    console.log(err);
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
          v-model="loginState.password"
        />
        <small>Error message</small>
      </div>
      <button type="submit" @click="login">Login</button>
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
