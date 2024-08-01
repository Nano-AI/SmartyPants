<script setup lang="ts">

import MenuBarComponent from "./MenuBarComponent.vue";
import ChatBoxComponent from "./ChatBoxComponent.vue";
</script>

<template class="">
  <div class="flex flex-col h-screen">
    <MenuBarComponent :display-search="true" ref="menuBar" />
    <ChatBoxComponent class="w-full flex-1 px-12 py-4" ref="chatBox" />
  </div>
</template>

<style scoped>
</style>