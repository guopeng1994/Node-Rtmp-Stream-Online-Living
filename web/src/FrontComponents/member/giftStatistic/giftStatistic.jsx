import React,{Component} from 'react'
import {message,Table,Modal} from 'antd'

import './giftStatistic.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../../redux/gift/gift.actions.js'

@connect((state={}) => {
    return {
        state:state.gift,
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
}})

export default class GiftStatistic extends React.Component{
	constructor(props){
		super(props);
        this.userInfo = this.props.userInfo;
        this.columns = [{
		  title: '送礼时间',
		  dataIndex: 'gifts_h_time',
		  key: 'gifts_h_time',
		},{
		  title: '送礼人',
		  dataIndex: 'gifts_h_giver',
		  key: 'gifts_h_giver',
		},{
		  title: '收礼人',
		  dataIndex: 'gifts_h_receiver',
		  key: 'gifts_h_receiver',
		},{
		  title: '礼物名称',
		  dataIndex: 'gift_name',
		  key: 'gift_name',
		},{
		  title: '礼物数量',
		  dataIndex: 'gifts_h_num',
		  key: 'gifts_h_num',
		}];
		if(!this.userInfo.anch_name){//不是主播
			this.props.actions.getCostAndCostHistory({//获取消费的金钱数和消费的历史
	        	userName:this.userInfo.user_nickname
	        });
		}else{
			this.props.actions.getIncomeAndIncometHistory({//获取收入的可兑换的金钱数和收取礼物的历史
	        	userName:this.userInfo.anch_name
	        });
		}
		this.state={
			visible:false
		}
	}
	reCharge=()=>{
		this.setState({
			visible:true
		})
	}
	handleCancel=()=>{
		this.setState({
			visible:false
		})
	}
	exchange=()=>{
		window.open("http://wpa.qq.com/msgrd?v=3&uin=455902861&site=qq&menu=yes");
	}
	render(){
		if(!this.userInfo.anch_name)//不是主播
			this.data = this.props.state.costData.history || [];
		else
			this.data = this.props.state.incomeData.history|| [];
		const paginOption = {//分页配置项
			total:this.data.length,
		    showTotal:(total, range) => `共 ${total} 项，当前是${range[0]}-${range[1]} 项`,
		    pageSize:20,
		    defaultCurrent:1
		}
		return(
			<div className="gift-statistics">
			{
				!this.userInfo.anch_name ? 
				<div className="my-cost">
					<div className="total-cost">共消费:
						<span className="cost-money">
							<label className="cost-money-gold">金币:{this.props.state.costData.totalCost.gold || ''}</label>
							<label className="cost-money-silver">银币:{this.props.state.costData.totalCost.silver || ''}</label>
						</span>
					</div>
					<div className="recharge">
						<button onClick={this.reCharge}>充值</button>
						<Modal title="扫码转账" visible={this.state.visible} onCancel={this.handleCancel}
				        	footer={null}
				        >
				          <img src='/img/payme.jpg' className='payme'/>
				        </Modal>
					</div>
					<p className="cost-history"><span>消费历史</span></p>
				</div>

				:

				<div className="income">
					<label>可兑换收入:</label><span>50000金币</span><button onClick={this.exchange}>兑换</button>
					<p className="income-history"><span>收入历史</span></p>
				</div>
			}				
				<Table bordered columns={this.columns} dataSource={this.data} pagination={paginOption}/>
			</div>
		)
	}
}