<script setup lang="ts">

import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";

import {useRouter} from "vue-router";
// import SearchComponent from "./SearchComponent.vue";

let searchValue: string;
const router = useRouter();

// This component should simply push the query text through the router,
// without doing any network operations on its own.
async function searchQuery() {
  router.push({ name: 'search', 
      params: { 
        query: encodeURIComponent(searchValue)
      } 
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

.search-bar {
  border-radius: 500px;
  width: 30vw;
  font-size: 20px;
}

</style>