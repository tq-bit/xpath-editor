import { createApp } from "vue";
import "./style.css";
import "primeicons/primeicons.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Tooltip from 'primevue/tooltip';

const app = createApp(App);
app.use(PrimeVue, {
  theme: { preset: Aura, options: { darkModeSelector: ".dark-theme" } },
});
app.directive('tooltip', Tooltip);
app.mount("#app");
