import api from '../index'

export default {
  // 登录
  login: (data: {
    username: string
    password: string
  }) => api.post('/api/auth/login', data),
  // 获取权限
  permission: () => api.post('/user/permission'),

  // 修改密码
  passwordEdit: (data: {
    oldPassword: string
    newPassword: string
  }) => api.post('/user/updatePassword', data),

  // 退出登录
  logout: () => api.post('/auth/logout'),

  // 获取用户信息
  getUserInfo: () => api.post('/user/getProfile'),
  // 修改用户信息
  editUserInfo: (data: {
    nickname: string
    mobile: string
    email: string
    sex: string
    address: string
  }) => api.post('/user/updateProfile', data),
}
