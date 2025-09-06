/**
 * 应用查询参数
 */
export interface AppQuery {
  appName?: string; //应用名称
}

/**
 * 应用详情
 */
export interface AppVo {
  id: string;         //应用ID
  appType: string;    //应用类型
  appName: string;    //应用名称
  appIcon: string;    //应用图标
  appDesc: string;    //应用描述
  chatModelId: string;//对话模型ID
  knowledgeId: string;//知识库ID
  promptText: string; //提示词
}

/**
 * 应用新增对象
 */
export interface AppSaveBo {
  appType: string;    //应用类型
  appName: string;    //应用名称
  appIcon: string;    //应用图标
  appDesc: string;    //应用描述
  chatModelId: string;//对话模型ID
  knowledgeId: string;//知识库ID
  promptText: string; //提示词
}

/**
 * 应用修改对象
 */
export interface AppUpdateBo extends AppSaveBo {
  id: string; //应用ID
}

export interface AppChatTestBo {
  appId: string;             //应用ID
  chatModelId: string;       //对话模型ID
  knowledgeId: string;       //知识库ID
  promptText: string;        //提示词
  conversationId?: string;   //会话ID
  messages: AppChatMessage[];//消息列表
}

export interface AppChatMessage {
  type?: string;    //消息类型
  content?: string; //消息内容
  imageUrl?: string;//图片地址
  audioUrl?: string;//音频地址
}

export interface AppChatCompletionsBo {
  appId: string;             //应用ID
  conversationId?: string;   //会话ID
  role:string;               //角色
  messages: AppChatMessage[];//消息列表
}
