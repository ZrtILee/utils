/*
 * @Descripttion: sqlite 方法集合
 * @version: 
 * @Author: wtzhang
 * @Date: 2021-10-12 16:26:39
 * @LastEditors: wtzhang
 * @LastEditTime: 2021-10-19 16:51:41
 * study：https://www.runoob.com/sqlite/sqlite-tutorial.html
 */
export const openDb = (name) => {
	//如果数据库存在则打开，不存在则创建。
	return new Promise((resolve, reject) => {
		plus.sqlite.openDatabase({
			name: name, //数据库名称
			path: `_doc/${name}.db`, //数据库地址
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
			}
		})
	})
}
// 查询所有数据表名
export const getTable = (name) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: "select * FROM sqlite_master where type='table'",
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
// 查询表数据总条数
export const getCount = (name, tabName) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: "select count(*) as num from " + tabName,
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
			}
		})
	})
}

// 查询表是否存在
export const isTable = (name,tabName) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: `select count(*) as isTable FROM sqlite_master where type='table' and name='${tabName}'`,
			success(e) {
				resolve(e[0].isTable ? true : false);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
// 修改数据
export const updateSQL = (name, tabName, setData, setName, setVal) => {
	if (JSON.stringify(setData) !== '{}') {
		let dataKeys = Object.keys(setData)
		let setStr = ''
		dataKeys.forEach((item, index) => {
			console.log(setData[item])
			setStr += (
				`${item} = ${JSON.stringify(setData[item])}${dataKeys.length - 1 !== index ? "," : ""}`)
		})
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: name,
				sql: `update ${tabName} set ${setStr} where ${setName} = "${setVal}"`,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					reject(e);
				}
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}

//删除数据库数据
export const deleteInformationType = (name,tabName,setData) => {
	if (JSON.stringify(setData) !== '{}') {
		let dataKeys = Object.keys(setData)
		let setStr = ''
		dataKeys.forEach((item, index) => {
			console.log(setData[item])
			setStr += (
				`${item}=${JSON.stringify(setData[item])}${dataKeys.length - 1 !== index ? " and " : ""}`)
		})
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: name,
				sql: `delete from ${tabName} where ${setStr}`,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}

//关闭数据库
export const closeSQL = (name) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name: 'pop',
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
			}
		})
	})
}

//监听数据库是否开启
export const isOpen = (name) => {
	let open = plus.sqlite.isOpenDatabase({
		name: 'appDb',
		path: '_doc/appDb.db', 
	})
	return open;
}
// 创建表
export const addTab = (name,tabName) => {
	// tabName不能用数字作为表格名的开头
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name: name,
			// sql: 'create table if not exists dataList("list" INTEGER PRIMARY KEY AUTOINCREMENT,"id" TEXT,"name" TEXT,"gender" TEXT,"avatar" TEXT)',
			sql: `create table if not exists ${tabName}("chat_i" INTEGER PRIMARY KEY AUTOINCREMENT,"local_id" TEXT NOT NULL UNIQUE,"id" TEXT,"chat_friend_id" TEXT,"content" INTEGER)`,
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
// 添加数据
export const addTabItem = (name,tabName,obj) => {
	if (obj) {
		let keys = Object.keys(obj)
		let keyStr = keys.toString()
		let valStr = ''
		keys.forEach((item, index) => {
			if (keys.length - 1 == index) {
				valStr += ('"' + obj[item] + '"')
			} else {
				valStr += ('"' + obj[item] + '",')
			}
		})
		console.log(valStr)
		let sqlStr = `insert into ${tabName}(${keyStr}) values(${valStr})`
		console.log(sqlStr)
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: name,
				sql: sqlStr,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					reject(e);
				}
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		})
	}
}
// 合并数据
export const mergeSql = (name,tabName,tabs) => {
	if (!tabs || tabs.length == 0) {
		return new Promise((resolve, reject) => {
			reject("错误")
		})
	}
	let itemValStr = ''
	tabs.forEach((item, index) => {
		let itemKey = Object.keys(item)
		let itemVal = ''
		itemKey.forEach((key, i) => {
			if (itemKey.length - 1 == i) {
				if (typeof item[key] == 'object') {
					itemVal += (`'${JSON.stringify(item[key])}'`)
				} else {
					itemVal += (`'${item[key]}'`)
				}
			} else {
				if (typeof item[key] == 'object') {
					itemVal += (`'${JSON.stringify(item[key])}',`)
				} else {
					itemVal += (`'${item[key]}',`)
				}
			}
		})
		if (tabs.length - 1 == index) {
			itemValStr += ('(' + itemVal + ')')
		} else {
			itemValStr += ('(' + itemVal + '),')
		}
	})
	let keys = Object.keys(tabs[0])
	let keyStr = keys.toString()
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name: name,
			sql: `insert or ignore into ${tabName} (${keyStr}) values ${itemValStr}`,
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
// 获取分页数据库数据
export const getDataList = async (name, tabName, num, size,byName,byType) => {
	let count = 0
	let sql = ''
	let numindex = 0
	await getCount(name, tabName).then((resNum) => {
		count = Math.ceil(resNum[0].num / size)
	})
	if(((num - 1) * size) == 0) {
	    numindex = 0
	} else {
		numindex = ((num - 1) * size) + 1
	}
	sql = `select * from ${tabName}`
	if(byName && byType) {
		// desc asc
		sql += ` order by ${byName} ${byType}`
	}
	sql += ` limit ${numindex},${size}`
	if (count < num - 1) {
		return new Promise((resolve, reject) => {
			reject("无数据")
		});
	} else {
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: name,
				// sql: "select * from userInfo limit 3 offset 3",
				sql:sql ,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	}
}
//查询数据库数据
export const selectDataList = (name,tabName,setData,byName,byType) => {
	let setStr = ''
	let sql = ''
	if (JSON.stringify(setData) !== '{}') {
		let dataKeys = Object.keys(setData)
		dataKeys.forEach((item, index) => {
			console.log(setData[item])
			setStr += (
				`${item}=${JSON.stringify(setData[item])}${dataKeys.length - 1 !== index ? " and " : ""}`)
		})
		sql = `select * from ${tabName} where ${setStr}`
	} else {
		sql = `select * from ${tabName}`
	}
	if(byName && byType) {
		// desc asc
		sql += ` order by ${byName} ${byType}`
	}
	console.log(sql)
	if (tabName !== undefined) {
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: name,
				sql: sql,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					reject(e);
				}
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}
