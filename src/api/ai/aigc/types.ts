export interface ChatModelBo {
  conversationId: string;    //会话ID
  provider: string;          //供应商
  model: string;             //模型名称
  modelFunction: string;     //模型功能:chat-对话
  modelParam: ChatModelParam;//模型参数对象
}

export interface ChatModelParam {
  message: string;         //用户消息
  prompt: string;          //提示词
  enableMemory?: boolean;  //是否开启多轮对话
  enableThinking?: boolean;//是否开启深度思考
  enableSearch?: boolean;  //是否开启联网搜索
}

export interface ChatConversationVo {
  id: string;        //对话框ID
  createTime: string;//创建时间
  userId: string;    //用户ID
  title: string;     //标题
}

export interface ChatMessageVo {
  id: string;                      //对话消息ID
  userId: string;                  //用户ID
  userName: string;                //用户名称
  conversationId: string;          //会话ID
  provider: string;                //供应商
  modelName: string;               //模型名称
  modelFunction: string;           //模型功能接口
  enableMemory: boolean;           //是否开启多轮对话
  enableThinking: boolean;         //是否开启深度思考
  enableSearch: boolean;           //是否开启联网搜索
  userMessage: string;             //用户发送消息
  assistantMessage: string;        //AI返回消息
  requestTime: string;             //请求时间
  responseTime: string;            //响应时间
  ip: string;                      //请求IP
  ipRegion: string;                //请求地区
  durationSeconds: number;         //对话运行时间
  inputTokenCount: number;         //输入Token数量
  inputCacheHitTokenCount: number; //命中上下文缓存的token数
  inputCacheMissTokenCount: number;//未命中上下文缓存的token数
  inputPrice: number;              //输入累计价格
  outputTokenCount: number;        //输出Token数量
  outputPrice: number;             //输出累计价格
  totalTokenCount: number;         //总共Token数量
  totalPrice: number;              //总共价格
}


export interface ImageModelBo {
  provider: string; //供应商
  model: string; //模型名称
  modelFunction: string; //模型功能:textToImage-文生图
  modelParam: ImageModelParam; //模型参数对象
}

export interface ImageModelParam {
  prompt: string; //正向提示词，用来描述生成图像中期望包含的元素和视觉特点。
  negativePrompt?: string; //反向提示词，用来描述不希望在画面中看到的内容，可以对画面进行限制。
  num: number; //生成图片的数量
  size?: string; //输出图像的分辨率
}
