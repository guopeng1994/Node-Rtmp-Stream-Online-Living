
import React,{ Component } from 'react'

import HeaderNav from "./HeaderNav"
import HeaderRecomm from './HeaderRecomm'

import './Header.scss'

export default class Header extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <header>
                <HeaderNav/>
                <HeaderRecomm recommData={this.props.recommData}/>
            </header>
        )
    }
}