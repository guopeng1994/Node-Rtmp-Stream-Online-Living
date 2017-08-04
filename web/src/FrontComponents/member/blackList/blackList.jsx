import React,{Component} from 'react'
import {Icon} from 'antd'
import './blackList.scss'
import BlackListDetail from './BlackListDetail/BlackListDetail'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../../redux/room/room.actions.js'

@connect((state = {})=>{
	return ({
		state:state.room
	})
},(dispatch)=>{
	return ({
		actions:bindActionCreators(actions,dispatch)
	})
})


export default class BlackList extends React.Component{
	constructor(props){
		super(props);
		this.props.actions.getMyManageableRoom({//获取当前用户可管理的直播间
			userName:this.props.userInfo.user_nickname
		})
	}
	openDetail = (e) =>{
		if(e.target.parentNode.offsetHeight == 40)
			e.target.parentNode.className = "manageable-room-item item-open"
		else
			e.target.parentNode.className = "manageable-room-item"
	}
	render(){
		let rooms = this.props.state.manageableRoomData || [];
		return (
			<div className="blacklist-box">
				<span className="blacklist-title">我管理的直播间</span>
				<ul className="manageable-room">
					{
						rooms.map((item,index)=>{
							return (
								<li className="manageable-room-item" key={item.roomUrl}>
									<p className="manageable-room-item-title" onClick={this.openDetail}>
									{item.roomName}
									</p>
									<BlackListDetail banlist={item.banlist} room={item.roomUrl}/>
								</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
}