<template>
  <div class="bbs-header">
    <div class="header-content">
      <div class="logo">
        <img src="@/assets/images/logo.svg" alt="BBS Logo" class="logo-img"/>
        <span class="logo-text">数游论坛</span>
      </div>
      <div class="nav-menu">
        <a href="/" :class="['nav-item', { active: currentRoute === '/' }]">首页</a>
        <a href="/face" :class="['nav-item', { active: currentRoute === '/face' }]">捏脸专区</a>
        <a href="/skin" :class="['nav-item', { active: currentRoute === '/skin' }]">外形专区</a>
        <a href="/guide" :class="['nav-item', { active: currentRoute === '/guide' }]">攻略专区</a>
        <a href="/notice" :class="['nav-item', { active: currentRoute === '/notice' }]">公告专区</a>
        <a href="/event" :class="['nav-item', { active: currentRoute === '/event' }]">活动专区</a>
      </div>
      <div class="user-section">
        <div v-if="!isLogin" class="login-buttons">
          <button class="btn btn-primary" @click="goToLogin">
            登录
          </button>
        </div>
        <div v-else class="user-info">
          <img :src="avatar" :alt="nickname" class="user-avatar" @click="goToProfile"/>
          <span class="user-name" @click="goToProfile">{{ nickname }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useUserStore} from '@/store/modules/user'

interface Emits {
  (e: 'go-to-login'): void

  (e: 'go-to-profile'): void
}

const emit = defineEmits<Emits>()
const route = useRoute()
const userStore = useUserStore()

// 当前路由
const currentRoute = computed(() => route.path)

// 用户相关状态
const isLogin = ref(false)
const avatar = ref('')
const nickname = ref('')

// 默认头像
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=DM'

// 获取用户头像
const getUserAvatar = () => {
  const userAvatar = userStore.avatar || userStore.userInfo?.avatar
  return userAvatar || defaultAvatar
}

// 获取用户昵称
const getUserNickname = () => {
  const userNickname = userStore.userInfo?.nickname || userStore.userInfo?.name
  return userNickname || 'DM'
}

// 更新用户状态
const updateUserState = () => {
  isLogin.value = !!userStore.userInfo.nickname
  avatar.value = getUserAvatar()
  nickname.value = getUserNickname()
}

// 登录处理
const goToLogin = () => {
  emit('go-to-login')
}

// 个人资料处理
const goToProfile = () => {
  emit('go-to-profile')
}

// 暴露更新用户状态的方法
defineExpose({
  updateUserState
})

// 初始化用户状态
updateUserState()
</script>

<style scoped>
/* 顶部导航栏样式 */
.bbs-header {
  background: white;
  color: #333;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.bbs-header .header-content {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.bbs-header .logo {
  margin-left: 100px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bbs-header .logo-img {
  width: 32px;
  height: 32px;
}

.bbs-header .logo-text {
  font-size: 20px;
  font-weight: bold;
}

.bbs-header .nav-menu {
  display: flex;
  gap: 30px;
}

.bbs-header .nav-item {
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.bbs-header .nav-item:hover,
.bbs-header .nav-item.active {
  background-color: rgba(0, 0, 0, 0.1);
  color: #000;
}

.bbs-header .user-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bbs-header .login-buttons {
  display: flex;
  gap: 10px;
}

.bbs-header .btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.bbs-header .btn-primary {
  background-color: #409eff;
  color: white;
}

.bbs-header .btn-primary:hover {
  background-color: #337ecc;
}

.bbs-header .user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bbs-header .user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bbs-header .user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.bbs-header .user-name {
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.bbs-header .user-name:hover {
  color: #000;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bbs-header .header-content {
    padding: 0 10px;
  }

  .bbs-header .logo {
    margin-left: 0;
  }

  .bbs-header .nav-menu {
    display: none;
  }
}
</style>
