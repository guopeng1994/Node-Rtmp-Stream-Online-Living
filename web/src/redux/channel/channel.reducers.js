import * as types from './channel.types.js'

let initstate = {
	channelOneData:[],
	channelTwoData:[],
	allChannelOne:[],//所有一级分类名称数据
	channelRooms:[{}]
};

export default (state = initstate,action) =>{
	switch (action.type){
		case types.SETCHANNELSONEDATA:
			return Object.assign({},state,{
				channelOneData:action.data
			})
		case types.SETCHANNELSTWODATA:
			return Object.assign({},state,{
				channelTwoData:action.data
		})
		case types.SETTOPCHANNELDATA:
			return Object.assign({},state,{
				allChannelOne:action.data
		})
		case types.SETCHANNELROOMDATA:
			return Object.assign({},state,{
				channelRooms:action.data
		})
		default:
			return state;
	}
}