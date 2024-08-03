import { createApp } from 'vue';
import './style.scss';
import 'primeicons/primeicons.css';
import App from './App.vue';

import { createRouter, createWebHistory } from "vue-router";

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'

import { MotionPlugin } from "@vueuse/motion";

import HomeComponent from "./components/HomeComponent.vue";
import SearchComponent from "./components/SearchComponent.vue";
import VueMarkdown from "vue-markdown-render";
import AddComponent from "./components/AddComponent.vue";
import ListComponent from "./components/ListComponent.vue";

// NGROK Public url, might need to make this fixed eventually it'll be a headache otherwise.
export const NGROKSERVERURL = "https://honest-solely-emu.ngrok-free.app";

const routes = [
    { path:'/', name:"home", component: HomeComponent },
    { path:'/search/:query', name:"search", component: SearchComponent },
    { path: '/suggest', name: 'suggest', component: AddComponent },
    { path: '/list', name: 'list', component: ListComponent }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

const app = createApp(App);
app.use(router)
   .use(PrimeVue, {
    theme: {
        preset: Aura
    }
   })
   .use(VueMarkdown)
    .use(MotionPlugin)
   .mount("#app");
