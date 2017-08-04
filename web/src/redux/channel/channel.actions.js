import * as types from './channel.types.js'
import superagent from 'superagent'
import {message} from 'antd'


export function getAllChannelOne(){
	return (dispatch)=>{
		return superagent.post("/api/channel/getAllChannelOne").end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETCHANNELSONEDATA,data:res.body.data});//重新获取所有数据
			}else{
				message.info("获取数据失败!");
			} 
		})
	}
}

export function getAllChannels(){
	return (dispatch)=>{
		return superagent.post("/api/channel/getAllChannels").end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETCHANNELSONEDATA,data:res.body.data});//重新获取所有数据
			}else{
				message.info("获取数据失败!");
			} 
		})
	}
}

export function getAllChannelTwo(){
	return (dispatch)=>{
		return superagent.post("/api/channel/getAllChannelTwo").end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETCHANNELSTWODATA,data:res.body.data});//重新获取所有数据
			}else{
				message.info("获取数据失败!");
			} 
		})
	}
}

export function getAllTopChannel(){
	return (dispatch)=>{
		return superagent.post("/api/channel/getAllTopChannel").end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETTOPCHANNELDATA,data:res.body.data});//重新获取所有数据
			}else{
				message.info("获取数据失败!");
			} 
		})
	}
}

export function addChannelOne(option){
	return (dispatch)=>{
		return superagent.post("/api/channel/addChannelOne").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//操作成功
			{
				dispatch({type:types.SETCHANNELSONEDATA,data:res.body.data});//重新获取所有数据
				message.success("添加成功!");
			}else{
				if(res.body.data)
					message.info(res.body.data);
				else
					message.info("添加失败!");
			}
		})
	}
}
export function addChannelTwo(option){
	return (dispatch)=>{
		return superagent.post("/api/channel/addChannelTwo").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//操作成功
			{
				dispatch({type:types.SETCHANNELSTWODATA,data:res.body.data});//重新获取所有数据
				message.success("添加成功!");
			}else{
				if(res.body.data)
					message.info(res.body.data);
				else
					message.info("添加失败!");
			}
		})
	}
}

export function updateChannelOne(option){
	return (dispatch)=>{
		return superagent.post("/api/channel/updateChannelOne").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//操作成功
			{
				dispatch({type:types.SETCHANNELSONEDATA,data:res.body.data});//重新获取所有数据
				message.info("修改成功!");
			}else{
				if(res.body.data)
					message.info(res.body.data);
				else
					message.info("修改失败!");
			}
		})
	}
}

export function updateChannelTwo(option){
	return (dispatch)=>{
		return superagent.post("/api/channel/updateChannelTwo").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//操作成功
			{
				dispatch({type:types.SETCHANNELSTWODATA,data:res.body.data});//重新获取所有数据
				message.info("修改成功!");
			}else{
				if(res.body.data)
					message.info(res.body.data);
				else
					message.info("修改失败!");
			}
		})
	}
}




export function deleteChannelOne(option){
	return (dispatch)=>{
		return superagent.post("/api/channel/deleteChannelOne").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETCHANNELSONEDATA,data:res.body.data});//重新获取所有数据
				message.info("删除成功!");
			}else{
				if(res.body.data)
					message.info(res.body.data);
				else
					message.info("删除失败!");
			} 
		})
	}
}
export function deleteChannelTwo(option){
	return (dispatch)=>{
		return superagent.post("/api/channel/deleteChannelTwo").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETCHANNELSTWODATA,data:res.body.data});//重新获取所有数据
				message.info("删除成功!");
			}else{
				if(res.body.data)
					message.info(res.body.data);
				else
					message.info("删除失败!");
			} 
		})
	}
}


export function getChannelRooms(params){//前台展示二级频道分类下的所有在播直播间信息
	return (dispatch)=>{
		return superagent.post("/api/channel/getChannelRooms").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETCHANNELROOMDATA,data:res.body.data});//重新获取所有数据
			}else{
				message.info("获取数据失败!");
			} 
		})
	}
}