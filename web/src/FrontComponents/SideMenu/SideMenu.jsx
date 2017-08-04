import React,{ Component} from 'react'


import './SideMenu.scss'
import SideMenuOpen from './SideMenuOpen'
import SideMenuClose from './SideMenuClose'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/common/common.actions.js'


@connect((state={}) => {
	return {
		state:state.common
	};
}, (dispatch) => {
	return{
     actions: bindActionCreators(actions,dispatch),
}})

export default class SideMenu extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div id="menu" style={{height:this.props.height+'px',top:this.props.top+'px'}}> 
				{this.props.state.open_side_menu ? <SideMenuOpen userInfo={this.props.userInfo} height={this.props.height}/> : <SideMenuClose userInfo={this.props.userInfo} height={this.props.height}/>}
			</div>
		)
	}
}