//首页顶部导航


import React ,{ Component } from 'react'
import {Dropdown,Menu,Icon} from 'antd'
import './HeaderNav.scss'

import FormContainer from '../../LogAndReg/FormContainer'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../../redux/user/user.actions.js'
import * as commonActions from '../../../redux/common/common.actions.js'

@connect((state={}) => {
    return {
        state:state.user,
        commonState:state.common
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
     commonActions:bindActionCreators(commonActions,dispatch),
}})

export default class HeaderNav extends React.Component{
    constructor(props){
        super(props);
        let userInfo;
        let arrCookie = document.cookie.split(';') || [];
        for(let i in arrCookie){
            var arr = arrCookie[i].trim().split("=");
            if (arr[0] == "userinfo") {
                if (arr.length > 1)
                    userInfo = arr[1];
                else
                    userInfo = null;
            }
        }
        if(userInfo)
            this.userInfo = JSON.parse(decodeURIComponent(userInfo).substring(2));
        else
            this.userInfo = userInfo
    }
    doLogin = (e)=>{
        this.props.commonActions.showform("login");
    }
    doRegist = (e) =>{
        this.props.commonActions.showform("regist");
    }
    getDom=()=>{
        let logRegDom = (
            <div className="header-log-reg">
                <span className="header-log sidebar-log-common" onClick={this.doLogin}><a href="#">登录</a></span>|
                <span className="header-reg " onClick={this.doRegist}><a href="#">注册</a></span>
            </div>
        );
        if(!this.userInfo){
            return logRegDom;
        }else{
            const menu = (
                <Menu onClick={this.userMenuClick}>
                    <Menu.Item key="1">个人中心</Menu.Item>
                    <Menu.Item key="2">退出登录</Menu.Item>
                </Menu>
            )
            let userinfoDom = (
                <div className="header-userinfo">
                    <span>欢迎您,</span>
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="#">
                           <img src={this.userInfo.user_avatar} />{this.userInfo.user_nickname}
                        </a>
                    </Dropdown>
                </div>
            );
            return userinfoDom;
        }
    }
    userMenuClick=({key})=>{
        if(key == "1")
        {
            window.location.href="/member";
        }
        else if(key == "2")
        {
            this.props.actions.userLogout();            
        }
    }
    render(){
        return(
            <div className="header-nav-container">
                <div className="header-top-nav">
                    <a href="#" className="header-top-logo"><img src="/img/logo.png" className="header-top-logo-ico"/></a>
                    <ul id="header-nav-ul">
                        <div className="li-item-selected"></div>
                        <li><a href="/index"  className="header-top-nav-index">首页</a></li>
                        <li><a href="/all" target="_blank">全部</a></li>
                        <li><a href="/classes" target="_blank">分类</a></li>
                        <li><a href="/admin" target="_blank">后台</a></li>
                    </ul>
                    <div className="header-top-nav-parts-right">
                        {/*
                        <div className="search-container">
                            <input type="text" placeholder="搜直播间/主播/用户" maxLength="20" className="search-content"/>
                            <div className="search-icon">
                                <Icon type="search" />
                            </div>
                        </div>
                        */}
                        {this.getDom()}

                    </div>
                    {this.props.commonState.formContainerState&&<FormContainer />}
                </div>
            </div>
        )
    }
}