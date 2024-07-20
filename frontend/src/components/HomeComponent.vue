<script setup lang="ts">
import SearchBarComponent from "./SearchBarComponent.vue";
import MenuBarComponent from "./MenuBarComponent.vue";

</script>

<template>
  <MenuBarComponent class="absolute" :displaySearch="false"/>
  <div class="center-container">
    <h1>Pratham</h1>
    <SearchBarComponent />
  </div>
</template>

<style scoped>
.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.search-bar {
  border-radius: 500px;
  width: 25vw;
}

.input-field {
  display: flex;
  align-items: center;
}
</style>
