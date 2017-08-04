const sqlStatement = {
	manager:{
		insert:"",
		delete:"",
		select:"select * from manager where mana_name = ? and mana_pwd = ?",
		update:"",
	},
	user:{
		insert:"insert into users(user_id,user_tel,user_email,user_nickname,user_pass,user_role,user_money_gold,user_money_silver) values(?,?,?,?,?,2,100000,100000)",
		delete:"",
		isEmailMatch:"select * from users where user_tel = ? and user_email = ?",
		select:"select * from users where user_tel = ? and user_pass = ?",
		selectTel:"select * from users where user_tel = ?",
		selectTelIsUnique:"select user_tel from users where user_tel = ?",
		selectNicknameIsUnique:"select * from users where user_nickname = ? and user_tel != ?",
		selectNickname:"select user_nickname from users where user_tel = ?",
		selectAll:"select * from users left join anchor on users.user_nickname = anchor.anch_name where user_tel = ?",
		selectUserIsExist:'select * from users where user_nickname = ?',
		selectPwdByTel:"select user_pass from users where user_tel = ?",
		selectAllUsers:"select * from users left join anchor on users.user_nickname = anchor.anch_name",
		selectByNickname:"select * from users left join anchor on users.user_nickname = anchor.anch_name where user_nickname like ?",
		selectNicknameByKeywords:"select * from users where user_nickname REGEXP ?",
		backUpdate:"update users set user_nickname = ? ,user_money_gold = ?,user_money_silver = ? where user_tel=?",
		//送礼时查询余额是否足够
		checkSilverBalance:"select user_money_silver from users where user_nickname = ?",
		checkGoldBalance:"select user_money_gold from users where user_nickname = ?",
		updateSilverBalance:"update users set user_money_silver = ? where user_nickname = ?",
		updateGoldBalance:"update users set user_money_gold = ? where user_nickname = ?",
		//密码修改
		updatePwdByTel:"update users set user_pass = ? where user_tel = ?",
		//头像修改
		updateAvatar:"update users set user_avatar = ? where user_tel = ?",
		//昵称修改
		updateNickname:"update users set user_nickname = ? where user_tel = ?",
		//邮箱修改
		updateEmail:"update users set user_email = ? where user_tel = ?",
		//查询用户的关注
		selectFocus:"select user_focus from users where user_nickname = ?",
		//修改更新用户的关注
		updateFocus:"update users set user_focus = ? where user_nickname = ?",
		//免费礼物
		updateFreeSilver:"update users set user_money_silver = user_money_silver+1000 where user_nickname = ?"
	},anchor:{
		insert:"insert into anchor(anch_name) values(?)",
		selectIsExist:"select * from anchor where anch_name = ?",
		//推流用户验证
		pushValidate:"select anch_push_stream_md5 from anchor where anch_push_stream_md5 = ?",
		//判断是否被封
		selectIsBaned:"select anch_live_status from anchor where anch_push_stream_md5 = ?",
		//根据推流的密钥获取播放推流的URL
		selectUrlByMd5:"select anch_live_url from anchor where anch_push_stream_md5 = ?",
		//开始直播 生成md5推流密钥 更新直播状态
		startShow:"update anchor set anch_live_status = ? ,anch_push_stream_md5 = ? where anch_name = ?",
		//生成密钥所需的用户名、密码、推流url地址等
		selectMd5CreateInfo:"select anch_name,anch_live_url,user_pass from anchor left join users on anchor.anch_name = users.user_nickname where anch_name = ?",
		//生成密钥所需的用户名、密码、推流url地址等 rtmpserver中通过当前md5获取
		selectMd5CreateInfoByMd5:"select anch_name,anch_live_url,user_pass from anchor left join users on anchor.anch_name = users.user_nickname where anch_push_stream_md5 = ?",
		isUrlUnique:"select * from anchor where anch_live_url = ? and anch_name != ?",
		selectByRoomName:"select * from anchor left join channel_level2 on anchor.anch_live_room_channel = channel_level2.chl2_id left join channel_level1 on channel_level1.chl1_id=channel_level2.chl2_chl1_id where anch_live_room_name like ?",
		selectByUrl:"select * from anchor left join channel_level2 on anchor.anch_live_room_channel = channel_level2.chl2_id left join channel_level1 on channel_level1.chl1_id=channel_level2.chl2_chl1_id where anch_live_url like ?",
		selectByAnchorName:"select * from anchor left join channel_level2 on anchor.anch_live_room_channel = channel_level2.chl2_id left join channel_level1 on channel_level1.chl1_id=channel_level2.chl2_chl1_id where anch_name like ?",
		selectBychannel:"select * from anchor left join channel_level2 on anchor.anch_live_room_channel = channel_level2.chl2_id left join channel_level1 on channel_level1.chl1_id=channel_level2.chl2_chl1_id where chl2_name like ?",
		selectAll:"select * from anchor left join channel_level2 on anchor.anch_live_room_channel = channel_level2.chl2_id left join channel_level1 on channel_level1.chl1_id=channel_level2.chl2_chl1_id ",
		selectByName:"select * from anchor left join channel_level2 on anchor.anch_live_room_channel = channel_level2.chl2_id left join channel_level1 on channel_level1.chl1_id=channel_level2.chl2_chl1_id where anch_name = ?",
		selectIfCh2InUse:"select * from anchor where anch_live_room_channel =?",
		anchorUpdate:"update anchor set anch_live_room_name = ?,anch_live_url=?,anch_live_notice=?,anch_live_room_channel=(select chl2_id from channel_level2 where chl2_name = ?),anch_live_bg = ? where anch_name = ?",
		//后台直播间管理更新
		anchorManageUpdate:"update anchor set anch_live_room_name = ?,anch_live_url=? ,anch_live_room_channel=(select chl2_id from channel_level2 where chl2_name = ?) where anch_name = ?",
		updateBan:"update anchor set anch_live_status = ? ,anch_live_banreason = ? where anch_name = ?",
		updateUnBan:"update anchor set anch_live_status = ? ,anch_live_banreason = '' where anch_name = ?",
		//房管设置
		updateRoomManage:"update anchor set anch_room_manager = ? where anch_live_url = ?",
		selectManagers:"select anch_room_manager from anchor where anch_live_url = ?",
		//二级频道下所有在播主播的直播间信息
		getChannelRoomsById:"select * from anchor left join channel_level2 on anchor.anch_live_room_channel = channel_level2.chl2_id where anch_live_room_channel = ? and anch_live_status = '1' ",
		getAllChannelRooms:"select * from anchor left join channel_level2 on anchor.anch_live_room_channel = channel_level2.chl2_id where anch_live_status = '1' order by anch_live_people desc",
		//直播间人数设置
		updateAddPeople:"update anchor set anch_live_people = anch_live_people + 1 where anch_live_url = ?",
		updateDelPeople:"update anchor set anch_live_people = anch_live_people - 1 where anch_live_url = ?",
		//被关注数
		updateAddFocus:"update anchor set anch_focus_total = anch_focus_total + 1 where anch_live_url = ?",
		updateDelFocus:"update anchor set anch_focus_total = anch_focus_total - 1 where anch_live_url = ?",
		//礼物收取
		updateIncome:"update anchor set anch_income = anch_income + ? where anch_name = ?",
		//今日热门
		todayhot:"select * from anchor where anch_live_status = 1 order by anch_live_people desc",
		//查询当前在播的视频流的url
		selectLivingUrl:"select anch_live_url,user_id from anchor left join users on anchor.anch_name = users.user_nickname where anch_live_status = '1'",
		//更新直播缩略预览图片
		updatePreviewBg:"update anchor set anch_live_bg = ? where anch_live_url = ?",
		//更新直播状态
		updateStatus:"update anchor set anch_live_status = ? where anch_live_url = ?",
		matchRoomManager:"select * from anchor where anch_room_manager REGEXP ? "
	},apply_tmp:{
		insert:"insert into apply_tmp(apply_time,apply_user,apply_profile_card_front,apply_profile_card_back,apply_profile_handle_card,apply_realname,apply_cardnumber,apply_status) values(?,?,?,?,?,?,?,1)",
		delete:"",
		select:"select * from apply_tmp where apply_user = ? order by apply_time desc",
		selectAll:"select  FROM_UNIXTIME(unix_timestamp(apply_time),'%Y-%m-%d %H:%i:%S') as apply_time,apply_user,apply_profile_card_front,apply_profile_card_back,apply_profile_handle_card,apply_realname,apply_cardnumber,apply_status from apply_tmp",
		selectByStatusTime:"select FROM_UNIXTIME(unix_timestamp(apply_time),'%Y-%m-%d %H:%i:%S') as apply_time,apply_user,apply_profile_card_front,apply_profile_card_back,apply_profile_handle_card,apply_realname,apply_cardnumber,apply_status from apply_tmp where apply_status = ? and unix_timestamp(apply_time) between ? and ?",
		selectByStatus:"select FROM_UNIXTIME(unix_timestamp(apply_time),'%Y-%m-%d %H:%i:%S') as apply_time,apply_user,apply_profile_card_front,apply_profile_card_back,apply_profile_handle_card,apply_realname,apply_cardnumber,apply_status from apply_tmp where apply_status = ?",
		selectByTime :"select FROM_UNIXTIME(unix_timestamp(apply_time),'%Y-%m-%d %H:%i:%S') as apply_time,apply_user,apply_profile_card_front,apply_profile_card_back,apply_profile_handle_card,apply_realname,apply_cardnumber,apply_status from apply_tmp where unix_timestamp(apply_time) between ? and ?",
		updateStatus:"update apply_tmp set apply_status = ? where apply_time = ?",
	},role:{
		insert:"",
		delete:"",
		select:"select * from roles",
		update:"",
	},barrage:{
		insert:"insert into barrage_replace(br_be_replaced,br_replace_content) values(?,?)",
		delete:"delete from barrage_replace where br_id = ?",
		select:"select * from barrage_replace",
		selectUnique:"select * from barrage_replace where br_be_replaced = ? and br_id !=?",
		update:"update barrage_replace set br_be_replaced=? ,br_replace_content=? where br_id = ?",
	},gift:{
		insert:"insert into gifts(gift_img,gift_name,gift_price_gold,gift_price_silver) values(?,?,?,?)",
		delete:"delete from gifts where gift_id = ?",
		select:"select * from gifts where gift_name = ?",
		update:"update gifts set gift_img=?,gift_name=?,gift_price_gold=?,gift_price_silver=? where gift_id =?",
		selectAll:"select * from gifts",
		selectPathById:"select gift_img from gifts where gift_id = ?"
	},gifts_history:{
		insert:"insert into gifts_history(gifts_h_giver,gifts_h_giftId,gifts_h_num,gifts_h_time,gifts_h_receiver,gifts_h_payway) values(?,?,?,?,?,?)",
		selectAllCost:"select FROM_UNIXTIME(unix_timestamp(gifts_h_time),'%Y-%m-%d %H:%i:%S') as gifts_h_time,gifts_h_giver,gifts_h_giftId,gifts_h_num,gift_name,gift_price_gold,gift_price_silver,gifts_h_receiver,gifts_h_payway from gifts_history left join gifts on gifts_history.gifts_h_giftId = gifts.gift_id where gifts_h_giver = ?",
		selectAllIncome:"select FROM_UNIXTIME(unix_timestamp(gifts_h_time),'%Y-%m-%d %H:%i:%S') as gifts_h_time,gifts_h_giver,gifts_h_giftId,gifts_h_num,gift_name,gift_price_gold,gift_price_silver,gifts_h_receiver,gifts_h_payway from gifts_history left join gifts on gifts_history.gifts_h_giftId = gifts.gift_id where gifts_h_receiver = ?"
	},
	channel_lv1:{
		insert:"insert into channel_level1(chl1_name) values(?)",
		delete:"delete from channel_level1 where chl1_id = ?",
		select:"select * from channel_level1 where chl1_name = ?",//添加时查重
		updateSelect:"select * from channel_level1 where chl1_name = ? and chl1_id != ?",//修改时查重
		update:"update channel_level1 set chl1_name = ? where chl1_id =?",
		selectAll:"select * from channel_level1 left join channel_level2 on channel_level1.chl1_id=channel_level2.chl2_chl1_id",
		selectAllName:"select chl1_name from channel_level1"
	},channel_lv2:{
		insert:"insert into channel_level2(chl2_name,chl2_chl1_id) select ?,chl1_id from channel_level1 where chl1_name =?",
		delete:"delete from channel_level2 where chl2_id = ?",
		updateSelect:"select * from channel_level2 where chl2_name = ? and chl2_id !=?",//修改时查重
		select:"select * from channel_level2 where chl2_name = ?",//添加时查重
		selectAllIdName:"select chl2_id,chl2_name,chl1_name from channel_level2 left join channel_level1 on channel_level2.chl2_chl1_id=channel_level1.chl1_id",
		selectIfCh1InUse:"select * from channel_level2 where chl2_chl1_id =?",
		selectNameById:"select chl2_name from channel_level2 where chl2_id = ?",
		update:"update channel_level2 set chl2_name = ? ,chl2_chl1_id = (select chl1_id from channel_level1 where chl1_name =?) where chl2_id =?",
	},recommendation:{
		selectRecomms:"select * from recommendation left join anchor on recommendation.reco_anchor = anchor.anch_name order by reco_pos asc",
		selectIsExist:"select * from recommendation where reco_pos = ?",
		insert:"insert into recommendation(reco_pos,reco_img,reco_anchor) values(?,?,?)",
		update:"update recommendation set reco_img = ? ,reco_anchor = ? where reco_pos = ?"
	},ban_talk:{
		selectByRoom:"select * from ban_talk where ban_room = ?"
	}
}

module.exports = sqlStatement;