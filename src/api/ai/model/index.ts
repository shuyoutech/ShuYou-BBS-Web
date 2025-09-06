import type {AxiosResponse} from "axios";
import api from "@/utils/axios.ts";
import type {ModelQuery, ModelSaveBo, ModelUpdateBo, ModelVo} from "@/api/ai/model/types.ts";

/**
 * 模型管理-分页
 */
export function modelPageApi(data: PageQuery<ModelQuery>): Promise<AxiosResponse<PageResult<ModelVo>>> {
  return api({
    url: '/model/page',
    method: 'post',
    data: data
  });
}

/**
 * 模型管理-详情
 */
export function modelDetailApi(modelId: string): Promise<AxiosResponse<ModelVo>> {
  return api({
    url: '/model/detail' + modelId,
    method: 'post'
  });
}

/**
 * 模型管理-新增
 */
export function modelSaveApi(data: ModelSaveBo): Promise<AxiosResponse<string>> {
  return api({
    url: '/model/save',
    method: 'post',
    data: data
  });
}

/**
 * 模型管理-修改
 */
export function modelUpdateApi(data: ModelUpdateBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/model/update',
    method: 'post',
    data: data
  });
}

/**
 * 模型管理-删除
 */
export function modelDeleteApi(data: string[]): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/model/delete',
    method: 'post',
    data: data
  });
}
