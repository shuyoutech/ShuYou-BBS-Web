import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/paramManage',
  component: Layout,
  name: 'paramManage',
  redirect: '/paramManage/list',
  meta: {
    title: '参数配置管理',
    icon: 'i-hugeicons:code',
    auth: ['paramManageIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'paramManageIndex',
      component: () => import('@/views/system/param/index.vue'),
      meta: {
        title: '参数配置管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/paramManage',
        auth: ['paramManageIndex'],
      },
    },
  ],
}
export default routes
