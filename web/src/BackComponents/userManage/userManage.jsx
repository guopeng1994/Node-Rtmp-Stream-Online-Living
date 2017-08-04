import React,{Component} from 'react'
import {Button,Popconfirm,Table,Input,InputNumber,Select,Icon,Modal,message} from 'antd'

const Option = Select.Option;
import './userManage.scss'


import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/user/user.actions.js'

@connect((state={}) => {
    return {
        state:state.user,
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
}})


export default class UserManage extends React.Component{
	constructor(props){
		super(props);

		this.columns = [{
		  title: '用户昵称',
		  dataIndex: 'user_nickname',
		  key: 'user_nickname',
		  render: (text, record,index) =><Input placeholder="请输入用户昵称" defaultValue={text} onChange={(e)=>this.changeNickName(e,index)}/>,
		}, {
		  title: '角色',
		  dataIndex: 'roleName',
		  key: 'roleName',
		},{
		  title: '绑定邮箱',
		  dataIndex: 'user_email',
		  key: 'user_email',
		},{
		  title: '拥有金豆',
		  dataIndex: 'user_money_gold',
		  key: 'user_money_gold',
		  render:(text, record,index) =><InputNumber defaultValue={text} min={0} max={999999999} onChange={(value)=>this.changeGold(value,index)}/>
		},{
		  title: '拥有银豆',
		  dataIndex: 'user_money_silver',
		  key: 'user_money_silver',
		  render:(text, record,index) =><InputNumber defaultValue={text} min={0} max={999999999} onChange={(value)=>this.changeSilver(value,index)}/>
		},{
		  title: '操作',
		  key: 'action',
		  render: (text, record,index) => (
		    <span className='action'>
				    <Button icon='save' onClick={()=>this.updateUser(index)} disabled={this.data[index].isChange ? false : true}>保存</Button>
			{/*
		    	  <Popconfirm title="确认删除?" okText="是的" cancelText="算了">
				    <Button icon='delete'>删除</Button>
				  </Popconfirm>
				  */}
		    </span>
		  ),
		}];

		this.props.actions.getAllUsers();
	}
	updateUser=(index)=>{
		message.destroy();
		if(!this.data[index].user_nickname)
		{
			message.error('昵称不能为空');
			return;
		}
		if(!this.data[index].user_money_gold < 0 || !this.data[index].user_money_gold > 999999999)
		{
			message.error('金币区间不正确');
			return;
		}
		if(!this.data[index].user_money_silver < 0 || !this.data[index].user_money_silver > 999999999)
		{
			message.error('银币区间不正确');
			return;
		}
		this.props.actions.updateUser(this.data[index]);
	}
	changeNickName=(e,index)=>{
		this.data[index].user_nickname = e.target.value;
		this.data[index].isChange = true;
		this.setState({});
	}
	changeGold=(value,index)=>{
		this.data[index].user_money_gold = value;
		this.data[index].isChange = true;
		this.setState({});
	}
	changeSilver=(value,index)=>{
		this.data[index].user_money_silver = value;
		this.data[index].isChange = true;
		this.setState({});
	}
	searchUser=(e)=>{
		if(e.keyCode == 13)
			this.props.actions.searchUser({
				keyWords:e.target.value
			});
	}
	render(){
		this.data = this.props.state.usersData || [];
		const paginOption = {//分页配置项
			total:this.data.length,
		    showTotal:(total, range) => `共 ${total} 项，当前是${range[0]}-${range[1]} 项`,
		    pageSize:10,
		    defaultCurrent:1
		}
		return(
			<div className="user-manage">
				<div className="add-btn-container">
						{/*<Select style={{width:"70px",float:"left"}} defaultValue="昵称">
							<Option value="昵称">昵称</Option>
							<Option value="角色">角色</Option>
						</Select>
						*/}
						<input placeholder="输入昵称关键字" className="search" onKeyUp={this.searchUser} maxLength="10"/>
				</div>
				<Table columns={this.columns} dataSource={this.data} pagination={paginOption}/>
			</div>
		)
	}
}