//首页主推荐位

import React ,{ Component } from 'react'
import './HeaderRecomm.scss'

export default class HeaderNav extends React.Component {
    constructor(props) {
        super(props);
    }
    changeRoom = (e,item)=>{
        let recomms = e.target.parentNode.parentNode.childNodes;
        for(let i =0 ;i<recomms.length;i++){
            recomms[i].className = ''
        }
        e.target.parentNode.className = 'room_selected';
        this.refs.goRoomLink.href = "/room/"+item.anch_live_url;
    }
    render() {
        return (
            <div className="header-recomm">
                {/*<!--正在直播-->*/ }
                <div className="recomm_container">

                    <div className="living-now">
                        <div id='myplayer'></div>
                        <div className="layer">
                            
                            {
                                this.props.recommData.map((item,index)=>{//默认值
                                    if(item.reco_pos ==1)
                                        return <a href={"/room/"+item.anch_live_url} ref='goRoomLink'><button>进入直播间</button></a>
                                })
                            }
                        </div>
                    </div>
                    <ul id="recomm_list">
                        {
                            this.props.recommData.map((item,index)=>{
                                if(item.reco_pos <=5)
                                {
                                    if(item.reco_pos == 1)
                                        return <li className="room_selected" onClick={(e)=>this.changeRoom(e,item)} data-url={item.anch_live_url}><div className="border-line"></div><img src={item.reco_img} /></li>
                                    else
                                        return <li onClick={(e)=>this.changeRoom(e,item)} data-url={item.anch_live_url}><div className="border-line"></div><img src={item.reco_img} /></li>
                                }
                            })
                        }
                    </ul>

                </div>
                <div className="clearfix"></div>
            </div>
        )
    }
}