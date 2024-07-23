<script setup lang="ts">

// import statements
import MenuBarComponent from "./MenuBarComponent.vue";
import {ref} from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Editor from "primevue/editor";
import Button from "primevue/button";

// types of opportunities as outlined in the schema
const types = ref([
  {name: "Internship", code: "internship"},
  {name: "Non-Profit", code: "non-profit"},
  {name: "Research", code: "research"},
  {name: "Volunteering", code: "volunteering"},
  {name: "Club", code: "club"},
  {name: "Competition", code: "competition"}
]);

// variables to store field-data
var title = ref<string>("");
var type = ref<string>("");
var flags = ref<string[]>([]); // this is for storing the total flags
var flagsInputBox = ref<string>(""); // this is for what's being typed in the flags box
var description = ref<string>("");
var content = ref<string>("");

// oninput function that handles whenever stuff is being typed into the box
function handleFlags() {
  // lower case it
  let text: string = flagsInputBox.value.toLowerCase();
  // check if it ends w comma or space
  if (text.endsWith(",") || text.endsWith(" ")) {
    // then remove that last trailing thing, and remove any additional spaces
    text = text.substring(0, text.length - 1).trim();
    // reset the flag box
    flagsInputBox.value = "";
    // check if it's not already part of existing list, then add
    if (!flags.value.includes(text)) {
      flags.value.push(text);
    }
  }
}

// only allow spaces, lowercase & uppercase letters, a dash, and commas in the input field
function filterFlags(event: any) {
  return /[ a-zA-Z,-]/i.test(event.key);
}

// remove a string from the array using filter function
function removeTag(name: string) {
  flags.value = flags.value.filter(e => e !== name);
}
</script>

<template>
  <MenuBarComponent :display-search="true"/>

  <!-- Container -->
  <div class="lg:mx-28 md:mx-14 mx-8 my-16">
    <h1 class="mb-5">Suggestion</h1>
    <!--  Grid layout  -->
    <div class="grid grid-cols-2 gap-2">
      <!--   Title   -->
      <div class="flex flex-col gap-2 col-span-2">
        <label for="title">Title</label>
        <InputText id="title" v-model="title" aria-describedby="title-help"/>
      </div>
      <!--   Type of opportunity   -->
      <div class="flex flex-col gap-2 col-span-2 md:col-span-1">
        <label for="type">Type</label>
        <Dropdown v-model="type" :options="types" optionLabel="name" placeholder="Type of Internship"
                  class="w-full md:w-[14 rem]"/>
      </div>
      <!--  Flags input    -->
      <div class="flex flex-col gap-2 col-span-2 md:col-span-1">
        <label for="flags">Flags</label>
        <InputText id="Flags" v-model="flagsInputBox" aria-describedby="flags-help" :oninput="handleFlags" :onkeydown="filterFlags"/>
        <small id="flags-help">
          <Tag v-for="flag in flags" :value="flag" class="mr-1 tag" icon="pi pi-times" :onclick="() => removeTag(flag)"></Tag>
        </small>
      </div>
      <!--  Description    -->
      <div class="flex flex-col gap-2 col-span-2">
        <label for="description">Description</label>
        <Textarea id="description" v-model="description" aria-describedby="description-help"/>
        <small id="description-help">The description that shows up under the card when searching.</small>
      </div>
    </div>
    <!--  Content    -->
    <div class="my-4">
      <label for="content">Content</label>
      <Editor class="w-full mt-2" id="content" v-model="content" aria-describedby="content-help" />
    </div>
    <!-- Submit button TODO: add submit functionality -->
    <Button label="Submit" class="w-full" />
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
.tag:hover {
  cursor: pointer;
}
</style>