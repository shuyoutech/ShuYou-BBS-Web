import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/noticeManage',
  component: Layout,
  name: 'noticeManage',
  redirect: '/noticeManage/list',
  meta: {
    title: '通知公告',
    icon: 'i-hugeicons:notification-01',
    auth: ['noticeManageIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'noticeManageIndex',
      component: () => import('@/views/system/notice/index.vue'),
      meta: {
        title: '通知公告',
        menu: false,
        breadcrumb: false,
        activeMenu: '/noticeManage',
        auth: ['noticeManageIndex'],
      },
    },
  ],
}
export default routes
