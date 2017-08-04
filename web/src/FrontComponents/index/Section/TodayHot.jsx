import React,{ Component } from 'react'

import './TodayHot.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../../redux/room/room.actions.js'

@connect((state = {})=>{
    return {
        state:state.room
    }
},(dispatch)=>{
    return {
        actions:bindActionCreators(actions,dispatch)
    }
})

export default class TodayHot extends React.Component{
    constructor(props){
        super(props);
        this.props.actions.getTodayHot();
    }
    render(){
        return(
            <div className="today-hot">
                {/*<!--今日热门-->*/}
                <p>
					<span className="today-hot-title">
						<span>今日热门</span>
					</span>
                    {/*<span className="today-hot-more"><a href="#">更多&nbsp;<i className="fa fa-angle-right" aria-hidden="true"></i></a></span>*/}
                </p>
                <ul>
                    {/*
                    <li>
                        <div className="today-hot-content">
                            <img src="img/livepics/livepics010.jpg" className="today-hot-item-bg"/>
                            <div className="layer"></div>
                            <img src="img/vedio-play.png" className="today-hot-playicon"/>
                            <div className="today-hot-room-name">
                                <div className="small-layer"></div>
                                <p>统一冰红茶IGL全国比赛AAA VS BBB</p>
                            </div>
                        </div>
                        <div className="today-hot-info">
                            <span className="today-hot-username"><i className="fa fa-user" aria-hidden="true"></i>&nbsp;冰封拳头总公司administrator</span>
                            <span className="today-hot-people-count"><i className="fa fa-eye" aria-hidden="true"></i>&nbsp;1539865</span>
                        </div>
                        <div className="live-prograss-bar"></div>
                    </li>*/}
                   {
                        this.props.state.todayHotData.map((item,index)=>{
                            return (
                                <li>
                                    <a href={"/room/" + item.anch_live_url || ''}>
                                        <div className="today-hot-content">
                                            <img src={item.anch_live_bg || ''} className="today-hot-item-bg"/>
                                            <div className="layer"></div>
                                            <img src="img/vedio-play.png" className="today-hot-playicon"/>
                                            <div className="today-hot-room-name">
                                                <div className="small-layer"></div>
                                                <p>{item.anch_live_room_name || ''}</p>
                                            </div>
                                        </div>
                                        <div className="today-hot-info">
                                            <span className="today-hot-username"><i className="fa fa-user" aria-hidden="true"></i>&nbsp;{item.anch_name || ''}</span>
                                            <span className="today-hot-people-count"><i className="fa fa-eye" aria-hidden="true"></i>&nbsp;{item.anch_live_people || 0}</span>
                                        </div>
                                        <div className="live-prograss-bar"></div>
                                    </a>
                                </li>
                            )
                        })
                   }
                </ul>
            </div>

        )
    }
}