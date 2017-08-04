
import { combineReducers } from 'redux'
import ReactRouterRedux, { routerReducer as routing } from 'react-router-redux'

import user from './user/user.reducers.js' //用户操作相关
import common from './common/common.reducers.js' //公共操作相关
import serverinfo from './serverinfo/serverinfo.reducers.js' //服务器信息相关
import gift from './gift/gift.reducers.js' //礼物操作相关
import channel from './channel/channel.reducers.js' //频道操作相关
import room from './room/room.reducers.js' //房间操作相关
import apply from './apply/apply.reducers.js' //用户申请成为主播的 资料操作相关

const initialState = {}
export default combineReducers({
	routing,
    common,
    user,
    serverinfo,
    gift,
    channel,
    room,
    apply
}, initialState)
