import React,{Component} from 'react'
import {Button,Popconfirm,Table,Input,Tag,message} from 'antd'

import './channel_lv1.scss'

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


export default class Channel_lv1 extends React.Component{
	constructor(props){
		super(props);
		this.baseKey = 10000;//行数据的唯一表示符//起始值
		this.columns = [{
		  title: '一级频道名',
		  dataIndex: 'chl1_name',
		  key: 'chl1_name',
		  render:(text, record,index) => <Input placeholder="请输入一级频道名" defaultValue={text} onChange={(e)=>this.changeName(e,index)}/>,
		}, {
		  title: '当前频道下包含的所有二级频道',
		  dataIndex: 'childrens',
		  key: 'childrens',
		  render:(text, record,index) =>{
		  	if(!text[0] || !text)
		  		text=[{name:"暂无二级频道"}];
			return text.map((item,index)=>{
				return  <Tag color="#f50">{item.name}</Tag>
			});
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
		this.props.actions.getAllChannelOne();
		this.data = [];
	}
	changeName =(e,index)=>{
		this.data[index].chl1_name = e.target.value;
		this.data[index].isChange = true;
		this.setState({});
	}
	addChannel=()=>{
		this.baseKey++;
		let obj = {//新增一行
			key:this.baseKey,
			chl1_name:'',
			childrens:[],
			add:true//表示是新增的未保存的行
		}
		this.data.unshift(obj);
		this.setState({});
	}
	deleteChannel=(index)=>{
		if(this.data[index].add)//新增未保存的行
		{
			this.data.splice(index,1);
			this.setState({});
		}
		else
			this.props.actions.deleteChannelOne({chl1_id:this.data[index].chl1_id});
	}
	updateChannel =(index)=>{
		message.destroy();
		if(this.data[index].chl1_name ==""){
			message.error("名称不能为空!");
			return;
		}
		if(this.data[index].add){//添加
			this.props.actions.addChannelOne({chl1_name:this.data[index].chl1_name});
		}else{//修改
			this.props.actions.updateChannelOne(this.data[index]);
		}
	}
	render(){
		this.data = this.props.state.channelOneData;
		const paginOption = {//分页配置项
			total:this.data.length,
		    showTotal:(total, range) => `共 ${total} 项，当前是${range[0]}-${range[1]} 项`,
		    pageSize:10,
		    defaultCurrent:1
		}
		return(
			<div className="channel-ch1">
				<div className="add-btn-container">
						<Button type="primary" onClick={this.addChannel}>新增一级分类</Button>
				</div>
				<Table columns={this.columns} dataSource={this.data} pagination={paginOption}/>
			</div>
		)
	}
}