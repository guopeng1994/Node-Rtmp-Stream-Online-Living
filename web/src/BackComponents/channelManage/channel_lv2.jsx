import React,{Component} from 'react'
import {Button,Popconfirm,Table,Input,Select,message} from 'antd'

const Option = Select.Option;

import './channel_lv2.scss'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../redux/channel/channel.actions.js'

@connect((state={})=>{
	return {
		state:state.channel
	}
},(dispatch)=>{
	return {
		actions:bindActionCreators(actions,dispatch)
	}
})

export default class Channel_lv2 extends React.Component{
	constructor(props){
		super(props);
		this.baseKey = 10000;
		this.columns = [{
		  title: '二级频道名',
		  dataIndex: 'chl2_name',
		  key: 'chl2_name',
		  render: (text,record,index )=> <Input placeholder="请输入二级频道名" defaultValue={text} onChange={(e)=>this.changeName(e,index)}/>,
		}, {
		  title: '所属上级频道',
		  dataIndex: 'chl1_name',
		  key: 'chl1_name',
		  render:(text, record,index) =>{
		  	text = text || [];
			let dom = text.map((item,index)=>{
				return  <Option value={item}>{item}</Option>
			});
			return (
		  		<Select defaultValue={text[0]} onChange={(value)=>this.changeTopChannel(value,index)}>
		  			{dom}
		  		</Select>
		  	)
		  }
		}, {
		  title: '操作',
		  key: 'action',
		  render: (text, record,index) => (
		    <span className='action'>
		    	<Button icon='save' onClick={()=>this.updateChannel(index)} disabled={this.data[index].isChange ? false : true}>{this.data[index].add ? "添加":"保存修改"}</Button>
		    	  <Popconfirm title="确认删除?" okText="是的" cancelText="算了" onConfirm={()=>this.deleteChannel(index)}>
				    <Button icon='delete'>删除</Button>
				  </Popconfirm>
		    </span>
		  ),
		}];
		this.props.actions.getAllChannelTwo();//获得所有二级分类数据
		this.props.actions.getAllTopChannel();//获得所有一级分类name
		this.data = [];
	}
	changeTopChannel=(value,index)=>{
		this.data[index].topChannel = value;//设置上级频道的名称
		this.data[index].isChange = true;
		this.setState({});
	}
	changeName =(e,index)=>{
		this.data[index].chl2_name = e.target.value;
		this.data[index].isChange = true;
		this.setState({});
	}
	addChannel=()=>{
		this.baseKey++;
		let obj = {//新增一行
			key:this.baseKey,
			chl2_name:'',
			chl1_name:this.props.state.allChannelOne,
			topChannel:this.props.state.allChannelOne[0],//默认上级为第一个一级分类
			add:true//表示是新增的未保存的行
		}
		this.data.unshift(obj)
		this.setState({});
	}
	deleteChannel=(index)=>{
		if(this.data[index].add)//新增未保存的行
		{
			this.data.splice(index,1);
			this.setState({});
		}
		else
			this.props.actions.deleteChannelTwo({chl2_id:this.data[index].chl2_id});
	}
	updateChannel =(index)=>{
		message.destroy();
		if(this.data[index].chl2_name ==""){
			message.error("名称不能为空!");
			return;
		}
		if(this.data[index].chl1_name.length ==0){//为空，没有一级分类
			message.error("上级频道不能为空!请先添加一级频道!");
			return;
		}
		if(this.data[index].add){//添加
			this.props.actions.addChannelTwo(this.data[index]);
		}else{//修改
			this.props.actions.updateChannelTwo(this.data[index]);
		}
	}
	render(){
		this.data = this.props.state.channelTwoData;
		const paginOption = {//分页配置项
			total:this.data.length,
		    showTotal:(total, range) => `共 ${total} 项，当前是${range[0]}-${range[1]} 项`,
		    pageSize:10,
		    defaultCurrent:1
		}
		return(
			<div className="channel-ch1">
				<div className="add-btn-container">
						<Button type="primary" onClick={this.addChannel}>新增二级分类</Button>
				</div>
				<Table columns={this.columns} dataSource={this.data} pagination={paginOption}/>
			</div>
		)
	}
}