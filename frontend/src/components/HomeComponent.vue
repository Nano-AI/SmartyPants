<script setup lang="ts">
import SearchBarComponent from "./SearchBarComponent.vue";
import MenuBarComponent from "./MenuBarComponent.vue";
import Logo from "./Logo.vue";

</script>

<template>
  <MenuBarComponent class="absolute" :displaySearch="false"/>
  <div class="center-container">
    <Logo class="logo h-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]" />
    <h1 class="inline-block font-bold p-10 major-mono-display">SmartyPants</h1>
    <SearchBarComponent />
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 30px;
}

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.input-field {
  display: flex;
  align-items: center;
}

.logo {
  opacity: 0.5;
}
</style>
