import React,{ Component } from 'react'
import Header from './Header/Header'
import Section from './Section/Section'
import Footer from './Footer/Footer'


import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/room/room.actions.js'

@connect((state={}) => {
    return {
        state:state.room,
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
}})


export default class IndexPage extends React.Component{
	constructor(props){
		super(props);
        this.props.actions.getRecomm();
	}
    render(){
        let recommData = this.props.state.recommData || [];
        return(
            <div>
                <Header recommData={recommData}/>
                <Section recommData={recommData}/>
                <Footer />
            </div>
        )
    }
}