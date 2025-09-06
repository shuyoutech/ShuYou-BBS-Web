import type {AxiosResponse} from "axios";
import api from "@/utils/axios.ts";
import type {NoticeQuery, NoticeSaveBo, NoticeUpdateBo, NoticeVo} from "@/api/system/notice/types.ts";

/**
 * 通知公告管理-分页
 */
export function noticePageApi(data: PageQuery<NoticeQuery>): Promise<AxiosResponse<PageResult<NoticeVo>>> {
  return api({
    url: '/notice/page',
    method: 'post',
    data: data
  });
}

/**
 * 通知公告管理-详情
 */
export function noticeDetailApi(noticeId: string): Promise<AxiosResponse<NoticeVo>> {
  return api({
    url: '/notice/detail' + noticeId,
    method: 'post'
  });
}

/**
 * 通知公告管理-新增
 */
export function noticeSaveApi(data: NoticeSaveBo): Promise<AxiosResponse<string>> {
  return api({
    url: '/notice/save',
    method: 'post',
    data: data
  });
}

/**
 * 通知公告管理-修改
 */
export function noticeUpdateApi(data: NoticeUpdateBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/notice/update',
    method: 'post',
    data: data
  });
}

/**
 * 通知公告管理-删除
 */
export function noticeDeleteApi(data: string[]): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/notice/delete',
    method: 'post',
    data: data
  });
}
