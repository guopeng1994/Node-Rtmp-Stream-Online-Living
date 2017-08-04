import * as types from './gift.types.js'
import superagent from 'superagent'
import {message} from 'antd'
export function updateGift(option){
	return (dispatch)=>{
		return superagent.post("/api/gift/updateGift").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//操作成功
			{
				dispatch({type:types.SETGIFTSDATA,data:res.body.data});//重新获取所有数据
				message.success("操作成功!");
			}else{
				message.info("操作失败!");
			}
		})
	}
}

export function getAllGifts(option){
	return (dispatch)=>{
		return superagent.post("/api/gift/getAllGifts").end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETGIFTSDATA,data:res.body.data});//重新获取所有数据
			}else{
				message.info("操作失败!");
			} 
		})
	}
}

export function deleteGift(option){
	return (dispatch)=>{
		return superagent.post("/api/gift/deleteGift").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//请求成功
			{
				dispatch({type:types.SETGIFTSDATA,data:res.body.data});//重新获取所有数据
				message.success("删除成功");
			}else{
				message.info("删除失败!");
			} 
		})
	}
}

export function giveGiftBySilver(option){//送礼功能
	return (dispatch)=>{
		return superagent.post("/api/gift/giveGiftBySilver").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//送礼成功
			{
				dispatch({type:types.GIVEGIFTS,data:'success'});
			}else{//余额不足
				dispatch({type:types.GIVEGIFTS,data:res.body.data});
			} 
		})
	}
}

export function giveGiftByGold(option){//送礼功能
	return (dispatch)=>{
		return superagent.post("/api/gift/giveGiftByGold").send(option).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)//送礼成功
			{
				dispatch({type:types.GIVEGIFTS,data:'success'});
			}else{//余额不足
				dispatch({type:types.GIVEGIFTS,data:res.body.data});
			} 
		})
	}
}


export function reSetGiveGiftStatus(option){//重置送礼状态
	return ({
		type:types.GIVEGIFTS,
		data:''
	});

}

//获取消费的金钱数和消费的历史
export function getCostAndCostHistory(params){
	return (dispatch)=>{
		return superagent.post("/api/gift/getCostAndCostHistory").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.COST,data:res.body.data});
			}else{
				console.log("获取消费的金钱数和消费的历史失败!");
			} 
		})
	}
}


//获取收入的可兑换的金钱数和收取礼物的历史
export function getIncomeAndIncometHistory(params){
	return (dispatch)=>{
		return superagent.post("/api/gift/getIncomeAndIncometHistory").send(params).end((err,res)=>{
			res.body = res.body ||[];
			if(res.body.errcode == 1)
			{
				dispatch({type:types.INCOME,data:res.body.data});
			}else{
				console.log("获取收入的可兑换的金钱数和收取礼物的历史失败!");
			} 
		})
	}
}



