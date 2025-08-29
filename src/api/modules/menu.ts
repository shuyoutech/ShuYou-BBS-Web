import api from '../index'

export default {
  list: (data: {
    menuName?: string
  }) => api.post('/menu/tree', data),

  create: (data: {
    status?: number | string
    parentId?: number | string
    menuType?: string
    menuName?: string
    menuPath: string
    menuSort: number | string
    menuDesc?: string
    perms: string
    icon: string
    component: string
    beenExt: boolean
    beenKeepalive: boolean
    beenVisible: boolean
  }) => api.post('/menu/save', data),

  edit: (data: {
    id: number | string
    status?: number | string
    parentId?: number | string
    menuType?: string
    menuName?: string
    menuPath: string
    menuSort: number | string
    menuDesc?: string
    perms: string
    icon: string
    component: string
    beenExt: boolean
    beenKeepalive: boolean
    beenVisible: boolean
  }) => api.post('/menu/update', data),

  delete: (data: string[]) => api.post('/menu/delete', data),
  detail: (data: { id?: string }) => api.post(`/menu/detail/${data.id}`, data),
}
