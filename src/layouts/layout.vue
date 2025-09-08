<script setup lang="ts">
import { default as AppMain } from "./component/AppMain.vue"
import { default as AppHeader } from "./component/Header.vue"
import AppFooter from '@/components/AppFooter/index.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Login from '@/views/login.vue'
import Profile from '@/views/user/profile.vue'
import PersonalCenter from '@/views/user/personal-center.vue'

const appHeaderRef = ref<any>(null)
const showAiLoginModal = ref(false)
const showProfileModal = ref(false)
const showPersonalCenterModal = ref(false)

const goToLogin = () => {
  showAiLoginModal.value = true
}

const goToProfile = () => {
  showProfileModal.value = true
}

const handleLoginSuccess = () => {
  showAiLoginModal.value = false
  ElMessage.success('登录成功！')
  // 更新AppHeader组件的用户状态
  if (appHeaderRef.value) {
    appHeaderRef.value.updateUserState()
  }

  // 登录成功后刷新页面数据或跳转到其他页面
  // 这里可以根据需要跳转到用户中心或其他页面
  // router.push('/profile') // 如果需要跳转到个人中心
}

const handleOpenPersonalCenter = () => {
  showPersonalCenterModal.value = true
}

const changeLoginStatus = () => {
  if (appHeaderRef.value) {
    appHeaderRef.value.updateUserState()
  }
}
const userStore = useUserStore()
watch(() => userStore.showAiLoginModal, (newVal) => {
  showAiLoginModal.value = newVal
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="layout-header">
        <AppHeader ref="appHeaderRef" @go-to-login="goToLogin" @go-to-profile="goToProfile"/>
      </el-header>
      <el-main>
        <AppMain />
      </el-main>
      <el-footer>
        <AppFooter />
      </el-footer>
    </el-container>
    <!-- AI登录模态框 -->
    <Login
      v-model:visible="showAiLoginModal"
      @login-success="handleLoginSuccess"
    />

    <!-- 个人中心弹窗 -->
    <Profile
      v-model:visible="showProfileModal"
      @open-personal-center="handleOpenPersonalCenter"
      @update:visible="changeLoginStatus"
    />

    <!-- 个人中心页面 -->
    <PersonalCenter
      v-model:visible="showPersonalCenterModal"
    />
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  .layout-header {
    width: 100%;
    height: 60px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  :deep(.el-footer) {
    height: 41px !important;
  }
  :deep(.el-main) {
    background: #f5f5f5;
  }
}
</style>
