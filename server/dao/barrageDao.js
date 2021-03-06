var sql = require('./sql/SqlStatement.js')//常用sql语句
var mysql = require('mysql');
var conf = require('../conf/DBconf.js');
var pool = mysql.createPool(conf.mysql);


let barrageDao = {
	getAllBarrageReplace:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				conosle.log(err);
				return;
			}
			connection.query(sql.barrage.select,function(error,result){
				connection.release();
				if(error){
					console.log(error);
					res.json({
						"errcode":0,
						"msg":"查询弹幕替换数据失败!",
						"data":''
					})
					return;
				}

				for(let i in result){
					result[i].key = result[i].br_id;
				}
				res.json({
					"errcode":1,
					"msg":"操作成功!",
					"data":result
				})
			});
		})
	},
	getBarrageReplaceCookie:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.barrage.select,function(error,result){
				connection.release();
				if(error){
					console.log(error);
					res.json({
						"errcode":0,
						"msg":"查询弹幕替换数据失败!",
						"data":''
					})
					return;
				}
				res.cookie("barrageReplace",result);
				res.json({
						"errcode":1,
						"msg":"查询弹幕替换数据成功!",
						"data":''
				})
			});
		})
	},
	addReplace:(req,res,next)=>{
		pool.getConnection((err,connection)=>{
			if(err){
				conosle.log(err);
				return;
			}
			connection.query(sql.barrage.selectUnique,[req.body.br_be_replaced],(error,result)=>{
				connection.release();
				if(error){
					console.log(error);
					res.json({
						"errcode":0,
						"msg":"查重失败!",
						"data":''
					})
					return;
				}
				if(result.length >0)//有重复项
				{
					res.json({
						"errcode":0,
						"msg":"被替换关键字已存在!",
						"data":'被替换关键字已存在'
					});
					return;
				}else{
					pool.getConnection(function(err,connection){
						if(err){
							conosle.log(err);
							return;
						}
						connection.query(sql.barrage.insert,[req.body.br_be_replaced,req.body.br_replace_content],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								res.json({
									"errcode":0,
									"msg":"添加弹幕替换数据失败!",
									"data":''
								})
								return;
							}
							barrageDao.getAllBarrageReplace(req,res,next);
						});
					});
				}
			});
		});
	},
	updateReplace:(req,res,next)=>{
		pool.getConnection((err,connection)=>{
			if(err){
				conosle.log(err);
				return;
			}
			connection.query(sql.barrage.selectUnique,[req.body.br_be_replaced,req.body.br_id],(error,result)=>{
				connection.release();
				if(error){
					console.log(error);
					res.json({
						"errcode":0,
						"msg":"查重失败!",
						"data":''
					})
					return;
				}
				console.log(result);
				if(result.length >0)//有重复项
				{
					res.json({
						"errcode":0,
						"msg":"被替换关键字已存在!",
						"data":'被替换关键字已存在'
					});
					return;
				}else{

					pool.getConnection(function(err,connection){
						if(err){
							conosle.log(err);
							return;
						}
						connection.query(sql.barrage.update,[req.body.br_be_replaced,req.body.br_replace_content,req.body.br_id],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								res.json({
									"errcode":0,
									"msg":"修改弹幕替换数据失败!",
									"data":''
								})
								return;
							}
							barrageDao.getAllBarrageReplace(req,res,next);
						});
					});
				}
			});
		});
	},
	deleteReplace:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				conosle.log(err);
				return;
			}
			connection.query(sql.barrage.delete,[req.body.br_id],(error,result)=>{
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				barrageDao.getAllBarrageReplace(req,res,next);
			});
		});
	}
}

module.exports = barrageDao;