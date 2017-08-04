import React,{Component} from 'react'
import FormContainer from '../LogAndReg/FormContainer'


import HeaderNav from '../index/Header/HeaderNav'
import Footer from '../index/Footer/Footer'
import SideMenu from '../SideMenu/SideMenu'
import RoomInfo from './RoomInfo'
import LiveSource from './LiveSource'
import DanmuContent from './DanmuContent'
import GiftsList from './GiftsList'
import PostDanmu from './PostDanmu'

import './Room.scss'
import * as io from 'socket.io-client'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/common/common.actions.js'
import * as userActions from '../../redux/user/user.actions.js'
@connect((state={}) => {
    return {
        state:state.common,
        userState:state.user
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
     userActions:bindActionCreators(userActions,dispatch)
}})


export default class Room extends React.Component{
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
            this.userInfo = userInfo || ''


        //
        //根据URL中的值来发送actions请求获取直播间主播信息
        this.url = this.props.params.urlName || '';
        this.props.userActions.queryAnchorLiveInfoByUrl({url:this.url});
        this.props.actions.getBarrageReplaceCookie();
        this.socket = io.connect('http://localhost:80');
        this.state = {};
    }
    controlScroll=(e)=>{
        let scrollTop = e.target.scrollingElement.scrollTop;
        if(scrollTop >=55)
            this.setState({
                height:window.innerHeight,
                top:"0"
            })
        else
            this.setState({
                height:(window.innerHeight-55),
                top:"55"
            })

    }
    componentDidMount() {
        window.addEventListener('scroll', this.controlScroll.bind(this));
        setInterval(()=> {
            this.props.userActions.queryAnchorLiveInfoByUrl({url:this.url});
            this.props.userActions.selectIsFocusThisRoom({
                url: this.url,
                userName:this.userInfo.user_nickname || ''
            });
            this.setState({});
        },5000);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.controlScroll.bind(this));
    }
    render() {
        this.liveInfoData = this.props.userState.liveInfoData||{};//通过url获取到的直播间信息
        return (
            <div>
                {/*侧栏分类菜单*/}
                <SideMenu userInfo={this.userInfo} height={this.state.height || (window.innerHeight-55)} top={this.state.top || "55"}/>
                <HeaderNav />
                <div className="live-content" onScroll={this.controlScroll} ref="lc">
                    {/*直播间播放区域*/}
                    <div className="live-room" style={{marginLeft : this.props.state.open_side_menu ? "280px":"100px"}}>
                        <RoomInfo liveInfoData={this.liveInfoData} userInfo={this.userInfo} url={this.url}/>
                        <DanmuContent socket={this.socket} />
                        <LiveSource socket={this.socket}/>
                        <GiftsList liveInfoData={this.liveInfoData} userInfo={this.userInfo} socket={this.socket}/>
                        <PostDanmu userInfo={this.userInfo} socket={this.socket}/>
                        <div className="notice">
                            <span>直播公告</span>
                            <div>{this.liveInfoData.anch_live_notice}</div>
                        </div>
                    </div>
                    <Footer />
                </div>
                {this.props.state.formContainerState&&<FormContainer />}
            </div>
        );
    }
}