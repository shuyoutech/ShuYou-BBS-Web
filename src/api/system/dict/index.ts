import type {AxiosResponse} from "axios";
import api from "@/utils/axios.ts";
import type {
  DictDataQuery,
  DictDataSaveBo, DictDataUpdateBo, DictDataVo, DictQuery, DictSaveBo,
  DictTypeQuery,
  DictTypeSaveBo,
  DictTypeUpdateBo,
  DictTypeVo, DictUpdateBo, DictVo
} from "@/api/system/dict/types.ts";

/**
 * 字典类型管理-分页
 */
export function dictTypePageApi(data: PageQuery<DictTypeQuery>): Promise<AxiosResponse<PageResult<DictTypeVo>>> {
  return api({
    url: '/dict/type/page',
    method: 'post',
    data: data
  });
}

/**
 * 字典类型管理-详情
 */
export function dictTypeDetailApi(dictTypeId: string): Promise<AxiosResponse<DictTypeVo>> {
  return api({
    url: '/dict/type/detail' + dictTypeId,
    method: 'post'
  });
}

/**
 * 字典类型管理-新增
 */
export function dictTypeSaveApi(data: DictTypeSaveBo): Promise<AxiosResponse<string>> {
  return api({
    url: '/dict/type/save',
    method: 'post',
    data: data
  });
}

/**
 * 字典类型管理-修改
 */
export function dictTypeUpdateApi(data: DictTypeUpdateBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/dict/type/update',
    method: 'post',
    data: data
  });
}

/**
 * 字典类型管理-删除
 */
export function dictTypeDeleteApi(data: string[]): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/dict/type/delete',
    method: 'post',
    data: data
  });
}

/**
 * 字典数据管理-分页
 */
export function dictDataPageApi(data: PageQuery<DictDataQuery>): Promise<AxiosResponse<PageResult<DictDataVo>>> {
  return api({
    url: '/dict/data/page',
    method: 'post',
    data: data
  });
}

/**
 * 字典数据管理-详情
 */
export function dictDataDetailApi(dictDataId: string): Promise<AxiosResponse<DictDataVo>> {
  return api({
    url: '/dict/data/detail' + dictDataId,
    method: 'post'
  });
}

/**
 * 字典数据管理-新增
 */
export function dictDataSaveApi(data: DictDataSaveBo): Promise<AxiosResponse<string>> {
  return api({
    url: '/dict/data/save',
    method: 'post',
    data: data
  });
}

/**
 * 字典数据管理-修改
 */
export function dictDataUpdateApi(data: DictDataUpdateBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/dict/data/update',
    method: 'post',
    data: data
  });
}

/**
 * 字典数据管理-删除
 */
export function dictDataDeleteApi(data: string[]): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/dict/data/delete',
    method: 'post',
    data: data
  });
}

/**
 * 字典管理-字典树
 */
export function dictTreeApi(data: DictQuery): Promise<AxiosResponse<Tree<DictVo>[]>> {
  return api({
    url: '/dict/tree',
    method: 'post',
    data: data
  });
}

/**
 * 字典管理-详情
 */
export function dictDetailApi(dictId: number): Promise<AxiosResponse<DictVo>> {
  return api({
    url: '/dict/detail' + dictId,
    method: 'post'
  });
}

/**
 * 字典管理-新增
 */
export function dictSaveApi(data: DictSaveBo): Promise<AxiosResponse<number>> {
  return api({
    url: '/dict/save',
    method: 'post',
    data: data
  });
}

/**
 * 字典管理-修改
 */
export function dictUpdateApi(data: DictUpdateBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/dict/update',
    method: 'post',
    data: data
  });
}

/**
 * 字典管理-删除
 */
export function dictDeleteApi(data: string[]): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/dict/delete',
    method: 'post',
    data: data
  });
}
