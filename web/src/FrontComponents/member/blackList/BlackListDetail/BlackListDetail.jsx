import React,{Component} from 'react'
import {Icon,Modal,Select,InputNumber,Table} from 'antd'
import moment from 'moment'
import './BlackListDetail.scss'

const Option = Select.Option;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../../../redux/room/room.actions.js'

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
		this.state={
			modalVisible:false,
			durationType:"小时",
			latestTime:0
		};
	}
	showBanModal=(item)=>{
		this.setState({
			modalVisible:true,
			baned_user:item.user_nickname
		})
	}
	cancleBanTalk=()=>{
		this.setState({
			modalVisible:false,
			durationType:"小时",
			latestTime:0
		})
	}
	changeBanDurationType=(value)=>{//修改粒度
		this.setState({
			durationType:value
		})
	}
	changeBanLatestTime=(value)=>{//修改时长
		this.setState({
			latestTime:value
		})
	}
	searchUser=()=>{
		let username_keyword = this.refs.username.value;
		if(username_keyword.trim() == '')
			return;
		this.props.actions.searchUserByKeywords({
			keywords:username_keyword
		})
	}
	banTalk=(baned_user)=>{//禁言
		if(this.state.durationType == '天')
			ban_duration = this.state.latestTime * 24;
		else if(this.state.durationType == '月')
			ban_duration = this.state.latestTime * 24 * 30;
		else if(this.state.durationType == '年')
			ban_duration = this.state.latestTime * 24 * 365;
		else
			ban_duration = this.state.latestTime;

		let banOption={
			baned_user:baned_user,
			ban_duration:ban_duration,//禁言时长 小时
			ban_room:this.props.room,
			bantime:moment().format('YYYY-MM-DD HH:mm:ss')
		}

		this.props.actions.banTalk(banOption);
	}
	unbanTalk=()=>{//解禁

	}
	render(){
		let endTime;
		let currentTime = new Date();
		let currentYear = currentTime.getFullYear();
		let currentMonth = currentTime.getMonth()+1;
		let currentDay = currentTime.getDate();
		let currentHour = currentTime.getHours();
		if(this.state.durationType == "小时")
		{
			endTime = currentTime.setHours(currentHour+this.state.latestTime);
		}else if(this.state.durationType == "天"){
			endTime = currentTime.setDate(currentDay+this.state.latestTime);
		}else if(this.state.durationType == "月"){
			endTime = currentTime.setMonth(currentMonth+this.state.latestTime);
		}else if(this.state.durationType == "年"){
			endTime = currentTime.setYear(currentYear+this.state.latestTime);
		}else{
			endTime = currentTime;
		}
		return (
			<div className="blacklist-detail-box">
				<div className="search-user">
					<input type="text" maxLength="10" placeholder="请输入用户名关键字" ref="username"/>
					<button onClick={this.searchUser}><Icon type="search" />搜索用户</button>
				</div>
				<p className="res-title">已为您搜索到以下内容</p>
				<div className="search-result">
					<ul className="search-result-list">
						{
							this.props.state.searchData ? 
								this.props.state.searchData.length > 0 ? 
									this.props.state.searchData.map((item,index)=>{
										return (
											<li className="search-result-list-item">{item.user_nickname}
												<button className="ban-talk" onClick={()=>this.showBanModal(item)}>禁言
												</button>
											</li>
										)
									})
								: <p className="no-data">没有搜索到任何内容</p>
							: <p className="no-data">暂无搜索结果</p>
						}
						<Modal title="设置禁言时长" visible={this.state.modalVisible}
				          onOk={()=>this.banTalk(this.state.baned_user)} onCancel={this.cancleBanTalk}
				          okText="确认禁言" cancelText="取消"
				          wrapClassName="ban-talk-modal"
				        >
				        	<label className="please-set">请设置禁言时长:</label>
				        	<InputNumber min={1} max={100} onChange={this.changeBanLatestTime} />
				           	<Select defaultValue="小时" style={{ width: 65 }} onChange={this.changeBanDurationType}>
						      <Option value="小时">小时</Option>
						      <Option value="天">天</Option>
						      <Option value="月">月</Option>
						      <Option value="年">年</Option>
						    </Select>
						    

						    <div className="ban-info">
						    	<p><span>被禁言用户:</span>{this.state.baned_user || ''}</p>
						    	<p><span>禁言时长:</span>{this.state.latestTime || '0'}  {this.state.durationType}</p>
						    	<p><span>预计解禁时间:</span>{moment(endTime).format('YYYY-MM-DD HH:mm:ss')}</p>
						    </div>
				        </Modal>
					</ul>
				</div>
				<p>当前直播间禁言用户</p>
				<div className="current-room-ban-list">
					<ul>
						{
							this.props.banlist.length > 0 ?
							this.props.banlist.map((item,index)=>{
								return(
									<li className="ban-list-item">{item.baned_user}
										<button className="unban-talk" onClick={this.unbanTalk}>解禁</button>
									</li>
								)
							})
							: <p className="no-data">当前无禁言用户</p>
						}
					</ul>
				</div>
			</div>
		)
	}
}