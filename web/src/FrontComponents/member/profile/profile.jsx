import React,{Component} from 'react'
import {message} from 'antd'

import './profile.scss'
import UpdatePwd from '../../updatePwd/updatePwd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../../redux/user/user.actions.js'

@connect((state={}) => {
    return {
        state:state.user,
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
}})

export default class Profile extends React.Component{
	constructor(props){
		super(props);
        this.userInfo = this.props.userInfo;
        this.state={
        	showButton:false,
        	showAvatar:false,
        	showNickname:false,
        	showEmail:false,
        	showPwd:false
        }
	}
	selectChangeList = ()=>{
		this.setState({
			showButton:true
		})
	}
	showAvatar=()=>{
		this.setState({
			showAvatar:true,
        	showNickname:false,
        	showEmail:false,
        	showPwd:false
		})
	}
	showNickname=()=>{
		this.setState({
			showAvatar:false,
        	showNickname:true,
        	showEmail:false,
        	showPwd:false
		})
	}
	showEmail=()=>{
		this.setState({
			showAvatar:false,
        	showNickname:false,
        	showEmail:true,
        	showPwd:false
		})
	}
	showPwd=()=>{
		this.setState({
			showAvatar:false,
        	showNickname:false,
        	showEmail:false,
        	showPwd:true
		})
	}
	changePic = (e)=>{
		let file = e.currentTarget.files[0];
		let filetype = file.type;
		if(!filetype.match("image")){
			message.error("只能选择图片!");
			return;
		}
		if(file.size/1000 > 500)//超过500kb
		{
			message.error("所选图片不得超过500kb，请重新选择!");
			return;
		}
		let reader = new FileReader();
		let img = e.target.parentNode.parentNode.childNodes[1].childNodes[1];
		reader.onload = (event)=> {//成功读取
			img.src = event.target.result;//设置图片 data:image....
			this.setState({
				avatar:event.target.result
			});
		}
		reader.readAsDataURL(file);
	}
	updateAvatar=()=>{
		message.destroy();
		let tel = this.userInfo.user_tel;
		let avatar = this.state.avatar || ''
		if(!avatar)
		{
			message.error("请选择图片!");
			return;
		}
		this.props.actions.updateAvatar({
			tel:tel,
			avatar:avatar
		});
		this.setState({});
	}
	updateNickname=(e)=>{
		message.destroy();
		let tel = this.userInfo.user_tel;
		let nickName = e.target.parentNode.parentNode.childNodes[0].childNodes[1].value || ''
		if(!nickName)
		{
			message.error("请输入1-10位昵称名!");
			return;
		}
		this.props.actions.updateNickname({
			tel:tel,
			nickName:nickName
		});
		this.setState({});
	}
	updateEmail=(e)=>{
		message.destroy();
		let tel = this.userInfo.user_tel;
		let email = e.target.parentNode.parentNode.childNodes[0].childNodes[1].value || ''
		if(!email)
		{
			message.error("请输入1-10位昵称名!");
			return;
		}
		if(!new RegExp(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/).test(email)){
			message.error("邮箱格式不正确！请重新填写！");
			return;
		}
		this.props.actions.updateEmail({
			tel:tel,
			email:email
		});
		this.setState({});
	}
	render(){
		return(
			<div className="profiles">
				<div className="profile">
					<div className="profile-infos">
						<img src={this.userInfo.user_avatar} className="profile-avatar"/>
						<div className="profile-text">
							<p>{this.userInfo.user_nickname}</p>
							<p><label>绑定邮箱：</label>{this.userInfo.user_email}</p>
							<p><label>我的财富：</label>
								<span title="金币"><img src="img/gold.png" />{this.userInfo.user_money_gold}</span>
								<span title="银币"><img src="img/silver.png"  />{this.userInfo.user_money_silver}</span>
							</p>
						</div>
					</div>
					<div className="update-profile-action">
						<button onClick={this.selectChangeList}>修改个人资料</button>
					</div>
				</div>
				{
					this.state.showButton
					 &&
					<div className="change-list">
						<button onClick={this.showAvatar}>修改头像</button>
						<button onClick={this.showNickname}>修改昵称</button>
						<button onClick={this.showEmail}>修改绑定邮箱</button>
						<button onClick={this.showPwd}>修改密码</button>
					</div>
				}
				{
					this.state.showAvatar
					 &&
					 <div className='updateAvatar'>
					 	<p><label>新头像</label><input type='file' name='newAvatar' onChange={this.changePic}/></p>
					 	<p><label>预览</label><img className='preview' src=''/></p>
					 	<p><button onClick={this.updateAvatar}>确定上传头像</button></p>
					 </div>
				}
				{
					this.state.showNickname
					 &&
					 <div className='updateNickname'>
					 	<p><label>昵称</label><input type='text' placeholder="请输入1-10位的昵称" maxLength='10'/></p>
					 	<p><button onClick={this.updateNickname}>确定修改</button></p>
					 </div>
				}
				{
					this.state.showEmail
					 &&
					<div className='updateEmail'>
						<p><label>邮箱地址</label><input type='text' placeholder="请输入1-50位邮箱地址" maxLength='50'/></p>
					 	<p><button onClick={this.updateEmail}>确定修改</button></p>
					</div>
				}
				{
					this.state.showPwd
					 &&
					<UpdatePwd userInfo={this.userInfo}/>
				}
			</div>
		)
	}
}