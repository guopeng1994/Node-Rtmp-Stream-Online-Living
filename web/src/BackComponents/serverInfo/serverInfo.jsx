import React,{Component} from 'react'
import * as THREE from 'three'
import "./serverInfo.scss"
import * as pkg from '../../../../package.json'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../../redux/serverinfo/serverinfo.actions.js'

@connect((state={})=>{
    return {
        state:state.serverinfo
    }
},(dispatch)=>{
    return {
        actions:bindActionCreators(actions,dispatch)
    }
})

export default class ServerInfo extends React.Component{
	constructor(props){
		super(props);
		this.timeTicket = null;
	}
	fetchNewDate = ()=> {
        this.props.actions.getServerUsage();
        this.setState({});
    }
	componentDidMount= ()=>{
        if (this.timeTicket) {
            clearInterval(this.timeTicket);
        }
        this.timeTicket = setInterval(()=>{
        	this.fetchNewDate();
		},1000);
        
        var scene;
        var camera;
        var pointLight;
        var renderer;
        function initThree(){
            scene = new THREE.Scene();
            
            scene.fog = new THREE.Fog(0x555555,250,1000);
            
            
            camera = new THREE.PerspectiveCamera(40,3,1,10000);
            camera.position.z = 700;
            camera.position.x = 0;
            camera.position.y = 300;
            camera.lookAt({
                x:0,y:0,z:0
            });
            let loader = new THREE.FontLoader();//新建字体对象
            let fontJsonUrl = '/fonts/Microsoft_YaHei_Regular.json'; //你的字体json路径，文件名规格随意
            
            loader.load( fontJsonUrl, (font)=>{
                let options = {
                            size: 100, 
                            height: 30, 
                            weight: 'normal', 
                            font: font, 
                            curveSegments:12,
                            bevelThickness:2,
                            bevelSize:1.5,
                            bevelSegments:3,
                            bevelEnabled:true,
                        };
                //上部文字
                let textGeo = new THREE.TextGeometry( 'Welcome', options);
                textGeo.computeBoundingBox();
                textGeo.computeVertexNormals();

                let material = new THREE.MeshPhongMaterial({
                   color: 0x00FFFF
                })
                let mesh = new THREE.Mesh( textGeo, material );
                mesh.position.x = -325;
                mesh.position.y = 80;
                scene.add( mesh );
              
                //镜面-plane平面板
              
                let plane = new THREE.Mesh(
                    new THREE.PlaneBufferGeometry(2000,2000),
                    new THREE.MeshBasicMaterial({
                        color:0xffffff,
                        opacity:0.5,
                        transparent:true,
                        side:THREE.DoubleSide
                    })
                )
                plane.position.y = 0;
                plane.position.x = 0;
                plane.rotation.x = Math.PI/2;
                scene.add(plane);
              
              
                let mirrorTextGeo = new THREE.TextGeometry( 'Welcome', options);
                mirrorTextGeo.computeBoundingBox();
                mirrorTextGeo.computeVertexNormals();

                let mirrorMaterial = new THREE.MeshPhongMaterial({
                   color: 0x00FFFF
                })

                let mirrorMesh = new THREE.Mesh( textGeo, material );
                mirrorMesh.position.x = -325;
                mirrorMesh.position.y = -80;
                mirrorMesh.rotation.x = Math.PI;
                scene.add( mirrorMesh );
                  
            
                pointLight = new THREE.PointLight( 0xffffff, 7,1000 );
                pointLight.position.set( 0, 300, 700 );
                scene.add( pointLight );   
                renderer = new THREE.WebGLRenderer({
                    antialias:true
                });
                renderer.setSize(900,300);
                document.getElementById('welcome_info').appendChild(renderer.domElement);
                renderer.setClearColor(scene.fog.color);
                renderer.render(scene, camera);
            })
            
        }
        // function animate(){
        //     requestAnimationFrame(animate);
        //     if(!pointLight){
        //         return
        //     }else{
        //         pointLight.position.x += Math.cos(Date.now()/2000)*5;
        //         renderer.render(scene, camera);
        //     }
        // }
        initThree();
        //animate();
    }
    componentWillUnmount= ()=>{
        if (this.timeTicket) {
            clearInterval(this.timeTicket);
        }
    }
    getRelies=()=>{
        let dependencies = pkg.dependencies;//object
        let relies =[];
        for(let i in dependencies){
            relies.push({
                name:i,
                version:dependencies[i]
            })
        }
        return relies.map((item,index)=>{
            return (
                <li>
                    {"库名: "+item.name+" 版本: "+item.version}
                </li>
            )
        })
    }
	render(){
		return(
			<div className="serverinfo">
				<div className="welcome_info" id="welcome_info">
				</div>
				<div className="otherinfo">
					<table>
						<tr>
							<th>当前时间：</th>
							<td>{this.props.state.nowUsage.time || ''}</td>
						</tr>
						<tr>
							<th>Node.js版本 ：</th>
							<td>6.10.2</td>
						</tr>
						<tr>
							<th>React版本：</th>
							<td>15.4.2</td>
						</tr>
                        <tr>
                            <th>依赖库：</th>
                            <td>
                                <ul>
                                    {
                                        this.getRelies()
                                    }
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>处理器：</th>
                            <td>{this.props.state.nowUsage.cpucore}</td>
                        </tr>
                        <tr>
                            <th>服务器内存使用率：</th>
                            <td>{this.props.state.nowUsage.memory + '%'}</td>
                        </tr>
						<tr>
							<th>浏览器内核：</th>
							<td>{navigator.userAgent}</td>
						</tr>
					</table>
				</div>
				<div className="clear"></div>
			</div>
		)
	}
}