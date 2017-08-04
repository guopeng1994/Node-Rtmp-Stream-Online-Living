import React,{ Component} from 'react'
import {Icon} from 'antd'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as commonActions from '../../redux/common/common.actions.js'
import * as channelActions from '../../redux/channel/channel.actions.js'

@connect((state={}) => {
	return {
		common:state.common,
		channel:state.channel
	};
}, (dispatch) => {
	return{
     commonActions: bindActionCreators(commonActions,dispatch),
     channelActions: bindActionCreators(channelActions,dispatch),
}})

export default class SideMenuOpen extends React.Component{
	constructor(props){
		super(props);
		// this.state = {
		// 	contentHeight:this.props.height - 280
		// }
		//console.log(this.props.height);
		this.props.channelActions.getAllChannels();
	}
	toggleMenu = (e) =>{
		this.props.commonActions.sideMenuToggle(false);
	}
	getChannels=(channelData)=>{
		return channelData.map((item,index)=>{
			return (
				<div className="sidebar-category">
					<div className="sidebar-category-head">
						<span className="sidebar-category-head-tltle">{item.chl1_name}</span>
					</div>
					<div className="sidebar-category-content">
						<ul className="sidebar-category-content-list clearfix">
							{
								item.children.map((it,i)=>{
									return (<li className="sidebar-category-content-list-item" title={it.value}><a href={"/all/"+it.chl2_id}>{it.value}</a></li>)
								})
							}
						</ul>
					</div>
				</div>
			)
		})
	}
	// handleWindowResize=()=>{
	// 	this.setState({
	// 		contentHeight:this.props.height-280
	// 	})
	// }
	// componentDidMount=()=>{
	// 	window.addEventListener('resize',this.handleWindowResize);
	// }
	// componentWillUnmount=()=>{
	// 	window.removeEventListener('resize',this.handleWindowResize);
	// }
	beAnchor=(userInfo)=>{
		//是否登录
		if(!userInfo.user_id){//没有登录
			//显示登录注册弹出框
			this.props.commonActions.showform("login");
		}else{
			window.location.href='/member'
		}
	}
	getUserinfoDom=(userInfo)=>{
		let loginedDom = (
			<div className="menu-userinfo">
				<img src={userInfo.user_avatar}/>
				<p>{userInfo.user_nickname}</p>
				<p><span>我的金币:</span>{userInfo.user_money_gold}</p>
				<p><span>我的银币:</span>{userInfo.user_money_silver}</p>
			</div>
		);
		let unloginedDom = (
			<div className="menu-userinfo">
				<img src="/img/avatar_normal.png"/>
				<div className="log-reg">
					<span onClick={()=>this.props.commonActions.showform('login')}>登录</span>
					|
					<span onClick={()=>this.props.commonActions.showform('regist')}>注册</span>
				</div>
			</div>
		)
		if(userInfo.user_id){
			return loginedDom;
		}else{
			return unloginedDom;
		}
	}
	render(){
		const channelData = this.props.channel.channelOneData;
		let userInfo = this.props.userInfo || {};
		return(
			<div id="menu_open">
				<div className="menu-open-top">
					<div className="menu-open-search">
						{this.getUserinfoDom(userInfo)}
					</div>
				</div>
					
					
				<div id="contents" style={{height:this.props.height-250+ 'px'}}>
					{this.getChannels(channelData)}
				</div>
				<div id="sidebar-be-anchor">
					<button onClick={()=>this.beAnchor(userInfo)}><img src="/img/camera.png"/>{userInfo.user_id ? "开启直播" : "我要做主播"}</button>
				</div>
				
				<a className="left-btn" onClick={this.toggleMenu}>
					<span></span>
				</a>
			</div>
		)
	}
}