var sql = require('./sql/SqlStatement.js')//常用sql语句
var mysql = require('mysql');
var conf = require('../conf/DBconf.js');
var fs = require('fs');
var path = require('path');
var pool = mysql.createPool(conf.mysql);


let giftDao = {
	giftUpdate:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function (err,connection) {
			//新增
			if(req.body.add)
			{
				connection.query(sql.gift.select,[req.body.gift_name],function(error,result){//查看名称是否重复，数据库是否已有
					if(err || error)
					{
						resobj={
							"errcode" : "0",
							"msg" :"系统异常！请稍后再试!",
							"data"	: ""
						}
						res.json(resobj);
						connection.release();
						return;
					}
					if(result && result.length >0)
					{
						resobj={
							"errcode" : "0",
							"msg" :"礼物名称已存在！请重新填写！",
							"data"	: ""
						}
						res.json(resobj);
						connection.release();
						return;
					}
					else{//不存在重复的，直接新增
						let imgobj = giftDao.giftImgMap(req);//图片对象,包含path,databuffer
					    fs.writeFile(path.resolve(__dirname, imgobj.fileSavePath), imgobj.dataBuffer, function(err) {
					        if(err){
						        resobj={
									"errcode" : "0",
									"msg" :"图片保存失败!",
									"data"	: ""
								}
								res.json(resobj);
								connection.release();
								console.log(err);
					        }else{
								connection.query(sql.gift.insert,[imgobj.fileUsePath,req.body.gift_name,req.body.gift_price_gold,req.body.gift_price_silver],function(error,result){
									if(err || error)
									{
										resobj={
											"errcode" : "0",
											"msg" :"系统异常！请稍后再试!",
											"data"	: ""
										}
										res.json(resobj);
										connection.release();
										return;
									}else{//没有出错
										giftDao.getAllGifts(req,res,next);
									}
								});
					        }
					        return;
					    });
					    
					}
				});
			}
			else{//修改
				//判断图片有没有改变
				if(!req.body.gift_img.match("uploads")){//修改了
					let imgobj = giftDao.giftImgMap(req);//新文件的路径信息
					fs.writeFile(path.resolve(__dirname, imgobj.fileSavePath), imgobj.dataBuffer, function(err) {//保存新文件
						if(err){
					        resobj={
								"errcode" : "0",
								"msg" :"图片保存失败!",
								"data"	: ""
							}
							res.json(resobj);
							console.log(err);
							return;
				        }
					});
					pool.getConnection(function(err,connection){//删除原文件
						connection.query(sql.gift.selectPathById,[req.body.gift_id],function(error,result){
							if(err || error){
								res.json({
									"errcode" : "0",
									"msg" :"系统异常！请稍后再试!",
									"data"	: ""
								});
								connection.release();
								return;
							}else{
								let fileUsePath = result[0].gift_img;
								let fileSavePath = "../web/src"+fileUsePath;
								fs.unlink(fileSavePath,()=>{//删除文件
									//删除完了之后更新行数据
										connection.query(sql.gift.update,[imgobj.fileUsePath,req.body.gift_name,req.body.gift_price_gold,req.body.gift_price_silver,req.body.gift_id],function(error,result){
											connection.release();
											if(err || error)
											{
												resobj={
													"errcode" : "0",
													"msg" :"系统异常！请稍后再试!",
													"data"	: ""
												}
												res.json(resobj);
												return;
											}
											else{
												giftDao.getAllGifts(req,res,next);
											}
										})
								});
							}
						})
					});
				}
				else{//没有修改
					pool.getConnection(function(err,connection){
						connection.query(sql.gift.update,[req.body.gift_img,req.body.gift_name,req.body.gift_price_gold,req.body.gift_price_silver,req.body.gift_id],function(error,result){
							connection.release();
							if(err || error)
							{
								resobj={
									"errcode" : "0",
									"msg" :"系统异常！请稍后再试!",
									"data"	: ""
								}
								res.json(resobj);
								return;
							}
							else{
								giftDao.getAllGifts(req,res,next);
							}
						})
					})
				}
			}
		});
	},
	getAllGifts:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			connection.query(sql.gift.selectAll,function(error,result){
				connection.release();
				if(err || error){
					res.json({
						"errcode" : "0",
						"msg" :"系统异常！请稍后再试!",
						"data"	: ""
					});
					return;
				}
				result.map(function(item,index){
					item.key = item.gift_id;
				})
				res.json({
						"errcode" : "1",
						"msg" :"成功!",
						"data"	: result
				});
			})
		});
	},
	giftDelete:(req,res,next)=>{
		//删除实际文件
		pool.getConnection(function(err,connection){
			connection.query(sql.gift.selectPathById,[req.body.gift_id],function(error,result){
				connection.release();
				if(err || error){
					res.json({
						"errcode" : "0",
						"msg" :"系统异常！请稍后再试!",
						"data"	: ""
					});
					return;
				}else{
					let fileUsePath = result[0].gift_img;
					let fileSavePath = "../web/src"+fileUsePath;
					fs.unlink(fileSavePath,()=>{//删除文件
						pool.getConnection(function(err,connection){
							connection.query(sql.gift.delete,[req.body.gift_id],function(error,result){//删除数据库记录
								connection.release();
								if(err || error){
									res.json({
										"errcode" : "0",
										"msg" :"系统异常！请稍后再试!",
										"data"	: ""
									});
									return;
								}else{
									giftDao.getAllGifts(req,res,next);
								}
							})
						});
					});
				}
			})
		});

	},
	giftImgMap:(req)=>{//base64图片保存及地址映射
		//base64保存为图片
		var imgData = req.body.gift_img;
	    //过滤data:URL
	    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	    var dataBuffer = new Buffer(base64Data, 'base64');
	    let filename = Date.parse(new Date()).toString();//时间戳作为图片名称
	    let fileSavePath = "../../web/src/uploads/"+filename+".png";//图片保存的路径
	    let fileUsePath = "/uploads/"+filename+".png";//图片路径入库的值//实际使用的路径
	    let obj = {
	    	fileSavePath:fileSavePath,
	    	fileUsePath:fileUsePath,
	    	dataBuffer:dataBuffer
	    }
	    return obj;
	},
	giveGiftBySilver:(req,res,next)=>{//银币方式
		//检查余额
		pool.getConnection(function (err,connection) {
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.user.checkSilverBalance,[req.body.giver],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				let leftSilver = result[0].user_money_silver -req.body.gift.gift_price_silver*parseInt(req.body.count);
				if(leftSilver >=0)//余额充足
				{

					//减少余额
					pool.getConnection(function (err,connection) {
						if(err){
							console.log(err);
							return;
						}
						connection.query(sql.user.updateSilverBalance,[leftSilver,req.body.giver],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}

							//保存送礼记录
							pool.getConnection(function (err,connection) {
								if(err){
									console.log(err);
									return;
								}
								connection.query(sql.gifts_history.insert,[req.body.giver,req.body.gift.gift_id,req.body.count,new Date(),req.body.receiver,'silver'],function(error,result){
									connection.release();
									if(error){
										console.log(error);
										return;
									}
									console.log(result);
									res.json({
										"errcode" : "1",
										"msg" :"送礼成功!",
										"data"	: ""
									});
									return;
								});
							});
						});
					});

				}else{
					res.json({
						"errcode" : "0",
						"msg" :"银币不足!",
						"data": "银币不足!"
					});
				}
			});
		});

	},
	giveGiftByGold:(req,res,next)=>{//金币方式
		//检查余额
		pool.getConnection(function (err,connection) {
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.user.checkGoldBalance,[req.body.giver],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				let leftGold = result[0].user_money_gold -req.body.gift.gift_price_gold*parseInt(req.body.count);
				if(leftGold >=0)//余额充足
				{

					//减少余额
					pool.getConnection(function (err,connection) {
						if(err){
							console.log(err);
							return;
						}
						connection.query(sql.user.updateGoldBalance,[leftGold,req.body.giver],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}

							//增加收入
							pool.getConnection(function (err,connection) {
								if(err){
									console.log(err);
									return;
								}
								connection.query(sql.anchor.updateIncome,[req.body.gift.gift_price_gold*parseInt(req.body.count),req.body.receiver],function(error,result){
									connection.release();
									if(error){
										console.log(error);
										return;
									}

									//保存送礼记录
									pool.getConnection(function (err,connection) {
										if(err){
											console.log(err);
											return;
										}
										connection.query(sql.gifts_history.insert,[req.body.giver,req.body.gift.gift_id,req.body.count,new Date(),req.body.receiver,'gold'],function(error,result){
											connection.release();
											if(error){
												console.log(error);
												return;
											}
											res.json({
												"errcode" : "1",
												"msg" :"送礼成功!",
												"data"	: ""
											});
											return;
										});
									});
								});
							});
						});
					});

				}else{
					res.json({
						"errcode" : "0",
						"msg" :"金币不足!",
						"data": "金币不足!"
					});
				}
			});
		});

	},
	getCostAndCostHistory:(req,res,next)=>{
		pool.getConnection(function (err,connection) {
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.gifts_history.selectAllCost,[req.body.userName],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				let history = result;
				let totalCost = {//统计总消费
					gold:0,
					silver:0
				};
				for(let i in history)
				{
					if(history[i].gifts_h_payway == 'gold')
					{
						totalCost.gold +=history[i].gifts_h_num*history[i].gift_price_gold;
					}else if(history[i].gifts_h_payway == 'silver')
					{
						totalCost.silver +=history[i].gifts_h_num*history[i].gift_price_silver;
					}
				}
				res.json({
					"errcode" : "1",
					"msg" :"统计消费数据成功!",
					"data"	: {
						totalCost:totalCost,
						history:history
					}
				});
				return;
			});
		});
	},
	getIncomeAndIncometHistory:(req,res,next)=>{
		pool.getConnection(function (err,connection) {
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.gifts_history.selectAllCost,[req.body.userName],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				let history = result;
				let totalCost = {//统计总消费
					gold:0,
					silver:0
				};
				for(let i in history)
				{
					if(history[i].gifts_h_payway == 'gold')
					{
						totalCost.gold +=history[i].gifts_h_num*history[i].gift_price_gold;
					}else if(history[i].gifts_h_payway == 'silver')
					{
						totalCost.silver +=history[i].gifts_h_num*history[i].gift_price_silver;
					}
				}
				res.json({
					"errcode" : "1",
					"msg" :"统计消费数据成功!",
					"data"	: {
						totalCost:totalCost,
						history:history
					}
				});
				return;
			});
		});
	}
}

module.exports = giftDao;