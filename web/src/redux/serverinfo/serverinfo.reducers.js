import * as types from './serverinfo.types.js'

let initstate = {
	nowUsage:{}//当前内存和cpu使用量
};

export default (state = initstate,action) =>{
	switch (action.type){
		case types.GETSERVERUSAGE:
			return Object.assign({},state,{
				nowUsage:action.data
			})
		default:
			return state;
	}
}