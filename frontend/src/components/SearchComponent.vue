<script setup lang="ts">
import {useRoute} from "vue-router";
// import SearchBarComponent from "./SearchBarComponent.vue";
// import Menubar from "primevue/menubar";
import Card from "primevue/card";
import Tag from "primevue/tag";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import VueMarkdown from 'vue-markdown-render'

import { ref, onMounted } from "vue";
import axios from 'axios'

// import * as SampleData from './SampleData.ts';
import MenuBarComponent from "./MenuBarComponent.vue";
import { NGROKSERVERURL } from "../main.ts";
import sampleData from "./SampleData.ts";

// Match db schema
interface SearchResult {
    _id: number;
    title: string;
    flags: Array<string>;
    description: string;
    content: string;
    url: string;
};

const route = useRoute();

// All variables related to search results
var resultBlocks = ref([] as Array<SearchResult>);

// Why is there a compiler error here?
const searchQuery = decodeURIComponent(<string>route.params['query']);

// This component takes query string from router push, then executes GET requests
// on its own. Results should load with this page, not with a submission from a sibling
// component (i.e request through this component's respective URL should work as well as
// a query submission through the bar component)
const fetchResults = async () => {
  if (searchQuery == "skibidi") {
    resultBlocks.value = sampleData;
    return;
  }
  await axios.get(`${NGROKSERVERURL}/naturalUserQuery/${searchQuery}`, {
      headers: {
        "ngrok-skip-browser-warning": "0"
      }
  }).then((res) => {
     resultBlocks.value = res["data"];
  });
};

// V3.0
onMounted(fetchResults);

const visible = ref(false);
const selected = ref({
  title: "",
  type: "",
  flags: [],
  description: "",
  content: "",
  url: ""
});

function select(item: any) {
  visible.value = true;
  selected.value = item;
}

</script>

<template>
  <MenuBarComponent :text="searchQuery" :displaySearch="true" />
<!--  <Menubar :model="items" class="container">-->
<!--    <template #start>-->
<!--      <SearchBarComponent :text="searchQuery" />-->
<!--    </template>-->
<!--  </Menubar>-->

  <div class="container w-full">
    <span class="small-text mb-24 text-lg">Showing results for <b>{{ searchQuery }}</b></span>
<!--    for ever result -->
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
        v-for="(result, index) in resultBlocks" class="result-card w-full">
      <template #title><a :href="result.url" target="_blank">{{result.title}}</a></template>
      <template #subtitle>
        {{result.url}}
      </template>
      <template #content>{{result.description}}</template>
      <template #footer>
        <Tag class="flag" v-for="flag in result.flags" :value="flag"></Tag>
        <Button class="why-button" label="" icon="pi pi-question" iconPos="right" @click="() => {select(result)}" />
      </template>
    </Card>
  </div>

  <Dialog v-model:visible="visible" modal :header="selected.title" :style="{width: '75vw'}" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="inner-container">
      <vue-markdown :source="selected.content"></vue-markdown>
      <div class="button-container">
        <Button as="a" label="Why" icon="pi pi-question" target="_blank" rel="noopener" iconPos="right" class="open-button" />
        <Button as="a" label="Add to list" icon="pi pi-list" target="_blank" rel="noopener" iconPos="right" class="open-button" />
        <Button as="a" label="Open" icon="pi pi-link" :href="selected.url" target="_blank" rel="noopener" iconPos="right" class="open-button" />
      </div>
    </div>
  </Dialog>
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
}
</style>