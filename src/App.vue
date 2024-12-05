<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AppXmlEditor from "./components/AppXmlEditor.vue";
import AppResultEditor from "./components/AppResultEditor.vue";
import AppCheatsheetButton from "./components/AppCheatsheetButton.vue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Message from "primevue/message";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";

import { useDarkTheme } from "./composables/useDarkTheme";
import { useXpathStore } from "./composables/useXpathStore";
import AppXpathHistory from "./components/AppXpathHistory.vue";
import AppSaveToHistoryDialog from "./components/AppSaveToHistoryDialog.vue";

const { recentQuery, recentXml, setRecentQuery, setRecentXml } =
  useXpathStore();

const query = ref("");
const xml = ref("");
const result = ref<AppXPathResult[]>([]);
const error = ref<string>("");
const successMessage = computed(() => {
  return result.value.length > 0
    ? `${
        result.value[0].isEvaluation
          ? `Evaluation successful: ${result.value[0].text}`
          : `Found ${result.value.length} Nodes`
      }`
    : "No results found";
});

// Handle recent query values from localstorage
watch(query, () => {
  setRecentQuery(query.value);
});
watch(xml, () => {
  setRecentXml(xml.value);
});

onMounted(() => {
  query.value = recentQuery.value;
  xml.value = recentXml.value;
});

const { isDarkTheme, toggleDarkTheme } = useDarkTheme();
</script>

<template>
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
        <AppCheatsheetButton @code="query = $event" />
        <Button
          :icon="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"
          class="mr-2"
          severity="secondary"
          @click="toggleDarkTheme"
        />
      </template>
    </Toolbar>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="mb-4">
        <InputGroup>
          <FloatLabel variant="over">
            <label for="query">Write your XPath query</label>
            <InputText
              id="query"
              v-model="query"
              rows="4"
              cols="40"
              class="w-full"
            />
          </FloatLabel>
          <InputGroupAddon>
            <AppSaveToHistoryDialog />
            <AppXpathHistory />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class="mb-4">
        <Message v-if="error" severity="error">{{ error }}</Message>
        <Message v-else severity="success">{{ successMessage }}</Message>
      </div>
    </div>

    <!-- Code editors -->
    <Splitter class="mb-8">
      <!-- Splitter left side -->
      <SplitterPanel>
        <AppXmlEditor
          :query="query"
          :xml="xml"
          v-model:error="error"
          v-model:result="result"
        ></AppXmlEditor>
      </SplitterPanel>
      <!-- Splitter right side -->
      <SplitterPanel>
        <AppResultEditor :xml="result"></AppResultEditor>
      </SplitterPanel>
    </Splitter>
  </div>
</template>
