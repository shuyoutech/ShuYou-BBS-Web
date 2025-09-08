import {createRouter, createWebHistory} from "vue-router"
import routes from "./routes/index.ts"
import {memberBindThirdPartyApi} from "@/api/member";

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  if (to.path === '/wechat/callback') {
    const query = to.query
    const shareStore = useShareStore()
    shareStore.code = String(query.code ?? '')
    shareStore.state = String(query.state ?? '')
    next('/')
    return
  } else if (to.path === '/wechat/bind/callback') {
    const query = to.query
    const shareStore = useShareStore()
    shareStore.bindCode = String(query.code ?? '')
    shareStore.bindState = String(query.state ?? '')
    memberBindThirdPartyApi(shareStore.bindCode).then(() => {
      const userStore = useUserStore()
      userStore.getUserInfo()
    }).catch((error) => {
      console.error('微信绑定失败:', error)
    })

    next('/')
    return
  }
  next()
})

export default router
