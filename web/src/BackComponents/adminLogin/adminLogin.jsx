import React,{Component} from 'react'
import {Input,Icon,Button} from 'antd'
import './adminLogin.scss'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../redux/user/user.actions.js'

@connect((state={})=>{
	return {
		state:state.user
	}
},(dispatch)=>{
	return {
		actions:bindActionCreators(actions,dispatch)
	}
})

export default class AdminLogin extends React.Component{
	constructor(props){
		super(props);
	}
	handleLogin=()=>{
		let name = this.refs.adminname.refs.input.value;
		let pwd = this.refs.adminpwd.refs.input.value;
		//校验
		if(name=="" || pwd=="")
		{
			let errmsg = "用户名或密码不能为空";
			this.props.actions.adminLogValidate(errmsg);
			return ;
		}

		let param = {
			name : name,
			pwd : pwd
		}
		this.props.actions.adminlogin(param);
	}
	handleChange=()=>{
		let errmsg = "";
		this.props.actions.adminLogValidate(errmsg);
	}
	render(){
		let adminLoginData = this.props.state.adminLoginData;
		let errmsg = adminLoginData.msg || "";
		if(adminLoginData.errcode && adminLoginData.errcode ==1){
			setTimeout(function () {
				window.location.href="/manage";
			},500);
			errmsg = errmsg + "即将自动跳转..."
		}
		return(
			<div className="admin-login">
				<div className="top"></div>
				<div className="bottom"></div>
				<div className="content">
					<div className="header">
						<span className="line line-left"></span>
						<span className="title">直播网站后台管理中心</span>
						<span className="line line-right"></span>
					</div>
					<div className="form">
						<Input type="text" placeholder="请输入用户名" prefix={<Icon type="user" />} ref="adminname" maxLength="10" onChange={this.handleChange}/>
						<Input type="password" placeholder="请输入密码" prefix={<Icon type="lock" />} ref="adminpwd" maxLength="16" onChange={this.handleChange} onKeyUp={(e)=>{(e.keyCode == '13') && this.handleLogin()}}/>
						<div className="errmsg">{errmsg}</div>
						<Button type="primary" onClick={this.handleLogin}>登录</Button>
					</div>
				</div>
			</div>
		)
	}
}