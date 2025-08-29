import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/vector',
  component: Layout,
  name: 'vector',
  redirect: '/vector/list',
  meta: {
    title: '向量库管理',
    icon: 'i-hugeicons:database-add',
    auth: 'vectorIndex',
  },
  children: [
    {
      path: 'list',
      name: 'vectorIndex',
      component: () => import('@/views/aiVector/index.vue'),
      meta: {
        title: '知识库管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/vector',
        auth: 'vectorIndex',
      },
    },
  ],
}
export default routes
