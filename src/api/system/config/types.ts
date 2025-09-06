/**
 * 参数配置查询参数
 */
export interface ConfigQuery {
  configName?: string;
  configKey?: string;
}

/**
 * 参数配置详情
 */
export interface ConfigVo {
  id: string;
  configName: string;
  configKey: string;
  configValue: string;
  configDesc: string;
}

/**
 * 参数配置新增对象
 */
export interface ConfigSaveBo {
  configName: string; //参数名称
  configKey: string;  //参数键名
  configValue: string;//参数键值
  configDesc: string; //参数描述
}

/**
 * 参数配置修改对象
 */
export interface ConfigUpdateBo extends ConfigSaveBo {
  id: string;
}
