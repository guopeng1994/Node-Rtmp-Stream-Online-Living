var express = require('express');
var router = express.Router();
var giftDao = require('../dao/giftDao.js');

//礼物新增和修改操作
router.post("/updateGift",function(req,res,next){
	giftDao.giftUpdate(req,res,next);
});


//获取所有礼物数据
router.post("/getAllGifts",function(req,res,next){
	giftDao.getAllGifts(req,res,next);
})

//删除礼物
router.post("/deleteGift",function(req,res,next){
	giftDao.giftDelete(req,res,next);
})

//送出礼物
router.post("/giveGiftBySilver",function(req,res,next){
	giftDao.giveGiftBySilver(req,res,next);
})

//送出礼物
router.post("/giveGiftByGold",function(req,res,next){
	giftDao.giveGiftByGold(req,res,next);
})

//获取消费的金钱数和消费的历史
router.post("/getCostAndCostHistory",function(req,res,next){
	giftDao.getCostAndCostHistory(req,res,next);
})

//获取收入的可兑换的金钱数和收取礼物的历史
router.post("/getIncomeAndIncometHistory",function(req,res,next){
	giftDao.getIncomeAndIncometHistory(req,res,next);
})

module.exports = router;