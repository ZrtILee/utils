/**
 * 聊天列表
 */
export class ChatList {
	constructor(obj) {
		if(obj){
			this.messageID = obj.userID;//消息ID
			this.userID = obj.userID; //用户ID
			this.time = obj.time; //时间戳
			this.data = obj.data; //数据json对象
		}else{
			this.messageID = '';//消息ID
			this.userID = '';
			this.time = '';
			this.data = '';
		}
	}
}