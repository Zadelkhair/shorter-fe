import './assets/main.css'

import * as Popper from '@popperjs/core';

window.Popper = Popper;

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.js'
window.bootstrap = bootstrap;

import './assets/fontawesome-free-6.4.0-web/css/all.css'
import './assets/fontawesome-free-6.4.0-web/js/all.js'

let user = localStorage.getItem("user");

// make user available globally
window.user = JSON.parse(user);

const app = createApp(App)

app.use(router)

app.mount('#app')
