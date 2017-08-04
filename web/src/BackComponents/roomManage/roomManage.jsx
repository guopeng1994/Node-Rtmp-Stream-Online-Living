import React,{Component} from 'react'
import {Button,Popconfirm,Table,Input,Select,Cascader,Card,Row,Col,Upload,Icon,message,Popover} from 'antd'

const Option = Select.Option;
import './roomManage.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/room/room.actions.js'
import * as userActions from '../../redux/user/user.actions.js'

@connect((state={}) => {
    return {
        state:state.room,
        userState:state.user
    };
}, (dispatch) => {
    return{
     actions: bindActionCreators(actions,dispatch),
     userActions: bindActionCreators(userActions,dispatch),
}})

export default class RoomManage extends React.Component{
	constructor(props){
		super(props);
		this.state={
			banReasonVisible:false,
			searchSelect:"anch_live_room_name"
		}
		this.props.actions.getAllAnchorRooms();
		this.props.userActions.getChannelsData();
		this.props.actions.getRecomm();
	}
	updateAnchor=(index)=>{
		message.destroy();
		if(this.data[index].anch_live_room_name == ""){
			message.error("请输入直播间标题!");
			return;
		}
		if(this.data[index].anch_live_url == ""){
			message.error("请输入直播间URL后缀!");
			return;
		}
		if(new RegExp(/[^a-z0-9]/).test(this.data[index].anch_live_url)){
			message.error("直播URL只能为数字、字母或数字字母的组合");
			return;
		}
		this.props.actions.updateAnchor(this.data[index]);
	}
	changeTitle=(e,index)=>{
		this.data[index].anch_live_room_name = e.target.value;
		this.data[index].isChange = true;
		this.setState({});
	}
	changeUrl=(e,index)=>{
		this.data[index].anch_live_url = e.target.value;
		this.data[index].isChange = true;
		this.setState({});
	}
	changeChannel=(value,index)=>{
		this.data[index].channel = value;
		this.data[index].isChange = true;
		this.setState({});
	}
	banAnchor=(index,isban)=>{
		if(this.data[index].banReason == "")// "" 为空 下拉框没有改变
		{
			this.data[index].banReason = "暴力、反动、危害国家安全等倾向";
		}

		let banReason = this.data[index].banReason;
		this.props.actions.banAnchor({
			userName:this.data[index].anch_name,
			ban:isban,
			banReason:banReason
		});
		this.setState({
			banReasonVisible:false
		})
	}
	banReasonPopover=(isShow)=>{//封禁原因弹出框的显示控制
		this.setState({
			banReasonVisible:isShow
		})
	}
	changeBanReason=(e,index)=>{
		this.data[index].banReason = e.target.value;
		this.setState({});
	}
	roomSearch=(e)=>{
		let keywords = e.target.value;
		let searchSelect = this.state.searchSelect;
		this.props.actions.roomSearch({
			searchType:searchSelect,
			keywords:keywords
		});
	}
	changeSearchSelect=(value)=>{
		this.setState({
			searchSelect:value
		});
	}
	changeRoomBgPic=(e)=>{
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
		reader.onload = (event)=> {//成功读取
			img.src = event.target.result;//设置图片 data:image....
		}
		reader.readAsDataURL(file);
		this.setState({});
	}
	saveRecomm=(e)=>{
		message.destroy();
		let pos = e.target.getAttribute('data-pos');
		let userName = e.target.parentNode.childNodes[0].value;
		let fileSrc = e.target.parentNode.childNodes[1].childNodes[2].src;
		if(!userName){
			message.error("请填写主播名称");
			return;
		}
		if(!fileSrc){
			message.error("请选择推荐位直播间背景图");
			return;
		}
		this.props.actions.saveRecomm({
			pos:pos,
			userName:userName,
			img:fileSrc
		})
	}
	render(){
		this.data = this.props.state.anchorRoomsData;
		const chans_data = this.props.userState.channelRelationData;
				this.columns = [{
		  title: '直播间标题',
		  dataIndex: 'anch_live_room_name',
		  key: 'anch_live_room_name',
		  render: (text,record,index) => <Input placeholder="请输入直播间标题" defaultValue={text} onChange={(e)=>this.changeTitle(e,index)}/>,
		}, {
		  title: '直播间后缀(URL)',
		  dataIndex: 'anch_live_url',
		  key: 'anch_live_url',
		  render: (text,record,index) => <Input placeholder="请输入直播间后缀" defaultValue={text} style={{width:"125px"}} onChange={(e)=>this.changeUrl(e,index)}/>,
		}, {
		  title: '所属主播',
		  dataIndex: 'anch_name',
		  key: 'anch_name',
		},  {
		  title: '所属分类',
		  dataIndex: 'channel',
		  key: 'channel',
		  render: (text,record,index) => {
		  	return <Cascader defaultValue={text} options={chans_data} allowClear={false} onChange={(value)=>this.changeChannel(value,index)}/>
		  }
		},{
		  title: '当前人数',
		  dataIndex: 'anch_live_people',
		  key: 'anch_live_people',
		},{
		  title: '直播状态',
		  dataIndex: 'anch_live_status',
		  key: 'anch_live_status',
		  render:text =>{
		  	if(text== 0)//已下播
		  		return 	<span className="status">已下播 <span className="status_gray"></span></span>
		  	if(text== 1)//直播中
		  		return 	<span className="status">直播中 <span className="status_green"></span></span>
		  	if(text== 2)//封禁
		  		return 	<span className="status">被封禁 <span className="status_red"></span></span>
		  }
		},{
		  title: '封禁原因',
		  dataIndex: 'anch_live_banreason',
		  key: 'anch_live_banreason',
		  render:text =><span className="ban_reason">{text}</span>
		},{
		  title: '操作',
		  key: 'action',
		  render: (text, record,index) =>{
		  	let banReasonDom = (
		  		<div className="ban-reason">
		  			<select onChange={(e)=>this.changeBanReason(e,index)} >
					  	<option value="暴力、反动、危害国家安全等倾向">暴力、反动、危害国家安全等倾向</option>
		  				<option value="恶意营销、虚假广告等">恶意营销、虚假广告等</option>
		  				<option value="色情或含有性诱惑等行为">色情或含有性诱惑等行为</option>
		  				<option value="言语严重侮辱他人、脏话等">言语严重侮辱他人、脏话等</option>
		  				<option value="直播吸烟、饮酒等不文明行为">直播吸烟、饮酒等不文明行为</option>
		  				<option value="其他国家政策不允许的行为等">其他国家政策不允许的行为等</option>
					</select>
		  			<div>
		  				<Button type="primary" onClick={()=>this.banReasonPopover(false)}>取消</Button>
		  				<Button type="primary" onClick={()=>this.banAnchor(index,true)}>封禁</Button>
		  			</div>
		  		</div>
		  	);
		  	let banDom = (
			    <span className='action'>
					    <Button icon='save' onClick={()=>this.updateAnchor(index)} disabled={!this.data[index].isChange}>保存</Button>
					    <Popover
					        content={banReasonDom}
					        title="封禁原因"
					        trigger="click"
					        //visible={this.state.banReasonVisible}
					      >
					    	<Button icon='lock' onClick={()=>this.banReasonPopover(true)}>封禁</Button>
					    </Popover>
			    </span>
		  	);
		  	let unbanDom = (
			    <span className='action'>
					    <Button icon='save' onClick={()=>this.updateAnchor(index)} disabled={!this.data[index].isChange}>保存</Button>
					    <Button icon='unlock' onClick={()=>this.banAnchor(index,false)}>解封</Button>
			    </span>
		  	);
		  	if(this.data[index].anch_live_status == 2)//被封禁需展示解封
		  		return unbanDom;
		  	else
		  		return banDom;
		  } ,
		}];
		let recommData = this.props.state.recommData;
		return(
			<div className="room-manage">
				<div className="add-btn-container">
						<Select style={{width:"70px",float:"left"}} defaultValue={this.state.searchSelect} onChange={this.changeSearchSelect}>
							<Option value="anch_live_room_name">标题</Option>
							<Option value="anch_live_url">后缀</Option>
							<Option value="anch_name">主播</Option>
							<Option value="anch_live_room_channel">二级频道</Option>
						</Select>
						<Input placeholder="输入搜索内容" className="search" onKeyUp={(e)=>{
							if(e.keyCode == "13")
								this.roomSearch(e);
						}}/>
				</div>
				<Table columns={this.columns} dataSource={this.data}/>


				<div className="recomm">
					<div className="recomm_groupname">首页大屏推荐位</div>
						<div className="index_bigscreen">
							<Row>
						      {
						      	recommData.map((item,index)=>{
						      		if(item.reco_pos <= 5)
						      			return(
			 								<Col span="6">
										        <Card title={"首页大屏序"+item.reco_pos} bordered={true}>
										        	<Input placeholder="输入主播名（昵称）" maxLength='10' defaultValue={item.reco_anchor || ''}/>
										        	<div className="upload-container">
												        <input title="点击选择图片" type="file" className="upload_img" onChange={this.changeRoomBgPic}/>
												        <div className="upload_btn">
												  			<Icon type='plus' />
												  			<div className="ant-upload-text">添加图片</div>
												  		</div>
												        <img className="preview_img" src={item.reco_img || ''}/>
											        </div>
											        <button onClick={this.saveRecomm} data-pos={item.reco_pos}>保存</button>
										        </Card>
									      	</Col>
						      			)
						      	})
						      }
						    </Row>
						</div>
					<div className="recomm_groupname">首页左推荐位</div>
						<div className="index_rmjj">
							<Row>
						      {
						      	recommData.map((item,index)=>{
						      		if(item.reco_pos > 5 && item.reco_pos<=9)
						      			return(
			 								<Col span="6">
										        <Card title={"左推荐位序"+(item.reco_pos-5)} bordered={true}>
										        	<Input placeholder="输入主播名（昵称）" maxLength='10' defaultValue={item.reco_anchor || ''}/>
										        	<div className="upload-container">
												        <input title="点击选择图片" type="file" className="upload_img" onChange={this.changeRoomBgPic}/>
												        <div className="upload_btn">
												  			<Icon type='plus' />
												  			<div className="ant-upload-text">添加图片</div>
												  		</div>
												        <img className="preview_img" src={item.reco_img || ''}/>
											        </div>
											        <button onClick={this.saveRecomm} data-pos={item.reco_pos}>保存</button>
										        </Card>
									      	</Col>
						      			)
						      	})
						      }
						    </Row>
						</div>
					<div className="recomm_groupname">首页中推荐位</div>
						<div className="index_zjdj">
							<Row>
						      {
						      	recommData.map((item,index)=>{
						      		if(item.reco_pos > 9 && item.reco_pos<=13)
						      			return(
			 								<Col span="6">
										        <Card title={"中推荐位序"+(item.reco_pos-9)} bordered={true}>
										        	<Input placeholder="输入主播名（昵称）" maxLength='10' defaultValue={item.reco_anchor || ''}/>
										        	<div className="upload-container">
												        <input title="点击选择图片" type="file" className="upload_img" onChange={this.changeRoomBgPic}/>
												        <div className="upload_btn">
												  			<Icon type='plus' />
												  			<div className="ant-upload-text">添加图片</div>
												  		</div>
												        <img className="preview_img" src={item.reco_img || ''}/>
											        </div>
											        <button onClick={this.saveRecomm} data-pos={item.reco_pos}>保存</button>
										        </Card>
									      	</Col>
						      			)
						      	})
						      }
						    </Row>
						</div>
					<div className="recomm_groupname">首页右推荐位</div>
						<div className="index_yylm">
							<Row>
						      {
						      	recommData.map((item,index)=>{
						      		if(item.reco_pos > 13)
						      			return(
			 								<Col span="6">
										        <Card title={"右推荐位序"+(item.reco_pos-13)} bordered={true}>
										        	<Input placeholder="输入主播名（昵称）" maxLength='10' defaultValue={item.reco_anchor || ''}/>
										        	<div className="upload-container">
												        <input title="点击选择图片" type="file" className="upload_img" onChange={this.changeRoomBgPic}/>
												        <div className="upload_btn">
												  			<Icon type='plus' />
												  			<div className="ant-upload-text">添加图片</div>
												  		</div>
												        <img className="preview_img" src={item.reco_img || ''}/>
											        </div>
											        <button onClick={this.saveRecomm} data-pos={item.reco_pos}>保存</button>
										        </Card>
									      	</Col>
						      			)
						      	})
						      }
						    </Row>
						</div>
				</div>
			</div>
		)
	}
}