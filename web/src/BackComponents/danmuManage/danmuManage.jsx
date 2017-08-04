import React,{Component} from 'react'

import "./danmuManage.scss"

import {Button,Input,Table,Popconfirm,message} from 'antd'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../redux/common/common.actions.js'

@connect((state={})=>{
    return {
        state:state.common
    }
},(dispatch)=>{
    return {
        actions:bindActionCreators(actions,dispatch)
    }
})


export default class DanmuManage extends React.Component{
	constructor(props){
		super(props); 
        this.baseKey = 10000;//行数据的唯一表示符//起始值
        this.columns = [{
          title: '被替换关键字',
          dataIndex: 'br_be_replaced',
          key: 'br_be_replaced',
          render:(text, record,index) => <Input placeholder="输入被替换关键字" defaultValue={text} onChange={(e)=>this.changeBeReplaced(e,index)}/>,
        }, {
          title: '',
          dataIndex: '',
          key: '',
          render:(text) => <span>--替换为--</span>,
        },{
          title: '目标替换内容',
          dataIndex: 'br_replace_content',
          key: 'br_replace_content',
          render:(text, record,index) => <Input placeholder="输入替换后内容" defaultValue={text} onChange={(e)=>this.changeReplaceContent(e,index)}/> ,
        },{
          title: '操作',
          key: 'action',
          render: (text, record,index) => (
            <span className='action'>
                <Button icon='save' onClick={()=>this.updateReplace(index)} disabled={this.data[index].isChange ? false : true}>{this.data[index].add ? "添加":"保存修改"}</Button>
                  <Popconfirm title="确认删除?" okText="是的" cancelText="算了" onConfirm={()=>this.deleteReplace(index)}>
                    <Button icon='delete'>删除</Button>
                  </Popconfirm>
            </span>
          ),
        }];
        this.props.actions.getAllBarrageReplace();
        this.data = [];
    }
    changeBeReplaced =(e,index)=>{
        this.data[index].br_be_replaced = e.target.value;
        this.data[index].isChange = true;
        this.setState({});
    }
    changeReplaceContent =(e,index)=>{
        this.data[index].br_replace_content = e.target.value;
        this.data[index].isChange = true;
        this.setState({});
    }
    addReplace=()=>{
        this.baseKey++;
        let obj = {//新增一行
            key:this.baseKey,
            br_be_replaced:'',
            br_replace_content:'',
            add:true//表示是新增的未保存的行
        }
        this.data.unshift(obj);
        console.log(this.data);
        this.setState({});
    }
    deleteReplace=(index)=>{
        if(this.data[index].add)//新增未保存的行
        {
            this.data.splice(index,1);
            this.setState({});
        }
        else
            this.props.actions.deleteReplace({br_id:this.data[index].br_id});
    }
    updateReplace =(index)=>{
        message.destroy();
        if(!this.data[index].br_be_replaced){
            message.error("被替换关键字不能为空!");
            return;
        }
        if(!this.data[index].br_replace_content){
            message.error("替换目标内容不能为空!");
            return;
        }
        if(this.data[index].add){//添加
            this.props.actions.addReplace(this.data[index]);
        }else{//修改
            this.props.actions.updateReplace(this.data[index]);
        }
    }
	render(){
        this.data = this.props.state.barrageReplaceData;
        const PaginOption = {//分页配置项
            total:this.data.length,
            showTotal:(total, range) => `共 ${total} 项，当前是${range[0]}-${range[1]} 项`,
            pageSize:10,
            defaultCurrent:1
        }
		return(
			<div className="danmu-manage">
                <div className="add-btn-container">
                    <Button type="primary" onClick={this.addReplace}>新增替换</Button>
                </div>
                <Table columns={this.columns} dataSource={this.data} pagination={PaginOption}/>
			</div>
		)
	}
}