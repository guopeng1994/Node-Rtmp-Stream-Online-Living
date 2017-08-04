import * as types from './user.types.js'
import {notification} from 'antd'
let initstate = {
	adminLoginData:{},
	errData:"",//用户登录或者注册的出错信息提示
	userInfo:{},
	applyStatus:0,
	liveInfoData:{},//主播之间的相关信息
	channelRelationData:[],
	usersData:[],
	forgetPwdValidateData:[],
	newpwd:'',
	focusData:false,
	AllFocusData:[]
};


export default (state = initstate,action) =>{
	switch (action.type){
		case types.ADMIN_LOGIN:
			return Object.assign({},state,{adminLoginData:action.data})
		case types.ADMIN_LOGOUT:
			{
				notification.open({
				    message: action.data.msg,
				    description: '即将退出至登录页... ...',
				});
				setTimeout(function()  {
					window.location.href = '/admin';
				},3000);
			}
		case types.ADMIN_LOG_VALIDATE:
			return Object.assign({},state,{adminLoginData:action.data})
		case types.USER_REGIST:
			return Object.assign({},state,{errData:action.data})
		case types.USER_LOGIN:
			return Object.assign({},state,{errData:action.data});
		case types.USER_INFO:
			return Object.assign({},state,{userInfo:action.data})
		case types.SET_TEL_ERR_DATA:
			return Object.assign({},state,{errData:action.data})
		case types.SET_PWD_ERR_DATA:
			return Object.assign({},state,{errData:action.data})
		case types.APPLY:
			return Object.assign({},state,{applyStatus:action.data})
		case types.SETLIVEINFO:
			return Object.assign({},state,{liveInfoData:action.data})
		case types.SETCHANNELDATA:
			return Object.assign({},state,{channelRelationData:action.data})
		case types.SETALLUSERDATA:
			return Object.assign({},state,{usersData:action.data})
		case types.FORGETPWDVALIDATE:
			return Object.assign({},state,{forgetPwdValidateData:action.data})
		case types.FORGETPWDNEW:
			return Object.assign({},state,{newpwd:action.data})
		case types.ISFOCUS:
			return Object.assign({},state,{focusData:action.data})
		case types.FOCUSDATA:
			return Object.assign({},state,{AllFocusData:action.data})
		default:
			return state;
	}
}