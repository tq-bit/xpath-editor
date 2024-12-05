<script setup lang="ts">
import { ref } from "vue";

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useDarkTheme } from "../composables/useDarkTheme";

const visible = ref(false);

const content = [
  // Left column
  [
    {
      title: "Access all nested elements from a level",
      code: "//Product/*",
    },
    {
      title: "Access an element on any level",
      code: "//ProductID",
    },
    {
      title: "Find an item by its property",
      code: "//List/Product[ProductID='HT-7000']",
    },
    {
      title: "Select last element in a list",
      code: "//List/Product[last()]",
    },
    {
      title: "Filter based on a property",
      code: "//List/Product/ProductPrice[number(.) < 1000]",
    },
    {
      title: "Select element that starts with a specific string",
      code: "//List/Product[starts-with(ProductName, 'Professional')]",
    }
  ],
  // Right column
  [
    {
      title: "Sum of all prices greater than 1000",
      code: "sum(//List/Product/ProductPrice[number() > 1000])",
    },
    {
      title: "Search and count nodes that contain a specific string",
      code: "count(//Product[contains(ProductName, 'Compact')])",
    },
    {
      title: "Replace characters in a string",
      code: "//List/Product/translate(ProductName, 'C', 'B')",
    },
    {
      title: "Remove whitespace from a string",
      code: "//List/Product/translate(ProductName, ' ', '')",
    },
    {
      title: "Replace a full word in a string",
      code: "//List/Product/replace(ProductName, 'Compact', 'Bulky')",
    },
    {
      title: "Find products that are more expensive than the average price", 
      code: "//List/Product[ProductPrice > avg(//List/Product/ProductPrice/number())]"
    }
  ],
];

const emit = defineEmits(["code"]);
const onClickCode = (code: string) => {
  visible.value = false;
  emit("code", code);
};

const { isDarkTheme } = useDarkTheme();
</script>

<template>
  <Button
    class="mr-2"
    icon="pi pi-question"
    text
    severity="secondary"
    @click="visible = true"
  />
  <Dialog v-model:visible="visible" modal header="Cheatsheet">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="column in content">
        <div v-for="item in column" class="mb-4">
          <div class="flex justify-between">
            <h3 class="text-md font-semibold mb-2">{{ item.title }}</h3>
            <Button
              @click="() => onClickCode(item.code)"
              icon="pi pi-file-export"
              severity="secondary"
              text
              class="p-0"
              style="width: 1.5rem; height: 1.5rem"
            />
          </div>
          <pre
            class="p-4 text-xs rounded"
            :class="isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'"
            >{{ item.code }}</pre
          >
        </div>
      </div>
    </div>
  </Dialog>
</template>
