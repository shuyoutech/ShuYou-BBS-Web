import api from '../index'

export default {

  // 社交用户授权,获取二维码地址
  authorize: (data: {
    socialType: string,
  }) => api.post('/api/member/auth/authorize', data),

  // 根据code获取第三方访问令牌
  accessToken: (data: {
    socialType: string,
    code: string,
    state: string
  }) => api.post('/api/member/auth/accessToken', data),

  // 发送手机验证码
  sendSms: (data: {
    mobile: string,
    templateCode: string,
  }) => api.post('/api/member/auth/sendSms', data),

  // 使用手机 + 验证码登录
  smsLogin: (data: {
    mobile: string,
    code: string,
  }) => api.post('/api/member/auth/smsLogin', data),

  // 获取个人信息
  getProfile: () => api.post('/memberUser/getProfile'),

}
