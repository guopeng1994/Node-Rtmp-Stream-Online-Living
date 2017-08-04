import * as types from './common.types.js'
import superagent from 'superagent'
import {message} from 'antd'

export function sideMenuToggle(option){
	if(option) //打开
		return {type:types.OPEN_SIDE_MENU};
	else //关闭
		return {type:types.CLOSE_SIDE_MENU};
}

export function showform(option) {
	if(option =="login")//点击的登陆按钮，显示登陆表单
		return ({
			type:types.USER_FORM_CONTAINER,
			formContainerState:true,//显示表单容器
			formState:{//显示登陆表单
				log:true,
				reg:false
			}
		})
	else if(option == "regist")
		return ({
			type:types.USER_FORM_CONTAINER,
			formContainerState:true,//显示表单容器
			formState:{//显示注册表单
				log:false,
				reg:true
			}
		})
	else if(option == "close")
		return ({
			type:types.USER_FORM_CONTAINER,
			formContainerState:false,//隐藏表单容器
			formState:{}
		})

}



export function getAllBarrageReplace(){
	return (dispatch)=>{
		return superagent.post('/api/barrage/getAllBarrageReplace').end((err,res)=>{
			res.body = res.body ||{};
			if(res.body.errcode == 1){
				dispatch({
					type:types.SET_BARRAGE_REPLACE_DATA,
					data:res.body.data
				})
			}
		})
	}
}


export function getBarrageReplaceCookie(){
	return (dispatch)=>{
		return superagent.post('/api/barrage/getBarrageReplaceCookie').end((err,res)=>{
			res.body = res.body ||{};
			if(res.body.errcode == 1){
				console.log("获取弹幕过滤数据成功");
			}
		})
	}
}

export function addReplace(params){
	return (dispatch)=>{
		return superagent.post('/api/barrage/addReplace').send(params).end((err,res)=>{
			res.body = res.body ||{};
			if(res.body.errcode == 1){
				message.success(res.body.msg);
				dispatch({
					type:types.SET_BARRAGE_REPLACE_DATA,
					data:res.body.data
				})
			}else{
				if(res.body.data !="")
					message.error(res.body.data);
			}
		})
	}
}

export function updateReplace(params){
	return (dispatch)=>{
		return superagent.post('/api/barrage/updateReplace').send(params).end((err,res)=>{
			res.body = res.body ||{};
			if(res.body.errcode == 1){
				message.success(res.body.msg);
				dispatch({
					type:types.SET_BARRAGE_REPLACE_DATA,
					data:res.body.data
				})
			}else{
				if(res.body.data !="")
					message.error(res.body.data);
			}
		})
	}
}

export function deleteReplace(params){
	return (dispatch)=>{
		return superagent.post('/api/barrage/deleteReplace').send(params).end((err,res)=>{
			res.body = res.body ||{};
			if(res.body.errcode == 1){
				message.success(res.body.msg);
				dispatch({
					type:types.SET_BARRAGE_REPLACE_DATA,
					data:res.body.data
				})
			}
		})
	}
}