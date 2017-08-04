var sql = require('./sql/SqlStatement.js')//常用sql语句
var mysql = require('mysql');
var conf = require('../conf/DBconf.js');
var pool = mysql.createPool(conf.mysql);
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var async = require('async');

let roomDao = {
	getAllAnchorRooms:(req,res,next)=>{
		pool.getConnection(function (err,connection) {
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.anchor.selectAll,function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				for(let i in result){
					result[i].channel = [];
					result[i].anch_live_people = parseInt(result[i].anch_live_people/2);
					result[i].channel.push(result[i].chl1_name);
					result[i].channel.push(result[i].chl2_name);
					result[i].key = result[i].anch_name;
				}
				res.json({
					"errcode":"1",
					"msg":"获取直播间数据成功!",
					"data":result
				})
			})
		});
	},
	updateAnchor:(req,res,next)=>{
		pool.getConnection(function (err,connection) {
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.anchor.anchorManageUpdate,[req.body.anch_live_room_name,req.body.anch_live_url,req.body.channel[1],req.body.anch_name],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}

				roomDao.getAllAnchorRooms(req,res,next);
			})
		});
	},
	banAnchor:(req,res,next)=>{
		let desStatus = req.body.ban ? 2 : 0 ;//封禁2 未直播0
		let banSqlStat;//封禁或是解封的sql语句
		let banParams;//封禁或是解封给sql语句传递的参数数据
		if(req.body.ban){//是封禁操作
			banSqlStat = sql.anchor.updateBan;
			banParams = [desStatus,req.body.banReason,req.body.userName];
		}else{//解封操作
			banSqlStat = sql.anchor.updateUnBan;
			banParams = [desStatus,req.body.userName];
		}

		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(banSqlStat,banParams,function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				roomDao.getAllAnchorRooms(req,res,next);
			});
		});
	},
	roomSearch:(req,res,next)=>{
		if(req.body.keywords == ""){//没有填写搜索内容 默认搜索全部
			roomDao.getAllAnchorRooms(req,res,next);
			return;
		}
		//req.body.keywords = '%'+JSON.stringify(req.body.keywords).replace(/\"/g,"'")+'%';
		req.body.keywords = '%'+req.body.keywords+'%';
		let sqlStat;
		if(req.body.searchType == "anch_live_room_name")
		{
			sqlStat = sql.anchor.selectByRoomName
		}
		else if(req.body.searchType == "anch_live_url")
		{
			sqlStat = sql.anchor.selectByUrl
		}
		else if(req.body.searchType == "anch_name")
		{
			sqlStat = sql.anchor.selectByAnchorName
		}
		else if(req.body.searchType == "anch_live_room_channel")
		{
			sqlStat = sql.anchor.selectBychannel
		}
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sqlStat,[req.body.keywords],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				for(let i in result){
					result[i].channel = [];
					result[i].channel.push(result[i].chl1_name);
					result[i].channel.push(result[i].chl2_name);
					result[i].key = result[i].anch_name;
				}
				res.json({
					"errcode":"1",
					"msg":"搜索直播间数据成功!",
					"data":result
				})
			});
		});
	},
	updateRoomManager:(req,res,next)=>{
		//console.log(req.body);
		let action = req.body.action;
		if(action == 'add')
			roomDao.addRoomManager(req,res,next);
		else
			roomDao.delRoomManager(req,res,next);
	},
	addRoomManager:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			//查看添加的房管是否存在该用户账户
			connection.query(sql.user.selectUserIsExist,[req.body.data.userName.replace(',','')],function(error,result){
				if(error){
					connection.release();
					console.log(error);
					return;
				}
				if(result.length == 0){
					connection.release();
					res.json({
						"errcode":"0",
						"msg":"该用户不存在!",
						"data":"该用户不存在!"
					});
					return;
				}else{
					//查看房管列表中是否已经存在该用户
					connection.query(sql.anchor.selectManagers,[req.body.data.roomInfo],function(error,result){
						if(error){
							connection.release();
							console.log(error);
							return;
						}
						let str;
						// console.log(result[0].anch_room_manager);
						if(!result[0].anch_room_manager) //当前房管列表为空
							str = '';//null转化为字符串
						else
							str = result[0].anch_room_manager;
						if(str.indexOf(req.body.data.userName)>=0){
							connection.release();
							res.json({
								"errcode":"0",
								"msg":"当前房管中已存在该用户!添加失败!",
								"data":"当前房管中已存在该用户!添加失败!"
							});
							return;	
						}else{
							let newManagers = str + req.body.data.userName//拼接字符串
							connection.query(sql.anchor.updateRoomManage,[newManagers,req.body.data.roomInfo],function(error,result){
								connection.release();
								if(error){
									console.log(error);
									return;
								}
								// res.json({
								// 	"errcode":"1",
								// 	"msg":"添加成功!",
								// 	"data":"添加成功!"
								// });
								// return;	
								roomDao.getRoomManagers(req,res,next);
							});
						}
					});
				}
			});
		});
	},
	delRoomManager:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			//查看添加的房管是否存在该用户账户
			connection.query(sql.user.selectUserIsExist,[req.body.data.userName.replace(',','')],function(error,result){
				if(error){
					connection.release();
					console.log(error);
					return;
				}
				if(result.length == 0){
					connection.release();
					res.json({
						"errcode":"0",
						"msg":"该用户不存在!",
						"data":"该用户不存在!"
					});
					return;
				}else{
					//查看房管列表中是否已经存在该用户
					connection.query(sql.anchor.selectManagers,[req.body.data.roomInfo],function(error,result){
						if(error){
							connection.release();
							console.log(error);
							return;
						}
						let str;
						// console.log(result[0].anch_room_manager);
						if(!result[0].anch_room_manager) //当前房管列表为空
							str = '';//null转化为字符串
						else
							str = result[0].anch_room_manager;
						if(str.indexOf(req.body.data.userName) <0){
							connection.release();
							res.json({
								"errcode":"0",
								"msg":"当前房管中不存在该用户!删除失败!",
								"data":"当前房管中不存在该用户!删除失败!"
							});
							return;	
						}
						else//删除时在房管列表中找到了该用户
						{
							let newManagers = str.replace(req.body.data.userName,'')//去除子串字符串
								connection.query(sql.anchor.updateRoomManage,[newManagers,req.body.data.roomInfo],function(error,result){
									connection.release();
									if(error){
										console.log(error);
										return;
									}
									roomDao.getRoomManagers(req,res,next);
								});
						}				
					});
				}
			});
		});
	},
	getRoomManagers:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.anchor.selectManagers,[req.body.data.roomInfo],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				//去除最后一个逗号
				let arr = result[0].anch_room_manager.split(',');
				if(arr.length > 1)
					arr.pop();
				res.json({
					"errcode":"1",
					"msg":"获取房管数据成功!",
					"data":arr
				})
			});
		});
	},
	getRecomm:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.recommendation.selectRecomms,function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				let allPosArr = [];//[1,2,3,...,17]
				for(let i=1;i<=17;i++)
				{
					allPosArr[i-1] = i;
				}
				
				let currentPosArr = [];//[1,3,...]
				for(let i in result){
					currentPosArr[i] = result[i].reco_pos;
				}
				
				for(let i=allPosArr.length;i>=0;i--){
					a = allPosArr[i];
					for(let j=currentPosArr.length;j>=0;j--){
						b = currentPosArr[j];
						if(a ==b){
							allPosArr.splice(i,1);
							currentPosArr.splice(j,1);
							break;
						}
					}
				}
				//console.log(allPosArr);//获取未设置推荐的位置
				for(let i in allPosArr){
					result.push({
						reco_pos:allPosArr[i]
					});
				}
				result = _.uniqBy(result, 'reco_pos');//根据对象的chl1_id值进行数组对象去重
				//console.log(result);
				res.json({
					"errcode":"1",
					"msg":"获取推荐位数据成功!",
					"data":result
				})
			});
		});
	},
	saveRecomm:(req,res,next)=>{
		pool.getConnection(function(err,connection){//查找主播是否存在
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.anchor.selectIsExist,[req.body.userName],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				if(result.length == 0){
					res.json({
						"errcode":"0",
						"msg":"主播"+req.body.userName+"不存在!",
						"data":"主播"+req.body.userName+"不存在!"
					});
					return;
				}else{
					pool.getConnection(function(err,connection){//判断当前推荐位位置是否有数据 //有 更新 //没有 新增
						if(err){
							console.log(err);
							return;
						}
						connection.query(sql.recommendation.selectIsExist,[req.body.pos],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}
							if(result.length > 0)
							{
								if(!req.body.img.match("uploads")){//图片改变了
									let imgobj = roomDao.imgMap(req);//文件的路径信息
									fs.writeFile(path.resolve(__dirname, imgobj.fileSavePath), imgobj.dataBuffer, function(err) {//覆盖文件
										if(err){
									        resobj={
												"errcode" : "0",
												"msg" :"图片保存失败!",
												"data"	: ""
											}
											res.json(resobj);
											return;
								        }
									});
									pool.getConnection(function(err,connection){ //有 更新
										if(err){
											console.log(err);
											return;
										}
										connection.query(sql.recommendation.update,[imgobj.fileUsePath,req.body.userName,req.body.pos],function(error,result){
											connection.release();
											if(error){
												console.log(error);
												return;
											}
											roomDao.getRecomm(req,res,next);
												
										});
									});
								}else{//图片没有改变
									pool.getConnection(function(err,connection){ //更新
										if(err){
											console.log(err);
											return;
										}
										connection.query(sql.recommendation.update,[req.body.img,req.body.userName,req.body.pos],function(error,result){
											connection.release();
											if(error){
												console.log(error);
												return;
											}
											roomDao.getRecomm(req,res,next);
												
										});
									});
								}
								
							}
							else{//没有 新增
								let imgobj = roomDao.imgMap(req);//新文件的路径信息
								fs.writeFile(path.resolve(__dirname, imgobj.fileSavePath), imgobj.dataBuffer, function(err) {//保存文件
									if(err){
								        resobj={
											"errcode" : "0",
											"msg" :"图片保存失败!",
											"data"	: ""
										}
										res.json(resobj);
										return;
							        }
								});
								pool.getConnection(function(err,connection){//没有 新增
									if(err){
										console.log(err);
										return;
									}
									connection.query(sql.recommendation.insert,[req.body.pos,imgobj.fileUsePath,req.body.userName],function(error,result){
										connection.release();
										if(error){
											console.log(error);
											return;
										}
										roomDao.getRecomm(req,res,next);
									});
								});
							}
						});
					});
				}
			});
		});
	},
	imgMap:(req)=>{//base64图片保存及地址映射
		//base64保存为图片
		var imgData = req.body.img;
	    //过滤data:URL
	    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	    var dataBuffer = new Buffer(base64Data, 'base64');
	    let filename = "recomm_"+req.body.pos;//位置作为图片名称
	    let fileSavePath = "../../web/src/uploads/"+filename+".png";//图片保存的路径
	    let fileUsePath = "/uploads/"+filename+".png";//图片路径入库的值//实际使用的路径
	    let obj = {
	    	fileSavePath:fileSavePath,
	    	fileUsePath:fileUsePath,
	    	dataBuffer:dataBuffer
	    }
	    return obj;
	},
	getTodayHot:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.anchor.todayhot,function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				res.json({
					"errcode" : "1",
					"msg" :"获取今日热门数据成功",
					"data"	: result
				})
			})
		})
	},
	getMyManageableRoom:(req,res,next)=>{
		let rooms = [];
		async.waterfall([
		    function(callback) {
		    	//查询用户本身是否为主播
				pool.getConnection(function(err,connection){
					connection.query(sql.anchor.selectIsExist,[req.body.userName],function(error,result){
						connection.release();
						if(error)
							console.log(error);
						if(result.length > 0)
						{
							let obj = {
								roomName:result[0].anch_live_room_name,
								roomUrl:result[0].anch_live_url,
							}
							rooms.push(obj);
						}
						callback(null, rooms, req.body.userName);
					})
				});
		    },
		    function(rooms, userName, callback) {
		    	//查询用户是哪些房间的房管
		        pool.getConnection(function(err,connection){
					connection.query(sql.anchor.matchRoomManager,[userName],function(error,result){
						connection.release();
						if(error)
							console.log(error);
						if(result.length > 0){
							for(let i in result){
								let obj = {
									roomName:result[i].anch_live_room_name,
									roomUrl:result[i].anch_live_url,
								}
								rooms.push(obj);
							}
						}
							
						callback(null, rooms, userName);
					})
				})
		    },function(rooms, userName, callback) {
		    	//遍历查询直播间禁言列表
		    	async.each(rooms,function(item,callback){
		    		let banlist = [];
					//查询直播间禁言用户列表
					pool.getConnection(function(err,connection){
						connection.query(sql.ban_talk.selectByRoom,[item.roomUrl],function(error,result){
							connection.release();
							if(error)
								console.log(error);
							if(result.length > 0)
								for(let i in result){
									banlist.push(result[i]);
								}
							item.banlist = banlist;
							callback(null, item);
						})
					})
		    	},function(err){
		    		if(err)
		    			console.log(err);
		    		callback(null, rooms);
		    	})
		    },
		], function (err, rooms) {
		   res.json({
				"errcode" : "1",
				"msg" :"获取用户可管理直播间数据成功",
				"data"	: rooms
			})
		})			
	},
	searchUserByKeywords:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err)
				console.log(err);
			connection.query(sql.user.selectNicknameByKeywords,[req.body.keywords],function(error,result){
				connection.release();
				if(error)
					console.log(error);
				res.json({
					errcode:'1',
					msg:"搜索成功!",
					data:result
				})
			})
		})
	}
}

module.exports = roomDao;