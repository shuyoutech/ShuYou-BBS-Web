import api from '../index'

export default {
  list: (data: {
    account?: string
    name?: string
    mobile?: string
    sex?: number | string
    from: number
    limit: number
  }) => api.post('/user/page', data),

  detail: (data: { userId?: string }) => api.post(`user/detail/${data.userId}`, data),

  create: (data: any) => api.post('/user/save', data),

  edit: (data: any) => api.post('/user/update', data),

  delete: (data: string[]) => api.post('/user/delete', data),

  passwordReset: (data: {
    userId: string
    password: string
  }) => api.post('/user/resetPassword', data),

  exportUser: (data: any) => api.post('/user/export', data),

  auth: (data: {
    userId: string
    roleIds: string[]
  }) => api.post('/user/grantRole', data),
}
