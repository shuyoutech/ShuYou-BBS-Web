import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/fileManage',
  component: Layout,
  name: 'fileManage',
  redirect: '/fileManage/list',
  meta: {
    title: '文件管理',
    icon: 'i-hugeicons:folder-file-storage',
    auth: ['fileManageIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'fileManageIndex',
      component: () => import('@/views/system/file/index.vue'),
      meta: {
        title: '文件管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/fileManage',
        auth: ['fileManageIndex'],
      },
    },
  ],
}
export default routes
