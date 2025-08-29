import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/orgManage',
  component: Layout,
  name: 'orgManage',
  redirect: '/orgManage/list',
  meta: {
    title: '机构管理',
    icon: 'i-hugeicons:building-03',
    auth: ['orgManageIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'orgManageIndex',
      component: () => import('@/views/system/org/index.vue'),
      meta: {
        title: '通知公告',
        menu: false,
        breadcrumb: false,
        activeMenu: '/orgManage',
        auth: ['orgManageIndex'],
      },
    },
  ],
}
export default routes
