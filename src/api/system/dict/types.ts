/**
 * 字典类型查询参数
 */
export interface DictTypeQuery {
  dictCode?: string;
  dictName?: string;
}

/**
 * 字典类型详情
 */
export interface DictTypeVo {
  id: number;
  dictCode: string;
  dictName: string;
  dictDesc: string;
}

/**
 * 字典类型新增对象
 */
export interface DictTypeSaveBo {
  dictCode: string; //字典编码
  dictName: string; //字典名称
  dictDesc: string; //字典描述
}

/**
 * 字典类型修改对象
 */
export interface DictTypeUpdateBo extends DictTypeSaveBo {
  id: string;
}

/**
 * 字典数据查询参数
 */
export interface DictDataQuery {
  dictTypeId?: string;
  dictLabel?: string;
}

/**
 * 字典数据详情
 */
export interface DictDataVo {
  id: number;
  dictTypeId: string;
  dictLabel: string;
  dictValue: string;
  dictSort: number;
}

/**
 * 字典数据新增对象
 */
export interface DictDataSaveBo {
  dictTypeId: string; //字典类型ID
  dictLabel: string;  //字典标签
  dictValue: string;  //字典值
  dictSort: number;   //字典排序
}

/**
 * 字典数据修改对象
 */
export interface DictDataUpdateBo extends DictDataSaveBo {
  id: string;
}


/**
 * 字典查询参数
 */
export interface DictQuery {
  dictCode?: string;
}

/**
 * 字典详情
 */
export interface DictVo {
  id: number;
  rootId: number;
  parentId: number;
  treePath: string;
  treeLevel: number;
  dictCode: string;
  dictLabel: string;
  dictValue: string;
  dictSort: number;
  dictDesc: string;
}

/**
 * 字典新增对象
 */
export interface DictSaveBo {
  status: string;    //状态
  parentId: number;  //父级ID
  dictCode: string;  //字典编码
  dictLabel: string; //字典标签
  dictValue: string; //字典值
  dictSort: number;  //字典排序
  dictDesc: string;  //字典描述
}

/**
 * 字典修改对象
 */
export interface DictUpdateBo extends DictSaveBo {
  id: number;
}



