<script setup lang="ts">

import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";

import {useRouter} from "vue-router";

let searchValue: string;
const router = useRouter();

function searchQuery() {
  router.push({ name: 'search', params: { query: encodeURIComponent(searchValue) } })
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