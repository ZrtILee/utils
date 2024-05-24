import {
	ChatBase
} from './ChatBase.js'
export class Chat {
	//关闭数据库
	static closeDB(){
		ChatBase.closeDB()
	}
	// 创建表
	static async addTab(tabName, tabColumns) {
		console.log(tabColumns)
		await ChatBase.openDb()
		return ChatBase.addTab(tabName, tabColumns)
	}
	
	// 添加数据
	static async addTabItem(tabName, data) {
		await ChatBase.openDb()
		return ChatBase.addTabItem(tabName, data)
	}
	
	// 添加数据并返回自增的dbid
	static async addTabItemAndReturnDbid(tabName, data) {
		await ChatBase.openDb()
		await ChatBase.addTabItem(tabName,data)
		return ChatBase.getLastInsertRowid(tabName)
	}

	// 修改数据
	static async updateTabItem(tabName, data) {
		await ChatBase.openDb()
		return ChatBase.updateTabItem(tabName, data)
	}

	static async deleteBySql(sql) {
		await ChatBase.openDb()
		return ChatBase.deleteBySql(sql)
	}

	//根据dbid删除表数据
	static async deleteByDbid(tabName, dbid) {
		await ChatBase.openDb()
		return ChatBase.deleteByDbid(tabName, dbid)
	}
	
	//根据sql删除数据
	static async deleteBySql(sql) {
		await ChatBase.openDb()
		return ChatBase.deleteBySql(sql)
	}
	
	static async deleteAll(tabName) {
		await ChatBase.openDb()
		return ChatBase.deleteAll(tabName)
	}

	//获取列表数据 
	static async getList(sql) {
		await ChatBase.openDb()
		return ChatBase.getList(sql)
	}

	static async executeSql(sql) {
		await ChatBase.openDb()
		return ChatBase.executeSql(sql)
	}
}
