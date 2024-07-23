<script setup lang="ts">

import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";

import axios from 'axios'

import {useRouter} from "vue-router";

let searchValue: string;
const router = useRouter();

const NGROKSERVERURL = "https://00a5-216-9-29-203.ngrok-free.app";

async function searchQuery() {
  router.push({ name: 'search', params: { query: encodeURIComponent(searchValue) } });

  await axios.get(`${NGROKSERVERURL}/naturalUserQuery/${searchValue}`, {
      headers: {
        "ngrok-skip-browser-warning": "0"
      }
  }).then((res) => {
    alert(`SMARTPANTS HAS ORGANIZED YOUR DATA: ${JSON.stringify(res)}`);
  });
  
}

const props = defineProps({
  text: {type: String},
})
</script>

<template>
  <IconField class="input-field">
    <InputIcon class="pi pi-search" />
    <InputText type="text" class="search-bar" v-model="searchValue" :placeholder="props.text" v-on:keydown.enter="searchQuery()" />
  </IconField>
</template>

<style scoped>

</style>