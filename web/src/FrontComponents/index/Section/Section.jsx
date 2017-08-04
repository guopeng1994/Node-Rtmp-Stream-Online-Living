import React,{ Component } from 'react'
import './Section.scss'
import TodayHot from './TodayHot'
import Recomm from './Recomm'

export default class Section extends React.Component{
	constructor(props){
		super(props);
	}
    render(){
        return(
            <section>
            	<Recomm recommData={this.props.recommData}/>
                <TodayHot />
            </section>
        )
    }
}