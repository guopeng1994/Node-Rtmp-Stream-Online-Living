var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao.js');

//admin登录
router.post("/admin/login",function(req,res,next){
	userDao.adminlogin(req,res,next);
})
//admin注销
router.get("/admin/logout",function(req,res,next){
	userDao.adminlogout(req,res,next);
})
//user注册
router.post("/user/regist",function(req,res,next){
	userDao.userRegist(req,res,next);
})
//user登录
router.post("/user/login",function(req,res,next){
	userDao.userLogin(req,res,next);
})
//user注销
router.post("/user/logout",function(req,res,next){
	userDao.userLogout(req,res,next);
})

//user申请为主播
router.post("/user/applyAnchor",function(req,res,next){
	userDao.applyAnchor(req,res,next);
})

//user申请为主播的状态、进度
router.post("/user/queryApplyState",function(req,res,next){
	userDao.queryApplyState(req,res,next);
})

//主播保存、设置直播间的信息
router.post("/user/saveLiveInfo",function(req,res,next){
	userDao.saveLiveInfo(req,res,next);
})


//查询主播直播间的信息
router.post("/user/queryAnchorLiveInfo",function(req,res,next){
	userDao.queryAnchorLiveInfo(req,res,next);
})

//通过url查询主播直播间的信息
router.post("/user/queryAnchorLiveInfoByUrl",function(req,res,next){
	userDao.queryAnchorLiveInfoByUrl(req,res,next);
})


//主播开启直播
router.post("/user/anchorStartShow",function(req,res,next){
	userDao.anchorStartShow(req,res,next);
})
//后台获取所有用户的信息
router.post("/user/getAllUsers",function(req,res,next){
	userDao.getAllUsers(req,res,next);
});
//后台修改用户的信息
router.post("/user/updateUser",function(req,res,next){
	userDao.updateUser(req,res,next);
});

//后台搜索用户的信息
router.post("/user/searchUser",function(req,res,next){
	userDao.searchUser(req,res,next);
});

//忘记密码 找回密码 验证用户是否存在
router.post("/user/isUserExist",function(req,res,next){
	userDao.isUserExist(req,res,next);
});

//忘记密码 找回密码 查看用户账户与邮箱是否匹配
router.post("/user/isEmailMatch",function(req,res,next){
	userDao.isEmailMatch(req,res,next);
});

//忘记密码 找回密码 发送邮箱 邮件验证码
router.post("/user/postEmailCaptcha",function(req,res,next){
	userDao.postEmailCaptcha(req,res,next);
});


//忘记密码 找回密码 发送邮箱 校验验证码
router.post("/user/checkCaptcha",function(req,res,next){
	userDao.checkCaptcha(req,res,next);
});

//忘记密码 找回密码 //忘记密码时生成新密码
router.post("/user/fgNewPwd",function(req,res,next){
	userDao.fgNewPwd(req,res,next);
});


//修改个人资料 修改头像
router.post("/user/updateAvatar",function(req,res,next){
	userDao.updateAvatar(req,res,next);
});

//修改个人资料 修改昵称
router.post("/user/updateNickname",function(req,res,next){
	userDao.updateNickname(req,res,next);
});

//修改个人资料 修改绑定邮箱
router.post("/user/updateEmail",function(req,res,next){
	userDao.updateEmail(req,res,next);
});

//修改个人资料 修改密码
router.post("/user/updatePwd",function(req,res,next){
	userDao.updatePwd(req,res,next);
});

//查询当前用户是否已经关注该直播间
router.post("/user/selectIsFocusThisRoom",function(req,res,next){
	userDao.selectIsFocusThisRoom(req,res,next);
});

//关注与取消关注操作
router.post("/user/focus",function(req,res,next){
	userDao.focus(req,res,next);
});


//获取用户关注的所有直播间数据
router.post("/user/getAllFocusRoom",function(req,res,next){
	userDao.getAllFocusRoom(req,res,next);
});

router.post("/user/getFreeChest",function(req,res,next){
	userDao.getFreeChest(req,res,next);
})
module.exports = router;