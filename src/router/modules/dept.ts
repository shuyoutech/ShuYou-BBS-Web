import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/deptManage',
  component: Layout,
  name: 'deptManage',
  redirect: '/deptManage/list',
  meta: {
    title: '岗位管理',
    icon: 'i-hugeicons:chart-relationship',
    auth: 'deptManageIndex',
  },
  children: [
    {
      path: 'list',
      name: 'deptManageIndex',
      component: () => import('@/views/system/dept/index.vue'),
      meta: {
        title: '岗位管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/deptManage',
        auth: 'deptManageIndex',
      },
    },
  ],
}
export default routes
