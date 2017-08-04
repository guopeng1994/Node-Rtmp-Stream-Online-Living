import React,{Component} from 'react'
import {message} from 'antd'

import './roomManager.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../../redux/room/room.actions.js'

@connect((state={}) => {
    return {
        state:state.room,
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
}})

export default class RoomManager extends React.Component{
	constructor(props){
		super(props);
		this.userInfo = this.props.userInfo;
		let reqObj = {
			data:{
				roomInfo:this.userInfo.anch_live_url
			}
		}
		this.props.actions.getAllManagers(reqObj);
	}
	getRoomManager=(managersArr)=>{
		if(managersArr[0] == '')
			return (
				<label>暂无房管</label>
			)
		else
			return managersArr.map((item,index)=>{
				return (
					<li>{item}</li>
				)
			})
	}
	doRoomManager=(action)=>{
		message.destroy();
		let userName = this.refs.username.value;
		if(userName == ''){
			message.error('请填写内容!');
			return;
		}
		if(!this.userInfo.anch_live_url){
			message.error('您还不是主播!');
			return;
		}
		let reqObj = {
			action:action,
			data:{
				userName:userName+',',//房管名
				roomInfo:this.userInfo.anch_live_url
			}
		}
		this.props.actions.updateRoomManager(reqObj);
	}
	render(){
		let managersArr = this.props.state.roomManagers;
		return(
			<div className="room-manager">
				<div className="add-del-box">
					<input type='text' maxLength='10' ref='username' placeholder='请输入需要添加/删除的房管(用户名)'/>
					<button onClick={()=>this.doRoomManager('add')}>添加房管</button>
					<button onClick={()=>this.doRoomManager('del')}>删除房管</button>
				</div>
				<ul>
					{this.getRoomManager(managersArr)}
				</ul>
			</div>
		)
	}
}