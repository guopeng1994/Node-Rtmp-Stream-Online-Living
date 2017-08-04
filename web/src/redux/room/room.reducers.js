import * as types from './room.types.js'

let initstate = {
	giftsData:[],
	anchorRoomsData:[],
	roomManagers:[],
	recommData:[],
	todayHotData:[],
	manageableRoomData:[],
};

export default (state = initstate,action) =>{
	switch (action.type){
		case types.SETGIFTSDATA:
			return Object.assign({},state,{giftsData:action.data});
		case types.SETANCHORROOMDATA:
			return Object.assign({},state,{anchorRoomsData:action.data});
		case types.SETROOMMANAGERDATA:
			return Object.assign({},state,{roomManagers:action.data});
		case types.SETROOMRECOMMDATA:
			return Object.assign({},state,{recommData:action.data}); 
		case types.SETTODAYHOT:
			return Object.assign({},state,{todayHotData:action.data})
		case types.SETMANAGEABLEROOM:
			return Object.assign({},state,{manageableRoomData:action.data});
		case types.SETSEARCHDATA:
			return Object.assign({},state,{searchData:action.data});
		default:
			return state;
	}
}