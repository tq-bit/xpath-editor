<script setup lang="ts">
import MonacoEditor from "monaco-editor-vue3";
import { computed, ref } from "vue";
import { useDarkTheme } from "../composables/useDarkTheme";

const {isDarkTheme} = useDarkTheme();
const theme = computed(() => {
  return isDarkTheme.value ? "vs-dark" : "vs";
});

const props = defineProps<{
  xml: AppXPathResult[];
}>();

const editorContainer = ref<HTMLDivElement | null>(null);

const content = computed(() => {
  // Early returns for empty results
  if (!props.xml || props.xml.length === 0) return "";

  // Evaluation shows only the first result and text
  if (props.xml.length === 1 && props.xml[0].isEvaluation) {
    return props.xml[0].text;
  }

  // Multiple nodes show both
  if (props.xml.length >= 1) {
    return `<!-- Node Content: --> 
${props.xml
  ?.map((item) => item.xml)
  .join("\n")
  .trim()}
  
<!-- Node Text: -->
${props.xml
  ?.map((item) => item.text)
  .join("\n")
  .trim()}`;
  }
});
</script>
<template>
  <div ref="editorContainer" class="w-full">
    <MonacoEditor
      :theme="theme"
      :options="{
        colorDecorators: true,
        lineHeight: 24,
        tabSize: 2,
        formatOnPaste: true,
        formatOnType: true,
        automaticLayout: true,
      }"
      class="w-full"
      :height="1000"
      language="xml"
      disabled
      :value="content"
    ></MonacoEditor>
  </div>
</template>

<style scoped></style>
