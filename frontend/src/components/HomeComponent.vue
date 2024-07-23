<script setup lang="ts">
import SearchBarComponent from "./SearchBarComponent.vue";
import MenuBarComponent from "./MenuBarComponent.vue";

</script>

<template>
  <MenuBarComponent class="absolute" :displaySearch="false"/>
  <div class="center-container">
    <h1>SmartyPants!</h1>
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
</style>
