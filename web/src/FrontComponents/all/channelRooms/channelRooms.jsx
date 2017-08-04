import React , {Component} from 'react'

import './channelRooms.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../../redux/channel/channel.actions.js'
import * as commonActions from '../../../redux/common/common.actions.js'

@connect((state={}) => {
    return {
        state:state.channel,
        commonState:state.common
    };
}, (dispatch) => {
    return{
     actions:bindActionCreators(actions,dispatch),
     commonActions:bindActionCreators(commonActions,dispatch)
}})

export default class ChannelRooms extends React.Component{
	constructor(props){
		super(props);
		this.channelId = this.props.channelId;
		this.props.actions.getChannelRooms({channelId:this.channelId });
	}
	getRooms=(roomsData)=>{
		if(!roomsData[0].anch_live_url)//[{}]
			return (
				<span className="none-room">暂时没有主播在此频道~试试看其他频道吧!</span>
			)
		else{
			return roomsData.map((item,index)=>{
				return(
					<div className="live-list-item">
						<a href={"/room/"+item.anch_live_url} className="vedio-cover">
							<div className="live-pics">
								<div className="live-pics-container">
									<img  className="vedio-pic vedio-pic-lazy" src={item.anch_live_bg} alt={item.anch_live_room_name} />
									<div className="live-pic-warp"></div>
								</div>
								<div className="vedio-play"></div>
							</div>
							<div className="live-infos clearfix">
								<div className="live-name-type">
									<span className="live-name">{item.anch_live_room_name}</span>
									<span className="live-type">{item.chl2_name}</span>
								</div>
								
								<div className="live-anchor-people">
									<span className="live-anchor"><i className="fa fa-user" aria-hidden="true"></i> {item.anch_name}</span>
									<span className="live-people"><i className="fa fa-eye" aria-hidden="true"></i> {item.anch_live_people}</span>
								</div>
							</div>
						</a>
					</div>
				)
			});
		}
	}
	render(){
		//响应式
		let roomsData = this.props.state.channelRooms;
		return(
			<div className='channel-rooms' style={{width : this.props.commonState.open_side_menu ? window.innerWidth - 230 : window.innerWidth - 80,left:this.props.commonState.open_side_menu ? 230 : 80}} onScroll={this.props.onScroll}>
				<span className="channel">{this.channelId=='all' ? '全部直播' : roomsData[0].chl2_name}</span>
				{this.getRooms(roomsData)}
			</div>
		)
	}
}