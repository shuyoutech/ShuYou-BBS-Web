import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/database',
  component: Layout,
  name: 'database',
  redirect: '/database/list',
  meta: {
    title: '知识库管理',
    icon: 'i-hugeicons:blockchain-05',
    auth: 'databaseIndex',
  },
  children: [
    {
      path: 'list',
      name: 'databaseIndex',
      component: () => import('@/views/aiDatabase/index.vue'),
      meta: {
        title: '知识库管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/database',
        auth: 'databaseIndex',
      },
    },
    {
      path: 'databaseDetail',
      name: 'databaseDetail',
      component: () => import('@/views/aiDatabase/detail.vue'),
      meta: {
        title: '知识库详情',
        menu: false,
        activeMenu: '/database',
        cache: true,
        noCache: 'databaseDetail',
        copyright: false,
      },
    },
  ],
}
export default routes
