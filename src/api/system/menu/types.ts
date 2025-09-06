/**
 * 菜单查询参数
 */
export interface MenuQuery {
    menuName?: string;
}

/**
 * 菜单详情
 */
export interface MenuVo {
    id: number;
    rootId: number;
    parentId: number;
    treePath: string;
    treeLevel: number;
    status: string;
    menuType: string;
    menuName: string;
    menuPath: string;
    menuSort: number;
    menuDesc: string;
    perms: string;
    icon: string;
    component: string;
    beenExt: boolean;
    beenKeepalive: boolean;
    beenVisible: boolean;
}

/**
 * 菜单新增对象
 */
export interface MenuSaveBo {
    status: string; //状态
    parentId: number; //父级ID
    menuType: string; //菜单类型
    menuName: string; //菜单名称
    menuPath: string; //菜单路径
    menuSort: number; //菜单排序
    menuDesc: string; //菜单描述
    perms: string;    //权限标识
    icon: string;     //菜单图标
    component: string;//组件路径
    beenExt: boolean; //是否外链
    beenKeepalive: boolean; //是否缓存
    beenVisible: boolean;   //是否显示
}

/**
 * 菜单修改对象
 */
export interface MenuUpdateBo extends MenuSaveBo {
    id: string;
}


