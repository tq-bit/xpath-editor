<script setup lang="ts">
// Vue core imports
import { ref, computed, onMounted } from "vue";

// Local components
import AppXmlEditor from "./AppXmlEditor.vue";
import AppResultEditor from "./AppResultEditor.vue";
import AppXpathHistory from "./AppXpathHistory.vue";
import AppSaveToHistoryDialog from "./AppSaveToHistoryDialog.vue";

// PrimeVue components
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Message from "primevue/message";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";

// Composables
import { useXpathStore } from "../../composables/useXpathStore";

// Store state
const { recentQuery, recentXml, setRecentQuery, setRecentXml } =
  useXpathStore();

// XPath editor state
const result = ref<AppXPathResult[]>([]);
const error = ref<string>("");

// Computed properties
const successMessage = computed(() => {
  return result.value.length > 0
    ? `${
        result.value[0].isEvaluation
          ? `Evaluation successful: ${result.value[0].text}`
          : `Found ${result.value.length} Nodes`
      }`
    : "No results found";
});

// Persistence logic
onMounted(() => {
  // No need to set query and xml values here, as we're using store values directly
});
</script>

<template>
  <div class="container-fluid mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="mb-4">
        <InputGroup>
          <FloatLabel variant="over">
            <label for="query">Write your XPath query</label>
            <InputText
              id="query"
              v-model="recentQuery"
              @update:modelValue="setRecentQuery"
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
          :query="recentQuery"
          :xml="recentXml"
          v-model:error="error"
          v-model:result="result"
          @update:xml="setRecentXml"
        ></AppXmlEditor>
      </SplitterPanel>
      <!-- Splitter right side -->
      <SplitterPanel>
        <AppResultEditor :xml="result"></AppResultEditor>
      </SplitterPanel>
    </Splitter>
  </div>
</template>
