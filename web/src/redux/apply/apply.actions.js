import * as types from './apply.types.js'

import superagent from 'superagent'
import {message} from 'antd'

export function queryApplys(params){//查询当前用户的申请状态
	return (dispatch)=>{
		return superagent.post('/api/apply/queryApplys').send(params).end((err,res)=>{
			res.body = res.body || {};
			console.log(res.body);
			if(res.body.errcode == 1){//请求成功
				dispatch({
					type:types.QUERYAPPLY,
					data:res.body.data
				})
			}
		});
	}
}

export function reviewProfile(params){//审核操作
	return (dispatch)=>{
		return superagent.post("/api/apply/reviewProfile").send(params).end((err,res)=>{
			res.body = res.body || {};
			if(res.body.errcode == "1"){
				message.success("操作成功!");
				dispatch({//重新设置数据
					type:types.QUERYAPPLY,
					data:res.body.data
				})
			}else{
				message.info("操作失败!");
			}
		})
	}
}