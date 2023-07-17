import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import PageNotFound from "../views/PageNotFoundView.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    component: LoginView,
  },
  {
    path: "/dashboard",
    component: DashboardView,
  },
  {
    path: "/:catchAll(.*)",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  //Scroll behavior ot handle new route positions
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
