<script setup>
import { ref } from 'vue';
import InputText from "primevue/inputtext";


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
  <div class="h-screen flex flex-col">
    <!-- Chat Header -->
    <div class="bg-black text-white p-4 rounded-t-2xl">
      <h1 class="text-lg font-bold">AI Chat Bot</h1>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2 max-h-fit bg-black">
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
</template>


<style>
/* Add any additional styles here */
</style>