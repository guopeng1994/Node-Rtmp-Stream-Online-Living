import React,{Component } from 'react'
import {Icon} from "antd"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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


export default class Regist extends React.Component{
    constructor(props){
        super(props);
        this.errTip={
            telErr:"",
            pwdErr:"",
            repwdErr:"",
            emailErr:""
        }
    }
    userRegist=()=>{
        let registData = {};
        let tel = this.refs.tel.value;
        let pwd = this.refs.pwd.value;
        let repwd = this.refs.repwd.value;
        let email = this.refs.email.value;
        registData.tel = tel;
        registData.password = pwd;
        registData.repassword = repwd;
        registData.email = email;
        let telErr = false;
        let pwdErr = false;
        let repwdErr = false;
        let emailErr = false;
        let telReg = new RegExp(/0?(13|14|15|18)[0-9]{9}/);
        let pwdReg = new RegExp(/\S/);
        let emailReg = new RegExp(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/);
        
        if(pwd != repwd){
            repwdErr = true;
            this.errTip.repwdErr="两次输入的密码不一致"
        }

        if(!telReg.test(tel)){
            telErr = true;
            this.errTip.telErr="手机号格式错误"
        }
        if(!pwdReg.test(pwd)){
            pwdErr = true;
            this.errTip.pwdErr="密码不得包含空白字符"
        }
        if(!pwdReg.test(repwd)){
            repwdErr = true;
            this.errTip.repwdErr="重复密码不得包含空白字符"
        }
        if(!emailReg.test(email)){
            emailErr = true;
            this.errTip.emailErr="邮箱格式不正确"
        }
        
        if(tel == "")
        {
            telErr = true;
            this.errTip.telErr="手机号不能为空"
        }
        if(pwd.length <6)
        {
            pwdErr = true;
            this.errTip.pwdErr="密码不能小于6位"
        }
        if(repwd.length <6)
        {
            repwdErr = true;
            this.errTip.repwdErr="重复密码不能小于6位"
        }
        if(email == "")
        {
            emailErr = true;
            this.errTip.emailErr="邮箱不能为空"
        }
        if(telErr || pwdErr || repwdErr || emailErr){
            this.setState({});
            return;
        }
        this.props.actions.userRegist(registData);
    }
    telChange=()=>{
        this.errTip.telErr = "";
        this.props.actions.setTelErrData();//清除错误信息
        this.setState({});
    }
    pwdChange=()=>{
        this.errTip.pwdErr = "";
        this.setState({});
    }
    repwdChange=()=>{
        this.errTip.repwdErr = "";
        this.setState({});
    }
    emailChange=()=>{
        this.errTip.emailErr = "";
        this.setState({});
    }
    render(){
        let errTip = this.errTip;
        let errData = this.props.state.errData;
        return(
            <form method="post" id="regist">
                {/*<!--手机号-->*/}
                <div className="form-item form-item-number">
                    <Icon type="mobile" />
                    <input type="text"  placeholder="请输入手机号" maxLength="11" ref="tel" onChange={this.telChange}/>
                    <div className="form-item-err form-item-err-number">
                        {errTip.telErr || errData}
                    </div>
                </div>
                {/*<!--验证码-->*/}
                {/*<div className="form-item form-item-captcha">
                    <Icon type="message" />
                    <input type="text"  placeholder="请输入验证码" maxLength="6"/>
                    <button onClick={this.refreshCaptcha}>{"1234"}</button>
                    <div className="form-item-err form-item-err-captcha">
                        验证码不能为空
                    </div>
                </div>
                */}
                {/*<!--密码-->*/}
                <div className="form-item form-item-pwd">
                    <Icon type="lock" />
                    <input type="password"  placeholder="请输入6-16位密码,不得包含空格" maxLength="16" ref="pwd" onChange={this.pwdChange}/>
                    <div className="form-item-err form-item-err-pwd">
                        {errTip.pwdErr}
                    </div>
                </div>
                {/*<!--重复密码-->*/}
                <div className="form-item form-item-pwd-repeat">
                    <Icon type="lock" />
                    <input type="password"  placeholder="请再次输入密码" maxLength="16" ref="repwd" onChange={this.repwdChange}/>
                    <div className="form-item-err form-item-err-pwd-repeat">
                        {errTip.repwdErr}
                    </div>
                </div>
                {/*<!--邮箱-->*/}
                <div className="form-item form-item-pwd">
                    {/*<!--表单提示图片-->*/}
                    <Icon type="mail" />
                    <input type="text" placeholder="请输入您的邮箱" maxLength="35" ref="email" onChange={this.emailChange} onKeyUp={(e)=>{(e.keyCode == '13') && this.userRegist()}}/>
                    <div className="form-item-err form-item-err-email">
                        {errTip.emailErr}
                    </div>
                </div>
                {/*<!--提交-->*/}
                <div className="form-item form-item-regist">
                    <button type="button" className='form-submit-button' onClick={this.userRegist}>注&nbsp;&nbsp;&nbsp;册</button>
                </div>
            </form>
        )
    }
}