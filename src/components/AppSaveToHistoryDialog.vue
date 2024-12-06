<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Message from "primevue/message";

import { useXpathStore } from "../composables/useXpathStore";
const visible = ref(false);

const { recentQuery, recentXml, addToHistory } = useXpathStore();
const description = ref("");
const onSave = () => {
  addToHistory({
    id: (() => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    })(),
    description: description.value,
    query: recentQuery.value,
    xml: recentXml.value,
    createdAt: new Date().toLocaleString("de-DE"),
  });
  visible.value = false;
};
</script>

<template>
  <Button v-tooltip.top="'Save this query'" icon="pi pi-save" severity="secondary" text @click="visible = true" />
  <Dialog v-model:visible="visible" modal header="Save this XPath query">
    <Message severity="info" class="mb-4">
      <p>All query and xml data is stored in your device's browser</p>
    </Message>
    <FloatLabel class="mt-8" variant="over">
      <label for="description">Enter a description</label>
      <InputText fluid id="description" v-model="description" />
    </FloatLabel>
    <template #footer>
      <Button label="Save" fluid icon="pi pi-check" @click="onSave" />
    </template>
  </Dialog>
</template>
