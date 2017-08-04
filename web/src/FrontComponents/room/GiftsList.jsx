import React,{Component} from 'react'
import Chest from './Chest'
import {message} from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/room/room.actions.js'
import * as giftActions from '../../redux/gift/gift.actions.js'

@connect((state={})=>{
    return {
        state:state.room,
        giftState:state.gift
    }
},(dispatch)=>{
    return {
        actions:bindActionCreators(actions,dispatch),
        giftActions:bindActionCreators(giftActions,dispatch)
    }
})


export default class GiftsList extends React.Component{
    constructor(props){
        super(props);
        this.socket = this.props.socket;
        this.props.actions.getAllGifts();
    }
    setGiftslist=(giftsData)=>{
        return giftsData.map((item,index)=>{
            return (
                <li>
                    <img src={item.gift_img} alt={item.gift_name}/>
                    <div className="gift-info">
                        <p>{item.gift_name}</p>
                        <div className="gift-price">
                            {
                                item.gift_price_silver ? <span className="gift-price-silver">{item.gift_price_silver}银币</span> : ""
                            }
                            {
                                item.gift_price_silver && item.gift_price_gold ? "/" : ""
                            }
                            {
                                item.gift_price_gold ? <span className="gift-price-gold">{item.gift_price_gold}金币</span> : ""
                            }
                        </div>
                        <div className="gift-give">
                            <input type="number" max='999' min='1' placeholder='输入数量1-999' defaultValue='1'/>
                            <button onClick={(e)=>this.giveGift(e,'silver',item)} disabled={item.gift_price_silver == 0 ? true:false} className={item.gift_price_silver == 0 ? "disabled":""}>银币送出</button>
                            <button onClick={(e)=>this.giveGift(e,'gold',item)} disabled={item.gift_price_gold == 0 ? true:false} className={item.gift_price_gold == 0 ? "disabled":""}>金币送出</button>
                        </div>
                    </div>
                </li>
            )
        });
    }
    giveGift=(e,giveWay,gift)=>{//送礼
        message.destroy();
        if(!this.props.userInfo)//未登录
        {
            message.info("请先登录!");
            return;
        }else{

            //数量输入校验
            let count = e.target.parentNode.childNodes[0].value;
            if(new RegExp(/[^\d]/).test(count) || count < 1 || count >1000)
            {
                message.error("请输入1-999之间的数字");
                return;
            }

            let giftGiver = this.props.userInfo.user_nickname;
            let giftReceiver = this.props.liveInfoData.anch_name;
            this.giveItem = {
                    giver:giftGiver,
                    gift:gift,
                    count:count,
                    receiver:giftReceiver
                };
            if(giveWay == 'silver')//银币方式送礼
                this.props.giftActions.giveGiftBySilver(this.giveItem);
            else
                this.props.giftActions.giveGiftByGold(this.giveItem);
        }
        this.setState({});
    }
    hideBalanceNotEnough=()=>{
        this.props.giftActions.reSetGiveGiftStatus();
        this.setState({});
    }
    componentDidMount=()=>{
        
    }
    render() {
        this.giftsData = this.props.state.giftsData || [];
        this.giveGiftStatus = this.props.giftState.giveGiftStatus || '';
        if(this.giveGiftStatus == 'success'){//渲染了两次
            this.props.giftActions.reSetGiveGiftStatus();
            this.socket.emit("giveGifts",this.giveItem);
        }
        return(
            <div className="live-gifts">
                {/*<!--免费礼物获得-->*/}
                <Chest userInfo={this.props.userInfo}/>
                <ul>
                    {this.setGiftslist(this.giftsData)}
                </ul>
                {  this.giveGiftStatus!='success' && this.giveGiftStatus!='' ? 
                    <div className='balanceNotEnough'>
                        <div>
                            <span>{this.giveGiftStatus}</span>
                            <button onClick={this.hideBalanceNotEnough}>确定</button>
                             {/*<!--去充值-->*/}
                        </div>
                    </div>
                    : ''
                }
            </div>
        );
    }
}