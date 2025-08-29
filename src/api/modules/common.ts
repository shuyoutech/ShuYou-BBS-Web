import api from '../index'

export default {
  getDictOptions: (dictCode: string) => api.post(`/common/dict/options/${dictCode}`, { dictCode }),

  downLoadFile: (templateType: string) => api.post(`/common/templateFile`, { templateType }),

  uploadFile: (data: any) => api.post(`/file/upload`, data),

  getPermission: (data: any) => api.post(`/user/permission`, data),
}
