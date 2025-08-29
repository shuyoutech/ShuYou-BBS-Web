import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/menu',
  component: Layout,
  name: 'menu',
  redirect: '/menu/list',
  meta: {
    title: '菜单管理',
    icon: 'i-hugeicons:menu-11',
    auth: ['menuIndex'],
  },
  children: [
    {
      path: 'list',
      name: 'menuIndex',
      component: () => import('@/views/system/menu/list.vue'),
      meta: {
        title: '菜单管理',
        menu: false,
        breadcrumb: false,
        activeMenu: '/menu',
        auth: ['menuIndex'],
      },
    },
    {
      path: 'detail',
      name: 'pagesExampleGeneralMenuCreate',
      component: () => import('@/views/system/menu/detail.vue'),
      meta: {
        title: '新增菜单',
        menu: false,
        activeMenu: '/menu',
        cache: true,
        noCache: 'pagesExampleGeneralMenuList',
        copyright: false,
      },
    },
    {
      path: 'detail/:id',
      name: 'pagesExampleGeneralMenuEdit',
      component: () => import('@/views/system/menu/detail.vue'),
      meta: {
        title: '编辑菜单',
        menu: false,
        activeMenu: '/menu',
        cache: true,
        noCache: 'pagesExampleGeneralMenuList',
        copyright: false,
      },
    },
  ],
}
export default routes
