/*源组件*/

import React,{Component} from 'react'


export default class LiveSource extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        return(
            <div className="live-source">
                  <div id='myplayer'></div>
            </div>
        );
    }
}