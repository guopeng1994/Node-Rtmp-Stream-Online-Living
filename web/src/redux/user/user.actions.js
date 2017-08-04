import * as types from './user.types.js'

import superagent from 'superagent'
import {message} from 'antd'

export function adminlogin (params) {
	return (dispatch)=>{
		return superagent.post('/api/user/admin/login').send(params).end((err,res)=>{
			res.body = res.body ||{};
			if(err)
				res.body.msg="服务器异常！请稍后再试！"
			dispatch({type:types.ADMIN_LOGIN,data:res.body});
		})
	}
}
export function adminlogout () {
	return (dispatch)=>{
		return superagent.get('/api/user/admin/logout').end((err,res)=>{
			res.body = res.body ||{};
			if(err)
				res.body.msg="服务器异常！请稍后再试！"
			dispatch({type:types.ADMIN_LOGOUT,data:res.body});
		})
	}
}
export function adminLogValidate(params){
	return({
		type:types.ADMIN_LOG_VALIDATE,
		data:{
			msg:params
		}
	})
}
export function userLogin(params){
	return (dispatch)=>{
		return superagent.post("/api/user/user/login").send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 0)
			{
				if(res.body.data){
					{
						dispatch({
							type:types.USER_LOGIN,//提示信息显示在表单中
							data:res.body.data
						})
					}
				}else
					console.log("服务端异常!请稍后再试!");
			}else{
				dispatch({
					type:types.USER_INFO,//登陆成功后返回的用户所有信息
					data:res.body.data
				})
				message.success(res.body.msg);//跳转提示
				setTimeout(function(){
					window.location.reload();//刷新当前页面
				},2000)
			}
		})
	}
}

export function userRegist(params){
	return (dispatch)=>{
		return superagent.post("/api/user/user/regist").send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 0) //!=""
			{
				if(res.body.data){
					{
						dispatch({
							type:types.USER_REGIST,//提示信息显示在表单中
							data:res.body.data
						})
					}
				}else
					console.log("服务端异常!请稍后再试!");
			}else{
				dispatch({
					type:types.USER_INFO,//注册成功后返回的用户所有信息
					data:res.body.data
				})
				message.success("注册成功!即将自动登录...");//跳转提示
				setTimeout(function(){
					window.location.reload();//刷新当前页面
				},2000)
			}
		})
	}
}
export function userLogout(){
	return (dispatch)=>{
		return superagent.post("/api/user/user/logout").end((err,res)=>{
			if(res.body.errcode == 1)
			{
				window.location.reload();
			}
		})
	}
}
export function setTelErrData(){
	return {
			type:types.SET_TEL_ERR_DATA,//提示信息显示在表单中
			data:""
		}
}
export function setPwdErrData(){
	return {
			type:types.SET_PWD_ERR_DATA,//提示信息显示在表单中
			data:""
		}
}

export function applyAnchor(params){//申请成为主播
	return (dispatch)=>{
		return superagent.post('/api/user/user/applyAnchor').send(params).end((err,res)=>{
			res.body = res.body || {};
			message.info(res.body.msg);
			if(res.body.errcode == 1){//申请成功
				dispatch({
					type:types.APPLY,
					data:res.body.data.status   //未申请0 申请失败、审核不通过-1 申请成功、申请中、审核中 1 审核通过2
				})
			}
			window.location.reload();
		});
	}
}

export function queryApplyState(params){//查询当前用户的申请状态
	return (dispatch)=>{
		return superagent.post('/api/user/user/queryApplyState').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 1){//请求成功
				dispatch({
					type:types.APPLY,
					data:res.body.data.status   //未申请0 申请失败、审核不通过-1 申请成功、申请中、审核中 1 审核通过2
				})
			}
		});
	}
}


export function saveLiveInfo(params){//主播设置直播间的信息
	return (dispatch)=>{
		return superagent.post('/api/user/user/saveLiveInfo').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 0){
				message.info(res.body.data);
			}else{
				message.info(res.body.msg);
				dispatch({
					type:types.SETLIVEINFO,
					data:res.body.data
				})
			}
		});
	}
}


export function queryAnchorLiveInfo(params){//查询主播直播间的信息
	return (dispatch)=>{
		return superagent.post('/api/user/user/queryAnchorLiveInfo').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 0){
				message.info(res.body.data);
			}else{
				dispatch({
					type:types.SETLIVEINFO,
					data:res.body.data
				})
			}
		});
	}
}


export function getChannelsData(){//获取频道信息
	return (dispatch)=>{
		return superagent.post('/api/channel/getAllChannels').end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 1){
				dispatch({
					type:types.SETCHANNELDATA,
					data:res.body.data
				})
			}
		});
	}
}

export function anchorStartShow(params){//前台-主播开启直播
	return (dispatch)=>{
		return superagent.post("/api/user/user/anchorStartShow").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETLIVEINFO,data:res.body.data});
			}else{
				console.log("主播开启直播间后更新直播间数据(包含主播可见数据)失败！");
			} 
		})
	}
}

export function queryAnchorLiveInfoByUrl(params){//通过URL查询主播直播间的信息
	return (dispatch)=>{
		return superagent.post('/api/user/user/queryAnchorLiveInfoByUrl').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 0){
				message.info(res.body.data);
			}else{
				dispatch({
					type:types.SETLIVEINFO,
					data:res.body.data
				})
			}
		});
	}
}


export function getAllUsers(){//后台用户管理获取所有用户信息
	return (dispatch)=>{
		return superagent.post('/api/user/user/getAllUsers').end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 1){
				dispatch({
					type:types.SETALLUSERDATA,
					data:res.body.data
				})
			}else{
				console.log('获取所有用户数据失败!');
			}
		});
	}
}

export function updateUser(params){//后台用户管理修改用户信息
	return (dispatch)=>{
		return superagent.post('/api/user/user/updateUser').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 1){
				dispatch({
					type:types.SETALLUSERDATA,
					data:res.body.data
				})
				message.success("保存成功!");
			}else{
				message.info(res.body.msg);
			}
		});
	}
}

export function searchUser(params){//后台用户管理搜索用户信息
	return (dispatch)=>{
		return superagent.post('/api/user/user/searchUser').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 1){
				dispatch({
					type:types.SETALLUSERDATA,
					data:res.body.data
				})
			}
		});
	}
}

export function isUserExist(params){//忘记密码查看用户是否存在
	return (dispatch)=>{
		return superagent.post('/api/user/user/isUserExist').send(params).end((err,res)=>{
			res.body = res.body || {};
			dispatch({
				type:types.FORGETPWDVALIDATE,
				data:res.body.data,
			})
			if(res.body.errcode == 0){
				message.info(res.body.msg);
			}
		});
	}
}

export function isEmailMatch(params){//查看用户账户与邮箱是否匹配
	return (dispatch)=>{
		return superagent.post('/api/user/user/isEmailMatch').send(params).end((err,res)=>{
			res.body = res.body || {};
			dispatch({
				type:types.FORGETPWDVALIDATE,
				data:res.body.data,
			})
			if(res.body.errcode == 0){
				message.info(res.body.msg);
			}
		});
	}
}

export function postEmailCaptcha(params){//发送验证邮件
	return (dispatch)=>{
		return superagent.post('/api/user/user/postEmailCaptcha').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == 1){
				message.success("邮件已发送!");
			}
		});
	}
}



export function checkCaptcha(params){//校验验证码
	return (dispatch)=>{
		return superagent.post('/api/user/user/checkCaptcha').send(params).end((err,res)=>{
			res.body = res.body || {};
			dispatch({
				type:types.FORGETPWDVALIDATE,
				data:res.body.data,
			})
			if(res.body.errcode == 0){
				message.info(req.body.msg);
			}
		});
	}
}
export function reSetPwdValidate(){//重置状态 //隐藏下一步按钮
	return ({
		type:types.FORGETPWDVALIDATE,
		data:'no',
	})
}

export function fgNewPwd(params){//忘记密码时生成新密码
	return (dispatch)=>{
		return superagent.post('/api/user/user/fgNewPwd').send(params).end((err,res)=>{
			res.body = res.body || {};
			dispatch({
				type:types.FORGETPWDNEW,
				data:res.body.data,
			})
		});
	}
}

//修改个人信息 修改头像

export function updateAvatar(params){
	return (dispatch)=>{
		return superagent.post('/api/user/user/updateAvatar').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode ==0)
				message.info("修改头像失败!请稍后再试!");
			else
				message.success("头像修改成功!");
		})
	}
}

//修改个人信息 修改昵称
export function updateNickname(params){
	return (dispatch)=>{
		return superagent.post('/api/user/user/updateNickname').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode ==0)
				message.info(res.body.data);
			else
				message.success("昵称修改成功!");
		})
	}
}

//修改个人信息 修改绑定邮箱
export function updateEmail(params){
	return (dispatch)=>{
		return superagent.post('/api/user/user/updateEmail').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode ==0)
				message.info(res.body.data);
			else
				message.success("绑定邮箱修改成功!");
		})
	}
}



//修改个人信息 修改密码
export function updatePwd(params){
	return (dispatch)=>{
		return superagent.post('/api/user/user/updatePwd').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode ==0)
				message.info(res.body.data);
			else{
				message.success("密码修改成功!请重新登录");
				window.location.reload();
			}
		})
	}
}
//查询当前用户是否已经关注该直播间
export function selectIsFocusThisRoom(params){
	return (dispatch)=>{
		return superagent.post('/api/user/user/selectIsFocusThisRoom').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode ==1)
				dispatch({
					type:types.ISFOCUS,
					data:res.body.data
				})
		})
	}
}

//关注与取消关注操作
export function focus(params){
	return (dispatch)=>{
		return superagent.post('/api/user/user/focus').send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode ==1)
				dispatch({
					type:types.ISFOCUS,
					data:res.body.data
				})
		})
	}
}

//获取用户关注的所有直播间数据
export function getAllFocusRoom(params){
	return(dispatch)=>{
		return superagent.post("/api/user/user/getAllFocusRoom").send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode ==1)
				dispatch({
					type:types.FOCUSDATA,
					data:res.body.data
				})
			else
				console.log("获取用户关注的直播间数据失败");
		})
	}
}


export function getFreeChest(params){//免费礼物获取
	return(dispatch)=>{
		return superagent.post("/api/user/user/getFreeChest").send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode = 1){
				console.log("免费礼物获取成功!");
			}
		})
	}
}


