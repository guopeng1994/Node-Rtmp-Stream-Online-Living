import React,{Component} from 'react'
import {Button,Popconfirm,Table,Input,Select,Icon,Modal,DatePicker} from 'antd'
const { RangePicker} = DatePicker;
const Option = Select.Option;
import './applyManage.scss'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/apply/apply.actions.js'

@connect((state={}) => {
    return {
        state:state.apply,
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
}})


export default class ApplyManage extends React.Component{
	constructor(props){
		super(props);
		this.state={
			visible:false,
			photos:{
			  	apply_profile_card_front:"",
			  	apply_profile_card_back:"",
			  	apply_profile_handle_card:""
			},
			dateRange:[],
			selectValue:"all"
		}

		this.columns = [{
		  title: '申请时间',
		  dataIndex: 'apply_time',
		  key: 'apply_time',
		},{
		  title: '申请人',
		  dataIndex: 'apply_user',
		  key: 'apply_user',
		}, {
		  title: '真实姓名',
		  dataIndex: 'apply_realname',
		  key: 'apply_realname',
		}, {
		  title: '身份证号',
		  dataIndex: 'apply_cardnumber',
		  key: 'apply_cardnumber',
		},{
		  title: '申请资料',
		  dataIndex: 'apply_info',
		  key: 'apply_info',
		  render:text =>{
		  		return 	(
		  			<span className="profiles">
					    	<span className="applying" 
					    		onClick={()=>{
					    			this.setState({
					    				visible:true,
					    				photos:text.photos
					    			});
					    			}
					    		}
					    	>申请资料</span>
					    	<Modal
					          visible={this.state.visible}
					          title="用户申请成为主播资料："
					          onOk={()=>this.setState({visible:false})}
					          onCancel={()=>this.setState({visible:false})}
					          okText="确定"
					        >
					          <ul className="apply_profile">
					          	<li>
						          	<div className="profile_name">身份证正面:</div>
						          	<div className="profile_img_container">
						          		<img src={this.state.photos.apply_profile_card_front || ""} className="profile_img"/>
						          	</div>
					          	</li>
					          	<li>
						          	<div className="profile_name">身份证反面:</div>
						          	<div className="profile_img_container">
						          		<img src={this.state.photos.apply_profile_card_back || ""} className="profile_img"/>
						          	</div>
					          	</li>
					          	<li>
						          	<div className="profile_name">手持证件照:</div>
						          	<div className="profile_img_container">
						          		<img src={this.state.photos.apply_profile_handle_card || ""} className="profile_img"/>
						          	</div>
					          	</li>
					          </ul>
					        </Modal>
		  			</span>
		  		)
		  }
		},{
			title: '申请状态',
		  	dataIndex: 'apply_status',
		  	key: 'apply_status',
		  	render:text =>{
		  		if(text == -1)//失败
		  		{
		  			return(
		  				<span className="status_red">审核不通过</span>
		  			)
		  		}else if(text == 1){//待处理
		  			return(
		  				<span className="status_orange">待审核</span>
		  			)
		  		}else if(text == 2){//已通过
		  			return(
		  				<span className="status_green">已通过</span>
		  			)
		  		}
		  	}
		},{
		  title: '操作',
		  key: 'action',
		  render: (text, record,index) => {
		  	let canDoDom = (
		  		<span className='action'>
			    	<Popconfirm title="确认通过审核?" okText="是的" cancelText="算了" onConfirm={()=>this.reviewProfile(true,index)}>
					    <Button icon='check'>通过审核</Button>
					</Popconfirm>
			    	  <Popconfirm title="确认拒绝通过审核?" okText="是的" cancelText="算了" onConfirm={()=>this.reviewProfile(false,index)}>
					    <Button icon='close'>拒绝通过</Button>
					  </Popconfirm>
			    </span>
		  	);
		  	let cantDoDom = (
		  		<span className='action'>
					<Button icon='check' disabled>通过审核</Button>
					<Button icon='close' disabled>拒绝通过</Button>
			    </span>
		  	);
		  	if(this.data[index].apply_status == 1){
		  		return canDoDom;
		  	}else{
		  		return cantDoDom;
		  	}
		  }
		}];

		this.props.actions.queryApplys();

	}
	disabledDate=(current)=>{
	  return current && current.valueOf() > Date.now();//今天之后的日期不能选择
	}
	changeSelect=(value)=>{
		this.setState({
			selectValue:value
		})
	}
	changeTime=(dates,dateStrings)=>{
		for(let i in dateStrings)//时间字符串转时间戳
		{
			dateStrings[i] = Date.parse(new Date(dateStrings[i]))/1000;
		}
		this.setState({
			dateRange:dateStrings
		})
	}
	queryCustomApplys=()=>{//自定义组合条件查询
		let selectValue = this.state.selectValue;
		let dateRange = this.state.dateRange;
		this.props.actions.queryApplys({
			selectValue:selectValue,
			dateRange:dateRange
		})
	}
	reviewProfile=(isPass,index)=>{
		let apply_time = this.data[index].apply_time;
		let apply_user = this.data[index].apply_user;
		this.props.actions.reviewProfile({
			isPass:isPass,
			apply_time:apply_time,
			apply_user:apply_user
		});
	}
	render(){
		this.data = this.props.state.applysData;
		return(
			<div className="apply-manage">
				<div className="add-btn-container">
					<Select style={{width:"120px",marginRight:"10px"}} defaultValue="all" onChange={this.changeSelect}>
						<Option value="all">全部状态</Option>
						<Option value="1">待审核状态</Option>
						<Option value="-1">审核不通过状态</Option>
						<Option value="2">已通过状态</Option>
					</Select>
					<RangePicker
				      disabledDate={this.disabledDate} //增加不可选择的时间区间
				      showTime format="YYYY-MM-DD HH:mm:ss"
				      onChange={this.changeTime}
				    />
				    <Button type="primary" onClick={this.queryCustomApplys}>筛选</Button>
				</div>
				<Table columns={this.columns} dataSource={this.data}/>
			</div>
		)
	}
}