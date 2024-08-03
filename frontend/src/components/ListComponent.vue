<script setup lang="ts">
import { Storage } from '../Storage';
import MenuBarComponent from "./MenuBarComponent.vue";
import Card from "primevue/card";
import Tag from "primevue/tag";
import Button from "primevue/button";
import Divider from "primevue/divider";
import VueMarkdown from 'vue-markdown-render'

// Match db schema
interface SearchResult {
  _id: number;
  title: string;
  flags: Array<string>;
  description: string;
  content: string;
  url: string;
};

import {ref} from "vue";

let list = ref([] as Array<SearchResult>);

let temp = Storage.getStorage("list", "opportunities");
if (!temp) {
  temp = [];
  Storage.saveStorage("list", {"opportunities": []});
}
list.value = temp;

function removeElement(index: number) {
  list.value.splice(index, 1);
  Storage.saveStorage('list', {'opportunities': list.value});
}
console.log(list)
</script>

<template>
  <MenuBarComponent class="absolute" :displaySearch="false"/>
  <div class="px-12">
    <h1 class="py-12 font-bold text-center w-full" v-if="list.length == 0">
      You haven't added anything!
      <br />
      <p class="text-2xl font-normal my-2">Any items added from our database will appear here.</p>
    </h1>
    <Card
        v-motion
        :initial="{
          opacity: 0,
          y: -100,
          scale: 1
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: '100',
            delay: (index + 1) * 150
          },
          scale: 1
        }"
        :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: '100',
            delay: (index + 1) * 150
          },
          scale: 1
        }"
        :hovered="{
          scale: 1.02,
        }"
        v-for="(result, index) in list" class="result-card w-full">
      <template #title><a :href="result.url" target="_blank">{{result.title}}</a></template>
      <template #subtitle>
        {{result.url}}
      </template>
      <template #content>
        {{result.description}}
        <Divider/>
        <vue-markdown :source="result.content"></vue-markdown>
      </template>
      <template #footer>
        <Tag class="flag" v-for="flag in result.flags" :value="flag"></Tag>
        <Button class="why-button" label="" icon="pi pi-times" iconPos="right" @click="removeElement(index)" />
      </template>
    </Card>
  </div>
</template>

<style scoped>

.button-container {
  display: flex;
}
.open-button {
  width: auto;
  margin: 0.5rem;
  flex-grow: 1;
}
.inner-container {
  margin: 1rem;
}
.why-button {
  float: right;
  border-radius: 100%;
  background-color: red !important;
  color: white;
  border: none;
}
.flag {
  margin-right: .5rem;
}
.result-card {
  padding: 1rem;
  margin-top: 2rem;
}
.small-text {
  color: grey;
  padding-left: 1rem;
}
.container {
  padding: 1rem 6rem;
  min-width: 100%;
  width: 100%;
}
</style>