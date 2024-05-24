import {
	Chat
} from '../../common/Chat.js'
import { ChatMessage } from '../bean/ChatMessage.js'
console.log('ChatMessage')
export class ChatMessageDao {
	static createTab() {
		let chatMessage = new ChatMessage()
		console.log(chatMessage)
		let columns = Object.keys(chatMessage)
		console.log(columns)
		return Chat.addTab('ChatMessage', columns)
	}

	insert(chatMessage) {
		console.log(chatMessage)
	    Chat.addTabItem('ChatMessage', chatMessage)
	}
	
	insertAndGetDbid(chatMessage) {
		console.log(chatMessage)
	    return Chat.addTabItemAndReturnDbid('ChatMessage', chatMessage)
	}
	
	update(chatMessage){
		Chat.updateTabItem('ChatMessage', chatMessage)
	}
	
	delete(chatMessage){
		Chat.deleteByDbid('ChatMessage', chatMessage.dbid)
	}
	
	deleteBySql(sql){
	    return	Chat.deleteBySql(sql)
	}

	deleteAll() {
		return Chat.deleteAll('ChatMessage')
	}

	//根据会话ID分页查询
	getMsgByConversationID(conversationID, pageSize, pageNum){
		let sql = `SELECT * FROM ChatMessage WHERE conversationID = '${conversationID}' ORDER BY time DESC LIMIT ${pageSize + 5} OFFSET ${(pageNum - 1) * (pageSize + 5)}`
		return Chat.getList(sql)
	}
	
	//根据ID查询
	getMsgByID(ID){
		let sql = `SELECT * FROM ChatMessage WHERE messageID = '${ID}'`
		return Chat.getList(sql)
	}
	
    getAll(){
		var sql = `select * from ${'ChatMessage'}`
		return Chat.getList(sql)
	}
}