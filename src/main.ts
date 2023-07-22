import "./utils/randomUUI-pollyfil";
import { createApp } from "vue";
import "./theme/vendor.scss";
import "./theme/style.scss";
import "reflect-metadata";
import "./container/container";
import VueApexCharts from "vue3-apexcharts";
import App from "./App.vue";
import router from "./router";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fontAwesomeLibrary } from "./utils/font-awesome-library";

const app = createApp(App);
app.use(router);
app.use(VueApexCharts);

app.component("font-awesome-icon", FontAwesomeIcon);

// Manage the list font awesome icons
fontAwesomeLibrary();

app.mount("#app");
