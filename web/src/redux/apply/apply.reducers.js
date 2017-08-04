import * as types from './apply.types.js'
import {notification} from 'antd'
let initstate = {
};


export default (state = initstate,action) =>{
	switch (action.type){
		case types.QUERYAPPLY:
			return Object.assign({},state,{applysData:action.data})//用户申请主播填写的信息
		default:
			return state;
	}
}