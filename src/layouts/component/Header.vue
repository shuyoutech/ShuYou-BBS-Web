<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useShareStore } from '@/store/modules/share'
import { useUserStore } from '@/store/modules/user'
import Menu from './menuModule.vue'

interface Emits {
  (e: 'goToLogin'): void
  (e: 'goToProfile'): void
}

const emit = defineEmits<Emits>()
// const route = useRoute()
const userStore = useUserStore()

// 当前路由
// const currentRoute = computed(() => route.path)

// 用户相关状态
const isLogin = ref(false)
const avatar = ref('')
const nickname = ref('')

// 默认头像
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=DM'

// 获取用户头像
function getUserAvatar() {
  const userAvatar = userStore.avatar || userStore.userInfo?.avatar
  return userAvatar || defaultAvatar
}

// 获取用户昵称
function getUserNickname() {
  const userNickname = userStore.userInfo?.nickname || userStore.userInfo?.name
  return userNickname || 'DM'
}

// 更新用户状态
function updateUserState() {
  isLogin.value = userStore.token && userStore.nickname
  avatar.value = getUserAvatar()
  nickname.value = getUserNickname()
}

// 登录处理
function goToLogin() {
  emit('goToLogin')
}

// 个人资料处理
function goToProfile() {
  emit('goToProfile')
}

// 暴露更新用户状态的方法
defineExpose({
  updateUserState,
})

const title = import.meta.env.VITE_APP_TITLE

onMounted(() => {
  // 初始化用户状态
  updateUserState()
  const shareStore = useShareStore()
  if (shareStore.code) {
    userStore.accessToken({
      code: shareStore.code,
    }).then(() => {
      isLogin.value = userStore.isLogin
      avatar.value = userStore.avatar
      nickname.value = userStore.nickname
    }).catch((error) => {
      console.error('微信登录失败:', error)
      ElMessage.error('微信登录失败，请重试')
    })
  }
})

watch(
  () => userStore.isLogin,
  (newValue) => {
    if (newValue) {
      isLogin.value = userStore.isLogin
      avatar.value = userStore.avatar
      nickname.value = userStore.nickname
    }
    else {
      isLogin.value = false
      avatar.value = ''
      nickname.value = ''
    }
  },
)
</script>

<template>
  <div class="bbs-header">
    <div class="header-content">
      <div class="logo">
        <img src="@/assets/images/logo.svg" alt="BBS Logo" class="logo-img">
        <span class="logo-text">{{ title }}</span>
      </div>
      <div class="nav-menu">
        <Menu />
      </div>
      <div class="user-section">
        <div v-if="!isLogin" class="login-buttons">
          <button class="btn btn-primary" @click="goToLogin">
            登录
          </button>
        </div>
        <div v-else class="user-info">
          <img :src="avatar" :alt="nickname" class="user-avatar" @click="goToProfile">
          <span class="user-name" @click="goToProfile">{{ nickname }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 顶部导航栏样式 */
.bbs-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0;
  color: #333;
  background: white;
}

.bbs-header .header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  height: 60px;
  padding: 0 20px;
  margin: 0 auto;
}

.bbs-header .logo {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-left: 100px;
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
  width: 60%;

  /* display: flex;
  gap: 30px; */
}

.bbs-header .nav-item {
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.bbs-header .nav-item:hover,
.bbs-header .nav-item.active {
  color: #000;
  background-color: rgb(0 0 0 / 10%);
}

.bbs-header .user-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.bbs-header .login-buttons {
  display: flex;
  gap: 10px;
}

.bbs-header .btn {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.bbs-header .btn-primary {
  color: white;
  background-color: #409eff;
}

.bbs-header .btn-primary:hover {
  background-color: #337ecc;
}

.bbs-header .user-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.bbs-header .user-avatar {
  width: 32px;
  height: 32px;
  cursor: pointer;
  object-fit: cover;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.bbs-header .user-avatar:hover {
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
  transform: scale(1.1);
}

.bbs-header .user-name {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bbs-header .user-name:hover {
  color: #000;
}

/* 响应式设计 */
@media (width <= 768px) {
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
