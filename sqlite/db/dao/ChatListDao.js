import {
	Chat
} from '../../common/Chat.js'
import { ChatList } from '../bean/ChatList.js'
console.log('ChatList')
export class ChatListDao {
	static createTab() {
		let chatList = new ChatList()
		console.log(chatList)
		let columns = Object.keys(chatList)
		console.log(columns)
		return Chat.addTab('ChatList', columns)
	}

	insert(chatList) {
		console.log(chatList)
	    Chat.addTabItem('ChatList', chatList)
	}
	
	insertAndGetDbid(chatList) {
		console.log(chatList)
	    return Chat.addTabItemAndReturnDbid('ChatList', chatList)
	}
	
	update(chatList){
		Chat.updateTabItem('ChatList', chatList)
	}
	
	delete(chatList){
		Chat.deleteByDbid('ChatList', chatList.dbid)
	}
	
	deleteBySql(sql){
	    return	Chat.deleteBySql(sql)
	}

	deleteAll() {
		return Chat.deleteAll('ChatList')
	}

	//根据用户ID分页查询
	getMsgByUserID(userID, pageSize, pageNum){
		let sql = `SELECT * FROM ChatList WHERE userID = '${userID}' ORDER BY time DESC LIMIT ${pageSize + 5} OFFSET ${(pageNum - 1) * (pageSize + 5)}`
		return Chat.getList(sql)
	}
	
	//根据ID查询
	getMsgByID(ID){
		let sql = `SELECT * FROM ChatList WHERE messageID = '${ID}'`
		return Chat.getList(sql)
	}
	
    getAll(){
		var sql = `select * from ${'ChatList'}`
		return Chat.getList(sql)
	}
}