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
    {
      name: "Home",
      path: "/home",
      meta: {title: "首页"},
      component: () => import("@/views/index.vue"),
    },

  ],
})

router.beforeEach((to, _from, next) => {
  console.log("router =========== request url:",to.path)
  if (to.path === '/wechat/callback') {
    const query = to.query
    const shareStore = useShareStore()
    shareStore.code = String(query.code ?? '')
    shareStore.state = String(query.state ?? '')
    console.log("router ===========  code:", shareStore.code)
    // 跳转到首页，让首页处理登录逻辑
    next('/')
    return
  }
  next()
})

export default router
