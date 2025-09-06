/**
 * 知识库查询参数
 */
export interface KnowledgeQuery {
  knowledgeName?: string; //知识库名称
}

/**
 * 知识库详情
 */
export interface KnowledgeVo {
  id: string;              //知识库ID
  createTime: string;      //创建时间
  knowledgeName: string;   //知识库名称
  vectorStoreId: string;   //向量数据库ID
  embeddingModelId: number;//向量模型ID
  knowledgeDesc: string;   //知识库描述
}

/**
 * 知识库新增对象
 */
export interface KnowledgeSaveBo {
  knowledgeName: string;   //知识库名称
  vectorStoreId: string;   //向量数据库ID
  embeddingModelId: number;//向量模型ID
  knowledgeDesc: string;   //知识库描述
}

/**
 * 知识库修改对象
 */
export interface KnowledgeUpdateBo extends KnowledgeSaveBo {
  id: string; //知识库ID
}

/**
 * 知识库文档查询参数
 */
export interface KnowledgeDocQuery {
  knowledgeId?: string;//知识库ID
  docName?: string;    //文档名称
}

/**
 * 知识库文档详情
 */
export interface KnowledgeDocVo {
  id: string;         //知识库文档ID
  createTime: string; //创建时间
  knowledgeId: string;//知识库ID
  docType: string;    //文档类型
  docName: string;    //文档名称
  docFileId: string;  //文件ID
  docContent: string; //文档内容
  sliceStatus: string;//切片状态
  sliceNum: number;   //切片数量
}

/**
 * 知识库文档新增对象
 */
export interface KnowledgeDocSaveBo {
  createTime: string; //创建时间
  knowledgeId: string;//知识库ID
  docType: string;    //文档类型
  docName: string;    //文档名称
  docFileId: string;  //文件ID
  docContent: string; //文档内容
  sliceStatus: string;//切片状态
  sliceNum: number;   //切片数量
}

/**
 * 知识库文档修改对象
 */
export interface KnowledgeDocUpdateBo extends KnowledgeDocSaveBo {
  id: string; //知识库文档ID
}

/**
 * 知识库文档切片查询参数
 */
export interface KnowledgeDocSliceQuery {
  knowledgeId?: string; //知识库ID
  docId?: string; //文档ID
}

/**
 * 知识库文档切片详情
 */
export interface KnowledgeDocSliceVo {
  id: string;         //知识库文档切片ID
  createTime: string; //创建时间
  knowledgeId: string;//知识库ID
  docId: string;      //文档ID
  docName: string;    //文档名称
  vectorId: string;   //向量库的ID
  content: string;    //切片内容
}

/**
 * 知识库文档切片新增对象
 */
export interface KnowledgeDocSliceSaveBo {
  knowledgeId: string;//知识库ID
  docId: string;      //文档ID
  docName: string;    //文档名称
  vectorId: string;   //向量库的ID
  content: string;    //切片内容
}

/**
 * 知识库文档切片修改对象
 */
export interface KnowledgeDocSliceUpdateBo extends KnowledgeDocSliceSaveBo {
  id: string; //知识库文档切片ID
}
