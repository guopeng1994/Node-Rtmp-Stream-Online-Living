import React,{Component } from 'react'
import LoginForm from './LoginForm'
import RegistForm from './RegistForm'

import './FormContainer.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/common/common.actions.js'


@connect((state={}) => {
    return {
        state:state.common
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
}})


export default class Container extends React.Component{
    constructor(props){
        super(props);
    }
    changeToLog = (e) =>{
        this.props.actions.showform("login");
    }
    changeToReg = (e) =>{
        this.props.actions.showform("regist");
    }
    closeFromContainer = (e) =>{
        this.props.actions.showform("close");
    }
    render(){
        return(
            <div className="log-reg">
                <div id="log-reg-container">
                    <div className="log-reg-bg-head"></div>
                    <div className="log-reg-bg-foot"></div>
                    <div className="log-reg-title">
                        <div className="log-reg-logo"><a href="#" ><img src="/img/logo.png" alt=""/></a></div>
                        <div className={this.props.state.formState.log ? 'log-reg-title-log log-reg-selected':'log-reg-title-log'} onClick={this.changeToLog}>登陆</div>
                        <div className={this.props.state.formState.reg ? 'log-reg-title-reg log-reg-selected':'log-reg-title-reg'} onClick={this.changeToReg}>注册</div>
                        <div className="log-reg-title-close" onClick={this.closeFromContainer}></div>
                    </div>
                    {/*<!--登录注册框-->*/}
                    <div className="log-reg-form-container log-reg-form-log">
                        {this.props.state.formState.log&&<LoginForm />}
                        {this.props.state.formState.reg&&<RegistForm />}
                    </div>

                </div>
                <div className="log-reg-layer"></div>
            </div>
        )
    }
}