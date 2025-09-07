/**
 * 路由配置
 * @description 所有路由都在这里集中管理
 */
const routes: any[] = [
  // 登录页
  {
    path: "/",
    redirect: "/home",
  },
  // 404
  {
    path: "/404",
    name: "404",
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: "404页",
    },
  },
  {
    path: '/home',
    component: () => import('@/layouts/layout.vue'),
    meta: {
      title: '首页',
    },
    children: [
      {
        path: '/home', // 修复：使用完整路径
        name: 'home',
        component: () => import('@/views/index.vue'),
        meta: {
          title: '首页',
          breadLevel: 0,
        },
      },
    ],
  },
  {
    path: '/face',
    component: () => import('@/layouts/layout.vue'),
    meta: {
      title: '捏脸',
    },
    children: [
      {
        path: '/face',
        name: 'face',
        component: () => import('@/views/bbs/face/index.vue'),
        meta: {
          title: '捏脸',
          breadLevel: 0,
        },
      },
      {
        path: '/face-upload',
        name: 'faceUpload',
        component: () => import('@/views/bbs/face/upload.vue'),
        meta: {
          showInMenu: false,
          title: '上传捏脸'
        },
      },
      {
        path: '/face/detail/:id',
        name: 'faceDetail',
        component: () => import('@/views/bbs/face/detail.vue'),
        meta: {
          showInMenu: false,
          title: '捏脸详情'
        },
      },
    ],
  },
  {
    path: '/skin',
    component: () => import('@/layouts/layout.vue'),
    meta: {
      title: '外形',
    },
    children: [
      {
        path: '/skin',
        name: 'skin',
        component: () => import('@/views/bbs/skin/index.vue'),
        meta: {
          title: '外形',
          breadLevel: 0,
        },
      },
    ],
  },
  {
    path: '/guide',
    component: () => import('@/layouts/layout.vue'),
    meta: {
      title: '攻略',
    },
    children: [
      {
        path: '/guide',
        name: 'guide',
        component: () => import('@/views/bbs/guide/index.vue'),
        meta: {
          title: '攻略',
          breadLevel: 0,
        },
      },
    ],
  },
  {
    path: '/notice',
    component: () => import('@/layouts/layout.vue'),
    meta: {
      title: '公告',
    },
    children: [
      {
        path: '/notice',
        name: 'notice',
        component: () => import('@/views/bbs/notice/index.vue'),
        meta: {
          title: '公告',
          breadLevel: 0,
        },
      },
    ],
  },
  {
    path: '/event',
    component: () => import('@/layouts/layout.vue'),
    meta: {
      title: '活动',
    },
    children: [
      {
        path: '/event',
        name: 'event',
        component: () => import('@/views/bbs/event/index.vue'),
        meta: {
          title: '活动',
          breadLevel: 0,
        },
      },
    ],
  },
]

export default routes
