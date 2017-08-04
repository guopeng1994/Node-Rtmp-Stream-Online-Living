import React,{Component} from 'react'
import {Button,Icon,message} from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/room/room.actions.js'
import * as userActions from '../../redux/user/user.actions.js'
@connect((state={})=>{
    return {
        state:state.room,
        userState:state.user
    }
},(dispatch)=>{
    return {
        actions:bindActionCreators(actions,dispatch),
        userActions:bindActionCreators(userActions,dispatch)
    }
})

export default class RoomInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hideMd5:true//默认遮挡md5密钥
        }
        this.props.userInfo = this.props.userInfo || ''
        let userName = this.props.userInfo.user_nickname || '';
        this.props.userActions.selectIsFocusThisRoom({
            url: this.props.url,
            userName:userName
        });
    }
    startShow=(isStartShow)=>{
        let anch_name = this.props.liveInfoData.anch_name;
        this.props.userActions.anchorStartShow({
            userName:anch_name,
            isStartShow:isStartShow
        });
        this.setState({});
    }
    md5Dom=()=>{
        if(!this.props.userInfo)//有没有登录 //没有登录
            return;
        if(this.props.userInfo.anch_role != 3)//是不是主播 //不是
            return;
        // if(this.props.liveInfoData.anch_live_status !=1)//没有开启直播的操作时 不显示
        //     return;
        if(this.props.liveInfoData.anch_name != this.props.userInfo.user_nickname)//不是自己
            return;
        let md5 = this.props.liveInfoData.anch_push_stream_md5 || '';
        let hideMd5 = md5.replace(/[0-9a-zA-Z]/g,'*');
        let show = (
            <span className="md5">
                <Button type='primary' size='small' onClick={()=>this.setState({hideMd5:true})}>遮挡</Button>
                <label>{md5}</label>
            </span>
        );
        let hide = (
            <span className="md5">
                <Button type='primary' size='small' onClick={()=>this.setState({hideMd5:false})}>显示</Button>
                <label>{hideMd5}</label>
            </span>
        );
        if(md5 == '')//还没有开启直播来生成  第一次开启直播
            hide = null;
        if(this.state.hideMd5){
            return hide;
        }else{
            return show;
        }
    }
    startDom = ()=>{
        if(!this.props.userInfo)//有没有登录 //没有登录
            return;
        if(this.props.userInfo.anch_role != 3)//是不是主播 //不是
            return;
        if(this.props.liveInfoData.anch_name != this.props.userInfo.user_nickname)//不是自己
            return;
        if(this.props.liveInfoData.anch_live_status == 0) //未开播 /*获取推流码（开始直播）*/
            return (
                <span className="start"><Button size="small" onClick={()=>this.startShow(true)}>获取推流码</Button></span>
            )
        else if(this.props.liveInfoData.anch_live_status == 1) //已开播
            return (
                <span className="start"><Button size="small" onClick={()=>this.startShow(false)}>关闭直播</Button></span>
            )
        else if(this.props.liveInfoData.anch_live_status == 2) //被封禁
            return (
                <span className="start"><Button size="small" disabled title="直播间已被封禁！无法获取推流码" >获取推流码</Button></span>
            )
    }
    focus=()=>{//关注
        message.destroy();
        if(!this.props.userInfo)//未登录
        {
            message.info("请先登录!");
            return;
        }
        if(!this.props.userState.focusData)//未关注
            this.props.userActions.focus({//添加关注
                url: this.props.liveInfoData.anch_live_url,
                userName:this.props.userInfo.user_nickname,
                action:'add'
            })
        else
            this.props.userActions.focus({//取消关注
                url: this.props.liveInfoData.anch_live_url,
                userName:this.props.userInfo.user_nickname,
                action:'cancle'
            })
    }
    render() {
        this.props.liveInfoData = this.props.liveInfoData || {};
        return(
            <div className="room-info">
                <div className="infos">
                    <p>{this.props.liveInfoData.anch_live_room_name}</p>
                    <p>
                        {this.md5Dom()}
                        <span className="focus">
                            <Button icon={this.props.userState.focusData ? "heart":"heart-o"} size="small" onClick={this.focus}>
                            {
                                this.props.userState.focusData ? "已关注" : "关注"
                            }
                            <span className="people">
                            {
                                this.props.liveInfoData.anch_focus_total
                            }
                            </span>
                            </Button>
                        </span>
                        {this.startDom()}
                    </p>
                    <p>
                        <span><label>当前频道:</label>{this.props.liveInfoData.chl1_name}/{this.props.liveInfoData.chl2_name}</span>
                        <span><label>当前人数:</label>{parseInt(this.props.liveInfoData.anch_live_people / 2)}</span>
                        {/*<span><Icon type="safety" />举报</span>*/}
                    </p>
                </div>
            </div>
        );
    }
}