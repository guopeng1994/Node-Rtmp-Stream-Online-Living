import React,{Component} from 'react'
import {message,notification } from 'antd'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../redux/user/user.actions.js'

notification.config({
  duration: 2,
});

@connect((state = {})=>{
    return {
        state:state.user
    }
},(dispatch)=>{
    return{
        actions:bindActionCreators(actions,dispatch)
    }
})

export default class Chest extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            leftTime:600,//10min
            timeUp:false//倒计时是否结束
        }
    }
    getChest=(e)=>{
        message.destroy();
        notification.destroy();
        if(!this.props.userInfo)//未登录
        {
            message.info("请先登录!");
            return;
        }
        if(!this.state.timeUp)//倒计时未结束
        {
            notification.open({
                message: '免费宝箱领取通知',
                description: "您还有"+this.state.leftTime+"秒后才能获取银币",
            });
            return;
        }else{
            notification.open({
                message: '免费宝箱领取通知',
                description: '恭喜您！通过宝箱免费获取了1000银币',
            });
            this.props.actions.getFreeChest({
                userName:this.props.userInfo.user_nickname
            });
            this.setState({
                leftTime:600,
                timeUp:false
            });
           // this.timer;
        }
    }
    componentDidMount=()=>{
        this.timer = setInterval(()=>{
            let leftTime = this.state.leftTime;
            this.setState({
                leftTime:leftTime-1
            });
            if(leftTime-1<=0){
                //clearInterval(this.timer);
                this.setState({
                    timeUp:true
                })
            }
        },1000);
    }
    componentWillUnMount=()=>{
        clearInterval(this.timer);
    }
    render() {
        let min = Math.floor(this.state.leftTime/60);
        let sec = this.state.leftTime-Math.floor(this.state.leftTime/60)*60;
        return(
            <div className="free-chest" onClick={this.getChest}>
                <img src='/img/chest-close.png'/>
                {
                    this.state.timeUp ? <span>领取银币</span> :
                    <span>{min < 10 ? '0'+min : min}:{sec < 10 ? '0'+sec : sec}</span>
                }
            </div>
        );
    }
}