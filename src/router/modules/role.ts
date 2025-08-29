import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/role',
  component: Layout,
  name: 'role',
  redirect: '/role/list',
  meta: {
    title: '角色管理',
    icon: 'i-hugeicons:user-multiple-03',
    auth: ['roleIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'roleIndex',
      component: () => import('@/views/system/roleManage/index.vue'),
      meta: {
        title: '角色管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/role',
        auth: ['roleIndex'],
      },
    },
    {
      path: 'roleAuth',
      name: 'pagesRoleAuthMenu',
      component: () => import('@/views/system/roleManage/authMenu.vue'),
      meta: {
        title: '角色授权',
        menu: false,
        activeMenu: '/role',
        cache: true,
        noCache: 'pagesRoleAuthMenu',
        copyright: false,
      },
    },
  ],
}
export default routes
