<script setup lang="ts">
import { useDarkTheme } from "./composables/useDarkTheme";
import XPathEditor from "./components/XPath/XPathEditor.vue";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import AppCheatsheetButton from "./components/XPath/AppCheatsheetButton.vue";
import Toast from "primevue/toast";

const { isDarkTheme, toggleDarkTheme } = useDarkTheme();
</script>

<template>
  <Toast position="bottom-right"/>
  <div class="container-fluid mx-auto p-4">
    <Toolbar class="mb-8">
      <template #start>
        <img
          alt="Vue logo"
          height="48px"
          width="48px"
          class="mr-4"
          src="./assets/logo.png"
        />
        <h1 class="text-2xl">XPath Live Editor</h1>
      </template>
      <template #end>
        <AppCheatsheetButton></AppCheatsheetButton>
        <Button
          :icon="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"
          class="mr-2"
          severity="secondary"
          @click="toggleDarkTheme"
        />
      </template>
    </Toolbar>
    <XPathEditor />
  </div>
</template>
