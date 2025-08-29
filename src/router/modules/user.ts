import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/user',
  component: Layout,
  name: 'user',
  redirect: '/user/list',
  meta: {
    title: '用户管理',
    icon: 'i-tabler:user-hexagon',
    auth: ['userIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'userIndex',
      component: () => import('@/views/system/userManage/list.vue'),
      meta: {
        title: '用户管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/user',
        auth: ['userIndex'],
      },
    },
    {
      path: 'detail',
      name: 'pagesExampleUserCreate',
      component: () => import('@/views/system/userManage/detail.vue'),
      meta: {
        title: '新增用户',
        menu: false,
        activeMenu: '/user',
        cache: true,
        noCache: 'userIndex',
      },
    },
    {
      path: 'detail/:id',
      name: 'pagesExampleUserEdit',
      component: () => import('@/views/system/userManage/detail.vue'),
      meta: {
        title: '编辑用户',
        menu: false,
        activeMenu: '/user',
        cache: true,
        noCache: 'userIndex',
      },
    },
  ],
}
export default routes
