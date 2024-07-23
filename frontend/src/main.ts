import { createApp } from 'vue';
import './style.scss';
import 'primeicons/primeicons.css';
import App from './App.vue';

import { createRouter, createWebHistory } from "vue-router";

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'

import HomeComponent from "./components/HomeComponent.vue";
import SearchComponent from "./components/SearchComponent.vue";
import VueMarkdown from "vue-markdown-render";
import AddComponent from "./components/AddComponent.vue";

const routes = [
    { path:'/', name:"home", component: HomeComponent },
    { path:'/search/:query', name:"search", component: SearchComponent },
    { path: '/suggest', name: 'suggest', component: AddComponent }
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
   .mount("#app");
