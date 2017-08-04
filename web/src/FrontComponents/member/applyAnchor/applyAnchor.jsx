import React,{Component} from 'react'
import {message,Cascader} from 'antd'
import './applyAnchor.scss'

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

export default class ApplyAnchor extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			channelValue:[]
		}
		this.props.actions.queryAnchorLiveInfo({
			userName:this.props.userInfo.user_nickname
		});
		this.props.actions.getChannelsData();
	}
	changeImg=(e,str)=>{
		let file = e.currentTarget.files[0];
		let filetype = file.type;
		if(file.size/1000 > 500)//超过500kb
		{
			message.error("所选图片不得超过500k，请重新选择!");
			return;
		}
		let reader = new FileReader();
		let img = e.target.parentNode.childNodes[1].childNodes[0];
		reader.onload = (event)=> {//成功读取
			img.src = event.target.result;//设置图片 data:image....
			if(str == "frontImg")
				this.setState({
					frontImg:img.src
				});
			else if(str == "backImg")
				this.setState({
					backImg:img.src
				});
			else if(str == "handleImg")
				this.setState({
					handleImg:img.src
				});
		}
		reader.readAsDataURL(file);
		
	}
	applyAnchor=()=>{
		message.destroy();
		let userName = this.props.userInfo.user_nickname;
		let realName = this.refs.realName.value;
		let cardNumber = this.refs.cardNumber.value;
		let frontImg = this.state.frontImg;
		let backImg = this.state.backImg;
		let handleImg = this.state.handleImg;
		let isAgree = this.refs.isAgree.checked;
		if(realName == '')
		{
			message.error("请填写真实姓名!");
			return;
		}
		if(cardNumber == '')
		{
			message.error("请填写身份证号!");
			return;
		}
		if(frontImg == '')
		{
			message.error("请上传身份证正面照片!");
			return;
		}
		if(backImg == '')
		{
			message.error("请上传身份证反面照片!");
			return;
		}
		if(handleImg == '')
		{
			message.error("请上传手持身份证正面照片!");
			return;
		}
		if(isAgree == false)
		{
			message.error("请勾选同意协议!");
			return;
		}
		if(!new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/).test(cardNumber))
		{
			message.error("身份证号格式错误!");
			return;
		}
		this.props.actions.applyAnchor({
			userName:userName,
			realName:realName,
			cardNumber:cardNumber,
			frontImg:frontImg,
			backImg:backImg,
			handleImg:handleImg
		});
	}
	saveLiveInfo=()=>{
		message.destroy();
		let roomName = this.refs.roomName.value;
		let liveUrl = this.refs.liveUrl.value.toLowerCase();
		let channel = this.state.channelValue[1];//只需要二级频道
		let liveNotice = this.refs.liveNotice.value;
		let userName = this.props.userInfo.user_nickname;
		let userID = this.props.userInfo.user_id;//生成初始化缩略图需要
		if(roomName == "")
		{
			message.error("请填写直播间标题!");
			return;
		}
		if(liveUrl == "")
		{
			message.error("请填写直播URL后缀!");
			return;
		}
		if(!channel)//不存在
		{
			message.error("请选择直播的频道!");
			return;
		}
		if(new RegExp(/[^a-z0-9]/).test(liveUrl)){
			message.error("直播URL只能为数字、字母或数字字母的组合");
			return;
		}

		this.props.actions.saveLiveInfo({
			roomName:roomName,
			liveUrl:liveUrl,
			channel:channel,
			liveNotice:liveNotice,
			userName:userName,
			userID:userID
		});
	}
	changeChannel=(value,selectedOptions)=>{
		this.setState({
			channelValue:value
		})
	}
	getDom=(applyStatus)=>{
		const chans_data = this.props.state.channelRelationData;
		this.props.state.liveInfoData = this.props.state.liveInfoData || '';
		let applyDom = (
			<div className="apply-form">
				{applyStatus == -1 ? <h5>抱歉！您的上次申请没有通过审核！</h5> : ""}
				<p className="real-name">
					<span><label>*</label>真实姓名：</span>
					<div>
						<input type="text" maxLength="4" placeholder="请输入真实姓名" className="input-text" ref="realName"/>
					</div>
				</p>
				<p className="card-number">
					<span><label>*</label>身份证号：</span>
					<div>
						<input type="text" maxLength="18" placeholder="请输入18位身份证号码" className="input-text" ref="cardNumber"/>
					</div>
				</p>
				<p className="front-card">
					<span><label>*</label>身份证正面照：</span>
					<div>
						<input type="file"  className="input-file" accept="image/jpeg,image/jpg,image/png" ref="frontImg" onChange={(e)=>this.changeImg(e,"frontImg")}/>
						<div className="file-reader"><img src="img/upload.png"/></div>
					</div>
				</p>
				<p className="back-card">
					<span><label>*</label>身份证反面照：</span>
					<div>
						<input type="file" className="input-file" accept="image/jpeg,image/jpg,image/png" ref="backImg" onChange={(e)=>this.changeImg(e,"backImg")}/>
						<div className="file-reader"><img src="img/upload.png"/></div>
					</div>
				</p>
				<p className="handle-card">
					<span><label>*</label>手持身份证正面照：</span>
					<div>
						<input type="file" className="input-file" accept="image/jpeg,image/jpg,image/png" ref="handleImg" onChange={(e)=>this.changeImg(e,"handleImg")}/>
						<div className="file-reader"><img src="img/upload.png"/></div>
					</div>
				</p>
				<p className="rules">
					<div><input type="checkbox" ref="isAgree"/> 我同意<a>相关主播协议及条款</a></div>
				</p>
				<button onClick={this.applyAnchor}>确认申请</button>
			</div>//申请表单
		);
		let applyingDom = (//申请中
			<div>
				<div className="applying-info">
					<img src="img/sorry.png"/>
					<p>您的申请正在处理中，请耐心等候...</p>
				</div>
			</div>
		);
		let anchorDom = (//主播开播表单
			<div>
				<div className="start-live">
					<p>
						<span><label>*</label>直播间标题：</span>
						<div>
							<input type="text" maxLength="20" placeholder={this.props.state.liveInfoData.anch_live_room_name || "请输入直播间的标题(房间名)"} ref="roomName" />
						</div>
					</p>
					<p>
						<span><label>*</label>直播URL后缀：</span>
						<div>
							<input type="text" maxLength="20" placeholder={this.props.state.liveInfoData.anch_live_room_name ? this.props.state.liveInfoData.anch_live_url || "20位数字、字母或组合的后缀名(不区分大小写)" : "20位数字、字母或组合的后缀名(不区分大小写)" } ref="liveUrl" />
						</div>
					</p>
					<p>
						<span><label>*</label>直播分类：</span>
						<div>
							<Cascader options={chans_data} allowClear={false} placeholder={this.props.state.liveInfoData.chl1_name+"/"+this.props.state.liveInfoData.chl2_name == 'null/null' ? "请选择直播频道" : this.props.state.liveInfoData.chl1_name+"/"+this.props.state.liveInfoData.chl2_name} onChange={this.changeChannel}/>
						</div>
					</p>
					<p>
						<span><label></label>直播公告：</span>
						<div>
							<textarea maxLength="200" rows="10" cols="20" placeholder={this.props.state.liveInfoData.anch_live_notice||"请输入200字内的直播公告"} ref="liveNotice"/>
						</div>
					</p>
					{/*保存直播相关的信息*/}
					<button onClick={this.saveLiveInfo}>确认保存</button>
				</div>
			</div>
		);
		if(this.props.state.applyStatus == 0 || this.props.state.applyStatus == -1){ //未申请0 申请、审核失败-1 申请、审核中1 通过成为主播2
			return applyDom;
	    }else if(this.props.state.applyStatus == 1){
	    	return applyingDom;
	    }else if(this.props.state.applyStatus == 2){
	        return anchorDom;
	    }
	}
	render(){
		return(
			<div className="apply-anchor">
				{this.getDom(this.props.applyStatus)}
			</div>
		)
	}
}