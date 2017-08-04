import React,{ Component } from 'react'

import './Footer.scss'

export default class Footer extends React.Component {
    render() {
        return (
            <footer>
                <p class="beian">
                    <a href="#">川ICP备00000001号</a> |
                    <a href="#">川网文[2017]0000-001号</a> |
                    <img src="/img/police.png"/><a href="#">川公网安备 00000000000001号</a>
                </p>
                <p class="contact">
                    成都无名氏文化有限公司 | 地址: 四川省成都市双流区 | 电话: 028-00000001
                </p>
            </footer>
        )
    }
}