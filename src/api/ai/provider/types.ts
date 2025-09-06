/**
 * 供应商查询参数
 */
export interface ProviderQuery {
  providerCode?: string; //供应商编码
  providerName?: string; //供应商名称
}

/**
 * 供应商详情
 */
export interface ProviderVo {
  id: string;           //供应商ID
  providerCode: string; //供应商编码
  providerName: string; //供应商名称
  providerIcon: string; //供应商图标
  providerSort: number; //供应商排序
  providerDesc: string; //供应商描述
}

/**
 * 供应商新增对象
 */
export interface ProviderSaveBo {
  providerCode: string; //供应商编码
  providerName: string; //供应商名称
  providerIcon: string; //供应商图标
  providerSort: number; //供应商排序
  providerDesc: string; //供应商描述
}

/**
 * 供应商修改对象
 */
export interface ProviderUpdateBo extends ProviderSaveBo {
  id: string; //供应商ID
}
