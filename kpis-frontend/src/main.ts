import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { store } from "@/redux/store";
import VueApexCharts from "vue3-apexcharts";
const app = createApp(App);

app.use(router);
app.config.globalProperties.$store = store;
app.use(VueApexCharts as any);
app.mount("#app");
