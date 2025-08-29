import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      noticeType: string
      noticeTitle: string
    }
  }) => api.post('/notice/page', data),

  detail: (id: number | string) => api.post(`/notice/detail/${id}`, { id }),

  create: (data: any) => api.post('/notice/save', data),

  edit: (data: any) => api.post('/notice/update', data),

  delete: (data: number[] | string[]) => api.post('/notice/delete', data),

  changeStatus: (data: {
    id: string
    status: boolean | string
  }) => api.post('/notice/status', data),
}
