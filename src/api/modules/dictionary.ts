import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      dictCode: ''
      dictName: ''
    }
  }) => api.post('/dictType/page', data),

  detail: (id: number | string) => api.post(`/dictType/detail/${id}`, { id }),

  create: (data: any) => api.post('/dictType/save', data),

  edit: (data: any) => api.post('/dictType/update', data),

  delete: (data: number[] | string[]) => api.post('/dictType/delete', data),

  itemList: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      dictTypeId: string
      dictLabel: string
    }
  }) => api.post('/dictData/page', data),

  itemCreate: (data: any) => api.post('/dictData/save', data),

  itemEdit: (data: any) => api.post('/dictData/update', data),

  itemDelete: (data: number[] | string[]) => api.post('/dictData/delete', data),

  itemDetail: (id: number | string) => api.post(`/dictData/detail/${id}`, { id }),
}
