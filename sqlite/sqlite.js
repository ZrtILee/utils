/*
 * @Descripttion: sqlite 方法集合
 * @version: 
 * @Author: wtzhang
 * @Date: 2021-10-12 16:26:39
 * @LastEditors: wtzhang
 * @LastEditTime: 2021-10-19 16:51:41
 * study：https://www.runoob.com/sqlite/sqlite-tutorial.html
 */


// 监听数据是否打开
function isOpenDB(name) {
  let dbName = name;
  let dbPath = `_doc/${name}_record.db`;
  //数据库打开了就返回true,否则返回false
  let isopen = plus.sqlite.isOpenDatabase({
    name: dbName,
    path: dbPath
  })
  return isopen
}

// 创建数据库/打开数据库
function openDB(name) {
  return new Promise((resolve, reject) => {
    plus.sqlite.openDatabase({
      name: name || 'testData',
      path: `_doc/${name}_record.db`,
      success: function (e) {
        resolve('openDatabase success!')
      },
      fail: function (e) {
        reject('openDatabase failed: ' + JSON.stringify(e))
      }
    });
  })
}

// 查询所有数据库表名
function queryDBTable(name) {
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

// 查询表是否存在
function queryIsTable(name, tabName) {
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
}

// 创建表
function createTable(name, tabName, tableStructure) {
  // 注意：tabName不能用数字作为表格名的开头
  return new Promise((resolve, reject) => {
    plus.sqlite.executeSql({
      name: name,
      // sql: 'create table if not exists dataList("list" INTEGER PRIMARY KEY AUTOINCREMENT,"id" TEXT,"name" TEXT,"gender" TEXT,"avatar" TEXT)',
      sql: `create table if not exists ${tabName}(${tableStructure})`,
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

// 查询表是否存在
function isTable(name, tabName) {
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

// 添加数据
function addSaveData(name, tabName, obj) {
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
    // console.log(valStr)
    let sqlStr = `insert into ${tabName}(${keyStr}) values(${valStr})`
    // console.log(sqlStr)
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

// 查询数据库数据
function selectDataList(name, tabName, setData, byName, byType) {
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
  if (byName && byType) {
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

// 获取数据库分页数据
/**
 * 
 * @param {*} name 
 * @param {*} tabName 
 * @param {*} num 页码
 * @param {*} size 页面大小返回条数
 * @param {*} byName 排序主键字段
 * @param {*} byType 排序类型 desc倒序 / asc正序
 */
async function queryDataList(name, tabName, num, size, byName, byType) {
  let count = 0
	let sql = ''
	let numindex = 0
	await queryCount(name, tabName).then((resNum) => {
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

// 查询表数据总条数
function queryCount(name, tabName) {
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

// 修改（更新）数据
// 示例：UPDATE COMPANY SET ADDRESS = 'Texas' WHERE ID = 6;
// UPDATE 表名 SET 要修改字段 = '修改内容' WHERE 筛选条件 = 6;
/**
 * 
 * @param {*} name 数据库名
 * @param {*} tabName 表名
 * @param {*} setData 设置值 （修改字段 + 修改内容）
 * @param {*} setName 筛选条件
 * @param {*} setVal 筛选值
 * @returns 
 */
function updateSqlData(name, tabName, setData, setName, setVal) {
  if (JSON.stringify(setData) !== '{}') {
    let dataKeys = Object.keys(setData)
		let setStr = ''
		dataKeys.forEach((item, index) => {
      // console.log(item, setData[item])
			setStr += (
				`${item} = ${JSON.stringify(setData[item])}${dataKeys.length - 1 !== index ? "," : ""}`)
    })
    console.log(setStr)
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

// 关闭数据库
function closeDB(name) {
  return new Promise((resolve, reject) => {
    plus.sqlite.closeDatabase({
      name: name,
      success: function (e) {
        resolve('closeDatabase success!');
      },
      fail: function (e) {
        reject('closeDatabase failed: ' + JSON.stringify(e));
      }
    });
  })
}

export default {
  openDB,
  closeDB,
  isOpenDB,
  queryDBTable,
  queryIsTable,
  createTable,
  isTable,
  addSaveData,
  selectDataList,
  queryCount,
  updateSqlData,
  queryDataList
}