import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import {
	Router,
	Route,
	IndexRoute,
	IndexRedirect,
	browserHistory 
} from 'react-router'

import Admin from '../BackComponents/adminLogin/adminLogin'
import IndexPage from '../FrontComponents/index/index'
import All from '../FrontComponents/all/all'
import Room from '../FrontComponents/room/room'
import Manage from '../BackComponents/manage'
import Member from '../FrontComponents/member/member'
import ForgetPwd from '../FrontComponents/forgetPwd/forgetPwd'
import Classes from '../FrontComponents/classes/classes'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

export default class Routes extends React.Component{
	render(){
		return(
			<Router history={this.props.history}>
				<Route path="/">
				  <IndexRedirect to="/index" />//重定向
				  <Route path='index' component={IndexPage}/>
				</Route>
        		<Route path='/all' component={All} >
        			<Route path='/all/:channelId' component={All}/>
        		</Route>
                <Route path='/room'>
                	<Route path='/room/:urlName' component={Room} />
                </Route>
                <Route path='/classes' component={Classes} />
                <Route path='/admin' component={Admin} />
                <Route path='/manage' component={Manage} />
                <Route path='/member' component={Member} />
                <Route path='/forgetPassword' component={ForgetPwd}/>
        	</Router>
		);
	}
}