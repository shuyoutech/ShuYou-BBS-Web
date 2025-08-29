import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/dict',
  component: Layout,
  name: 'dict',
  redirect: '/dict/list',
  meta: {
    title: '字典管理',
    icon: 'i-hugeicons:align-box-bottom-left',
    auth: ['dictIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'dictIndex',
      component: () => import('@/views/system/dict/index.vue'),
      meta: {
        title: '字典管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/dict',
        auth: ['dictIndex'],
      },
    },
    {
      path: 'dictDetail',
      name: 'dictDataDetailList',
      component: () => import('@/views/system/dict/list.vue'),
      meta: {
        title: '字典详情',
        menu: false,
        activeMenu: '/dict',
        cache: true,
        noCache: 'dictIndex',
        copyright: false,
      },
    },
  ],
}
export default routes
