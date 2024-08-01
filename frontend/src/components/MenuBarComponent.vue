<script setup lang="ts">
import Menubar from "primevue/menubar";
import Badge from "primevue/badge";
import Logo from "./Logo.vue";
import {ref} from "vue";
import SearchBarComponent from "./SearchBarComponent.vue";
import VueMarkdown from "vue-markdown-render";
import Dialog from "primevue/dialog";
import ChatComponent from "./ChatComponent.vue";
import ChatBoxComponent from "./ChatBoxComponent.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

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
    label: "Suggest",
    icon: 'pi pi-plus',
    route: '/suggest'
  },
  {
    label: "Chat",
    icon: 'pi pi-comments',
    route: "#",
    onClick: () => {visible.value = true;}
  }
  // {
  //   label: 'List',
  //   icon: 'pi pi-list',
  //   badge: 5
  // },
]);

const visible = ref(false);



const messages = ref([
  { id: 1, text: 'Hello! How can I assist you today?', isUser: false },
]);
const newMessage = ref('');

const sendMessage = () => {
  console.log("HELP")
  if (newMessage.value.trim() === '') return;

  messages.value.push({ id: Date.now(), text: newMessage.value, isUser: true });
  newMessage.value = '';

  // Simulate AI response
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      text: "I'm here to help!",
      isUser: false,
    });
  }, 1000);
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
  <Dialog maximizable v-model:visible="visible" modal header="Header" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="inner-dialog h-full">
      <!-- Chat Messages -->
      <div class="p-4 space-y-2 max-h-full bg-black rounded-t-2xl h-full">
        <div class="space-y-2">
          <div v-motion-slide-visible-top v-for="message in messages" :key="message.id" :class="{ 'text-right': message.isUser }">
            <div
                :class="{
              'bg-red-500 text-white': message.isUser,
              'bg-gray-300 text-black': !message.isUser
            }"
                class="inline-block p-6 rounded-lg max-w-xs text-xl"
            >
              {{ message.text }}
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

</style>