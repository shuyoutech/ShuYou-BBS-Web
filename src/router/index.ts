import {createRouter, createWebHistory} from 'vue-router'
import {useShareStore} from "@/store/modules/share.ts";

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

router.beforeEach((to, _from, next) => {
  if (to.path === '/wechat/callback') {
    const query = to.query
    const shareStore = useShareStore()
    shareStore.code = String(query.code ?? '')
    shareStore.state = String(query.state ?? '')
    return
  }
  next()
})

export default router
