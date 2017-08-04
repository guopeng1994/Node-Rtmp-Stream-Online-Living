import React,{Component} from 'react'
import {message} from 'antd'

import './myFocus.scss'

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

export default class MyFocus extends React.Component{
	constructor(props){
		super(props);
        this.userInfo = this.props.userInfo;
        this.props.actions.getAllFocusRoom({
        	userName:this.userInfo.user_nickname
        });
	}
	getOffLineFocus=()=>{
		let count = 0;
		for(let i in this.props.state.AllFocusData){//计算数量
			if(this.props.state.AllFocusData[i].anch_live_status != 1){//下播、被封禁等未开播状态
				count ++ ;
			}
		}
		if(count ==0)
			return(<span className="none">暂无</span>)
		else
			return this.props.state.AllFocusData.map((item,index)=>{
				if(item.anch_live_status != 1){//下播、被封禁等未开播状态
					count ++ ;
					return(
						<a href={'/room/'+item.anch_live_url}>
							<div className="live-rooms">
								<img src={item.anch_live_bg || ""} className="live-rooms-bg"/>
								<div className="layer"></div>
								<img src="img/vedio-play.png" className="live-rooms-playicon"/>
								<p className="live-rooms-name">{item.anch_live_room_name || ''}</p>
								<p className="live-rooms-username">{item.anch_name || ''}</p>
							</div>
						</a>
					)
				}
			}) 

	}
	getOnLineFocus=()=>{
		let count = 0;
		for(let i in this.props.state.AllFocusData){//计算数量
			if(this.props.state.AllFocusData[i].anch_live_status == 1){//下播、被封禁等未开播状态
				count ++ ;
			}
		}
		if(count ==0)
			return(<span className="none">暂无</span>)
		else
			return this.props.state.AllFocusData.map((item,index)=>{
				if(item.anch_live_status == 1){//下播、被封禁等未开播状态
					count ++ ;
					return(
						<a href={'/room/'+item.anch_live_url}>
							<div className="live-rooms">
								<img src={item.anch_live_bg || ""} className="live-rooms-bg"/>
								<div className="layer"></div>
								<img src="img/vedio-play.png" className="live-rooms-playicon"/>
								<p className="live-rooms-name">{item.anch_live_room_name || ''}</p>
								<p className="live-rooms-username">{item.anch_name || ''}</p>
							</div>
						</a>
					)
				}
			}) 

	}
	render(){
		return(
			<div className="focuses">
				<div className="isLiving">
					<p><span className="total-title">正在直播</span></p>
					{
						this.getOnLineFocus()
					}
				</div>
				<div className="offline">
					<p><span className="total-title">已下播</span></p>
					{
						this.getOffLineFocus()
					}
				</div>
			</div>
		)
	}
}