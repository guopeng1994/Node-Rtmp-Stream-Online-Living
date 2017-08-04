import React,{Component} from 'react'
import {Icon} from 'antd'

export default class DanmuContent extends  React.Component{
    constructor(props){
        super(props);   
    }
    componentDidMount=()=>{
        //清屏
        $(".clear").on("click",function(){
            $(".danmu-content-detail").html('');
        });
        //滚动控制
        $(".scroll-Control").on("click",function(){
            if($(this).text() == '开始滚屏')
                $(this).text('停止滚屏');
            else if($(this).text() == '停止滚屏')
                $(this).text('开始滚屏');
        });
        let socket = this.props.socket;
        socket.on('channelGifts',function(data){
            let custom = '';
            let goldPrice = parseInt(data.count)*data.gift.gift_price_gold;//礼物金币价值
            if(goldPrice >= 100)
                custom = '，小小意思不成敬意~~';
            if(goldPrice >= 500)
                custom = '，有钱真好~';
            if(goldPrice >= 1000)
                custom = '，土豪的世界我们不懂~';
            if(goldPrice >= 4999)
                custom = '，真是羡煞旁人!!!';
            $(".danmu-content-detail").append('<li class="gifts"><span>'+data.giver+'</span>给主播送出了'+data.count+'个<label>'+data.gift.gift_name+custom+'</label><li>');
            let contentHeight = $(".danmu-content-detail")[0].scrollHeight;
            if($(".scroll-Control").text() == '停止滚屏')
                $(".danmu-content-detail").scrollTop(contentHeight);
        })
    }
    controlScroll=(e)=>{
        e.stopPropagation();
    }
    render() {
        return(
            <div className="danmu-container" onScroll={this.controlScroll}>
                {/*<!--弹幕内容-->*/}
                <div className="danmu-content">
                    <span className="scroll-Control">停止滚屏</span>
                    <span className="clear"><Icon type="delete" />清屏</span>
                    <div className="danmu-content-detail">
                    </div>
                </div>
            </div>
        );
    }
}