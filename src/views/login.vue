<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="50%"
    class="ai-login-modal"
  >
    <div class="login-page">
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="handleClose">
        <FaIcon name="i-mdi:close" />
      </button>

      <!-- 左侧功能展示区 -->
      <div class="left-section">
        <div class="content">
          <h1 class="title">Hello, 欢迎登录数游论坛</h1>
          <p class="subtitle">更多精彩等你来发现</p>

          <!-- 3D螺旋图形 -->
          <div class="spiral-container">
            <div class="spiral">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
              <div class="ring ring-4"></div>
              <div class="ring ring-5"></div>
              <div class="ring ring-6"></div>
            </div>
          </div>

          <!-- AI功能按钮 -->
          <div class="ai-features">
            <div
              v-for="feature in aiFeatures"
              :key="feature.name"
              class="feature-btn"
              :class="feature.position"
            >
              <FaIcon :name="feature.icon" class="feature-icon" />
              <span>{{ feature.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录面板 -->
      <div class="right-section">
        <div class="login-panel">
          <div class="brand">
            <div class="logo">
              <FaIcon name="i-mdi:brain" class="logo-icon" />
            </div>
            <h2 class="brand-name">数游论坛</h2>
          </div>

          <div class="login-tabs">
            <button
              class="tab-btn"
              :class="{ active: loginType === 'wechat' }"
              @click="loginType = 'wechat'"
            >
              微信登录
            </button>
            <button
              class="tab-btn"
              :class="{ active: loginType === 'phone' }"
              @click="loginType = 'phone'"
            >
              手机登录
            </button>
          </div>

          <div v-if="loginType === 'wechat'" class="wechat-login">
            <div class="qr-container">
              <div class="qr-code">
                <div v-show="qrCodeUrl" class="code-box">
                  <iframe
                      :src="qrCodeUrl"
                      :style="{ width: '200px', height: '200px' }"
                      class="wechat-iframe"
                  />
                </div>
              </div>
            </div>
            <div class="qr-instructions">
              <div class="instruction-item">
                <FaIcon name="i-mdi:wechat" class="wechat-icon" />
                <span>打开【手机微信】扫一扫登录更方便</span>
              </div>
            </div>
          </div>

          <div v-if="loginType === 'phone'" class="phone-login">
            <form @submit="onPhoneSubmit">
              <div class="form-item">
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  class="phone-input"
                  v-model="phoneForm.phone"
                />
              </div>

              <div class="form-item">
                <div class="code-input-group">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    class="code-input"
                    v-model="phoneForm.code"
                  />
                  <button
                    type="button"
                    class="send-code-btn"
                    @click="sendCode"
                  >
                    发送验证码
                  </button>
                </div>
              </div>

              <button
                :disabled="loading"
                class="login-btn"
                type="submit"
              >
                {{ loading ? '登录中...' : '登录' }}
              </button>
            </form>
          </div>

          <div class="terms">
            <p>欢迎使用数游论坛,您登录即同意</p>
            <div class="terms-links">
              <a href="#" class="term-link">《用户协议》</a>
              <span>和</span>
              <a href="#" class="term-link">《隐私政策》</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import apiAuth from '@/api/modules/auth'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'login-success', userData: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const loginType = ref<'wechat' | 'phone'>('wechat')
const qrCodeUrl = ref('')

const phoneForm = ref({
  phone: '',
  code: '',
})

const aiFeatures = [
  { name: '游戏指南', icon: 'i-mdi:play-circle', position: 'top' },
  { name: '游戏捏脸', icon: 'i-mdi:presentation', position: 'top-left' },
  { name: '游戏商城', icon: 'i-mdi:sail-boat', position: 'top-right' },
  { name: '游戏百科', icon: 'i-mdi:account', position: 'bottom-left' },
  { name: '游戏公会', icon: 'i-mdi:chat', position: 'bottom-right' },
]

const onPhoneSubmit = async (e: Event) => {
  e.preventDefault()
  loading.value = true
  console.log('登录信息:', phoneForm.value)

  try {
    // 模拟登录成功
    const mockUserInfo = {
      id: 1,
      nickname: '测试用户',
      avatar: 'https://via.placeholder.com/40x40/8b5cf6/ffffff?text=U',
      phone: phoneForm.value.phone
    }

    // 保存用户信息到本地存储
    localStorage.setItem('token', 'mock-token-' + Date.now())
    localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))
    localStorage.setItem('avatar', mockUserInfo.avatar)

    console.log('登录成功，用户信息已保存')

    // 登录成功
    setTimeout(() => {
      loading.value = false
      ElMessage.success('登录成功！')
      emit('login-success', mockUserInfo)
      handleClose()
    }, 1000)

  } catch (error) {
    console.error('登录失败:', error)
    loading.value = false
  }
}

const sendCode = () => {
  const phone = phoneForm.value.phone
  if (!phone || phone.length !== 11) return
  console.log('发送验证码到:', phone)
  ElMessage.success('验证码已发送')
}

const handleClose = () => {
  emit('update:visible', false)
}

function getQrcode() {
  let res = apiAuth.authorize({
    socialType: '01'
  });
  qrCodeUrl.value = res.data
}
</script>

<style scoped>
.ai-login-modal :deep(.el-dialog) {
  margin: 20vh auto !important;
  height: 60vh !important;
  max-width: 600px !important;
  width: 45% !important;
  border-radius: 20px !important;
  overflow: hidden !important;
}

.ai-login-modal :deep(.el-dialog__body) {
  padding: 0;
  height: 60vh;
}

.login-page {
  display: flex;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d1b69 100%);
  overflow: hidden;
  position: relative;
}

/* 左侧功能展示区 */
.left-section {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #1a1a3a 0%, #2d1b69 50%, #4c1d95 100%);
}

.left-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.content {
  text-align: center;
  z-index: 1;
  position: relative;
  margin-top: 40px;
}

.title {
  font-size: 2.0rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.25rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

/* 3D螺旋图形 */
.spiral-container {
  width: 150px;
  height: 150px;
  margin-left: 100px;
}

.spiral {
  position: relative;
  width: 100%;
  height: 100%;
  animation: rotate 20s linear infinite;
}

.ring {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite alternate;
}

.ring-1 {
  width: 60px;
  height: 60px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #8b5cf6;
  animation-delay: 0s;
}

.ring-2 {
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #a855f7;
  animation-delay: 0.5s;
}

.ring-3 {
  width: 180px;
  height: 180px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #c084fc;
  animation-delay: 1s;
}

.ring-4 {
  width: 240px;
  height: 240px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #d8b4fe;
  animation-delay: 1.5s;
}

.ring-5 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #e9d5ff;
  animation-delay: 2s;
}

.ring-6 {
  width: 360px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #f3e8ff;
  animation-delay: 2.5s;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% {
    opacity: 0.3;
    box-shadow: 0 0 20px currentColor;
  }
  100% {
    opacity: 1;
    box-shadow: 0 0 40px currentColor;
  }
}

/* AI功能按钮 */
.ai-features {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto;
}

.feature-btn {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-btn:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
}

.feature-icon {
  font-size: 1rem;
  color: #a855f7;
}

.feature-btn.top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.feature-btn.top-left {
  top: 20%;
  left: 10%;
}

.feature-btn.top-right {
  top: 20%;
  right: 10%;
}

.feature-btn.bottom-left {
  bottom: 20%;
  left: 10%;
}

.feature-btn.bottom-right {
  bottom: 20%;
  right: 10%;
}

.feature-btn.bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.feature-btn.bottom-center-2 {
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
}

/* 右侧登录面板 */
.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  min-width: 350px;
}

.login-panel {
  width: 100%;
  max-width: 350px;
  padding: 0.5rem;
  position: relative;
}

.close-btn {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  z-index: 1000;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.brand {
  text-align: center;
  margin-bottom: 0.5rem;
}

.logo {
  width: 50px;
  height: 50px;
  margin: 0 auto 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  font-size: 2rem;
  color: white;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.25rem;
}

.brand-slogan {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.login-tabs {
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-btn.active {
  color: white;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.wechat-login {
  text-align: center;
}

.qr-container {
  margin-bottom: 0.5rem;
}

.qr-code {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.qr-placeholder {
  text-align: center;
  color: #666;
}

.qr-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.qr-instructions {
  color: white;
}

.instruction-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.wechat-icon {
  color: #07c160;
  font-size: 1.25rem;
}

.proxy-notice {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

.phone-login {
  color: white;
}

.form-item {
  margin-bottom: 0.75rem;
}

.phone-input,
.code-input {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  backdrop-filter: blur(10px);
}

.phone-input::placeholder,
.code-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.phone-input:focus,
.code-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.code-input-group {
  display: flex;
  gap: 0.75rem;
}

.code-input {
  flex: 1;
}

.send-code-btn {
  white-space: nowrap;
  padding: 12px 16px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-code-btn:hover {
  background: rgba(139, 92, 246, 0.3);
  border-color: rgba(139, 92, 246, 0.5);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.terms {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

.terms-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.term-link {
  color: #8b5cf6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.term-link:hover {
  color: #a855f7;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .left-section {
    flex: 1;
    min-height: 40vh;
  }

  .right-section {
    flex: 1;
  }

  .title {
    font-size: 1.5rem;
  }

  .spiral-container {
    width: 200px;
    height: 200px;
  }

  .ai-features {
    width: 300px;
    height: 300px;
  }

  .feature-btn {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>
