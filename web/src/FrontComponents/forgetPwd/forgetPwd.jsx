import React , {Component} from 'react'
import { Steps, Button, message } from 'antd';
const Step = Steps.Step;

import './forgetPwd.scss'
import HeaderNav from '../index/Header/HeaderNav'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/user/user.actions.js'

@connect((state={}) => {
    return {
        state:state.user
    };
}, (dispatch) => {
    return{
     actions:bindActionCreators(actions,dispatch),
}})


export default class ForgetPwd extends React.Component{
	constructor(props){
		super(props);
		this.state = {
	      current: 0,
	      checkTel:{},
	      checkEmail:{},
	      checkCaptcha:{},
	      time:60
	    };
	}
	next() {
	    const current = this.state.current + 1;
	    if(current == 2){
	    	let email = this.state.checkEmail.value;
	    	let tel = this.state.checkTel.value;
	    	this.props.actions.postEmailCaptcha({//发送邮件验证码
	    		tel:tel,
				email:email
			});
	    }

	    if(current == 3){//生成新密码
	    	let tel = this.state.checkTel.value;
	    	this.props.actions.fgNewPwd({//发送邮件验证码
	    		tel:tel
			});
	    }
	    this.setState({ current });
	    this.props.actions.reSetPwdValidate();
	}
	prev() {
	    const current = this.state.current - 1;
	    this.setState({ current });
	}
	checkTel=(e)=>{
		message.destroy();
		let tel = this.refs.tel.value;
		if(!new RegExp(/0?(13|14|15|18)[0-9]{9}/).test(tel)){
			 this.refs.tel.style.borderColor='#ff4500';
			 message.error("格式不正确！请重新填写！");
			this.setState({
				checkTel:{
					value:tel,
				}
			})
			return;
		}
		this.props.actions.isUserExist({
			tel:tel
		});
		this.setState({});
	}
	changeTel=(e)=>{
		e.target.style.borderColor='#ddd';
		let tel = e.target.value;
		this.setState({
			checkTel:{
				value:tel,
			}
		})
	}
	checkEmail=(e)=>{
		message.destroy();
		let email = this.refs.email.value;
		if(!new RegExp(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/).test(email)){
			 this.refs.email.style.borderColor='#ff4500';
			 message.error("邮箱格式不正确！请重新填写！");
			this.setState({
				checkEmail:{
					value:email,
				}
			})
			return;
		}
		let tel = this.state.checkTel.value;
		this.props.actions.isEmailMatch({//查看用户绑定的邮箱是否正确
			tel:tel,
			email:email
		});
		this.setState({});
	}
	changeEmail=(e)=>{
		e.target.style.borderColor='#ddd';
		let email = e.target.value;
		this.setState({
			checkEmail:{
				value:email,
			}
		})
	}
	checkCaptcha=(e)=>{
		message.destroy();
		let captcha = this.refs.captcha.value;
		let tel = this.state.checkTel.value;
		let email = this.state.checkEmail.value;
		if(!captcha){
			 this.refs.captcha.style.borderColor='#ff4500';
			 message.error("验证码不能为空！");
			this.setState({
				checkCaptcha:{
					value:captcha,
				}
			})
			return;
		}
		//let captcha = this.state.checkCaptcha.value;
		this.props.actions.checkCaptcha({//查看验证码是否正确
			tel:tel,
			email:email,
			captcha:captcha
		});
		this.setState({});
	}
	changeCaptcha=(e)=>{
		e.target.style.borderColor='#ddd';
		let captcha = e.target.value;
		this.setState({
			checkCaptcha:{
				value:captcha,
			}
		})
	}
	getEmailCaptcha=(e)=>{
		this.countDown();
		let email = this.state.checkEmail.value;
    	let tel = this.state.checkTel.value;
    	this.props.actions.postEmailCaptcha({
    		tel:tel,
			email:email
		});
	}
	countDown=()=>{
		let timer = setInterval(()=>{
			let time = this.state.time
			if(time <=0)
			{
				this.setState({
					time:60
				})
				clearInterval(timer);
				return;
			}
			this.setState({
				time:time-1
			})
		},1000)
	}
	render(){
		const { current } = this.state;
		const steps = [{
		  title: '第一步：填写账号',
		  content: <div className="step-current-dom">
				  <label>账号(手机号):</label>
				  <input type="text" maxLength="11" placeholder="请填写需要找回的登录账号" value={this.state.checkTel.value || ''} onChange={this.changeTel} ref='tel'/>
				  <Button type='primary' onClick={this.checkTel}>确定</Button>
				  </div>,
		  description:"填写登录时用的账号（手机号）"
		}, {
		  title: '第二步：填写邮箱',
		  content: <div className="step-current-dom">
		  			<label>邮箱:</label>
		  			<input type="text" maxLength="30" placeholder="请填写绑定的邮箱账号" value={this.state.checkEmail.value || ''} onChange={this.changeEmail} ref="email"/>
		  			<Button type='primary' onClick={this.checkEmail}>确定</Button>
		  			</div>,
		  description:"填写与账号绑定的邮箱"
		}, {
		  title: '第三步：输入验证码',
		  content: <div className="step-current-dom">
		  			<p>验证码已经发送到邮箱<span>{this.state.checkEmail.value}</span></p>
		  			<label>验证码:</label>
		  			<input type="text" maxLength="6" placeholder="请查看邮箱并填写验证码" value={this.state.checkCaptcha.value || ''} onChange={this.changeCaptcha}  ref="captcha"/>
		  			 <Button onClick={this.getEmailCaptcha} disabled={this.state.time < 60 ? true :false}>{this.state.time < 60 ? this.state.time+"s后重新获取" : "重新获取"}</Button>
		  			 <Button onClick={this.checkCaptcha}>确定</Button>
		  			</div>,
		  description:"登录邮箱查看验证码后，并填写"
		},{
		  title: '第四步：完成！获取新密码',
		  content: <div className="step-current-dom">
		  				<label className='newpwd'>您的新密码为:<span>{this.props.state.newpwd}</span>，</label>
		  				<label>请及时修改密码</label>
		  			</div>,
		}];
		return(
			<div className='forget-pwd'>
				<HeaderNav />
				<p><span className="title">找回密码</span></p>
				<div className="steps">
					<Steps current={current}>
			          {steps.map(item => <Step key={item.title} title={item.title} description={item.description}/>)}
			        </Steps>
			        <div className="steps-content">{steps[this.state.current].content}</div>
			        {
			        	this.props.state.forgetPwdValidateData == 'yes' 

			        	?

			        	<div className="steps-action">
				          {
				            this.state.current < steps.length - 1
				            &&
				            <Button type="primary" onClick={() => this.next()}>下一步</Button>
				          }
				          {
				            this.state.current === steps.length - 1
				            &&
				            <Button type="primary" onClick={() => message.success('Processing complete!')}>完成</Button>
				          }
				          {
				            this.state.current > 0
				            &&
				            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
				              上一步
				            </Button>
				          }
				        </div>

				        :

				        ''
			        }
		        </div>
			</div>
		)
	}
}