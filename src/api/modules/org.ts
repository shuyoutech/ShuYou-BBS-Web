import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      orgName: string
    }
  }) => api.post('/org/page', data),

  tree: (data: any) => api.post('/org/tree', data),

  detail: (id: number | string) => api.post(`/org/detail/${id}`, { id }),

  create: (data: any) => api.post('/org/save', data),

  edit: (data: any) => api.post('/org/update', data),

  delete: (data: number[] | string[]) => api.post('/org/delete', data),
}
