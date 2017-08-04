// 修改密码
import React,{Component} from 'react'
import {message} from 'antd'

import './updatePwd.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/user/user.actions.js'

@connect((state={}) => {
    return {
        state:state.user,
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
}})

export default class UpdatePwd extends React.Component{
	constructor(props){
		super(props);
		this.userInfo = this.props.userInfo;
	}
	updatePwd = ()=>{
		message.destroy();
		let oldpwd = this.refs.oldpwd.value;
		let newpwd = this.refs.newpwd.value;
		let renewpwd = this.refs.renewpwd.value;
		if(!oldpwd){
			message.error("请输入原密码!");
			return;
		}
		if(!newpwd){
			message.error("请输入新密码!");
			return;
		}
		if(!renewpwd){
			message.error("请再次输入新密码!");
			return;
		}
		if(newpwd!==renewpwd){
			message.error("两次输入的新密码不相同!请重新输入!");
			return;
		}
		let tel = this.userInfo.user_tel;
		this.props.actions.updatePwd({
			tel:tel,
			oldpwd,oldpwd,
			newpwd:newpwd
		})
	}
	render(){
		return(
			<div className="update-pwd">
				<p><input type="password" maxLength="16" placeholder="请输入原密码" ref='oldpwd'/></p>
				<p><input type="password" maxLength="16" placeholder="请输入6-16位新密码" ref='newpwd'/></p>
				<p><input type="password" maxLength="16" placeholder="重复输入6-16位新密码" ref='renewpwd'/></p>
				<p><button onClick={this.updatePwd}>确认修改</button></p>
			</div>
		)
	}
}