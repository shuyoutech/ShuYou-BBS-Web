/**
 * 岗位查询参数
 */
export interface PostQuery {
  postName?: string;
  postCode?: string;
}

/**
 * 岗位详情
 */
export interface PostVo {
  id: string;
  status: string;
  postCode: string; //岗位编码
  postName: string; //岗位名称
  postSort: number; //岗位排序
  postDesc: string; //岗位描述
}

/**
 * 岗位新增对象
 */
export interface PostSaveBo {
  status: string;   //状态
  postCode: string; //岗位编码
  postName: string; //岗位名称
  postSort: number; //岗位排序
  postDesc: string; //岗位描述
}

/**
 * 岗位修改对象
 */
export interface PostUpdateBo extends PostSaveBo {
  id: string;
}
