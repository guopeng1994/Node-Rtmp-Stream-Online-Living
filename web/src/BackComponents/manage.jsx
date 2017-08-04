
import React,{ Component} from 'react'
import ReactDOM,{render} from 'react-dom'
import { Layout,Menu,Breadcrumb,Icon,Dropdown } from 'antd'
const { SubMenu } = Menu;
const { Header,Content,Sider,Footer } = Layout;
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../redux/user/user.actions.js'
import './manage.scss'


import UserManage from './userManage/userManage.jsx'
import ApplyManage from './applyManage/applyManage.jsx'
import DanmuManage from './danmuManage/danmuManage.jsx'
import RoomManage from './roomManage/roomManage.jsx'
import GiftManage from './giftManage/giftManage.jsx'
import ChannelManage1 from './channelManage/channel_lv1.jsx'
import ChannelManage2 from './channelManage/channel_lv2.jsx'
import ServerInfo from './serverInfo/serverInfo.jsx'

@connect((state = {})=>{
    return {
        state : state.user
    }
},(dispatch)=>{
    return {
        actions : bindActionCreators(actions,dispatch)
    }
})


export default class ManageIndex extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            height:window.innerHeight, //页面的
            contentComponent:{
                "compo":<ServerInfo />,
                "parent":"服务器信息",
                "child":""
            },
        };
        let cookieInfo;
        let arrCookie = document.cookie.split(';') || [];
        for(let i in arrCookie){
            var arr = arrCookie[i].trim().split("=");
            if (arr[0] == "adminlogin") {
                if (arr.length > 1)
                    cookieInfo = arr[1];
                else
                    cookieInfo = null;
            }
        }
        if(cookieInfo)
            this.cookieInfo = JSON.parse(decodeURIComponent(cookieInfo).substring(2));
        else//未登录
            window.location.href="/admin";

    }
    handleClick=(item)=>{
        const contentDom = {
            "0":{
                "compo":<UserManage />,
                "parent":"用户管理",
                "child":"用户管理"
            },
            "2":{
                "compo":<ApplyManage />,
                "parent":"用户管理",
                "child":"主播申请管理"
            },
            "3":{
                "compo":<DanmuManage />,
                "parent":"弹幕管理",
                "child":""
            },
            "4":{
                "compo":<RoomManage />,
                "parent":"直播间管理",
                "child":""
            },
            "5":{
                "compo":<GiftManage />,
                "parent":"礼物管理",
                "child":""
            },
            "6":{
                "compo":<ChannelManage1 />,
                "parent":"频道管理",
                "child":"一级分类"
            },
            "7":{
                "compo":<ChannelManage2 />,
                "parent":"频道管理",
                "child":"二级分类"
            },
            "8":{
                "compo":<ServerInfo />,
                "parent":"服务器信息",
                "child":""
            },
        };
        for(let i in contentDom)
        {
            if(i == item.key)
                this.setState({
                    contentComponent:contentDom[i]
                }); 
        }
    }
    logout=(e)=>{
        e.preventDefault();
        console.log(this);
        this.props.actions.adminlogout();

    }
    render(){
        const adminMenu = (
        <Menu>
            <Menu.Item>
              <a onClick={this.logout}>注销</a>
            </Menu.Item>
        </Menu>
        )

        return(
                <Layout>
                    <Header className="header">
                    <span className="logo"><img src='/img/logo.png'/></span>
                        <Dropdown overlay={adminMenu} className="admininfo">
                            <a className="ant-dropdown-link" href="#">
                              {this.cookieInfo.name}<Icon type="down" />
                            </a>
                        </Dropdown>
                    </Header>
                    <Layout style={{minHeight:this.state.height - 65}}>
                        <Sider>
                            <Menu theme="dark" mode="inline" style={{ lineHeight: '64px' }} onClick={this.handleClick}>
                                <SubMenu key="sub1" title={<span><Icon type="user"/>用户角色管理</span>}>
                                    <Menu.Item key="0">用户管理</Menu.Item>
                                    {/*<Menu.Item key="1">角色权限</Menu.Item>*/}
                                    <Menu.Item key="2">主播申请管理</Menu.Item>
                                </SubMenu>
                                <Menu.Item key="3" ><span><Icon type="laptop" /></span>弹幕管理</Menu.Item>
                                <Menu.Item key="4" ><span><Icon type="home" /></span>直播间管理</Menu.Item>
                                <Menu.Item key="5" ><span><Icon type="star" /></span>礼物管理</Menu.Item>
                                <SubMenu key="sub2" title={<span><Icon type="appstore" />频道管理</span>}>
                                    <Menu.Item key="6">一级分类</Menu.Item>
                                    <Menu.Item key="7">二级分类</Menu.Item>
                                </SubMenu>
                                <Menu.Item key="8" ><span><Icon type="pushpin" /></span>服务器信息</Menu.Item>
                            </Menu>
                        </Sider>
                        <Content style={{ padding: '0 10px' }}>
                            <Breadcrumb style={{ margin: '12px 0' }}>
                                <Breadcrumb.Item>菜单</Breadcrumb.Item>
                                <Breadcrumb.Item>{this.state.contentComponent.parent}</Breadcrumb.Item>
                                {this.state.contentComponent.child ? <Breadcrumb.Item>{this.state.contentComponent.child}</Breadcrumb.Item> : ""}
                            </Breadcrumb>
                            <div style={{minHeight:500}}>
                                {this.state.contentComponent.compo}
                            </div>
                            <Footer style={{ textAlign: 'center' }}>
                                copyright @guopeng 2017
                            </Footer>
                        </Content>
                    </Layout>
                </Layout>
        );
    }
}
