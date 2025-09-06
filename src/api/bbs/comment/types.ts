/**
 * 帖子评论详情
 */
export interface PostCommentVo {
  id: string;             //帖子评论ID
  createTime: string;     //创建时间
  postId: string;         //帖子ID
  userId: string;         //评论用户ID
  userName: string;       //评论用户名称
  parentId: string;       //父评论ID
  rootId: string;         //根评论ID
  treePath: string;       //树结构编码
  content: string;        //评论内容
  replyCount: number;     //回复次数
  likeCount: number;      //点赞次数
  dislikeCount: number;   //点踩次数
  ipAddress: string;      //发帖IP地址:12.12.12.12
  ipLocation: string;     //发帖IP地理位置:江苏
}

