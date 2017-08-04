import * as types from './room.types.js'
import superagent from 'superagent'
import {message} from 'antd'
export function getAllGifts(){//前台获取所有礼物信息
	return (dispatch)=>{
		return superagent.post("/api/gift/getAllGifts").end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETGIFTSDATA,data:res.body.data});//重新获取所有数据
			}else{
				console.log("获取礼物信息失败！");
			} 
		})
	}
}


export function getAllAnchorRooms(){//后台直播间管理获取所有直播间信息
	return (dispatch)=>{
		return superagent.post("/api/room/getAllAnchorRooms").end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETANCHORROOMDATA,data:res.body.data});
			}else{
				console.log("获取直播间失败！");
			} 

		});
	}
}

export function updateAnchor(params){//后台更新、修改直播间的信息
	return (dispatch)=>{
		return superagent.post("/api/room/updateAnchor").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETANCHORROOMDATA,data:res.body.data});
			}else{
				console.log("更新直播间数据失败！");
			} 
		})
	}
}


export function banAnchor(params){//后台封禁、解封直播间
	return (dispatch)=>{
		return superagent.post("/api/room/banAnchor").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETANCHORROOMDATA,data:res.body.data});
			}else{
				console.log("更新直播间数据失败！");
			} 
		})
	}
}

export function roomSearch(params){//后台搜索直播间功能
	return (dispatch)=>{
		return superagent.post("/api/room/roomSearch").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETANCHORROOMDATA,data:res.body.data});
			}else{
				console.log("搜索后更新直播间数据失败！");
			} 
		})
	}
}


export function updateRoomManager(params){//直播间房管管理
	return (dispatch)=>{
		return superagent.post("/api/room/updateRoomManager").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETROOMMANAGERDATA,data:res.body.data});
				message.info('操作成功!');
			}else{
				message.info(res.body.data);
			} 
		})
	}
}


export function getAllManagers(params){//直播间房管管理
	return (dispatch)=>{
		return superagent.post("/api/room/getAllManagers").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETROOMMANAGERDATA,data:res.body.data});
			}else{
				console.log('获取直播间房管失败！');
			} 
		})
	}
}

export function getRecomm(){//直播间房间推荐位获取
	return (dispatch)=>{
		return superagent.post("/api/room/getRecomm").end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETROOMRECOMMDATA,data:res.body.data});
			}else{
				console.log('获取直播间推荐位失败！');
			} 
		})
	}
}

export function saveRecomm(params){//直播间房间推荐位设置
	return (dispatch)=>{
		return superagent.post("/api/room/saveRecomm").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.SETROOMRECOMMDATA,data:res.body.data});
				message.success("设置成功");
			}else{
				message.info(req.body.msg || "获取数据失败!");
			} 
		})
	}
}

export function getTodayHot(){//获得今日热门的直播间//根据当前直播人数
	return (dispatch)=>{
		return superagent.post("/api/room/getTodayHot").end((err,res)=>{
			res.body = res.body || [];
			if(res.body.errcode == 1)
			{
				dispatch({
					type:types.SETTODAYHOT,
					data:res.body.data
				});
				console.log("获取今日热门数据成功!");
			}else{
				message.info(req.body.msg || "获取数据失败!");
			}
		})
	}
}


export function getMyManageableRoom(params){//获取当前用户可管理的直播间及直播间禁言用户列表
	return (dispatch)=>{
		return superagent.post("/api/room/getMyManageableRoom").send(params).end((err,res)=>{
			res.body = res.body || [];
			if(res.body.errcode == 1)
			{
				dispatch({
					type:types.SETMANAGEABLEROOM,
					data:res.body.data
				});
				console.log("获取用户可管理直播间列表及直播间禁言用户列表数据成功!");
			}else{
				message.info(req.body.msg || "获取数据失败!");
			}
		})
	}
}

export function searchUserByKeywords(params){//禁言时搜索用户
	return (dispatch)=>{
		return superagent.post("/api/room/searchUserByKeywords").send(params).end((err,res)=>{
			res.body = res.body || [];
			if(res.body.errcode == 1)
			{
				dispatch({
					type:types.SETSEARCHDATA,
					data:res.body.data
				});
			}else{
				message.info(req.body.msg || "获取数据失败!");
			}
		})
	} 
}