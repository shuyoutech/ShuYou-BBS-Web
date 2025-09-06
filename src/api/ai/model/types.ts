/**
 * 模型查询参数
 */
export interface ModelQuery {
  provider?: string;  //模型编码
  modelName?: string; //模型名称
  modelType?: string; //模型类型
  hot?: boolean;      //是否热门模型
  chargeType?: string;//计费类型
  modelTag?: string;  //模型标签
}

/**
 * 模型详情
 */
export interface ModelVo {
  id: string;              //模型ID
  status: string;          //状态
  statusName: string;      //状态名称
  provider: string;        //供应商
  providerName: string;    //供应商名称
  providerIcon: string;    //供应商图标
  modelTypes: string[];    //模型类型
  modelTypeNames: string[];//模型类型名称
  modelName: string;       //模型名称
  modelAlias: string;      //模型别名
  inputs: string[];        //输入支持
  outputs: string[];       //输出支持
  modelDesc: string;       //模型描述
  contextWindow: number;   //上下文长度
  baseUrl: string;         //代理地址
  apiKey: string;          //API密钥
  modelTags: string[];     //模型标签
  hot: boolean;            //是否热门模型
  enableSearch: boolean;   //是否支持互联网搜索
  enableThinking: boolean; //是否支持思考模式
  chargeType: string;      //计费类型
  chargeTypeName: string;  //计费类型名称
  prices: ModelPriceVo[];  //价格列表
}

export interface ModelPriceVo {
  feeRule: string;             //收费规则
  feeRuleName: string;         //收费规则名称
  tokenPrice: number;          //token价格
  tokenPriceUnit: string;      //价格单位:千Token、百万Token
  tokenPriceUnitName: string;  //价格单位名称
  currencyUnit: string;        //货币单位
  currencyUnitName: string;    //货币单位名称
}

/**
 * 模型新增对象
 */
export interface ModelSaveBo {
  status: string;          //状态
  provider: string;        //供应商
  modelTypes: string[];    //模型类型
  modelName: string;       //模型名称
  modelAlias: string;      //模型别名
  inputs: string[];        //输入支持
  outputs: string[];       //输出支持
  modelDesc: string;       //模型描述
  contextWindow: number;   //上下文长度
  baseUrl: string;         //代理地址
  apiKey: string;          //API密钥
  modelTags: string[];     //模型标签
  hot: boolean;            //是否热门模型
  enableSearch: boolean;   //是否支持互联网搜索
  enableThinking: boolean; //是否支持思考模式
  chargeType: string;      //计费类型
  prices: ModelPriceBo[];  //价格列表
}

export interface ModelPriceBo {
  feeRule: string;             //收费规则
  tokenPrice: number;          //token价格
  tokenPriceUnit: string;      //价格单位:千Token、百万Token
  currencyUnit: string;        //货币单位
}

/**
 * 模型修改对象
 */
export interface ModelUpdateBo extends ModelSaveBo {
  id: string; //模型ID
}
