import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      postName: string
    }
  }) => api.post('/post/page', data),

  detail: (id: number | string) => api.post(`/post/detail/${id}`, { id }),

  create: (data: any) => api.post('/post/save', data),

  edit: (data: any) => api.post('/post/update', data),

  delete: (data: number[] | string[]) => api.post('/post/delete', data),
}
