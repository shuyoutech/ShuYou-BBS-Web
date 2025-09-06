import type {AxiosResponse} from "axios";
import type {ChatConversationVo, ChatMessageVo, ChatModelBo, ImageModelBo} from "@/api/ai/aigc/types.ts";
import api from "@/utils/axios.ts";

/**
 * 对话管理-对话接口
 */
export function chatApi(data: ChatModelBo) {
  return api({
    url: '/v1/chat',
    method: 'post',
    data: data,
  });
}

/**
 * 对话管理-对话窗口分页列表
 */
export function chatConversationPageApi(title?: string): Promise<AxiosResponse<PageResult<ChatConversationVo>>> {
  return api({
    url: '/chat/conversation/page',
    method: 'post',
    data: {
      title: title,
    }
  });
}

/**
 * 对话管理-修改对话窗口
 */
export function chatConversationUpdateApi(title: string): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/chat/conversation/update',
    method: 'post',
    data: {
      title: title,
    }
  });
}

/**
 * 对话管理-修改对话窗口
 */
export function chatConversationDeleteApi(conversationId: string): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/chat/conversation/delete',
    method: 'post',
    data: {
      ids: [conversationId],
    }
  });
}

/**
 * 对话管理-对话消息分页列表
 */
export function chatMessagePageApi(conversationId: string): Promise<AxiosResponse<PageResult<ChatMessageVo>>> {
  return api({
    url: '/chat/message/page',
    method: 'post',
    data: {
      conversationId: conversationId,
    }
  });
}

/**
 * 图片接口
 */
export function imageApi(data: ImageModelBo) {
  return api({
    url: '/v1/image',
    method: 'post',
    data: data,
  });
}

/**
 * 音频接口
 */
export function audioApi(data: ChatModelBo) {
  return api({
    url: '/v1/audio',
    method: 'post',
    data: data,
  });
}

/**
 * 视频接口
 */
export function videoApi(data: ChatModelBo) {
  return api({
    url: '/v1/video',
    method: 'post',
    data: data,
  });
}
