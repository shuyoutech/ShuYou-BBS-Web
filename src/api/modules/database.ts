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
  }) => api.post('/knowledge/page', data),

  detail: (data: {
    id: string
  }) => api.post(`/knowledge/detail/${data.id}`, data),

  knowledgeDocList: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      knowledgeId: ''
      docName: ''
    }
  }) => api.post(`/knowledgeDoc/page`, data),

  addKnowledge: (data: {
    knowledgeName: string
    vectorStoreId: string
    embeddingModelId: string
    knowledgeDesc: string
  }) => api.post(`/knowledge/save`, data),

  editKnowledge: (data: {
    id: string
    knowledgeName: string
    vectorStoreId: string
    embeddingModelId: string
    knowledgeDesc: string
  }) => api.post(`/knowledge/update`, data),

  delete: (data: string[]) => api.post('/knowledge/delete', data),

  importFile: (data: {
    knowledgeId: string
    docFileIds: string[]
  }) => api.post(`/embedding/file`, data),

  importText: (data: {
    knowledgeId: string
    docContent: string
  }) => api.post(`/embedding/text`, data),

  deleteDoc: (data: string[]) => api.post('/knowledgeDoc/delete', data),

  knowledgeSliceList: (data: {
    pageNum?: string
    pageSize?: string
    sort?: string
    order?: string
    query?: {
      knowledgeId: ''
      docId: ''
    }
  }) => api.post(`/knowledgeDocSlice/page`, data),

  editSlice: (data: {
    id: string
    knowledgeId?: string
    docId?: string
    docName?: string
    vectorId?: string
    content?: string
  }) => api.post(`/knowledgeDocSlice/update`, data),

  deleteSlice: (data: string[]) => api.post('/knowledgeDocSlice/delete', data),

  search: (data: {
    knowledgeId: string
    text: string
  }) => api.post(`/embedding/search`, data),
}
