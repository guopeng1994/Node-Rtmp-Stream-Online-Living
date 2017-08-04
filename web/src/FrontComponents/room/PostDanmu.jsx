import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as commonActions from '../../redux/common/common.actions.js'

@connect((state={}) => {
    return {
        common:state.common,
    };
}, (dispatch) => {
    return{
     commonActions: bindActionCreators(commonActions,dispatch),
}})
export default class PostDanmu extends React.Component{
    constructor(props){
        super(props);    
    }
    login=()=>{
        //显示登录注册弹出框
        this.props.commonActions.showform("login");
    }
    getLogDom=()=>{
        let dom = (
            <div className="unlog_layer">
                <span onClick={this.login}>登录参与聊天</span>
            </div>
        );
        if(!this.props.userInfo)//没有登录
            return dom;
        else
            return;
    }
    render() {
        return( 
            <div className="post-danmu">
                {this.getLogDom()}
                <textarea type="text" className="danmuText" maxLength="30" rows="3" cols="10" warp="soft" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" placeholder="按下Enter键快捷发送消息~"></textarea>
                <button className="post-btn" >发送</button>
            </div>
        );
    }
}