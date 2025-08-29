import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/model',
  component: Layout,
  name: 'model',
  redirect: '/model/list',
  meta: {
    title: 'AI模型管理',
    icon: 'i-hugeicons:hierarchy-square-06',
    auth: ['modelIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'modelIndex',
      component: () => import('@/views/aiModel/index.vue'),
      meta: {
        title: 'AI模型管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/model',
        auth: ['modelIndex'],
      },
    },
  ],
}
export default routes
