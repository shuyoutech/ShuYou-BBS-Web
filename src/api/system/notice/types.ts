/**
 * 通知公告查询参数
 */
export interface NoticeQuery {
  noticeType?: string;
  noticeTitle?: string;
}

/**
 * 通知公告详情
 */
export interface NoticeVo {
  id: string;
  status: string;
  noticeType: string; //公告类型
  noticeTitle: string; //公告标题
  noticeContent: string; //公告内容
  noticeDesc: string; //公告描述
}

/**
 * 通知公告新增对象
 */
export interface NoticeSaveBo {
  noticeType: string;
  noticeTitle: string;
  noticeContent: string;
  noticeDesc: string;
}

/**
 * 通知公告修改对象
 */
export interface NoticeUpdateBo extends NoticeSaveBo {
  id: string;
}
