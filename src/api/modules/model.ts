import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    query?: {
      modelType: ''
      modelName: ''
    }
  }) => api.post('/model/page', data),

  detail: (data: { id: string }) => api.post(`/model/detail/${data.id}`, data),

  create: (data: any) => api.post('/model/save', data),

  update: (data: any) => api.post('/model/update', data),

  delete: (data: string[]) => api.post('/model/delete', data),

  changeStatus: (data: {
    id?: string
    status?: string
  }) => api.post('/model/status', data),
}
