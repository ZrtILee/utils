/**
 * 聊天记录
 */
export class ChatMessage {
	constructor(obj) {
		if(obj){
			this.messageID = obj.messageID;//消息ID
			this.conversationID = obj.conversationID; //会话ID
			this.time = obj.time; //会话ID
			this.data = obj.data; //消息json对象
		}else{
			this.messageID = '';
			this.conversationID = '';
			this.time = '';
			this.data = '';
		}
	}
}
