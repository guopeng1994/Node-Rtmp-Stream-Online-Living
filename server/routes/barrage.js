var express = require('express');
var router = express.Router();
var barrageDao = require('../dao/barrageDao.js');

//获取所有弹幕替换数据
router.post("/getAllBarrageReplace",function(req,res,next){
	barrageDao.getAllBarrageReplace(req,res,next);
});

//获取所有弹幕替换数据并转换成cookie
router.post("/getBarrageReplaceCookie",function(req,res,next){
	barrageDao.getBarrageReplaceCookie(req,res,next);
});

//添加替换
router.post("/addReplace",function(req,res,next){
	barrageDao.addReplace(req,res,next);
});


//修改替换
router.post("/updateReplace",function(req,res,next){
	barrageDao.updateReplace(req,res,next);
});


//删除替换
router.post("/deleteReplace",function(req,res,next){
	barrageDao.deleteReplace(req,res,next);
});




module.exports = router;