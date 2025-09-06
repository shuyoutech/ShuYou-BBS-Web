export interface GameVo {
  id: string;                   //游戏ID
  gameName: string;             //游戏名
  gameType: string;             //游戏类型
  gameInitial: string;          //游戏名字首字母
  gameIcon: string;             //游戏图标
  goodsTypes: string[];         //商品类型
  crossAreas: string[];         //跨区
  areaServers: GameAreaServer[];//游戏区服
  gameRaces: string[];          //游戏种族阵营
  gameRoles: string[];          //游戏角色职业"
  platformIds: string[];        //点赞次数
  hotFlag: boolean;             //是否热门游戏
}

export interface GameAreaServer {
  gameArea: string;  //游戏区
  gameServer: string;//游戏服
  crossArea: string; //跨区
}
