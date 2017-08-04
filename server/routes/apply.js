var express = require('express');
var router = express.Router();
var applyDao = require('../dao/applyDao.js');

//获取、查询申请信息
router.post("/queryApplys",function(req,res,next){
	applyDao.queryApplys(req,res,next);
});

//审核操作
router.post("/reviewProfile",function(req,res,next){
	applyDao.reviewProfile(req,res,next);
});



module.exports = router;