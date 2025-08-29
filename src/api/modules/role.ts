import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      roleCode: string
      roleName: string
    }
  }) => api.post('/role/page', data),

  detail: (id: number | string) => api.post(`/role/detail/${id}`, { roleId: id }),

  create: (data: any) => api.post('/role/save', data),

  edit: (data: any) => api.post('/role/update', data),

  delete: (data: number[] | string[]) => api.post('/role/delete', data),

  checkUnique: (data: {
    id: string
    paramCode: string
    paramValue: string
  }) => api.post('/role/unique', data),

  changeStatus: (data: {
    id: string
    status: boolean | string
  }) => api.post('/role/status', data),

  getAuthUserList: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      username: string
      roleId: string
    }
  }) => api.post('/role/grantUserList', data),

  getUnAuthUserList: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      username: string
      neRoleId: string
    }
  }) => api.post('/role/unGrantUserList', data),

  cancelSingleAuth: (data: {
    userId: string
    roleId: string
  }) => api.post('/role/cancelGrantUser', data),

  cancelBatchAuth: (data: {
    userIds: string[]
    roleId: string
  }) => api.post('/role/batchCancelGrantUser', data),

  batchAuth: (data: {
    userIds: string[]
    roleId: string
  }) => api.post('/role/batchGrantUser', data),

  roleBindMenu: (data: {
    menuIds: string[]
    roleId: string
  }) => api.post('/role/grantMenu', data),
}
