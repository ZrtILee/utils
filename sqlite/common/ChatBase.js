export class ChatBase {
	//https://www.jianshu.com/p/0cedd951e1e4
	//打开数据库
	static openDb() {
		return new Promise((resolve, reject) => {
			if (plus.sqlite.isOpenDatabase({ //判断数据库是否已打开
					name: 'appDb',
					path: '_doc/appDb.db'
				})) {
				console.log('打开数据库成功')
				resolve('打开数据库成功');
			} else {
				plus.sqlite.openDatabase({
					name: 'appDb',
					path: '_doc/appDb.db',
					success: function(e) {
						resolve(e);
					},
					fail: function(e) {
						console.log(e)
						// plus.nativeUI.alert('打开数据库失败: ' + JSON.stringify(e));
						reject(e);
					}
				});
			}
		})
	}
	// 关闭数据库
	static closeDB() {
		return new Promise((resolve, reject) => {
			if (plus.sqlite.isOpenDatabase({ //判断数据库是否已打开
					name: 'appDb',
					path: '_doc/appDb.db'
				})) {
				plus.sqlite.closeDatabase({
					name: 'appDb',
					success: function(e) {
						console.log('关闭数据库成功')
						//plus.nativeUI.alert('关闭数据库成功');
						resolve(e);
					},
					fail: function(e) {
						console.log(e)
						// plus.nativeUI.alert('关闭数据库失败: ' + JSON.stringify(e));
						reject(e);
					}
				});
			}
		})
	}

	// 创建表
	static addTab(tabName, tabColumns) {
		console.log(tabColumns)
		var columnsStr = ''
		for (var i = 0; i < tabColumns.length; i++) {
			if (tabColumns[i] === 'dbid') {
				continue;
			}
			if(tabColumns[i] === 'time'){
				columnsStr += '"' + tabColumns[i] + '" INTEGER,'
				continue
			}
			if (i != (tabColumns.length - 1)) {
				columnsStr += '"' + tabColumns[i] + '" text,'
			} else {
				columnsStr += '"' + tabColumns[i] + '" text'
			}
		}
		var sqlStr = `create table if not exists ${tabName}("dbid" integer PRIMARY KEY AUTOINCREMENT,"created_at" DATETIME DEFAULT (datetime('now', 'localtime')),${columnsStr})`
		console.log(sqlStr)
		// tabName不能用数字作为表格名的开头
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: 'appDb',
				sql: sqlStr,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					// plus.nativeUI.alert('创建' + tabName + '表失败: ' + JSON.stringify(e));
					reject(e);
				}
			})
		})
	}

	// 添加数据
	static addTabItem(tabName, data) {
		if (data) {
			let dataKeys = Object.keys(data)
			let keyStr = ''
			let valStr = ''
			for(var i = 0;i < dataKeys.length;i++){
				let item = dataKeys[i]
				if (item === 'dbid') {
					continue;
				}
				if (dataKeys.length - 1 == i) {
					keyStr += (item)
					valStr += ("'" + data[item] + "'")
				} else {
					keyStr += (item + ",")
					valStr += ("'" + data[item] + "',")
				}
			}
			let sqlStr = `insert into ${tabName}(${keyStr}) values(${valStr})`
			console.log(sqlStr)
			return new Promise((resolve, reject) => {
				plus.sqlite.executeSql({
					name: 'appDb',
					sql: sqlStr,
					success(e) {
						resolve(e);
					},
					fail(e) {
						console.log(e)
						// plus.nativeUI.alert('保存数据失败: ' + JSON.stringify(e));
						reject(e);
					}
				})
			})
		} else {
			return new Promise((resolve, reject) => {
				reject("数据不能为空")
			})
		}
	}
	
	//获取自增id
	static getLastInsertRowid(tabName){
		let sqlStr = `select last_insert_rowid() from ${tabName}`
		console.log(sqlStr)
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: 'appDb',
				sql: sqlStr,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					// plus.nativeUI.alert('获取自增id失败: ' + JSON.stringify(e));
					reject(e);
				}
			})
		})
	}

	// 修改数据
	static updateTabItem(tabName, data) {
		if (JSON.stringify(data) !== '{}') {
			let dataKeys = Object.keys(data)
			let setStr = ''
			for(var i = 0;i < dataKeys.length;i++){
				let item = dataKeys[i]
				if (item === 'messageID') {
					continue;
				}
				setStr += (`${item} = '${JSON.stringify(data[item])}${dataKeys.length - 1 !== i ? "," : ""}'`)
			}
			let sqlStr = `update ${tabName} set ${setStr} where messageID = '${data.messageID}'`
			console.log('sqlStr')
			return new Promise((resolve, reject) => {
				plus.sqlite.executeSql({
					name: 'appDb',
					sql: sqlStr,
					success(e) {
						resolve(e);
					},
					fail(e) {
						console.log(e)
						// plus.nativeUI.alert('更新数据失败: ' + JSON.stringify(e));
						reject(e);
					}
				})
			})
		} else {
			return new Promise((resolve, reject) => {
				reject("数据不能为空")
			});
		}
	}

	static deleteBySql(sql) {
		console.log(sql)
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: 'appDb',
				sql: sql,
				success(e) {
					console.log(e)
					resolve(e);
				},
				fail(e) {
					console.log(e)
					// plus.nativeUI.alert('删除数据失败: ' + JSON.stringify(e));
					reject(e);
				}
			})
		})
	}

	//删除表数据
	static deleteByDbid(tabName, dbid) {
		let sqlStr = `delete from ${tabName} where dbid = ${dbid}`
		console.log(sqlStr)
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: 'appDb',
				sql: sqlStr,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					// plus.nativeUI.alert('删除数据失败: ' + JSON.stringify(e));
					reject(e);
				}
			})
		})
	}

	static deleteAll(tabName) {
		let sqlStr = `delete from ${tabName}`
		console.log(sqlStr)
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: 'appDb',
				sql: sqlStr,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					// plus.nativeUI.alert('删除数据失败: ' + JSON.stringify(e));
					reject(e);
				}
			})
		})
	}

	//获取列表数据 
	static getList(sql) {
		let sqlStr = sql
		console.log(sqlStr)
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: 'appDb',
				sql: sqlStr,
				success(e) {
					console.log(e)
					let arr = e.map((item, index)=>{
						// console.warn(JSON.parse(item.data))
						return JSON.parse(item.data)
					})
					console.warn(arr)
					resolve(arr);
				},
				fail(e) {
					console.log(e)
					// plus.nativeUI.alert('获取数据失败: ' + JSON.stringify(e));
					reject(e);
				}
			})
		})
	}

	static executeSql(sql) {
		let sqlStr = sql
		console.log(sqlStr)
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: 'appDb',
				sql: sqlStr,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					// plus.nativeUI.alert('数据库操作失败: ' + JSON.stringify(e));
					reject(e);
				}
			})
		})
	}
}
