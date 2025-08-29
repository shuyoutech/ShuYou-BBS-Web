import api from '../index'

export default {
  list: (data: {
    pageNum?: string
    pageSize?: string
    query?: {
      name: ''
      type: ''
    }
  }) => api.post('/vectorStore/page', data),

  detail: (data: {
    id: string
  }) => api.post(`/vectorStore/detail/${data.id}`, data),

  add: (data: {
    name?: string
    type?: string
    host?: string
    port?: string
    username?: string
    password?: string
    databaseName?: string
    tableName?: string
    dimension?: string
  }) => api.post('/vectorStore/save', data),

  edit: (data: {
    id?: string
    name?: string
    type?: string
    host?: string
    port?: string
    username?: string
    password?: string
    databaseName?: string
    tableName?: string
    dimension?: string
  }) => api.post('/vectorStore/update', data),

  delete: (data: string[]) => api.post('/vectorStore/delete', data),

  testConnect: (data: {
    id?: string
  }) => api.post(`/vectorStore/testConnect/${data.id}`, data),
}
