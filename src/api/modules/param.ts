import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      configName: string
      configKey: string
    }
  }) => api.post('/config/page', data),

  detail: (id: number | string) => api.post(`/config/detail/${id}`, { id }),

  create: (data: any) => api.post('/config/save', data),

  edit: (data: any) => api.post('/config/update', data),

  delete: (data: number[] | string[]) => api.post('/config/delete', data),
}
