import "./utils/randomUUI-pollyfil";
import { createApp } from "vue";
import "./theme/vendor.scss";
import "./theme/style.scss";
import "reflect-metadata";
import "./container/container";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);

app.mount("#app");
