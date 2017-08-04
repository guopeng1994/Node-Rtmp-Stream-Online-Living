/*
Navicat MySQL Data Transfer

Source Server         : 1
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : a

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-05-27 17:49:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `anchor`
-- ----------------------------
DROP TABLE IF EXISTS `anchor`;
CREATE TABLE `anchor` (
  `anch_name` varchar(10) NOT NULL,
  `anch_live_url` varchar(20) NOT NULL COMMENT '直播间房间url',
  `anch_live_room_name` varchar(20) DEFAULT NULL COMMENT '直播间',
  `anch_role` int(11) unsigned NOT NULL DEFAULT '3',
  `anch_live_room_channel` int(11) unsigned DEFAULT NULL COMMENT '直播间所在分类（频道）',
  `anch_live_status` int(11) NOT NULL DEFAULT '0' COMMENT '默认未直播、下播0 直播中1 封禁2',
  `anch_live_banreason` varchar(50) DEFAULT '' COMMENT '封禁原因',
  `anch_live_people` int(11) DEFAULT '0' COMMENT '直播间人数',
  `anch_live_notice` varchar(200) DEFAULT '' COMMENT '直播公告',
  `anch_push_stream_md5` varchar(200) DEFAULT NULL COMMENT '直播推流地址+用户名+密码组合加密 用作验证',
  `anch_room_manager` varchar(5000) DEFAULT '' COMMENT '房管列表',
  `anch_focus_total` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '直播间总关注数',
  `anch_live_bg` varchar(255) DEFAULT NULL COMMENT '封面',
  `anch_income` int(11) unsigned DEFAULT '0' COMMENT '收入',
  PRIMARY KEY (`anch_live_url`),
  KEY `fk_anchor_channel_level2_1` (`anch_live_room_channel`),
  KEY `fk_anchor_role` (`anch_role`),
  KEY `fk_anchor_users_1` (`anch_name`),
  CONSTRAINT `fk_anchor_channel_level2_1` FOREIGN KEY (`anch_live_room_channel`) REFERENCES `channel_level2` (`chl2_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_anchor_role` FOREIGN KEY (`anch_role`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_anchor_users_1` FOREIGN KEY (`anch_name`) REFERENCES `users` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of anchor
-- ----------------------------
INSERT INTO `anchor` VALUES ('金木研丶、狰', 'cold', '我的直播间', '3', '51', '0', '', '2', '大家好，我是新晋主播', 'ebca9360ebd2d956a4f557c22dddb396', '用户14913723,', '3', '../web/src/uploads/screenshoot/1489995054.png', '10998');
INSERT INTO `anchor` VALUES ('用户14920756', 'lao5', '钻石王老五带你淘金', '3', '48', '0', '', '0', '大家想淘金的加微信piannimeishangliang', 'd6cfbecadfdd0c92f0787aee1faa5121', '金木研丶、狰,', '1', '/uploads/screenshoot/1492075663.png', '2000');
INSERT INTO `anchor` VALUES ('1489995053', 'river', '黄河大道东', '3', '44', '0', '', '0', '谢谢大家的支持，每天08：00-14直播', '5704263e338ab79a2ac8a2b05e51c90d', '金木研丶、狰,', '1', '/uploads/screenshoot/1491372222.png', '0');

-- ----------------------------
-- Table structure for `apply_tmp`
-- ----------------------------
DROP TABLE IF EXISTS `apply_tmp`;
CREATE TABLE `apply_tmp` (
  `apply_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `apply_user` varchar(10) NOT NULL COMMENT '申请人',
  `apply_profile_card_front` varchar(255) NOT NULL COMMENT '身份证正面',
  `apply_profile_card_back` varchar(255) NOT NULL COMMENT '身份证反面',
  `apply_profile_handle_card` varchar(255) NOT NULL COMMENT '手持证件照',
  `apply_realname` varchar(4) NOT NULL,
  `apply_cardnumber` char(18) NOT NULL,
  `apply_status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`apply_time`),
  KEY `fk_apply_tmp_users_1` (`apply_user`),
  CONSTRAINT `fk_apply_tmp_users_1` FOREIGN KEY (`apply_user`) REFERENCES `users` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of apply_tmp
-- ----------------------------
INSERT INTO `apply_tmp` VALUES ('2017-03-23 11:31:02', '金木研丶、狰', 'uploads/149015060183741.png', 'uploads/149015060113826.png', 'uploads/149015060188536.png', '王小二', '548657895645125365', '-1');
INSERT INTO `apply_tmp` VALUES ('2017-03-23 11:32:49', '金木研丶、狰', 'uploads/149015036160001.png', 'uploads/149015036183591.png', 'uploads/149015036150538.png', '王小二', '548657895645125365', '2');
INSERT INTO `apply_tmp` VALUES ('2017-04-06 18:43:16', '1489995053', 'uploads/149147539556043.png', 'uploads/149147539529026.png', 'uploads/149147539559213.png', 'adw', '512465824596852458', '2');
INSERT INTO `apply_tmp` VALUES ('2017-04-13 17:31:41', '用户14920756', '/uploads/149207590041392.png', '/uploads/149207590057782.png', '/uploads/14920759004824.png', '昂劳务', '51309487625687293X', '2');

-- ----------------------------
-- Table structure for `ban_talk`
-- ----------------------------
DROP TABLE IF EXISTS `ban_talk`;
CREATE TABLE `ban_talk` (
  `ban_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '被禁言的时间',
  `baned_user` varchar(10) NOT NULL COMMENT '禁言的用户名',
  `ban_duration` int(11) NOT NULL COMMENT '禁言时长 5 10 30 1min 永久',
  `ban_room` varchar(20) NOT NULL COMMENT '在哪个房间被禁',
  PRIMARY KEY (`ban_time`),
  KEY `fk_ban_talk_users_1` (`baned_user`),
  KEY `fk_ban_talk_anchor_1` (`ban_room`),
  CONSTRAINT `fk_ban_talk_anchor_1` FOREIGN KEY (`ban_room`) REFERENCES `anchor` (`anch_live_url`),
  CONSTRAINT `fk_ban_talk_users_1` FOREIGN KEY (`baned_user`) REFERENCES `users` (`user_nickname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ban_talk
-- ----------------------------
INSERT INTO `ban_talk` VALUES ('2017-05-24 17:18:07', '1489995053', '50', 'cold');
INSERT INTO `ban_talk` VALUES ('2017-05-24 17:18:51', '1489995053', '50', 'river');

-- ----------------------------
-- Table structure for `barrage_replace`
-- ----------------------------
DROP TABLE IF EXISTS `barrage_replace`;
CREATE TABLE `barrage_replace` (
  `br_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `br_be_replaced` varchar(30) NOT NULL COMMENT '被替换的内容',
  `br_replace_content` varchar(30) NOT NULL COMMENT '替换成的内容',
  PRIMARY KEY (`br_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of barrage_replace
-- ----------------------------
INSERT INTO `barrage_replace` VALUES ('2', '哎', '*');
INSERT INTO `barrage_replace` VALUES ('3', '4396', '***');

-- ----------------------------
-- Table structure for `channel_level1`
-- ----------------------------
DROP TABLE IF EXISTS `channel_level1`;
CREATE TABLE `channel_level1` (
  `chl1_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `chl1_name` varchar(10) NOT NULL,
  PRIMARY KEY (`chl1_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of channel_level1
-- ----------------------------
INSERT INTO `channel_level1` VALUES ('35', '热门竞技');
INSERT INTO `channel_level1` VALUES ('36', '主机单机');
INSERT INTO `channel_level1` VALUES ('37', '娱乐联盟');
INSERT INTO `channel_level1` VALUES ('38', '网游专区');
INSERT INTO `channel_level1` VALUES ('39', '手游专区');
INSERT INTO `channel_level1` VALUES ('40', '大杂烩');

-- ----------------------------
-- Table structure for `channel_level2`
-- ----------------------------
DROP TABLE IF EXISTS `channel_level2`;
CREATE TABLE `channel_level2` (
  `chl2_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `chl2_name` varchar(10) NOT NULL,
  `chl2_chl1_id` int(11) unsigned NOT NULL COMMENT '二级分类的上级分类',
  PRIMARY KEY (`chl2_id`),
  KEY `fk_chan2_chan1` (`chl2_chl1_id`),
  CONSTRAINT `fk_chan2_chan1` FOREIGN KEY (`chl2_chl1_id`) REFERENCES `channel_level1` (`chl1_id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of channel_level2
-- ----------------------------
INSERT INTO `channel_level2` VALUES ('42', '英雄联盟', '35');
INSERT INTO `channel_level2` VALUES ('43', '炉石传说', '35');
INSERT INTO `channel_level2` VALUES ('44', '守望先锋', '35');
INSERT INTO `channel_level2` VALUES ('45', 'DOTA2', '35');
INSERT INTO `channel_level2` VALUES ('46', '穿越火线', '35');
INSERT INTO `channel_level2` VALUES ('47', '熊猫星秀', '37');
INSERT INTO `channel_level2` VALUES ('48', '户外直播', '37');
INSERT INTO `channel_level2` VALUES ('49', '主机游戏', '36');
INSERT INTO `channel_level2` VALUES ('50', '体育竞技', '37');
INSERT INTO `channel_level2` VALUES ('51', '我的世界', '36');
INSERT INTO `channel_level2` VALUES ('52', '跑跑卡丁车', '38');
INSERT INTO `channel_level2` VALUES ('53', '战争游戏', '38');
INSERT INTO `channel_level2` VALUES ('54', '王者荣耀', '39');
INSERT INTO `channel_level2` VALUES ('55', '天天酷跑', '39');
INSERT INTO `channel_level2` VALUES ('56', '阴阳师', '39');
INSERT INTO `channel_level2` VALUES ('57', '影评专区', '40');
INSERT INTO `channel_level2` VALUES ('58', '经融理财', '40');
INSERT INTO `channel_level2` VALUES ('59', '科技前沿', '40');
INSERT INTO `channel_level2` VALUES ('60', '体坛快讯', '40');
INSERT INTO `channel_level2` VALUES ('61', '使命召唤OL', '35');
INSERT INTO `channel_level2` VALUES ('62', '风暴英雄', '35');

-- ----------------------------
-- Table structure for `gifts`
-- ----------------------------
DROP TABLE IF EXISTS `gifts`;
CREATE TABLE `gifts` (
  `gift_id` int(11) NOT NULL AUTO_INCREMENT,
  `gift_img` varchar(100) NOT NULL,
  `gift_name` varchar(10) NOT NULL,
  `gift_price_gold` bigint(20) NOT NULL,
  `gift_price_silver` bigint(20) NOT NULL,
  PRIMARY KEY (`gift_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gifts
-- ----------------------------
INSERT INTO `gifts` VALUES ('1', '/uploads/1492585386000.png', '情书', '1000', '0');
INSERT INTO `gifts` VALUES ('2', '/uploads/1489664131000.png', '药丸', '0', '2000');
INSERT INTO `gifts` VALUES ('5', '/uploads/1489664227000.png', '巧克力', '4999', '0');
INSERT INTO `gifts` VALUES ('6', '/uploads/1489665402000.png', '香皂！', '50', '2000');
INSERT INTO `gifts` VALUES ('7', '/uploads/1489665426000.png', '我可能是个假红包', '5', '0');
INSERT INTO `gifts` VALUES ('8', '/uploads/1489665445000.png', '感冒胶囊', '0', '2000');
INSERT INTO `gifts` VALUES ('10', '/uploads/1492585616000.png', 'aaaaaaaaaa', '1', '1');

-- ----------------------------
-- Table structure for `gifts_history`
-- ----------------------------
DROP TABLE IF EXISTS `gifts_history`;
CREATE TABLE `gifts_history` (
  `gifts_h_giver` varchar(10) NOT NULL COMMENT '送出人',
  `gifts_h_giftId` int(11) NOT NULL COMMENT '礼物',
  `gifts_h_num` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '数量',
  `gifts_h_time` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '送礼时间',
  `gifts_h_receiver` varchar(10) NOT NULL COMMENT '收礼人',
  `gifts_h_payway` varchar(10) NOT NULL COMMENT '支付方式',
  PRIMARY KEY (`gifts_h_time`),
  KEY `fk_gifts_history_gifts_1` (`gifts_h_giftId`),
  KEY `fk_gifts_history_users_1` (`gifts_h_giver`),
  KEY `fk_gifts_history_users_2` (`gifts_h_receiver`),
  CONSTRAINT `fk_gifts_history_gifts_1` FOREIGN KEY (`gifts_h_giftId`) REFERENCES `gifts` (`gift_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_gifts_history_users_1` FOREIGN KEY (`gifts_h_giver`) REFERENCES `users` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_gifts_history_users_2` FOREIGN KEY (`gifts_h_receiver`) REFERENCES `users` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gifts_history
-- ----------------------------
INSERT INTO `gifts_history` VALUES ('金木研丶、狰', '7', '1', '2017-04-13 14:52:08', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('金木研丶、狰', '7', '555', '2017-04-13 14:52:19', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:27', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:30', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:31', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:32', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:33', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:34', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:35', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:36', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:37', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:38', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:39', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:40', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '7', '2017-04-13 14:52:43', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '7', '2017-04-13 14:52:44', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:45', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:47', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:48', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:49', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:50', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:52', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:54', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:57', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:52:58', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:53:01', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:53:02', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:53:04', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:53:05', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:53:06', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:53:09', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '7', '1', '2017-04-13 14:53:10', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('金木研丶、狰', '1', '10', '2017-04-13 14:53:26', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('金木研丶、狰', '1', '1', '2017-04-13 14:53:28', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('金木研丶、狰', '1', '1', '2017-04-13 14:53:29', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('用户18408249', '2', '1', '2017-04-13 14:53:45', '金木研丶、狰', 'silver');
INSERT INTO `gifts_history` VALUES ('用户14914733', '2', '1', '2017-04-13 14:53:51', '金木研丶、狰', 'silver');
INSERT INTO `gifts_history` VALUES ('金木研丶、狰', '2', '20', '2017-04-13 14:53:54', '金木研丶、狰', 'silver');
INSERT INTO `gifts_history` VALUES ('用户14914733', '5', '1', '2017-04-13 14:55:15', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('用户14914733', '5', '1', '2017-04-13 14:55:16', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('1489995053', '6', '2', '2017-04-13 14:55:29', '金木研丶、狰', 'silver');
INSERT INTO `gifts_history` VALUES ('用户14914733', '6', '1', '2017-04-13 14:55:33', '金木研丶、狰', 'silver');
INSERT INTO `gifts_history` VALUES ('1489995053', '8', '1', '2017-04-13 14:55:56', '金木研丶、狰', 'silver');
INSERT INTO `gifts_history` VALUES ('用户14914733', '8', '1', '2017-04-13 14:56:02', '金木研丶、狰', 'silver');
INSERT INTO `gifts_history` VALUES ('用户14920756', '1', '1', '2017-04-13 18:06:23', '用户14920756', 'gold');
INSERT INTO `gifts_history` VALUES ('用户14920756', '1', '1', '2017-04-13 18:06:27', '用户14920756', 'gold');
INSERT INTO `gifts_history` VALUES ('用户14920756', '1', '1', '2017-04-14 10:58:09', '金木研丶、狰', 'gold');
INSERT INTO `gifts_history` VALUES ('用户14920756', '2', '1', '2017-04-14 15:31:35', '金木研丶、狰', 'silver');

-- ----------------------------
-- Table structure for `manager`
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `mana_name` varchar(10) NOT NULL,
  `mana_pwd` varchar(16) NOT NULL,
  `mana_role` int(11) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`mana_name`),
  KEY `fk_mana_roles` (`mana_role`),
  CONSTRAINT `fk_mana_roles` FOREIGN KEY (`mana_role`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of manager
-- ----------------------------
INSERT INTO `manager` VALUES ('admin', 'admin', '1');

-- ----------------------------
-- Table structure for `recommendation`
-- ----------------------------
DROP TABLE IF EXISTS `recommendation`;
CREATE TABLE `recommendation` (
  `reco_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reco_img` varchar(100) NOT NULL COMMENT '推荐位的图片',
  `reco_pos` int(11) NOT NULL DEFAULT '1' COMMENT '推荐位置',
  `reco_anchor` varchar(10) NOT NULL COMMENT '推荐的主播（昵称）',
  PRIMARY KEY (`reco_id`),
  KEY `fk_recommendation_users_1` (`reco_anchor`),
  CONSTRAINT `fk_recommendation_users_1` FOREIGN KEY (`reco_anchor`) REFERENCES `users` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of recommendation
-- ----------------------------
INSERT INTO `recommendation` VALUES ('1', '/uploads/recomm_1.png', '1', '金木研丶、狰');
INSERT INTO `recommendation` VALUES ('2', '/uploads/recomm_6.png', '6', '金木研丶、狰');
INSERT INTO `recommendation` VALUES ('3', '/uploads/recomm_8.png', '8', '金木研丶、狰');
INSERT INTO `recommendation` VALUES ('4', '/uploads/recomm_7.png', '7', '金木研丶、狰');
INSERT INTO `recommendation` VALUES ('5', '/uploads/recomm_9.png', '9', '金木研丶、狰');
INSERT INTO `recommendation` VALUES ('6', '/uploads/recomm_2.png', '2', '1489995053');
INSERT INTO `recommendation` VALUES ('7', '/uploads/recomm_3.png', '3', '金木研丶、狰');
INSERT INTO `recommendation` VALUES ('8', '/uploads/recomm_4.png', '4', '金木研丶、狰');
INSERT INTO `recommendation` VALUES ('9', '/uploads/recomm_5.png', '5', '金木研丶、狰');

-- ----------------------------
-- Table structure for `roles`
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(5) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES ('1', '超管');
INSERT INTO `roles` VALUES ('2', '普通用户');
INSERT INTO `roles` VALUES ('3', '主播');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` varchar(10) NOT NULL DEFAULT '',
  `user_tel` varchar(11) NOT NULL COMMENT '手机号，默认用作登录账号',
  `user_email` varchar(50) NOT NULL,
  `user_nickname` varchar(10) NOT NULL COMMENT '时间戳',
  `user_pass` varchar(16) NOT NULL,
  `user_focus` varchar(500) DEFAULT '' COMMENT '用户关注收藏订阅的直播间',
  `user_avatar` varchar(255) DEFAULT '/img/avatar.png' COMMENT '用户头像',
  `user_role` int(11) unsigned NOT NULL DEFAULT '1',
  `user_money_gold` bigint(20) NOT NULL DEFAULT '100000' COMMENT '1金币=1块=100银币',
  `user_money_silver` bigint(20) NOT NULL DEFAULT '100000' COMMENT '1银币=0.01金币=1分钱',
  PRIMARY KEY (`user_nickname`),
  KEY `fk_user_roles` (`user_role`),
  CONSTRAINT `fk_user_roles` FOREIGN KEY (`user_role`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1491372222', '18408249225', 'asdadw@qq.com', '1489995053', '111111', 'cold,river,', '/img/avatar.png', '2', '93671', '999997999');
INSERT INTO `users` VALUES ('1491372354', '18408249226', 'aodjaoj@qq.com', '用户14913723', '111111', '', '/img/avatar.png', '2', '100000', '100000');
INSERT INTO `users` VALUES ('1491372595', '18408249227', 'adhauowdhaw@qq.com', '用户14913725', '111111', '', '/img/avatar.png', '2', '100000', '100000');
INSERT INTO `users` VALUES ('1491473306', '15680400995', '522363215@qq.com', '用户14914733', '522363215', '', '/img/avatar.png', '2', '84953', '96000');
INSERT INTO `users` VALUES ('1492075663', '18408241234', 'aiuhduihu@163.com', '用户14920756', '111111', 'lao5,', '/img/avatar.png', '2', '87002', '98000');
INSERT INTO `users` VALUES ('1491011580', '18408249224', 'adadamj@qq.com', '用户18408249', '111111', 'cold,', '/img/avatar.png', '2', '100000', '98000');
INSERT INTO `users` VALUES ('1489995054', '18408249223', '1151953571@qq.com', '金木研丶、狰', '111111', 'cold,', '/uploads/149180464597307.png', '2', '517', '54000');
