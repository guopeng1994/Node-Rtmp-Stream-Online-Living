import React,{ Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/common/common.actions.js'
import {Icon} from 'antd'

@connect((state={}) => {
	return {
		state:state.common
	};
}, (dispatch) => {
	return{
     actions: bindActionCreators(actions,dispatch),
}})

export default class SideMenuClose extends React.Component{
	constructor(props){
		super(props);
	}
	toggleMenu = (e) =>{
		this.props.actions.sideMenuToggle(true);
	}
	render(){
		return(
			<div id="menu_close">
				<ul>
					<li><a href="/index"><img src="/img/logo.png" className="menu-close-logo"/></a></li>
					<li>
						<a href="/all">
							<Icon type="play-circle" />
							<span>全部</span>
						</a>
					</li>
					<li>
						<a href="/classes">
							<Icon type="appstore-o" />
							<span>分类</span>
						</a>
					</li>
					<li>
						<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=455902861&site=qq&menu=yes">
							<Icon type="customer-service" />
							<span>客服</span>
						</a>
					</li>
				</ul>
				
				{/*<button className="sidebar-log-common">登录</button>*/}
				
				<a className="left-btn" onClick={this.toggleMenu}>
					<span></span>
				</a>
			</div>
		)
	}
}