import * as types from './common.types.js'

let initstate = {
	open_side_menu:true,
	formContainerState:false,//不显示登陆注册表单容器
	formState:{},
	barrageReplaceData:[]
};

export default (state = initstate,action) =>{
	switch (action.type){
		case types.OPEN_SIDE_MENU:
			return Object.assign({},state,{open_side_menu:true});
		case types.CLOSE_SIDE_MENU:
			return Object.assign({},state,{open_side_menu:false});
		case types.USER_FORM_CONTAINER:
			return Object.assign({},state,{
				formContainerState:action.formContainerState,
				formState:action.formState
			})
		case types.SET_BARRAGE_REPLACE_DATA:
			return Object.assign({},state,{
				barrageReplaceData:action.data
			})
		default:
			return state;
	}
}