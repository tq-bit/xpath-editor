<script setup lang="ts">
import MonacoEditor from "monaco-editor-vue3";
import { computed, ref } from "vue";
import { useDarkTheme } from "../../composables/useDarkTheme";

// Types
interface AppXPathResult {
  xml: string;
  text: string;
  isEvaluation: boolean;
}

// Props
const props = defineProps<{
  xml: AppXPathResult[];
}>();

// Refs
const editorContainer = ref<HTMLDivElement | null>(null);

// Theme handling
const { isDarkTheme } = useDarkTheme();
const theme = computed(() => isDarkTheme.value ? "vs-dark" : "vs");

// Editor configuration
const editorOptions = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
  formatOnPaste: true,
  formatOnType: true,
  automaticLayout: true,
};

// Content processing
const content = computed(() => {
  if (!props.xml || props.xml.length === 0) {
    return "";
  }

  if (props.xml.length === 1 && props.xml[0].isEvaluation) {
    return props.xml[0].text;
  }

  return `<!-- Node Content: --> 
${props.xml
  .map((item) => item.xml)
  .join("\n")
  .trim()}
  
<!-- Node Text: -->
${props.xml
  .map((item) => item.text)
  .join("\n")
  .trim()}`;
});
</script>

<template>
  <div ref="editorContainer" class="w-full">
    <MonacoEditor
      :theme="theme"
      :options="editorOptions"
      :height="1000"
      :value="content"
      language="xml"
      disabled
      class="w-full"
    />
  </div>
</template>

<style scoped></style>
