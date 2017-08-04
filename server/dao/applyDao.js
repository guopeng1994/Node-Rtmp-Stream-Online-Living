var sql = require('./sql/SqlStatement.js')//常用sql语句
var mysql = require('mysql');
var conf = require('../conf/DBconf.js');
var pool = mysql.createPool(conf.mysql);
var _ = require('lodash');
let applyDao = {
	queryApplys:(req,res,next)=>{
		let sqlStat;
		let sqlParams;
		if(_.isEmpty(req.body) || (req.body.selectValue=="all" && !req.body.dateRange[0])){//不带条件查询或查询条件为空
			sqlStat = sql.apply_tmp.selectAll;
			sqlParams = [];
		}else if(req.body.selectValue=="all" && req.body.dateRange[0]){//只选择了时间
			sqlStat = sql.apply_tmp.selectByTime;
			sqlParams = [req.body.dateRange[0],req.body.dateRange[1]];
		}else if(req.body.selectValue!="all" && !req.body.dateRange[0]){//只选择了状态
			sqlStat = sql.apply_tmp.selectByStatus;
			sqlParams = [req.body.selectValue];
		}else if(req.body.selectValue!="all" && req.body.dateRange[0]){//选择了时间和状态
			sqlStat = sql.apply_tmp.selectByStatusTime;
			sqlParams = [req.body.selectValue,req.body.dateRange[0],req.body.dateRange[1]];
		}
		pool.getConnection(function (err,connection) {
			if(err){
				console.log(err);
				return;
			}

			connection.query(sqlStat,sqlParams,function(error,result){
				connection.release();
				if(error)
				{
					console.log(error);
					return
				}
				for(let i in result){ 
					result[i].key = result[i].apply_time;
					result[i].apply_info = {};
					result[i].apply_info.photos ={};
					result[i].apply_info.photos.apply_profile_card_front = result[i].apply_profile_card_front;
					result[i].apply_info.photos.apply_profile_card_back = result[i].apply_profile_card_back;
					result[i].apply_info.photos.apply_profile_handle_card = result[i].apply_profile_handle_card;
				}
				res.json({
					"errcode":"1",
					"msg":"请求数据成功!",
					"data":result
				});
			});
		})
	},
	reviewProfile:(req,res,next)=>{//审核资料
		let desStatus;//要修改到的目标状态
		
		if(req.body.isPass)//通过审核成为主播
		{
			desStatus = 2;
		}else{//没有通过审核
			desStatus = -1;
		}
		pool.getConnection(function(err,connection){//修改主播申请表内容
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.apply_tmp.updateStatus,[desStatus,req.body.apply_time],function(error,result){
				if(error){
					connection.release();
					console.log(error);
					return;
				}else{
					//向主播表插入数据
					connection.query(sql.anchor.insert,function(error,result){
						connection.release();
						if(error){
							console.log(error);
							return;
						}

						//修改用户表该用户的角色
						//重新查询并返回数据
						req.body.selectValue="all";
						req.body.dateRange=[null,null];
						applyDao.queryApplys(req,res,next);
					})
				}
			})
		})
	}
}

module.exports = applyDao;