import React , {Component} from 'react'
import './classes.scss'

import SideMenu from '../SideMenu/SideMenu'
import HeaderNav from '../index/Header/HeaderNav'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/channel/channel.actions.js'
import * as commonActions from '../../redux/common/common.actions.js'

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

export default class Classes extends React.Component{
	constructor(props){
		super(props);
		//this.props.actions.getAllChannels();
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
	render(){
		let channels = this.props.state.channelOneData;
		return(
			<div className="classes">

				<SideMenu userInfo={this.userInfo} height={this.state.height || (window.innerHeight-55)} top={this.state.top || "55"}/>
				<HeaderNav />
				<div className="channels" style={{width : this.props.commonState.open_side_menu ? window.innerWidth - 230 : window.innerWidth - 80,left:this.props.commonState.open_side_menu ? 230 : 80}} onScroll={this.controlScroll}>
				{
					channels.map((item,index)=>{
						return (
							<div className="channel-item">
								<p><div>{item.chl1_name}</div></p>
								<div className="channel-details">
									<ul>
									{
										item.children.map((it,n)=>{
											return (
												<li><a href={'/all/'+it.chl2_id}>{it.value}</a></li>
											)
										})
									}
									</ul>
								</div>
							</div>
						)
					})
				}
				</div>
			</div>
		)
	}
}