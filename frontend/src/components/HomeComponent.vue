<script setup lang="ts">
import SearchBarComponent from "./SearchBarComponent.vue";
import MenuBarComponent from "./MenuBarComponent.vue";
import Logo from "./Logo.vue";

const title = "SmartyPants";
const fadeDelay = 250;
const loopOffset = 500;
</script>

<template>
  <MenuBarComponent class="absolute" :displaySearch="false"/>
  <div class="center-container">
    <Logo class="logo h-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]" />
<!--    <h1 v-motion-->
<!--        :initial="{-->
<!--          opacity: 0,-->
<!--        }"-->
<!--        :enter="{-->
<!--          opacity: 1,-->
<!--          transition: {-->
<!--            delay: 250,-->
<!--          },-->
<!--        }"-->
<!--        class="inline-block font-bold p-10 major-mono-display">SmartyPants</h1>-->
    <h1 class="inline-block font-bold major-mono-display">
      <span v-for="(letter, index) in title">
        <span v-motion
            :initial="{
              opacity: 0.5,
            }"
            :enter="{
              opacity: 1,
              transition: {
                delay: (index + 1) * fadeDelay,
                repeat: Infinity,
                repeatType: 'mirror',
                repeatDelay: fadeDelay * (title.toString().length) + loopOffset,
                type: 'keyframes',
                ease: 'easeIn',
              }
            }"
           >{{letter}}</span>
      </span>
    </h1>
    <div>
      <p class="text-md pb-8">
      </p>
    </div>
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
