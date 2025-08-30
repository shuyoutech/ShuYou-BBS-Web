import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Index",
      path: "/",
      meta: {title: "首页"},
      component: () => import("@/views/index.vue"),
    },

  ],
})

export default router
