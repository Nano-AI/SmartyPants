<script setup lang="ts">
import Menubar from "primevue/menubar";
import Badge from "primevue/badge";
import Avatar from "primevue/avatar";
import {ref} from "vue";
import SearchBarComponent from "./SearchBarComponent.vue";

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
  }
  // {
  //   label: 'List',
  //   icon: 'pi pi-list',
  //   badge: 5
  // },
]);

</script>

<template>
  <div class="w-full">
    <Menubar :model="items" class="nav-bar m-3">
      <template #start>
        <span class="text-3xl">👖</span>
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <RouterLink :to="item?.route" v-ripple class="flex items-center" v-bind="props.action">
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
</template>

<style scoped>

</style>