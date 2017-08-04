var sql = require('./sql/SqlStatement.js')//常用sql语句
var mysql = require('mysql');
var conf = require('../conf/DBconf.js');
var fs = require('fs');
var path =require('path');
var pool = mysql.createPool(conf.mysql);
var crypto = require('crypto');
var async = require('async');
//邮箱发送验证码								
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '455902861@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'kjnmwoynayrybgdc'
    }
});


let userDao = {
	adminlogin:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function (err,connection) {
			if(err)
			{
				console.log(err);
				return;
			}
			connection.query(sql.manager.select,[req.body.name,req.body.pwd],function(error,result){
				connection.release();
				if(error)
				{
					resobj={
						"errcode" : "0",
						"msg" :"数据库操作失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					return;
				}
				
				if(result.length == 0)//没查到
				{
					resobj={
						"errcode" : "0",
						"msg" :"用户名或密码错误!",
						"data"	: ""
					}
				}else{
					resobj={
						"errcode" : "1",
						"msg" :"登陆成功!",
						"data"	: ""
					}

					res.cookie("adminlogin",{name:req.body.name,pwd:req.body.pwd});
				}
				res.json(resobj);
			});
		})
	},
	adminlogout:(req,res,next)=>{
		let resobj = {};
		res.clearCookie("adminlogin");
		resobj = {
			"errcode" : "1",
			"msg" :"注销成功!",
			"data"	: ""
		}
		res.json(resobj);
	},
	userRegist:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function(err,connection){
			if(err)
			{
				resobj={
					"errcode":"0",
					"msg":"数据库连接失败！请稍后再试!",
					"data":""
				}
				res.json(resobj);
				return;
			}
			connection.query(sql.user.selectTelIsUnique,[req.body.tel],function(error,result){
				if(error)
				{
					connection.release();
					resobj={
						"errcode":"0",
						"msg":"数据库tel查重失败！请稍后再试!",
						"data":""
					}
					console.log(error);
					res.json(resobj);
					return;
				}
				if(result.length >=1){
					connection.release();
					resobj={
						"errcode":"0",
						"msg":"当前手机号已被注册!",
						"data":"当前手机号已被注册!"
					}
					console.log(error);
					res.json(resobj);
					return;
				}else{
					let user_id = (Date.parse(new Date())/1000).toString().substr(0,10);
					let user_nickname = '用户'+user_id.substr(0,8);//主键
					connection.query(sql.user.insert,[user_id,req.body.tel,req.body.email,user_nickname,req.body.password],function(error,result){
						if(error)
						{
							connection.release();
							resobj={
								"errcode":"0",
								"msg":"数据库插入失败！请稍后再试!",
								"data":""
							}
							console.log(error);
							res.json(resobj);
							return;
						}else
						{
							//查询用户的所有信息
							connection.query(sql.user.selectAll,[req.body.tel],function(error,result){
								connection.release();
								if(error)
								{
									resobj={
										"errcode" : "0",
										"msg" :"数据库查询昵称失败！请稍后再试!",
										"data"	: ""
									}
									res.json(resobj);
									return;
								}
								else{
									resobj={
										"errcode":"1",
										"msg":"注册成功！",
										"data":result[0]
									}
									res.cookie("userinfo",result[0]);
									res.json(resobj);
									return;
								}
							});
						}
					})
				}
			});
			
		})
	},
	userLogin:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function (err,connection) {
			if(err)
			{
				resobj={
					"errcode":"0",
					"msg":"数据库连接失败！请稍后再试!",
					"data":""
				}
				res.json(resobj);
				return;
			}
			connection.query(sql.user.selectTel,[req.body.tel],function(error,result){
				if(error)
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"数据库查询失败！请稍后再试!",
						"data"	: ""
					}
					res.json(resobj);
					return;
				}
				
				if(result.length == 0)//没查到登录名tel
				{
					connection.release();
					resobj={
						"errcode" : "0",
						"msg" :"手机号不存在",
						"data":{
							telErr:"手机号不存在",
							pwdErr:""
						}
					}
					res.json(resobj);
					return;
				}else{
					connection.query(sql.user.select,[req.body.tel,req.body.password],function(error,result){
						if(error)
						{
							connection.release();
							resobj={
								"errcode" : "0",
								"msg" :"数据库查询失败！请稍后再试!",
								"data"	: ""
							}
							res.json(resobj);
							return;
						}
						if(result.length == 0)//没查到tel对应的密码
						{
							connection.release();
							resobj={
								"errcode" : "0",
								"msg" :"密码错误",
								"data"	:  {
									telErr:"",
									pwdErr:"密码错误"
								}
							}
							res.json(resobj);
							return;
						}else{
							//查询用户的所有信息
							connection.query(sql.user.selectAll,[req.body.tel],function(error,result){
								connection.release();
								if(error)
								{
									resobj={
										"errcode" : "0",
										"msg" :"数据库查询昵称失败！请稍后再试!",
										"data"	: ""
									}
									res.json(resobj);
									return;
								}
								else{
									resobj={
										"errcode" : "1",
										"msg" :"登陆成功!",
										"data"	: result[0]
									}
									res.cookie("userinfo",result[0]);
									res.json(resobj);
									return;
								}
							});
						}
					})
				}
			});
		})
	},
	userLogout:(req,res,next)=>{
		let resobj = {};
		res.clearCookie("userinfo");
		resobj = {
			"errcode" : "1",
			"msg" :"注销成功!",
			"data"	: ""
		}
		res.json(resobj);
	},
	selectAll:(req,res,next)=>{//返回更新cookie信息
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			//查询用户的所有信息
			connection.query(sql.user.selectAll,[req.body.tel],function(error,result){
				connection.release();
				if(error)
				{
					console.log(error);
					return;
				}
				else{
					res.cookie("userinfo",result[0]);
					res.json({
						"errcode":"1",
						"msg":"修改成功!",
						"data":"修改成功!",
					});
					return;
				}
			});
		})
	},
	applyAnchor:(req,res,next)=>{
		let resobj = {};
		if(!req.body.frontImg || !req.body.backImg || !req.body.handleImg || !req.body.realName|| !req.body.cardNumber|| !req.body.userName){//有一个为空，未接收到数据
			resobj={
				"errcode":"0",
				"msg":"资料上传失败!",
				"data":""
			}
			res.json(resobj);
			return;
		}else{
			resobj={
				"errcode":"1",
				"msg":"申请成功!",
				"data":{
					status:1 //未申请、申请失败0 申请成功 1 审核通过2
				}
			}
			res.json(resobj);
			//保存身份证照片等图片文件//防止阻塞，后生成文件
			//保存正面照
			let frontImgObj = userDao.imgMap(req.body.frontImg);
			var frontImgUsePath = "";
			fs.writeFile(path.resolve(__dirname,frontImgObj.fileSavePath),frontImgObj.dataBuffer,function(err){
				if(err){
					console.log("身份证正面照图片保存失败!");
					return;
		        }else{
		        	frontImgUsePath = frontImgObj.fileUsePath;
		        }
			});
			//保存背面照
			let backImgObj = userDao.imgMap(req.body.backImg);
			var backImgUsePath = "";
			fs.writeFile(path.resolve(__dirname,backImgObj.fileSavePath),backImgObj.dataBuffer,function(err){
				if(err){
					console.log("身份证反面照图片保存失败!");
					return;
		        }else{
		        	backImgUsePath = backImgObj.fileUsePath;
		        }
			});
			//保存正面照
			let handleImgObj = userDao.imgMap(req.body.handleImg);
			var handleImgUsePath = "";
			fs.writeFile(path.resolve(__dirname,handleImgObj.fileSavePath),handleImgObj.dataBuffer,function(err){
				if(err){
					console.log("手持身份证正面照图片保存失败!");
					return;
		        }else{
		        	handleImgUsePath = handleImgObj.fileUsePath;
	        			if(frontImgUsePath && backImgUsePath && handleImgUsePath){
							pool.getConnection(function(err,connection){
								if(err)
								{
									console.log("数据库连接失败！请稍后再试!");
									return;
								}else{
									connection.query(sql.apply_tmp.insert,[new Date(),req.body.userName,frontImgUsePath,backImgUsePath,handleImgUsePath,req.body.realName,req.body.cardNumber],function(error,result){
										connection.release();
										if(error){
											console.log(error);
											console.log("数据库插入失败！请稍后再试!");
											return;
										}else{
											console.log("保存完成！");
										}
									});
								}
							})
						}else{
							console.log("图片路径生成失败！");
						}



		        }
			});
		}
	},
	queryApplyState:(req,res,next)=>{
		let resobj = {};
		pool.getConnection(function(err,connection){
			if(err)
			{
				resobj={
					"errcode":"0",
					"msg":"数据库连接失败！请稍后再试!",
					"data":""
				}
				res.json(resobj);
				return;
			}else{
				connection.query(sql.apply_tmp.select,[req.body.userName],function(error,result){
					connection.release();
					if(error){
						resobj={
							"errcode":"0",
							"msg":"数据库查询失败！请稍后再试!",
							"data":""
						}
						res.json(resobj);
						return;
					}else{
						if(result.length == 0 || result[0].apply_status == 0)//申请表中没有该用户申请记录或者申请、审核不通过
						{
							resobj={
								"errcode":"1",
								"msg":"用户未申请或不通过!",
								"data":{
									status:0 //未申请、申请失败、审核不通过0 申请成功、申请中、审核中 1 审核通过2
								}
							}
							res.json(resobj);
							return;
						}else{
							resobj={
								"errcode":"1",
								"msg":"其他状态!",
								"data":{
									status:result[0].apply_status
								}
							}
							res.json(resobj);
							return;
						}
					}
				})
			}
		})
	},
	/*@params baseImg 图片的base64编码*/
	imgMap:(baseImg)=>{//base64图片保存及地址映射
		//base64保存为图片
		var imgData = baseImg;
	    //过滤data:URL
	    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	    var dataBuffer = new Buffer(base64Data, 'base64');
	    let filename = (Date.parse(new Date())/1000).toString();//时间戳+随机数作为图片名称
	    filename = filename + Math.floor(Math.random()*100000).toString();
	    let fileSavePath = "../../web/src/uploads/"+filename+".png";//图片保存的路径
	    let fileUsePath = "/uploads/"+filename+".png";//图片路径入库的值//实际使用的路径
	    let obj = {
	    	fileSavePath:fileSavePath,
	    	fileUsePath:fileUsePath,
	    	dataBuffer:dataBuffer
	    }
	    return obj;
	},
	saveLiveInfo:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			//查询除自己之外liveURL是否唯一
			connection.query(sql.anchor.isUrlUnique,[req.body.liveUrl,req.body.userName],function(error,result){
				if(error){
					connection.release();
					console.log(error);
					return;
				}
				if(result.length > 0)//已存在
				{
					connection.release();
					res.json({
						"errcode":"0",
						"msg":"URL已存在",
						"data":"当前URL后缀已被占用!请更换!"
					})
					return;
				}else{//不存在
					//主播设置自己的直播间的信息 房间名、URL、频道、直播公告
					let bg_url = "../web/src/uploads/screenshoot/"+req.body.userID+".png";
					connection.query(sql.anchor.anchorUpdate,[req.body.roomName,req.body.liveUrl,req.body.liveNotice,req.body.channel,bg_url,req.body.userName],function(error,result){
						connection.release();
						if(error){
							console.log(error);
							return;
						}
						//复制文件 初始化直播间预览图片 
						fs.createReadStream("../web/src/static/img/avatar.png").pipe(fs.createWriteStream(bg_url));

						userDao.queryAnchorLiveInfo(req,res,next);
					})
				}
			})
		});
	},
	queryAnchorLiveInfo:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			//查询当前主播信息
			connection.query(sql.anchor.selectByName,[req.body.userName],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				res.json({
					"errcode":"1",
					"msg":"操作成功!",
					"data":result[0]
				})
				return;
			})
		});
	},
	queryAnchorLiveInfoByUrl:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			//查询当前主播信息
			connection.query(sql.anchor.selectByUrl,[req.body.url],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				res.json({
					"errcode":"1",
					"msg":"查询成功!",
					"data":result[0]
				})
				return;
			})
		});
	},
	anchorStartShow:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			//获取信息并配合时间戳生成md5密钥
			connection.query(sql.anchor.selectMd5CreateInfo,[req.body.userName],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				//连接未加密的字符串
				let unEncodedString = result[0].anch_name+result[0].user_pass+result[0].anch_live_url+(Date.parse(new Date())/1000).toString();
			    let hash = crypto.createHash("md5");  //创建返回md5的hash对象
			    hash.update(unEncodedString);  //生成hash内容
			    let encoded = hash.digest('hex');  //计算传递给散列的所有数据 编码为hex
			    //console.log(encoded);
				pool.getConnection(function(err,connection){
					if(err){
						console.log(err);
						return;
					}
					// let status;
					// if(req.body.isStartShow){
					// 	status = 1;
					// }else{
					// 	status = 0;
					// }
					let status = 0;//开始直播仅做获取推流码使用，不修改直播状态
					connection.query(sql.anchor.startShow,[status,encoded,req.body.userName],function(error,result){
						connection.release();
						if(error){
							console.log(error);
							return;
						}
						userDao.queryAnchorLiveInfo(req,res,next);
					});
				});
			});
		});

	},
	getAllUsers:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err)
			{
				console.log(err); 
				return;
			}
			connection.query(sql.role.select,function(error,roleResult){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
					pool.getConnection(function(err,connection){
						if(err)
						{
							console.log(err); 
							return;
						}
						connection.query(sql.user.selectAllUsers,function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}
							for(let i in result){
								result[i].key = result[i].user_id;
								result[i].role = result[i].anch_role || result[i].user_role;
								for(let j in roleResult){
									if(result[i].role == roleResult[j].role_id)
										result[i].roleName = roleResult[j].role_name;
								}
							}
							res.json({
								"errcode":"1",
								"msg":"获取所有用户数据成功!",
								"data":result
							})
						});
					});
			});
		});
	},
	updateUser:(req,res,next)=>{
		pool.getConnection(function(err,connection){//昵称查重
			if(err)
			{
				console.log(err); 
				return;
			}
			connection.query(sql.user.selectNicknameIsUnique,[req.body.user_nickname,req.body.user_tel],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				
				if(result.length > 0)
				{
					res.json({
						"errcode":"0",
						"msg":"该昵称已被使用",
						"data":''
					})
					return;
				}else{
					pool.getConnection(function(err,connection){
						if(err)
						{
							console.log(err); 
							return;
						}
						connection.query(sql.user.backUpdate,[req.body.user_nickname,req.body.user_money_gold,req.body.user_money_silver,req.body.user_tel],function(error,roleResult){
							connection.release();
							if(error){
								console.log(error);
								return;
							}
							
							userDao.getAllUsers(req,res,next);
						});
					});
				}
			});
		});
	},
	searchUser:(req,res,next)=>{
		if(!req.body.keyWords) //空或者其他
			userDao.getAllUsers(req,res,next);
		else 
			pool.getConnection(function(err,connection){
			if(err)
			{
				console.log(err); 
				return;
			}
			connection.query(sql.role.select,function(error,roleResult){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
					pool.getConnection(function(err,connection){
						if(err)
						{
							console.log(err); 
							return;
						}
						connection.query(sql.user.selectByNickname,['%'+req.body.keyWords+'%'],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}
							for(let i in result){
								result[i].key = result[i].user_id;
								result[i].role = result[i].anch_role || result[i].user_role;
								for(let j in roleResult){
									if(result[i].role == roleResult[j].role_id)
										result[i].roleName = roleResult[j].role_name;
								}
							}
							res.json({
								"errcode":"1",
								"msg":"获取所有用户数据成功!",
								"data":result
							})
						});
					});
			});
		});	
	},
	isUserExist:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}	
			connection.query(sql.user.selectTel,[req.body.tel],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				if(result.length > 0){
					res.json({
						"errcode":"1",
						"msg":"当前用户存在",
						"data":'yes'
					})
				}else{
					res.json({
						"errcode":"0",
						"msg":"该用户不存在",
						"data":'no'
					})
				}
			});
		});
	},
	isEmailMatch:(req,res,next)=>{
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}	
			connection.query(sql.user.isEmailMatch,[req.body.tel,req.body.email],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				if(result.length > 0){
					res.json({
						"errcode":"1",
						"msg":"账号密保邮箱匹配",
						"data":'yes'
					})
				}else{
					res.json({
						"errcode":"0",
						"msg":"账号与密保邮箱不匹配",
						"data":'no'
					})
				}
			});
		});
	},
	postEmailCaptcha:(req,res,next)=>{
		let email = req.body.email;
		let tel = req.body.tel;
		let sourceStr = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let sourceArr = sourceStr.split('');
		let captcha = [];
		for(let i = 0;i<6;i++){
			captcha.push(sourceArr[Math.floor(Math.random()*63)]);//0~62
		}
		captcha = captcha.join('');
		let mailOptions = {
		    from: '455902861@qq.com',
		    to: email,
		    subject: '【密码找回】账号'+tel+"密码找回验证码",//标题
		    html: '<p>您的验证码是:</p><b>'+captcha+'</b><p>请勿将验证码泄露给他人,验证码30分钟内有效</p>'
		}
		transporter.sendMail(mailOptions,function(err,info){
			if(err)
				console.log(err);
			//验证码有效期
			res.cookie('fgpwdstore',{tel:tel,email:email,captcha:captcha}, { maxAge: 1800000, httpOnly: true });
			res.json({
				"errcode":"1",
				"msg":"发送成功",
				"data":''
			});
		});
	},
	checkCaptcha:(req,res,next)=>{
		let cookies = req.headers.cookie || '';
		let arrCookie = cookies.split(';') || [];
	    for(let i in arrCookie){
	        var arr = arrCookie[i].trim().split("=");
	        if (arr[0] == "fgpwdstore") {
	            if (arr.length > 1)
	                fgpwd = arr[1];
	            else
	                fgpwd = null;
	        }
	    }
	    if(fgpwd){
	        fgpwd = JSON.parse(decodeURIComponent(fgpwd).substring(2));
	        if(req.body.tel != fgpwd.tel || req.body.captcha != fgpwd.captcha){
	        	res.json({
					"errcode":"0",
					"msg":"验证码错误!请核对后重新输入!",
					"data":'验证码错误!请核对后重新输入!'
				});
	        }else{
	        	res.json({
					"errcode":"1",
					"msg":"验证码核对通过!",
					"data":'yes'
				});
	        }
	    }
	    else{
	    	res.json({
				"errcode":"0",
				"msg":"验证码已失效!请重新获取!",
				"data":'验证码已失效!请重新获取!'
			});
	    }
	},
	fgNewPwd:(req,res,next)=>{
		let tel = req.body.tel;
		let sourceStr = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let sourceArr = sourceStr.split('');
		let newpwd = [];
		for(let i = 0;i<16;i++){
			newpwd.push(sourceArr[Math.floor(Math.random()*63)]);//0~62
		}
		newpwd = newpwd.join('');
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.user.updatePwdByTel,[newpwd,tel],function(error,result){
				if(error){
					console.log(error);
					return;
				}
				res.json({
					"errcode":"1",
					"msg":"新密码生成成功!",
					"data":newpwd
				});
			});
		});
	},
	updateAvatar:(req,res,next)=>{
		let tel = req.body.tel;
		let avatar = req.body.avatar;

		let avatarImgObj = userDao.imgMap(avatar);
		var avatarImgUsePath = "";
		fs.writeFile(path.resolve(__dirname,avatarImgObj.fileSavePath),avatarImgObj.dataBuffer,function(err){
			if(err){
				console.log("头像修改保存失败!");
				res.json({
					"errcode":"0",
					"msg":"头像修改保存失败!",
					"data":"头像修改保存失败!",
				});
				return;
	        }else{
	        	avatarImgUsePath = avatarImgObj.fileUsePath;
	        	if(avatarImgUsePath)
		        	pool.getConnection(function(err,connection){
						if(err)
						{
							console.log(err);
							return;
						}else{
							connection.query(sql.user.updateAvatar,[avatarImgUsePath,tel],function(error,result){
								connection.release();
								if(error){
									console.log(error);
									return;
								}else{
									userDao.selectAll(req,res,next);
								}
							});
						}
					})
		        else{
		        	console.log("头像图片路径生成失败!");
		        	res.json({
						"errcode":"0",
						"msg":"头像图片路径生成失败!",
						"data":"头像图片路径生成失败!",
					});
		        }
	        }
		});
	},
	updateNickname:(req,res,next)=>{
		let tel = req.body.tel;
		let nickName = req.body.nickName;
		//昵称查重
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.user.selectNicknameIsUnique,[nickName,tel],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				if(result.length > 0){
					res.json({
						"errcode":"0",
						"msg":"该昵称已被占用!",
						"data":"该昵称已被占用!",
					});
				}else{
					//更新
					pool.getConnection(function(err,connection){
						if(err){
							console.log(err);
							return;
						}
						connection.query(sql.user.updateNickname,[nickName,tel],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}

							userDao.selectAll(req,res,next);
						});
					});
				}
			});
		});
	},
	updateEmail:(req,res,next)=>{
		let tel = req.body.tel;
		let email = req.body.email;
		//更新
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.user.updateEmail,[email,tel],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				userDao.selectAll(req,res,next);
			});
		});
	},
	updatePwd:(req,res,next)=>{
		let tel = req.body.tel;
		let oldpwd = req.body.oldpwd;
		let newpwd = req.body.newpwd;
		//校验原密码
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.user.selectPwdByTel,[tel],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				if(result[0].user_pass != oldpwd)
				{
					res.json({
						"errcode":"0",
						"msg":"原密码不正确!",
						"data":"原密码不正确!",
					});
					return;
				}else{
					//更新
					pool.getConnection(function(err,connection){
						if(err){
							console.log(err);
							return;
						}
						connection.query(sql.user.updatePwdByTel,[newpwd,tel],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}
							res.clearCookie("userinfo");
							res.json({
								"errcode":"1",
								"msg":"密码修改成功!请重新登录!",
								"data":"密码修改成功!请重新登录!",
							});
							//userDao.selectAll(req,res,next);
						});
					});
				}
			});
		});
	},
	selectIsFocusThisRoom:(req,res,next)=>{
		if(!req.body.userName){
			res.json({
				"errcode":"0",
				"msg":"未获取到用户名！用户未登录",
				"data":false,//已关注
			});
			return;
		}
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return;
			}
			connection.query(sql.user.selectFocus,[req.body.userName],function(error,result){
				connection.release();
				if(error){
					console.log(error);
					return;
				}
				//console.log(result[0].user_focus);
				let arr = result[0].user_focus.split(',');
				for(let i in arr){
					if(arr[i] == req.body.url)
					{
						res.json({
							"errcode":"1",
							"msg":"当前用户已关注该直播间",
							"data":true,//已关注
						});
						return;
					}
				}
				res.json({
					"errcode":"1",
					"msg":"当前用户未关注该直播间",
					"data":false,//已关注
				});
			});
		});
	},
	focus:(req,res,next)=>{
		if(req.body.action == 'add')//添加关注
			pool.getConnection(function(err,connection){
				if(err){
					console.log(err);
					return;
				}
				//先查询出来
				connection.query(sql.user.selectFocus,[req.body.userName],function(error,result){
					if(error){
						connection.release();
						console.log(error);
						return;
					}
					let newFocus = result[0].user_focus+req.body.url+',';//拼接字符串
					//console.log(newFocus);
					//更新用户关注
					connection.query(sql.user.updateFocus,[newFocus,req.body.userName],function(error,result){
						if(error){
							connection.release();
							console.log(error);
							return;
						}
						//更新主播被关注数
						connection.query(sql.anchor.updateAddFocus,[req.body.url],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}
							//查询并返回结果
							userDao.selectIsFocusThisRoom(req,res,next);
						})
					});
				});
			});
		else//取消关注
			pool.getConnection(function(err,connection){
				if(err){
					console.log(err);
					return;
				}
				//先查询出来
				connection.query(sql.user.selectFocus,[req.body.userName],function(error,result){
					if(error){
						connection.release();
						console.log(error);
						return;
					}
					// let newFocus = result[0].user_focus+req.body.url+',';//拼接字符串
					let arr = result[0].user_focus.split(',')
					//console.log(arr);
					for(let i in arr){
						if(arr[i] == req.body.url)
						{
							arr.splice(i,1);
							break;
						}
					}
					//console.log(arr);
					let newFocus = arr.join(',');
					//console.log(newFocus);
					//更新用户关注
					connection.query(sql.user.updateFocus,[newFocus,req.body.userName],function(error,result){
						if(error){
							connection.release();
							console.log(error);
							return;
						}
						//更新主播被关注数
						connection.query(sql.anchor.updateDelFocus,[req.body.url],function(error,result){
							connection.release();
							if(error){
								console.log(error);
								return;
							}
							//查询并返回结果
							userDao.selectIsFocusThisRoom(req,res,next);
						})
					});
				});
			});
	},
	getAllFocusRoom:(req,res,next)=>{
		pool.getConnection(function(err,connection){
				if(err){
					console.log(err);
					return;
				}
				//先查询出来
				connection.query(sql.user.selectFocus,[req.body.userName],function(error,result){
					if(error){
						connection.release();
						console.log(error);
						return;
					}
					let arr = result[0].user_focus.split(',');
					let resArr = [];
					var count = 0;
					async.whilst(
					    function() { return count < arr.length; },
					    function(callback) {
					   
					        pool.getConnection(function(err,connection){
								if(err){
									console.log(err);
									return;
								}
								connection.query(sql.anchor.selectByUrl,[arr[count]],function(error,result){
									connection.release();
									if(error){
										connection.release();
										console.log(error);
										return;
									}
									resArr.push(result[0]);
									count++;
									callback();
								})
							})
					    },
					    function (err, n) {
					        //console.log(resArr);
					        resArr = resArr.slice(0,-1);//去掉最后一个因,产生的无用元素
					        //console.log(resArr);
					        if(err)
					        	res.json({
									"errcode":"0",
									"msg":"获取用户关注直播间数据失败",
									"data":err
								});
					        else
						        res.json({
									"errcode":"1",
									"msg":"获取用户关注直播间数据成功",
									"data":resArr
								});
					    }
					);
				});
		});
	},
	getFreeChest:(req,res,next)=>{
		//console.log(req.body);
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return
			}
			connection.query(sql.user.updateFreeSilver,[req.body.userName],function(error,result){
				if(error){
					console.log(error);
					return
				}
				res.json({
					"errcode":"1",
					"msg":"免费银币获取成功",
					"data":''
				});
			})
		});
	}
}

module.exports = userDao;