import apiUser from '@/api/modules/user'
import router from '@/router'

export const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const account = ref(localStorage.getItem('account') ?? '')
    const token = ref(localStorage.getItem('token') ?? '')
    const avatar = ref(localStorage.getItem('avatar') ?? '')
    const userInfo = ref(localStorage.getItem('userInfo') ? JSON.parse(<string>localStorage.getItem('userInfo')) : {})
    const permissions = ref<string[]>([])
    const isLogin = computed(() => {
      return !!token.value;
    })

    // 登录
    async function login(data: {
      account: string
      password: string
    }) {
      const res = await apiUser.login({username: data.account, password: data.password})
      localStorage.setItem('account', data.account)
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('userId', res.data.userId)
      account.value = data.account
      token.value = res.data.accessToken
      await getUserInfo()
    }

    // 手动登出
    async function logout() {
      await apiUser.logout()
      // 此处仅清除计算属性 isLogin 中判断登录状态过期的变量，以保证在弹出登录窗口模式下页面展示依旧正常
      localStorage.removeItem('token')
      token.value = ''
      router.push({
        name: 'home',
      }).then(logoutCleanStatus)
    }

    // 请求登出
    function requestLogout() {
      // 此处仅清除计算属性 isLogin 中判断登录状态过期的变量，以保证在弹出登录窗口模式下页面展示依旧正常
      localStorage.removeItem('token')
      token.value = ''
      router.push({
        name: 'home',
      }).then(logoutCleanStatus)
    }

    // 登出后清除状态
    function logoutCleanStatus() {
      localStorage.removeItem('account')
      localStorage.removeItem('avatar')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      account.value = ''
      avatar.value = ''
      permissions.value = []
    }

    // 获取权限
    async function getPermissions() {
      const res = await apiUser.permission()
      permissions.value = res.data
    }

    // 修改密码
    async function editPassword(data: {
      password: string
      newPassword: string
    }) {
      await apiUser.passwordEdit({oldPassword: data.password, newPassword: data.newPassword})
    }

    // 获取用户信息
    async function getUserInfo() {
      const res = await apiUser.getUserInfo()
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      localStorage.setItem('avatar', res.data.avatar)
      avatar.value = res.data.avatar
      userInfo.value = res.data
    }

    return {
      account,
      token,
      avatar,
      permissions,
      userInfo,
      isLogin,
      login,
      logout,
      requestLogout,
      getPermissions,
      editPassword,
    }
  },
)
