<script setup lang="ts">
// XPath and XML parsing imports
import {
  evaluateXPath,
  evaluateXPathToNodes,
  evaluateXPathToString,
} from "fontoxpath";
import { DOMParser as dom, Document } from "@xmldom/xmldom";

// UI Components
import MonacoEditor from "monaco-editor-vue3";

// Vue imports
import { watch, ref, onMounted, computed } from "vue";
import { useDarkTheme } from "../../composables/useDarkTheme";

// Component props and state
const query = defineModel<string>("query");
const xml = defineModel<string>("xml");
const result = defineModel<AppXPathResult[]>("result");
const error = defineModel<string>("error");
const editorContainer = ref<HTMLDivElement | null>(null);

// XML parsing setup
const parser = new dom();

// Theme handling
const { isDarkTheme } = useDarkTheme();
const theme = computed(() => isDarkTheme.value ? "vs-dark" : "vs");

// XPath evaluation functions
function evalXpathToNodes(doc: Document) {
  const nodes = evaluateXPathToNodes(query.value || "", doc, null, {});
  result.value = nodes
    //@ts-ignore
    .map((node: Node) => ({
      text: (node.textContent || node.nodeValue || "").trim().replace(/\n/g, ""),
      xml: node.toString().trim().replace(/\n/g, " "),
      isEvaluation: false,
    }))
    .filter((item): item is AppXPathResult => Boolean(item.text || item.xml));
}

function evalXpathToString(doc: Document) {
  const stringResult = evaluateXPathToString(
    query.value || "",
    doc,
    null,
    {}
  );
  if (stringResult) {
    result.value = [
      {
        text: stringResult.trim().replace(/\n/g, ""),
        xml: stringResult.trim().replace(/\n/g, ""),
        isEvaluation: true,
      },
    ];
    return;
  }
}

function evalXpathToGeneric(doc: Document) {
  const genericResult = evaluateXPath(query.value || "", doc, null, {});
  if (genericResult !== null && genericResult !== undefined) {
    result.value = [
      {
        text: String(genericResult).trim().replace(/\n/g, ""),
        xml: String(genericResult).trim().replace(/\n/g, " "),
        isEvaluation: true,
      },
    ];
    return;
  }
}

function evaluateXpath(doc: Document) {
  try {
    evalXpathToNodes(doc);
  } catch (e) {
    try {
      evalXpathToString(doc);
    } catch (e2) {
      evalXpathToGeneric(doc);
    }
  }
}

// Main query execution function
const executeQuery = (): void => {
  if (!xml.value) {
    result.value = [];
    error.value = "";
    return;
  }

  try {
    const doc = parser.parseFromString(xml.value, "text/xml");
    evaluateXpath(doc);
    error.value = "";
  } catch (err) {
    error.value = String(err);
    result.value = [];
  }
};

// Editor event handlers
const handleChange = (value: string | undefined) => {
  xml.value = value || "";
};

// Watchers and lifecycle hooks
watch(xml, executeQuery);
watch(query, executeQuery);
onMounted(executeQuery);
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
      :value="xml"
      @change="handleChange"
    ></MonacoEditor>
  </div>
</template>
