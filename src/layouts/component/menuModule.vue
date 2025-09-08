<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { isEmpty } from '@/utils/common'
import menuItem from './menuItem.vue'
import routes from "@/router/routes/index.ts"
// import { useAppStore } from '@/stores/app'

// const app = useAppStore()
const sidebarRouters = computed(() => {
  return JSON.parse(JSON.stringify([...routes]))
})

const router = useRouter()
const route = useRoute()
const active = ref('')

// 点击激活当前菜单
function handleSelect(key: string) {
  active.value = key
  sessionStorage.setItem('carbon_menusResults', key)
  router.push(key)
}

// 初始化或刷新激活菜单
function initMenu() {
  const path = sessionStorage.getItem('carbon_menusResults') || ''
  // 修复：使用当前路由路径作为默认值
  active.value = isEmpty(path) ? route.path : path
}

// 处理菜单
const routesList = computed(() => {
  const hasAuth = (item: any) => {
    if (item.meta.auth) {
      // return app.menus.includes(item.meta.auth)
      return true
    } else {
      return true
    }
  }
  const routes = sidebarRouters.value.filter((route: any) => {
    const children = isEmpty(route.children) ? [] : route.children
    const hasLevel1 = children.some(
        (item: any) => item.meta && item.meta.breadLevel === 0 && hasAuth(item)
    )
    return hasLevel1
  })
  const val = ref<any>([])
  const result = routes.map((option: any) => {
    if (!option.path) {
      val.value.push(...option.children)
    }
    const children = option.children.filter(
        (item: any) => item.meta && item.meta.breadLevel === 0 && hasAuth(item)
    )
    if (children.length > 1) {
      return {
        ...option,
        title: option.meta.title,
        children: children.map((item: any) => {
          return {
            ...item,
            title: item.meta.title,
          }
        }),
      }
    } else {
      return {
        ...children[0],
        title: children[0] ? children[0].meta.title : '',
      }
    }
  })
  
  return result
})

// 监听路由变化，自动更新active状态
watch(() => route.path, (newPath) => {
  active.value = newPath
}, { immediate: true })

initMenu()
</script>

<template>
  <div class="menu-wrap">
    <el-menu
      :default-active="active"
      class="el-menu-vertical-demo"
      :collapse="false"
      :collapse-transition="false"
      mode="horizontal"
      :ellipsis="false"
      v-bind="$attrs"
      @select="handleSelect"
    >
      <menu-item v-for="(route, index) in routesList" :key="index" :route="route" />
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.menu-wrap{
   background: #fff;
   padding: 0 0 0;
   border-radius: 8px;
   width: 100%;
   overflow: visible;
   .icon-img{
      margin-right: 7px;
   }
   :deep(.el-menu-item){
      height: 60px;
      line-height: 60px;
      display: inline-block;
      visibility: visible;
      opacity: 1;
      min-width: 80px;
      flex-shrink: 0;
   }
   :deep(.el-sub-menu .el-menu-item){
      min-width: 160px;
      height: 60px;
      line-height: 60px;
      padding-left: 45px;
      display: block;
      visibility: visible;
      opacity: 1;
   }
   :deep(.el-menu){
      border-radius: 8px;
      border-right: 0px;
      display: flex;
      flex-wrap: nowrap;
      overflow: visible;
      width: 100%;
   }
   :deep(.el-menu--horizontal) {
      white-space: nowrap;
      overflow: visible;
   }
   :deep(.el-menu--horizontal .el-menu-item) {
      white-space: nowrap;
      flex-shrink: 0;
   }
   :deep(.el-sub-menu__title){
      height: 60px;
      line-height: 60px;
      display: inline-block;
      visibility: visible;
      opacity: 1;
      min-width: 80px;
      flex-shrink: 0;
   }
   :deep(.el-menu > .el-menu-item.is-active){
      background-color: #f0f9ff;
      color: #409eff;
      border-bottom: none;
   }
   :deep(.el-menu > .el-sub-menu.is-active > .el-sub-menu__title) {
      color: #409eff;
   }
   :deep(.el-menu-item) {
      border-bottom: none !important;
      border: none !important;
   }
   :deep(.el-menu-item::after) {
      display: none !important;
   }
   :deep(.el-menu-item::before) {
      display: none !important;
   }
   :deep(.el-menu) {
      border-bottom: none !important;
   }
   :deep(.el-menu-item[data-index="/event"]) {
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
   }
   :deep(.el-sub-menu[data-index="/event"]) {
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
   }
   :deep(.el-menu--horizontal .el-menu-item) {
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
      width: auto !important;
      min-width: 80px !important;
   }
   :deep(.el-menu--horizontal .el-sub-menu) {
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
      width: auto !important;
      min-width: 80px !important;
   }
   :deep(.el-menu--horizontal .el-sub-menu__title) {
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
   }
}
</style>
