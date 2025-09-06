<script lang="ts" setup>
import { isEmpty } from '@/utils/common'

defineProps({
  route: {
    type: Object as any,
    required: true,
  },
})
</script>

<template>
  <el-menu-item v-if="isEmpty(route.children)" :key="route?.path" :index="route.path">
    <template #title>
      <span class="iconfont icon-img" :class="route.meta?.icon"></span>
      {{ route?.meta?.title }}
    </template>
  </el-menu-item>
  <el-sub-menu v-else :key="`sub-${route?.path}`" :index="route.path">
    <template #title>
      <span class="iconfont icon-img" :class="route.meta?.icon"></span>
      <span>{{ route?.meta?.title }}</span>
    </template>
    <menu-item v-for="(sub, i) in route.children" :route="sub" :key="sub.path || i" />
  </el-sub-menu>
</template>
