import { createRouter, createWebHistory } from "vue-router";
import BackofficeDashboard from "@/views/BackofficeDashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "BackofficeDashboard",
      component: BackofficeDashboard,
    },
  ],
});

export default router;
