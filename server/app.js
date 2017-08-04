var path = require('path');
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var io = require('socket.io');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var pkg = require('../package.json');

var sql = require('./dao/sql/SqlStatement.js')//常用sql语句
var mysql = require('mysql');
var conf = require('./conf/DBconf.js');
var pool = mysql.createPool(conf.mysql);

const url = require('url');
//var port = pkg.config.devPort;
var port = 80;
var host = pkg.config.devHost;

var app = express();

//页面入口 防止多次渲染报错，捕获每个请求
 app.all('/',function (req,res) {//index
     res.render('index.html');
});
  app.all('/index',function (req,res) {//index
     res.redirect('/');
});
 app.all('/all',function (req,res) {
     res.render('index.html');
});
 app.all('/room/*',function (req,res) {
     res.render('index.html');
});
  app.all('/member',function (req,res) {
     res.render('index.html');
});
 app.all('/admin',function (req,res) {
     res.render('index.html');
});
 app.all('/manage',function (req,res) {
     res.render('index.html');
});
//设置view的路径

app.set('views','../web/src');
//app.set('views','./test/');
app.set('view engine','html');
app.engine('html',ejs.renderFile);

// //静态文件托管路径设置
//打包后的js、css、静态图片等
app.use(express.static('../web/src/output'));

//数据解析
app.use(bodyParser.json({limit:'10mb'}));//解析applicaton/json的数据 请求体最大不得超过10M
app.use(bodyParser.urlencoded({extended:true}));//解析application/x-www-form-urlencoded数据


//路由
var gift = require('./routes/gift.js');
var serverinfo = require('./routes/serverInfo.js');
var user = require('./routes/user.js');
var channel = require('./routes/channel.js');
var apply = require('./routes/apply.js');
var room = require('./routes/room.js');
var barrage = require('./routes/barrage.js');


app.use('*',function(req,res,next){//每次请求都更新用户的cookie
    //console.log(req.headers.cookie);
    let userInfo;
    req.headers.cookie = req.headers.cookie || '';
    let arrCookie = req.headers.cookie.split(';') || [];
    //console.log(arrCookie);
    for(let i in arrCookie){
        var arr = arrCookie[i].trim().split("=");
        if (arr[0] == "userinfo") {
            if (arr.length > 1)
                userInfo = arr[1];
            else
                userInfo = null;
        }
    }
    if(userInfo)
        userInfo = JSON.parse(decodeURIComponent(userInfo).substring(2));
    //console.log(userInfo);
    if(userInfo){
        //查询用户的所有信息
        pool.getConnection(function(err,connection){
            if(err)
                return;
            connection.query(sql.user.selectAll,[userInfo.user_tel],function(error,result){
                connection.release();
                if(error)
                {
                    console.log(error);
                    return;
                }
                else{
                    res.cookie("userinfo",result[0]);
                    next();
                }
            });
        })
    }else{
        next();
    }
});

app.use("/api/server",serverinfo);
app.use("/api/user",user);
app.use("/api/gift",gift);
app.use("/api/channel",channel);
app.use("/api/apply",apply);
app.use("/api/room",room);
app.use("/api/barrage",barrage);

//视频流截图生成预览图片
setInterval(function(){//只能截图当前在播的视频流
    pool.getConnection(function(err,connection){
        if(err){
            console.log(err);
            return;
        }
        connection.query(sql.anchor.selectLivingUrl,function(error,result){
            connection.release();
            if(error){
                console.log(error);
                return;
            }
            //console.log(result);
            result.map((item,index)=>{
                let file = '../web/src/uploads/screenshoot/'+item.user_id+'.png';
                var command = ffmpeg("rtmp://"+pkg.config.devHost+":1935/live/"+item.anch_live_url);
                command.on('end',function(files){
                    //更新入库
                    pool.getConnection(function(err,connection){
                        if(err) {
                            console.log(err);
                            return;
                        }
                        connection.query(sql.anchor.updatePreviewBg,[file.substr(10),item.anch_live_url],function(error,result){
                            connection.release();
                            if(error){
                                console.log(error);
                                return;
                            }
                            console.log("更新--"+item.anch_live_url+"--视频流预览图成功!["+new Date().toLocaleString()+"]");
                        });
                    });
                }).on('error',function(err){
                    console.log("视频流--"+item.anch_live_url+"--更新缩略图出错!");
                    console.log(err.message);
                    return false;
                }).outputOptions(['-f image2', '-vframes 1', '-vcodec png', '-f rawvideo', '-s 810x450', '-ss 00:00:01'])
                .output(file)
                .run();
            });
        })
    });
},60000);//1min截一次图























var server = app.listen(port,function () {
    console.log('Server Listening at http://%s:%d',host,port);
});

var ioServer = io.listen(server);
ioServer.sockets.on("connection",function(socket){


    let roomName = url.parse(socket.request.headers.referer).pathname;
    let roomLocationTag = roomName.substr(0,6);
    roomName = roomName.substr(6);
    //根据客户端连接请求的url地址提取出主播的推流播放url地址，并据此生成房间
    if(roomLocationTag == '/room/')//
    	socket.join(roomName,function(){//join room success func
            pool.getConnection(function(err,connection){
                connection.query(sql.anchor.updateAddPeople,[roomName],function(error,result){
                  connection.release();
                    if(error){
                      console.log(error);
                    }
                    console.log("房间"+roomName+" 人数加1");
                })
            })
        });

    //html与jsx组件有两次socket连接，人数需除2
	socket.emit('welcome', { welcome: '欢迎来到本直播间!直播间禁止发送违法、辱骂、地域黑等不当言论！违者将根据情况进行处理！' });
	socket.on('postDanmu', function (data) {//接受用户发送的弹幕并广播出去
        console.log(data);
		ioServer.sockets.in(roomName).emit('channelDanmu',data);//发送房间消息
	});
    socket.on('giveGifts', function (data) {//接受用户的送礼信息并广播出去
        //console.log(data);
        ioServer.sockets.in(roomName).emit('channelGifts',data);//发送房间消息
    });
    socket.on("disconnect",function(){//监听断开连接
        if(roomLocationTag == '/room/')//
            pool.getConnection(function(err,connection){
                connection.query(sql.anchor.updateDelPeople,[roomName],function(error,result){
                  connection.release();
                    if(error){
                      console.log(error);
                    }
                    console.log("房间"+roomName+" 人数减1");
                })
            })
    })
});





ioServer.sockets.on("disconnect",function(socket){
    let roomName = url.parse(socket.request.headers.referer).pathname;
    roomName = roomName.substr(6);
    //根据客户端连接请求的url地址提取出主播的推流播放url地址，并据此生成房间
    console.log(roomName);
        
});
