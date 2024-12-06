<script setup lang="ts">
// PrimeVue Imports
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import { useToast } from "primevue/usetoast";

// Vue Imports
import { ref } from "vue";

// Composables
import { useXpathStore } from "../../composables/useXpathStore";

// Constants and Refs
const visible = ref(false);
const description = ref("");
const { recentQuery, recentXml, addToHistory } = useXpathStore();
const toast = useToast();

// Helper Functions
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Event Handlers
const onSubmit = () => {
  addToHistory({
    id: generateUUID(),
    description: description.value,
    query: recentQuery.value,
    xml: recentXml.value,
    createdAt: new Date().toLocaleString("de-DE"),
  });
  visible.value = false;
  toast.add({
    severity: "success",
    summary: "Saved to history",
    detail: description.value,
    life: 3000,
  });
};
</script>

<template>
  <Button
    v-tooltip.top="'Save this query'"
    icon="pi pi-save"
    severity="secondary"
    text
    @click="visible = true"
  />
  <Dialog v-model:visible="visible" modal header="Save this XPath query">
    <Message severity="info" class="mb-4">
      <p>All query and xml data is stored in your device's browser</p>
    </Message>
    <form @submit.prevent="onSubmit">
      <FloatLabel class="mt-8 mb-4" variant="over">
        <label for="description">Enter a description</label>
        <InputText
          required
          name="description"
          fluid
          id="description"
          v-model="description"
        />
      </FloatLabel>
      <Button label="Save" fluid icon="pi pi-check" type="submit" />
    </form>
  </Dialog>
</template>
