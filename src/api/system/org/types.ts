
/**
 * 机构查询参数
 */
export interface OrgQuery {
  status?: string;
  parentId?: number;
  orgType?: string;
  orgName?: string;
}

/**
 * 机构详情
 */
export interface OrgVo {
  id: number;
  rootId: number;
  parentId: number;
  treePath: string;
  treeLevel: number;
  createTime: string;
  status: string;
  statusName: string;
  orgType: string;
  orgTypeName: string;
  orgName: string;
  orgSort: number;
  directorId: string;
  directorName: string;
}

/**
 * 机构新增对象
 */
export interface OrgSaveBo {
  status: string;
  parentId: number;
  orgType: string;
  orgName: string;
  orgSort: string;
  directorId: string;
}

/**
 * 机构修改对象
 */
export interface OrgUpdateBo extends OrgSaveBo {
  id: string;
}
