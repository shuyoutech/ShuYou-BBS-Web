import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      fileName: string
    }
  }) => api.post('/file/page', data),

  detail: (id: number | string) => api.post(`/file/detail/${id}`, { id }),

  create: (data: any) => api.post('/file/save', data),

  delete: (data: {
    id: string
  }) => api.post(`/file/delete/${data.id}`, data),
}
