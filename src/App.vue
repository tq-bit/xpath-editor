<script setup lang="ts">
import { ref, computed } from "vue";
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
import { useDarkTheme } from "./composables/useDarkTheme";

const query = ref("//ProductID");
const xml =
  ref(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
    <List>
      <Product>
        <ProductID>HT-2001</ProductID>
        <ProductName>Professional Dry Cleaning Machine</ProductName>
        <ProductPrice>1999.99</ProductPrice>
      </Product>
      <Product>
        <ProductID>HT-1020</ProductID>
        <ProductName>Compact Dry Cleaning Unit</ProductName>
        <ProductPrice>799.50</ProductPrice>
      </Product>
      <Product>
        <ProductID>HT-7000</ProductID>
        <ProductName>Industrial Dry Cleaning System</ProductName>
        <ProductPrice>5499.00</ProductPrice>
      </Product>
    </List>
  </soapenv:Body>
</soapenv:Envelope>`);
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

const { isDarkTheme, toggleDarkTheme } = useDarkTheme();
</script>

<template>
  <div class="container-fluid mx-auto p-4">
    <Toolbar class="mb-4">
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
        <FloatLabel variant="in">
          <label for="query">Write your XPath query</label>
          <InputText
            id="query"
            v-model="query"
            rows="4"
            cols="40"
            class="w-full"
          />
        </FloatLabel>
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
