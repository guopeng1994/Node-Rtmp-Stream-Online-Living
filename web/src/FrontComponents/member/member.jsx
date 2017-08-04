import React,{Component} from 'react'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;


import HeaderNav from '../index/Header/HeaderNav'
import './member.scss'


import Profile from './profile/profile'
import ApplyAnchor from './applyAnchor/applyAnchor'
import RoomManager from './roomManager/roomManager'
import MyFocus from './myFocus/myFocus'
import GiftStatistic from './giftStatistic/giftStatistic'
import BlackList from './blackList/blackList'



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

export default class Member extends React.Component{
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
            this.userInfo = userInfo || {};
	    this.state = {
            contentComponent:{
                "compo":<Profile userInfo={this.userInfo}/>
            }
        };
        let userName = this.userInfo.user_nickname || '';
        this.props.actions.queryApplyState({
            userName:userName
        });
	}
	switchMenu=(item)=>{
		 const contentDom = {
            "0":{
                "compo":<Profile userInfo={this.userInfo}/>
            },
            "1":{
                "compo":<MyFocus userInfo={this.userInfo}/>
            },
            "2":{
                "compo":<RoomManager userInfo={this.userInfo}/>
            },
            "3":{
                "compo":<GiftStatistic userInfo={this.userInfo}/>
            },
            "4":{
                "compo":<ApplyAnchor userInfo={this.userInfo} applyStatus={this.applyStatus}/>
            },
            "5":{
                "compo":<BlackList userInfo={this.userInfo}/>
            }
        };
        for(let i in contentDom){
        	if(i == item.key)
        	{
        		this.setState({
        			contentComponent:contentDom[i]
        		});
        		return;
        	}
        }
	}
	render(){
        this.applyStatus = this.props.state.applyStatus;
		return(
			<div className="member">
				<HeaderNav />
                {
                    !this.userInfo.user_id
                     ?
                    <div className="please-login">
                        <p>
                        <img src='img/sorry-bule.png'/>
                        <span>请先登录</span>
                        </p>
                    </div>
                    :
                    <div className="member-infos">
                        <div className="member-header">
                            <div className="member-title">
                                个人中心
                            </div>
                            <div className="member-header-fill"></div>
                        </div>
                        <Layout style={{ background: '#fff' }}>
                                <Sider width={160} style={{ background: '#fff' }}>
                                    <Menu
                                      onClick={this.switchMenu}
                                      style={{ width: 160 }}
                                    >
                                        <Menu.Item key="0"><span><Icon type="tags" /></span>个人资料</Menu.Item>
                                        <Menu.Item key="1"><span><Icon type="heart" /></span>我的关注</Menu.Item>
                                        {this.userInfo.anch_live_url &&<Menu.Item key="2"><span><Icon type="home" /></span>房管设置</Menu.Item>}
                                        <Menu.Item key="3"><span><Icon type="gift" /></span>我的礼物</Menu.Item>
                                        <Menu.Item key="5"><span><Icon type="dislike-o" /></span>直播间黑名单</Menu.Item>
                                    </Menu>
                                    <div className="be-anchor" onClick={()=>this.switchMenu({key:"4"})}>
                                        {this.props.state.applyStatus == 2 ? "开启直播" : "成为主播"}
                                    </div>
                                </Sider>
                                <Content style={{padding:20}}>
                                    {
                                      this.state.contentComponent.compo 
                                    }
                                </Content>
                        </Layout>
                    </div>
                }

                
			</div>
		)
	}
}