<script setup lang="ts">
// Vue core imports
import { computed, ref } from "vue";

// UI Components
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import Tree from "primevue/tree";
import Message from "primevue/message";

// Composables
import { useXpathStore } from "../../composables/useXpathStore";
import { useDarkTheme } from "../../composables/useDarkTheme";

// Component state
const visible = ref(false);
const { isDarkTheme } = useDarkTheme();
const { history, removeFromHistory, setRecentQuery, setRecentXml } = useXpathStore();

// Computed properties
const localHistory = computed(() => {
  return history.value.map((item) => ({
    label: item.description,
    key: `root-item-${item.id}`,
    children: [
      {
        icon: "pi pi-clock",
        key: `query-item-${item.id}`,
        label: "Query",
        children: [{ key: `query-detail-${item.id}`, label: item.query }],
      },
      {
        icon: "pi pi-code",
        key: `xml-item-${item.id}`,
        label: "XML",
        children: [{ key: `xml-detail-${item.id}`, label: item.xml }],
      },
    ],
  }));
});

// Event handlers
const onClickHistoryItem = (id: string) => {
  const itemId = id.replace("root-item-", "");
  const item = history.value.find((item) => item.id === itemId) as AppXpathStoreItem | undefined;
  
  if (item) {
    visible.value = false;
    setRecentQuery(item.query);
    setRecentXml(item.xml);
  }
};

const onDeleteHistoryItem = (id: string) => {
  const itemId = id.replace("root-item-", "");
  const item = history.value.find((item) => item.id === itemId) as AppXpathStoreItem | undefined;
  
  if (item) {
    removeFromHistory(item.id);
  }
};
</script>

<template>
  <Button v-tooltip.top="'Stored queries'" icon="pi pi-book" severity="secondary" text @click="visible = true" />
  <Drawer
    v-model:visible="visible"
    header="Stored queries"
    position="left"
    style="width: 30rem"
  >
    <Tree v-if="localHistory.length > 0" :filter="true" :value="localHistory">
      <template #default="slotProps">
        <pre
          v-if="slotProps.node.key?.includes('detail')"
          class="p-4 text-xs rounded"
          :class="isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'"
          >{{ slotProps.node.label }}</pre
        >
        <div v-else-if="slotProps.node.key?.includes('root')">
          <b>{{ slotProps.node.label }}</b>
          <span class="ml-4">
            <Button icon="pi pi-file-export" size="small" text severity="primary" @click="onClickHistoryItem(slotProps.node.key)" />
            <Button icon="pi pi-trash" size="small" text severity="warn" @click="onDeleteHistoryItem(slotProps.node.key)" />
          </span>
        </div>
        <p v-else>{{ slotProps.node.label }}</p>
      </template>
    </Tree>
    <Message v-else severity="info">No stored queries found</Message>
  </Drawer>
</template>

<style scoped></style>
