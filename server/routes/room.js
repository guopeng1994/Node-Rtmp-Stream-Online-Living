var express = require('express');
var router = express.Router();

var roomDao = require('../dao/roomDao.js');

//获取主播用户的直播间信息
router.post("/getAllAnchorRooms",function(req,res,next){
	roomDao.getAllAnchorRooms(req,res,next);
})
//后台更新、修改直播间的信息
router.post("/updateAnchor",function(req,res,next){
	roomDao.updateAnchor(req,res,next);
})

//直播间封禁、解封
router.post("/banAnchor",function(req,res,next){
	roomDao.banAnchor(req,res,next);
})

//直播间搜索查询
router.post("/roomSearch",function(req,res,next){
	roomDao.roomSearch(req,res,next);
})

//直播间房管设置
router.post("/updateRoomManager",function(req,res,next){
	roomDao.updateRoomManager(req,res,next);
})

//获取直播间房管数据
router.post("/getAllManagers",function(req,res,next){
	roomDao.getRoomManagers(req,res,next);
})

//获取直播间推荐位数据
router.post("/getRecomm",function(req,res,next){
	roomDao.getRecomm(req,res,next);
})

//设置直播间推荐位数据
router.post("/saveRecomm",function(req,res,next){
	roomDao.saveRecomm(req,res,next);
})



//获取今日热门的直播间
router.post("/getTodayHot",function(req,res,next){
	roomDao.getTodayHot(req,res,next);
})

//获取用户可管理的所有直播间
router.post("/getMyManageableRoom",function(req,res,next){
	roomDao.getMyManageableRoom(req,res,next);
})

//禁言时搜索用户
router.post("/searchUserByKeywords",function(req,res,next){
	roomDao.searchUserByKeywords(req,res,next);
})


module.exports = router;