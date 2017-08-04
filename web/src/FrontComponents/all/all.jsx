import React , {Component} from 'react'

import SideMenu from '../SideMenu/SideMenu'
import HeaderNav from '../index/Header/HeaderNav'
import FormContainer from '../LogAndReg/FormContainer'
import ChannelRooms from './channelRooms/channelRooms'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as commonActions from '../../redux/common/common.actions.js'

@connect((state={}) => {
    return {
        commonState:state.common
    };
}, (dispatch) => {
    return{
     commonActions:bindActionCreators(commonActions,dispatch),
}})

export default class All extends React.Component{
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

		this.channelId = this.props.params.channelId || 'all';
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
		return(
			<div>

				<SideMenu userInfo={this.userInfo} height={this.state.height || (window.innerHeight-55)} top={this.state.top || "55"}/>
				<HeaderNav />
				<ChannelRooms channelId={this.channelId}  onScroll={this.controlScroll}/>
				{this.props.commonState.formContainerState&&<FormContainer />}
			</div>
		)
	}
}