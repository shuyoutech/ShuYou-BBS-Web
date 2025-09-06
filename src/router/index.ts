import {createRouter, createWebHistory} from "vue-router"
import routes from "./routes/index.ts"

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
  }
  next()
})

export default router
