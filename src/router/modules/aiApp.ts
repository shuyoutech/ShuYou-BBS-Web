import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/aiApp',
  component: Layout,
  name: 'aiApp',
  redirect: '/aiApp/list',
  meta: {
    title: '应用管理',
    icon: 'i-hugeicons:command',
    auth: 'aiAppIndex',
  },
  children: [
    {
      path: 'list',
      name: 'aiAppIndex',
      component: () => import('@/views/aiApp/index.vue'),
      meta: {
        title: '应用管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/aiApp',
        auth: 'aiAppIndex',
      },
    },
    {
      path: 'aiAppDetail',
      name: 'aiAppDetail',
      component: () => import('@/views/aiApp/detail.vue'),
      meta: {
        title: '应用详情',
        menu: false,
        activeMenu: '/aiApp',
        cache: true,
        noCache: 'aiAppDetail',
        copyright: false,
      },
    },
    {
      path: 'aiAppChatDetail',
      name: 'aiAppChatDetail',
      component: () => import('@/views/aiApp/chatDetail.vue'),
      meta: {
        title: '应用聊天详情',
        menu: false,
        activeMenu: '/aiApp',
        cache: true,
        noCache: 'aiAppChatDetail',
        copyright: false,
      },
    },
  ],
}
export default routes
