import api from '@/utils/axios.ts'

import type {AxiosResponse} from "axios"
import type {
  UserProfileBo,
  UserQuery,
  UserSaveBo,
  UserUpdateBo,
  UserVo
} from "@/api/system/user/types.ts";

/**
 * 用户管理-分页列表
 */
export function userPageApi(data: PageQuery<UserQuery>): Promise<AxiosResponse<PageResult<UserVo>>> {
  return api({
    url: '/user/page',
    method: 'post',
    data: data
  });
}

/**
 * 用户管理-详情
 */
export function userDetailApi(userId: string): Promise<AxiosResponse<UserVo>> {
  return api({
    url: '/user/detail' + userId,
    method: 'post'
  });
}

/**
 * 用户管理-新增
 */
export function userSaveApi(data: UserSaveBo): Promise<AxiosResponse<string>> {
  return api({
    url: '/user/save',
    method: 'post',
    data: data
  });
}

/**
 * 用户管理-修改
 */
export function userUpdateApi(data: UserUpdateBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/user/update',
    method: 'post',
    data: data
  });
}

/**
 * 用户管理-删除
 */
export function userDeleteApi(data: string[]): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/user/delete',
    method: 'post',
    data: data
  });
}

/**
 * 用户管理-状态
 */
export function userStatusApi(data: UpdateStatusBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/user/status',
    method: 'post',
    data: data
  });
}

/**
 * 用户管理-导出用户
 */
export function userExportApi(data: UserQuery) {
  return api({
    url: '/user/export',
    method: 'post',
    data: data,
    responseType: 'arraybuffer'
  });
}

/**
 * 用户管理-导入用户
 */
export function userImportApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return api({
    url: '/user/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 用户管理-重置密码,管理员可以指定用户
 */
export function userResetPasswordApi(userId: string, password: string) {
  return api({
    url: '/user/resetPassword',
    method: 'post',
    data: {userId: userId, password: password}
  });
}

/**
 * 用户管理-修改密码,当前用户
 */
export function userUpdatePasswordApi(newPassword: string, oldPassword: string) {
  return api({
    url: '/user/updatePassword',
    method: 'post',
    data: {newPassword: newPassword, oldPassword: oldPassword}
  });
}

/**
 * 用户管理-用户授权角色
 */
export function userGrantRoleApi(userId: string, roleIds: string[]) {
  return api({
    url: '/user/grantRole',
    method: 'post',
    data: {userId: userId, roleIds: roleIds}
  });
}

/**
 * 用户管理-用户授权岗位
 */
export function userGrantPostApi(userId: string, postIds: string[]) {
  return api({
    url: '/user/grantPost',
    method: 'post',
    data: {userId: userId, postIds: postIds}
  });
}

/**
 * 用户管理-获取个人信息
 */
export function userGetProfileApi(): Promise<AxiosResponse<UserVo>> {
  return api({
    url: '/user/getProfile',
    method: 'post'
  });
}

/**
 * 用户管理-修改个人信息
 */
export function userUpdateProfileApi(data: UserProfileBo) {
  return api({
    url: '/user/updateProfile',
    method: 'post',
    data: data,
  });
}

/**
 * 用户管理-获取路由权限
 */
export function userPermissionApi(): Promise<AxiosResponse<string[]>> {
  return api({
    url: '/user/permission',
    method: 'post'
  });
}

/**
 * 用户管理-上传用户头像
 */
export function userAvatarApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return api({
    url: '/user/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}


