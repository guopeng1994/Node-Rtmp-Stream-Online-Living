import React,{Component} from 'react'
import {Button,Popconfirm,Table,Input,InputNumber,Icon,message} from 'antd'
import * as _ from 'lodash'
import './giftManage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../redux/gift/gift.actions.js'

@connect((state={})=>{
	return {
		state:state.gift
	}
},(dispatch)=>{
	return {
		actions:bindActionCreators(actions,dispatch)
	}
})


export default class GiftManage extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			currentPage:1,
			pageSize:5
		}
		this.baseKey=10000;
		this.columns = [{
		  title: '礼物图片',
		  dataIndex: 'gift_img',
		  key: 'gift_img',
		  render: (text,record,index )=> {
		  	let uploadButton = (
		  		<div className="upload_btn">
		  			<Icon type='plus' />
		  			<div className="ant-upload-text">添加图片</div>
		  		</div>
		  	);
	        let imgPreview = (
		  		<img className="preview_img" src={text}/>
		  	);
		  	return (
		  		<div className="upload-container">
		        <input title="点击选择图片" type="file" className="upload_img" onChange={(e)=>{this.changeGiftPic(e,record)}}/>
		        {uploadButton}
		        {imgPreview}
		        </div>
		  	)
		  }
		}, {
		  title: '礼物名称',
		  dataIndex: 'gift_name',
		  key: 'gift_name',
		  render:(text,record,index )=><Input placeholder="请输入礼物名称(1-10个字符)" maxLength="10" defaultValue={text} onChange={(e)=>{this.changeGiftName(e,record)}}/>,
		}, {
		  title: '价格(金币)',
		  dataIndex: 'gift_price_gold',
		  key: 'gift_price_gold',
		  render: (text,record,index ) => <InputNumber placeholder="请输入0-4999数字" defaultValue={text} min={0} max={4999} onChange={(value)=>{this.changeGiftPriceGold(value,record)}}/>,
		},  {
		  title: '价格(银币)',
		  dataIndex: 'gift_price_silver',
		  key: 'gift_price_silver',
		  render: (text,record,index ) => <InputNumber placeholder="请输入0-2000数字" defaultValue={text} min={0} max={2000} onChange={(value)=>{this.changeGiftPriceSilver(value,record)}}/>,
		},{
		  title: '操作',
		  key: 'action',
		  render: (text, record,index) => (
		    <span className='action'>
		    	<Button icon='save' onClick={(e)=>this.updateGift(e,record)} disabled={record.isChange ? false : true}>{record.add ? "添加":"保存修改"}</Button>
		    	  <Popconfirm title="确认删除?" okText="是的" cancelText="算了" 
		    	  	onConfirm={
		    	  		()=>{
		    	  			this.deleteGift(record);
		    	  		}
		    	  	}>
				    <Button icon='delete'>删除</Button>
				  </Popconfirm>
		    </span>
		  ),
		}];

		this.props.actions.getAllGifts();
		this.data = [];
	}
	findIndex=(arr,obj)=>{
		for(let i in arr){
			if(arr[i].gift_id == obj.gift_id){
				return i;
			}
		}
	}
	changeGiftPic = (e,record)=>{
		let file = e.currentTarget.files[0];
		let filetype = file.type;
		if(!filetype.match("image")){
			message.error("只能选择图片!");
			return;
		}
		if(file.size/1000 > 500)//超过500kb
		{
			message.error("所选图片不得超过500kb，请重新选择!");
			return;
		}
		let reader = new FileReader();
		let img = e.target.parentNode.childNodes[2];
		let index = this.findIndex(this.data,record);
		reader.onload = (event)=> {//成功读取
			img.src = event.target.result;//设置图片 data:image....
			this.data[index].gift_img = img.src;//更新data数据项
		}
		reader.readAsDataURL(file);
		this.data[index].isChange = true;
		this.setState({});
	}
	changeGiftName = (e,record)=>{
		let index = this.findIndex(this.data,record);
		console.log(index);
		this.data[index].gift_name = e.target.value;
		this.data[index].isChange = true;
		this.setState({});
	}
	changeGiftPriceGold = (value,record)=>{
		let index = this.findIndex(this.data,record);
		this.data[index].gift_price_gold = value;
		this.data[index].isChange = true;
		this.setState({});
	}
	changeGiftPriceSilver = (value,record)=>{
		let index = this.findIndex(this.data,record);
		this.data[index].gift_price_silver = value;
		this.data[index].isChange = true;
		this.setState({});
	}
	addGift = ()=>{
		this.baseKey++;
		let obj = {//新增一行
			key:this.baseKey,
			gift_id:'',
			gift_img:'',
			gift_name:'',
			gift_price_gold:"",
			gift_price_silver:"",
			add:true//表示是新增的未保存的行
		}
		this.data.unshift(obj);
		this.setState({});
	}
	updateGift = (e,record)=>{//保存修改操作
		message.destroy();//清空提示//防止提示过多
		let index = this.findIndex(this.data,record);
		let newGift = this.data[index];
		console.log(e.currentTarget.parentNode.parentNode.childNodes[0].childNodes[1].childNodes[3]);
		if(!newGift.gift_img)
		{
			message.error("请选择图片!");
			return;
		}
		if(!newGift.gift_name)
		{
			message.error("请填写礼物名称!");
			return;
		}
		if(!newGift.gift_price_gold && newGift.gift_price_gold!=0)
		{
			message.error("请设置金币数值!");
			return;
		}
		if(newGift.gift_price_silver==="")
		{
			message.error("请设置银币数值!");
			return;
		}
		this.props.actions.updateGift(newGift);
	}
	deleteGift = (record)=>{//删除操作
		let index = this.findIndex(this.data,record);
		//删除当前索引
		if(this.data[index].add)//新增未保存的行
		{
			this.data.splice(index,1);
			this.setState({});
		}else{
			let option = {
				gift_id:this.data[index].gift_id
			}
			this.props.actions.deleteGift(option);
		}
		
	}
	changePagination=(pagination, filters, sorter)=>{
		//console.log(pagination);
		this.setState({
			currentPage:pagination.current,
			pageSize:pagination.pageSize
		})
	}
	render(){
		this.data = this.props.state.giftsData;
		const paginOption = {//分页配置项
			total:this.data.length,
		    showTotal:(total, range) => `共 ${total} 项，当前是${range[0]}-${range[1]} 项`,
		    pageSize:5,
		    defaultCurrent:1,
		}
		return(
			<div className="gifts">
				<div className="add-btn-container">
						<Button type="primary" onClick={this.addGift}>新增礼物</Button>
				</div>
				<Table columns={this.columns} dataSource={this.data} 
					pagination={paginOption}
					onChange={this.changePagination}
				/>
			</div>
		)
	}
}