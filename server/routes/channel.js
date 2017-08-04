var express = require('express');
var router = express.Router();

var channelDao = require('../dao/channelDao.js');

//获取一级频道所有信息
router.post("/getAllChannelOne",function(req,res,next){
	channelDao.getAllChannelOne(req,res,next);
})
//获取一级频道的所有名称
router.post("/getAllTopChannel",function(req,res,next){
	channelDao.getAllTopChannel(req,res,next);
})

//一级频道添加
router.post("/addChannelOne",function(req,res,next){
	channelDao.addChannelOne(req,res,next);
})

//一级频道删除
router.post("/deleteChannelOne",function(req,res,next){
	channelDao.deleteChannelOne(req,res,next);
})

//一级频道修改
router.post("/updateChannelOne",function(req,res,next){
	channelDao.updateChannelOne(req,res,next);
})

//获取二级频道所有信息
router.post("/getAllChannelTwo",function(req,res,next){
	channelDao.getAllChannelTwo(req,res,next);
})


//二级频道添加
router.post("/addChannelTwo",function(req,res,next){
	channelDao.addChannelTwo(req,res,next);
})

//二级频道删除
router.post("/deleteChannelTwo",function(req,res,next){
	channelDao.deleteChannelTwo(req,res,next);
})

//二级频道修改
router.post("/updateChannelTwo",function(req,res,next){
	channelDao.updateChannelTwo(req,res,next);
})


//所有频道信息及所属关系
router.post("/getAllChannels",function(req,res,next){
	channelDao.getAllChannels(req,res,next);
})

//所有频道信息及所属关系
router.post("/getChannelRooms",function(req,res,next){
	channelDao.getChannelRooms(req,res,next);
})


module.exports = router;