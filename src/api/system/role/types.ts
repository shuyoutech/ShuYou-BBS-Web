/**
 * 角色查询参数
 */
export interface RoleQuery {
  roleCode?: string;
  roleName?: string;
}

/**
 * 角色详情
 */
export interface RoleVo {
  id: string;
  status: string;
  statusName: string;
  roleCode: string;
  roleName: string;
  roleSort: number;
  roleDes: string;
  dataScope: string;
  menuIds: number[];
  orgIds: number[];
  createTime: string;
  createUserId: string;
  createUserName: string;
  createOrgId: number;
  createOrgName: string;
  updateTime: string;
  updateUserId: string;
  updateUserName: string;
}

/**
 * 角色新增对象
 */
export interface RoleSaveBo {
  status: string;    //状态
  roleCode: string;  //角色编码
  roleName: string;  //角色名称
  roleSort: string;  //角色排序
  roleDes: string;   //角色描述
  dataScope: string; //数据范围
  menuIds: string[]; //菜单组数据权限
  orgIds: string[];  //机构组数据权限
}

/**
 * 角色修改对象
 */
export interface RoleUpdateBo extends RoleSaveBo {
  id: string;
}

export interface CancelGrantUserBo {
  roleId: string; //角色ID
  userId: string; //用户ID
}

export interface BatchGrantUserBo {
  roleId: string; //角色ID
  userIds: string[]; //用户IDS
}

export interface BatchGrantMenuBo {
  roleId: string; //角色ID
  menuIds: string[]; //菜单IDS
}


