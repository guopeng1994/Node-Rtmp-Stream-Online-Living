var sql = require('./sql/SqlStatement.js')//常用sql语句
var mysql = require('mysql');
var conf = require('../conf/DBconf.js');
var _ = require('lodash');
var pool = mysql.createPool(conf.mysql);


let channelDao = {
	getAllChannelOne:(req,res,next)=>{//获得所有一级频道信息
		let resobj = {};
		pool.getConnection(function(err,connection){
			connection.release();
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}
			connection.query(sql.channel_lv1.selectAll,function(error,result){
				if(error){
					res.json({
						"errcode" : "0",
						"msg" :"系统异常！请稍后再试!",
						"data"	: ""
					});
					console.log(error);
					return;
				}
				let tmp_result = result.slice(0);
				for(let i in result){//生成相同父亲的孩子数组
					result[i].childrens=[];
					result[i].key = result[i].chl1_id;
					for(let j in tmp_result){
						if(result[i].chl1_id == tmp_result[j].chl1_id)//父亲相同
						{
							result[i].childrens.push({
								name:tmp_result[j].chl2_name,
								id:tmp_result[j].chl2_id
							});
						}
					}
				}
				result = _.uniqBy(result, 'chl1_id');//根据对象的chl1_id值进行数组对象去重
				res.json({
						"errcode" : "1",
						"msg" :"成功!",
						"data"	: result
				});
				return;
			})
		});
	},
	getAllChannels:(req,res,next)=>{//获得所有频道及所属关系
		let resobj = {};
		pool.getConnection(function(err,connection){
			connection.release();
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}
			connection.query(sql.channel_lv1.selectAll,function(error,result){
				if(error){
					res.json({
						"errcode" : "0",
						"msg" :"系统异常！请稍后再试!",
						"data"	: ""
					});
					console.log(error);
					return;
				}
				let tmp_result = result.slice(0);
				for(let i in result){//生成相同父亲的孩子数组
					result[i].children=[];
					result[i].value = result[i].chl1_name;
					result[i].label = result[i].chl1_name;
					result[i].chl2_id = result[i].chl2_id;
					for(let j in tmp_result){
						if(result[i].chl1_id == tmp_result[j].chl1_id)//父亲相同
						{
							result[i].children.push({
								value:tmp_result[j].chl2_name,
								label:tmp_result[j].chl2_name,
								chl2_id:tmp_result[j].chl2_id,
							})
						}
					}
				}
				result = _.uniqBy(result, 'chl1_id');//根据对象的chl1_id值进行数组对象去重
				res.json({
						"errcode" : "1",
						"msg" :"成功!",
						"data"	: result
				});
				return;
			})
		});
	},
	addChannelOne:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function (err,connection) {
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}

			connection.query(sql.channel_lv1.select,[req.body.chl1_name],(error,result)=>{
				if(error)
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"数据库查重失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}
				else{
					if(result.length>=1)//有数据
					{
						//名称重复
						connection.release();
						resobj={
							"errcode" : "0",
							"msg" :"频道名称已存在!",
							"data"	: "频道名称已存在"
						}
						res.json(resobj);
						return;
					}
					else{
						//名称不重复
						connection.query(sql.channel_lv1.insert,[req.body.chl1_name],function(error,result){
							connection.release();
							if(error)
							{
								resobj={
									"errcode" : "0",
									"msg" :"数据库操作失败！请稍后再试!",
									"data"	: ""
								}
								res.json(resobj);
								console.log(error);
								return;
							}
							else{
								channelDao.getAllChannelOne(req,res,next);
								return;
							}
						});
					}
				}

			});
		})
	},
	deleteChannelOne:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function(err,connection){
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}
			//查找当前一级分类下是否有二级分类//有的话因为外键存在是删不掉的
			connection.query(sql.channel_lv2.selectIfCh1InUse,[req.body.chl1_id],function(error,result){
				if(error)
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"数据库操作失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}
				else{
					if(result.length >=1)//当前一级分类下存在二级分类
					{
						connection.release();
						resobj={
							"errcode" : "0",
							"msg" :"当前分类下存在二级分类！请先删除二级分类!",
							"data"	: "当前分类下存在二级分类！请先删除二级分类!"
						}
						res.json(resobj);
						return;
					}else{
						//删除操作
						connection.query(sql.channel_lv1.delete,[req.body.chl1_id],function(error,result){
							connection.release();
							if(error)
							{
								resobj={
									"errcode" : "0",
									"msg" :"数据库操作失败！请稍后再试!",
									"data"	: ""
								}
								res.json(resobj);
								console.log(error);
								return;
							}
							else{
								channelDao.getAllChannelOne(req,res,next);
								return;
							}
						});
					}
				}
			});
		});
	},
	updateChannelOne:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function(err,connection){
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}
			connection.query(sql.channel_lv1.updateSelect,[req.body.chl1_name,req.body.chl1_id],(error,result)=>{
				if(error)
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"数据库查重失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}
				else{
					if(result.length>=1)//有数据
					{
						//名称重复
						connection.release();
						resobj={
							"errcode" : "0",
							"msg" :"频道名称已存在!",
							"data"	: "频道名称已存在"
						}
						res.json(resobj);
						return;
					}
					else{
						connection.query(sql.channel_lv1.update,[req.body.chl1_name,req.body.chl1_id],function(error,result){
							connection.release();
							if(error)
							{
								resobj={
									"errcode" : "0",
									"msg" :"数据库操作失败！请稍后再试!",
									"data"	: ""
								}
								res.json(resobj);
								console.log(error);
								return;
							}
							else{
								channelDao.getAllChannelOne(req,res,next);
								return;
							}
						});
					}
				}
			});
		});
	},
	getAllTopChannel:(req,res,next)=>{//获得一级频道名称并返回数组
		let resobj = {};
		let ch1_names = [];
		pool.getConnection(function(err,connection){
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}
			//获得所有一级分类
			connection.query(sql.channel_lv1.selectAllName,function(error,result){
				connection.release();
				if(error)
				{
					resobj={
						"errcode" : "0",
						"msg" :"数据库查询失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}else{
					//返回的所有一级分类名
					result.map((item,index)=>{
						ch1_names.push(item.chl1_name);
					});
					resobj={
						"errcode" : "1",
						"msg" :"获取一级分类名称成功",
						"data"	: ch1_names
					}
					res.json(resobj);
				}
			});
		});
	},
	getAllChannelTwo:(req,res,next)=>{
		let resobj={};
		let ch1_names = [];
		pool.getConnection(function(err,connection){
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}			//获得所有一级分类
			connection.query(sql.channel_lv1.selectAllName,function(error,result){
				if(error)
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"数据库查重失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}else{
					//返回的所有一级分类名
					result.map((item,index)=>{
						ch1_names.push(item.chl1_name);
					});
					//console.log(ch1_names);
					return;
				}
			});
			//获得二级分类id和名称一级所属上级分类的名称
			connection.query(sql.channel_lv2.selectAllIdName,function(error,result){
				connection.release();
				if(error)
				{
					resobj={
						"errcode" : "0",
						"msg" :"数据库操作失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}
				else{
					//返回组合后的数据
					//需排序,将当前二级频道的上级频道放在数组首位
					//如一级频道名['aaa','bbb','ccc']
					//存在二级频道'ddd',其上级频道为'bbb',则最终返回的一级频道数组为['bbb','aaa',,'ccc']
					//即当前二级频道的上级频道放在首位，作为默认值//方便前端展示
					for(let i in result){
						let tmp_ch1_names = ch1_names.slice(0);//复制数组从0开始 直接使用=赋值会改变原数组
						result[i].key = result[i].chl2_id;
						for(let j in tmp_ch1_names){
							if(tmp_ch1_names[j] ==result[i].chl1_name){//二级分类的父级等于所有一级分类的某个索引的值
								//父级'aaa' 所有一级['bbb','aaa',,'ccc']
								//交换顺序
								let tmp;
								tmp = tmp_ch1_names[0];
								tmp_ch1_names[0] = result[i].chl1_name;
								tmp_ch1_names[j] = tmp;

								//设置result的值
								result[i].chl1_name = tmp_ch1_names;
								break;
							}
						}		
					}
					resobj = {
						"errcode" : "1",
						"msg" :"成功!",
						"data"	: result
					};
					//res.end();
					res.json(resobj);
					return;
				}
				
			});
		});
	},
	addChannelTwo:(req,res,next)=>{//增加二级频道
		let resobj = {};
		pool.getConnection(function (err,connection) {
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}

			connection.query(sql.channel_lv2.select,[req.body.chl2_name],(error,result)=>{
				if(error)
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"数据库查重失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}
				else{
					if(result.length>=1)//有数据
					{
						//名称重复
						connection.release();
						resobj={
							"errcode" : "0",
							"msg" :"频道名称已存在!",
							"data"	: "频道名称已存在"
						}
						res.json(resobj);
						return;
					}
					else{
						//名称不重复
						connection.query(sql.channel_lv2.insert,[req.body.chl2_name,req.body.topChannel],function(error,result){
							connection.release();
							if(error)
							{
								resobj={
									"errcode" : "0",
									"msg" :"数据库操作失败！请稍后再试!",
									"data"	: ""
								}
								res.json(resobj);
								console.log(error);
								return;
							}
							else{
								channelDao.getAllChannelTwo(req,res,next);
								return;
							}
						});
					}
				}

			});
		})
	},
	deleteChannelTwo:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function(err,connection){
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}
			//查找当前二级分类下是否存在主播在直播//有的话因为外键存在是删不掉的
			connection.query(sql.anchor.selectIfCh2InUse,[req.body.chl2_id],function(error,result){
				if(error)
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"数据库操作失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}
				else{
					if(result.length >=1)//当前分类下存在主播，在使用中
					{
						connection.release();
						resobj={
							"errcode" : "0",
							"msg" :"当前分类存在主播！无法删除!",
							"data"	: "当前分类存在主播！无法删除!"
						}
						res.json(resobj);
						return;
					}else{
						//删除操作
						connection.query(sql.channel_lv2.delete,[req.body.chl2_id],function(error,result){
							connection.release();
							if(error)
							{
								resobj={
									"errcode" : "0",
									"msg" :"数据库操作失败！请稍后再试!",
									"data"	: ""
								}
								res.json(resobj);
								console.log(error);
								return;
							}
							else{
								channelDao.getAllChannelTwo(req,res,next);
								return;
							}
						});
					}
				}
			});
		});
	},
	updateChannelTwo:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function(err,connection){
			if(err){
				resobj={
					"errcode" : "0",
					"msg" :"数据库连接失败!",
					"data"	: ""
				}
				res.json(resobj);
				return;
			}
			connection.query(sql.channel_lv2.updateSelect,[req.body.chl2_name,req.body.chl2_id],(error,result)=>{
				if(error)
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"数据库查重失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					console.log(error);
					return;
				}
				else{
					if(result.length>=1)//有数据
					{
						//名称重复
						connection.release();
						resobj={
							"errcode" : "0",
							"msg" :"频道名称已存在!",
							"data"	: "频道名称已存在"
						}
						res.json(resobj);
						return;
					}
					else{
						connection.query(sql.channel_lv2.update,[req.body.chl2_name,req.body.topChannel,req.body.chl2_id],function(error,result){
							connection.release();
							if(error)
							{
								resobj={
									"errcode" : "0",
									"msg" :"数据库操作失败！请稍后再试!",
									"data"	: ""
								}
								res.json(resobj);
								console.log(error);
								return;
							}
							else{
								channelDao.getAllChannelTwo(req,res,next);
								return;
							}
						});
					}
				}
			});
		});
	},
	getChannelRooms:(req,res,next)=>{
		if(req.body.channelId != 'all'){
			pool.getConnection(function(err,connection){
				if(err){
					console.log(err);
					return;
				}
				connection.query(sql.anchor.getChannelRoomsById,[req.body.channelId],(error,result)=>{
					if(error)
					{
						connection.release();
						console.log(error);
						return;
					}
					if(result.length > 0)//有数据返回全部信息
					{	connection.release();
						res.json({
							"errcode" : "1",
							"msg" :"获取频道下所有直播间数据成功！",
							"data"	: result
						})
						return;
					}
					else//没数据返回频道名称
						connection.query(sql.channel_lv2.selectNameById,[req.body.channelId],(error,result)=>{
							connection.release();
							if(error)
							{
								console.log(error);
								return;
							}
							res.json({
								"errcode" : "1",
								"msg" :"获取频道下所有直播间数据成功！",
								"data"	: result
							})
							return;
						});
				});
			});
		}
		else{
			pool.getConnection(function(err,connection){
				if(err){
					console.log(err);
					return;
				}
				connection.query(sql.anchor.getAllChannelRooms,(error,result)=>{
					connection.release();
					if(error)
					{
						console.log(error);
						return;
					}
					res.json({
						"errcode" : "1",
						"msg" :"获取频道下所有直播间数据成功！",
						"data"	: result
					})
					return;
					
				});
			});
		}
	}
}

module.exports = channelDao;