<script setup lang="ts">
import Menubar from "primevue/menubar";
import Badge from "primevue/badge";
import {ref} from "vue";
import SearchBarComponent from "./SearchBarComponent.vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

import config from "./config.json";
import { GoogleGenerativeAI } from "@google/generative-ai";

import VueMarkdown from "vue-markdown-render";

import { Storage } from "../Storage.ts";

const genAI = new GoogleGenerativeAI(config.API_KEY);

interface Message {
  id: number;
  text: string;
  isUser: boolean;
};

function saveMessages(messages: Message[]): void {
  Storage.saveStorage("messages", {logs: messages});
}

function getMessages(): Message[] {
  return Storage.getStorage("messages", "logs");
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
      `
Pretend that you are a counselor giving advice upon extracurricular activities to a young audience under the age of 25 through a chat window.
Your job is to provide helpful feedback that could assist them in overall improving their experience.
For further context, you are a chat bot on a website named "SmartyPants" that uses AI to help people find opportunities to further their education outside of just schools.
Such examples of these are specialized search features pertaining to jobs, schools, etc.
We want to make sure students - even in less accessible households - all have a fair opportunity.
Make sure to know what the user wants to do (majors, jobs, colleges, jobs, etc.). Here is the message log so far between you and the user given from oldest to newest message:
${messages.value.map((v) => {
  return "#" + v.id + " " + (v.isUser ? "User: " : "You: ") + v.text;
}).toString()}
Please provide the appropriate response to the user’s request as just a paragraph. Do not write the ID, or anything else.
      `
  ]);

  messages.value.push({ text: result.response.text(), isUser: false, id: Date.now() + 1 });

  saveMessages(messages.value);
}

const props = defineProps({
  displaySearch: {type: Boolean},
  text: {type: String}
});

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/'
  },
  {
    label: "List",
    icon: 'pi pi-list',
    route: "/list"
  },
  {
    label: "Suggest",
    icon: 'pi pi-plus',
    route: '/suggest'
  },
  {
    label: "Chat",
    icon: 'pi pi-comments',
    route: "#",
    onClick: () => {visible.value = true;}
  },

]);

/*
  struct.
  messages: {
    logs: [...]
  }
 */

const visible = ref(false);

let temp: Message[] = getMessages();
if (!temp) {
  temp = [
    { id: Date.now() + 1, text: 'Hello! How can I assist you today?', isUser: false },
  ];
  saveMessages(temp);
}

const messages = ref(temp);

const newMessage = ref('');

const sendMessage = () => {
  if (newMessage.value.trim() === '') return;

  messages.value.push({ id: Date.now(), text: newMessage.value, isUser: true });
  saveMessages(messages.value);
  newMessage.value = '';

  // Simulate AI response
  // setTimeout(() => {
  //   messages.value.push({
  //     id: Date.now() + 1,
  //     text: "I'm here to help!",
  //     isUser: false,
  //   });
  // }, 1000);
  run();
};

</script>

<template>
  <div class="w-full">
    <Menubar :model="items" class="nav-bar m-3">
      <template #start>
        <span class="text-3xl inline-block logo major-mono-display ml-8 p-2">
          SP
        </span>
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <RouterLink :to="item?.route" v-ripple class="flex items-center" v-bind="props.action" @click="item?.onClick">
          <span :class="item.icon"/>
          <span class="ml-2">{{ item.label }}</span>
          <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge"/>
          <span v-if="item.shortcut"
                class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
              item.shortcut
            }}</span>
          <i v-if="hasSubmenu"
             :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
        </RouterLink>
      </template>
      <template #end>
        <div class="flex items-center gap-2 mr-2">
          <SearchBarComponent v-if="props.displaySearch" :text="text" />
<!--          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle"/>-->
        </div>
      </template>
    </Menubar>
  </div>

<!--  AI Chat Dialog -->
  <Dialog maximizable v-model:visible="visible" modal header="Header" :style="{ width: '75vw', height: '75vh' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" class="h-full">
    <div class="inner-dialog h-full">
      <!-- Chat Messages -->
      <div class="p-4 space-y-2 max-h-full bg-black rounded-t-2xl h-full">
        <div class="space-y-2 overflow-y-scroll max-h-full">
          <div v-motion-slide-visible-top v-for="message in messages" :key="message.id" :class="{ 'text-right': message.isUser }" class="overflow-y-scroll">
            <div
                :class="{
              'bg-red-500 text-white': message.isUser,
              'bg-gray-300 text-black': !message.isUser
            }"
                class="inline-block p-6 rounded-lg text-xl chat-message"
                v-if="message.text && message.text.trim() != ''"
            >
<!--              {{message.text}}-->
              <vue-markdown v-if="message" :source="message.text"></vue-markdown>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="bg-black p-4 rounded-b-2xl flex">
        <InputText
            type="text"
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type your message..."
            class="flex-1 p-2 rounded-lg border border-gray-400 bg-white text-black"
        />
        <Button
            v-on:click="sendMessage()"
            class="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Send
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.logo {
  display: inline-block !important;
}
.inner-container {
  margin: 1rem;
}

.h-full {
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow-y: visible;
}

.chat-message {
  max-width: 75% !important;
}


</style>