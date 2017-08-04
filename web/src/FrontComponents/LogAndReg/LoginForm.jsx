import React,{Component } from 'react'
import {Icon} from 'antd'
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
export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.errTip={
            telErr:"",
            pwdErr:"",
        }
    }
    userLogin=()=>{
        let tel = this.refs.tel.value;
        let pwd = this.refs.pwd.value;
        if(tel == "")
        {
            this.errTip.telErr="手机号不能为空"
        }
        if(pwd.length <6)
        {
            this.errTip.pwdErr="密码不能小于6位"
        }
        if(this.errTip.telErr || this.errTip.pwdErr)
        {
            this.setState({});
            return;
        }
        this.props.actions.userLogin({
            tel:tel,
            password:pwd
        });
    }
    telChange=()=>{
        this.errTip.telErr = "";
        this.props.actions.setTelErrData();
        this.setState({});
    }
    pwdChange=()=>{
        this.errTip.pwdErr = "";
        this.props.actions.setPwdErrData();
        this.setState({});
    }
    render(){
        let errTip = this.errTip;
        let errData = this.props.state.errData;
        return(
            <form method="post">
                {/*<!--手机号-->*/}
                <div className="form-item form-item-number">
                    {/*<!--表单提示图片-->*/}
                     <Icon type="mobile" />
                    <input type="text" className='login-name' name="form-item-number-value" placeholder="请输入手机号" maxLength="11" ref="tel" onChange={this.telChange}/>
                    <div className="form-item-err form-item-err-number">
                        {errTip.telErr || errData.telErr}
                    </div>
                </div>
                {/*<!--密码-->*/}
                <div className="form-item form-item-pwd">
                    {/*<!--表单提示图片-->*/}
                    <Icon type="lock" />
                    <input type="password" className='login-pwd'  name="form-item-pwd-value" placeholder="请输入密码" maxLength="16" ref="pwd" onChange={this.pwdChange} onKeyUp={(e)=>{(e.keyCode == '13') && this.userLogin()}}/>
                    <div className="form-item-err form-item-err-pwd">
                        {errTip.pwdErr || errData.pwdErr}
                    </div>
                </div>

                <div className="form-item form-item-forget-pwd">
                    <span><a href="/forgetPassword">忘记密码?</a></span>
                </div>
                {/*<!--提交-->*/}
                <div className="form-item form-item-login">
                    <button type="button" className='form-submit-button' onClick={this.userLogin}>登&nbsp;&nbsp;&nbsp;陆</button>
                </div>
            </form>
        )
    }
}