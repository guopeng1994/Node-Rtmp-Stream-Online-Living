import React,{ Component } from 'react'
import './Recomm.scss'

export default class Recomm extends React.Component{
	constructor(props){
		super(props);
	}
    render(){
        return(
            <div className="recomm_types">
				<div className="rmjj">
					<p><span className="recomm_type">热门竞技</span></p>
					{
						this.props.recommData.map((item,index)=>{
							if(item.reco_pos >5 && item.reco_pos<=9)
								return(
									<a href={'/room/'+item.anch_live_url || ''}>
										<div className="live-rooms">
											<img src={item.reco_img || ''} className="live-rooms-bg"/>
											<div className="layer"></div>
											<img src="img/vedio-play.png" className="live-rooms-playicon"/>
											<p className="live-rooms-name">{item.anch_live_room_name || ''}</p>
											<p className="live-rooms-username">{item.anch_name  || ''}</p>
										</div>
									</a>
								)
						})
					}
				</div>
				<div className="zjdj">
					<p><span className="recomm_type">主机单机</span></p>
					{
						this.props.recommData.map((item,index)=>{
							if(item.reco_pos >9 && item.reco_pos<=13)
								return(
									<a href={'/room/'+item.anch_live_url || ''}>
									<div className="live-rooms">
										<img src={item.reco_img || ''} className="live-rooms-bg"/>
										<div className="layer"></div>
										<img src="img/vedio-play.png" className="live-rooms-playicon"/>
										<p className="live-rooms-name">{item.anch_live_room_name || ''}</p>
										<p className="live-rooms-username">{item.anch_name  || ''}</p>
									</div>
									</a>
								)
						})
					}
				</div>
				<div className="yllm">
					<p><span className="recomm_type">娱乐联盟</span></p>
					{
						this.props.recommData.map((item,index)=>{
							if(item.reco_pos >13 && item.reco_pos<=17)
								return(
									<a href={'/room/'+item.anch_live_url || ''}>
									<div className="live-rooms">
										<img src={item.reco_img || ''} className="live-rooms-bg"/>
										<div className="layer"></div>
										<img src="img/vedio-play.png" className="live-rooms-playicon"/>
										<p className="live-rooms-name">{item.anch_live_room_name || ''}</p>
										<p className="live-rooms-username">{item.anch_name  || ''}</p>
									</div>
									</a>
								)
						})
					}
				</div>
			</div>
        )
    }
}


