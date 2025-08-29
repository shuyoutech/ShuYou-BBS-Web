import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      name: ''
    }
  }) => api.post('/app/page', data),

  detail: (data: {
    id: string
  }) => api.post(`/app/detail/${data.id}`, data),

  chat: (data: any) => api.post(`/app/chatTest`, data),

  edit: (data: any) => api.post(`/app/update`, data),

  add: (data: any) => api.post(`/app/save`, data),

  delete: (data: string[]) => api.post('/app/delete', data),

  chatList: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      appId: ''
      source: ''
      title: ''
      startDate: ''
      endDate: ''
    }
  }) => api.post(`/chatConversation/page`, data),

  newsList: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      appId: ''
      conversationId: ''
    }
  }) => api.post(`/chatMessage/page`, data),
}
