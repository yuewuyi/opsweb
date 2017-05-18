/*
Navicat MySQL Data Transfer

Source Server         : opsweb
Source Server Version : 50635
Source Host           : 172.20.11.102:3306
Source Database       : opsweb

Target Server Type    : MYSQL
Target Server Version : 50635
File Encoding         : 65001

Date: 2017-05-18 19:59:16
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `Config`
-- ----------------------------
DROP TABLE IF EXISTS `Config`;
CREATE TABLE `Config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config_key` varchar(40) DEFAULT NULL,
  `config_item1` varchar(100) DEFAULT NULL,
  `create_time` date NOT NULL,
  `update_time` date NOT NULL,
  `config_item2` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of Config
-- ----------------------------
INSERT INTO `Config` VALUES ('1', 'zabbix_api_addr', 'http://zabbix.cdfortis.com/api_jsonrpc.php', '2017-02-17', '2017-02-17', null);
INSERT INTO `Config` VALUES ('3', 'zabbix_api_user', 'admin', '2017-02-21', '2017-02-21', 'f#t@2016zabbix');

-- ----------------------------
-- Table structure for `django_migrations`
-- ----------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of django_migrations
-- ----------------------------
INSERT INTO `django_migrations` VALUES ('1', 'sessions', '0001_initial', '2017-01-20 09:41:07.771497');
INSERT INTO `django_migrations` VALUES ('2', 'user', '0001_initial', '2017-01-20 09:41:07.872503');
INSERT INTO `django_migrations` VALUES ('3', 'api', '0001_initial', '2017-02-17 07:46:42.663302');
INSERT INTO `django_migrations` VALUES ('4', 'api', '0002_auto_20170221_1508', '2017-02-22 03:31:24.252677');
INSERT INTO `django_migrations` VALUES ('5', 'api', '0003_auto_20170221_1518', '2017-02-22 03:31:24.274678');
INSERT INTO `django_migrations` VALUES ('6', 'api', '0004_item_config', '2017-05-02 08:00:22.268383');

-- ----------------------------
-- Table structure for `django_session`
-- ----------------------------
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_de54fa62` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of django_session
-- ----------------------------
INSERT INTO `django_session` VALUES ('ffze65ns23lcf0vqyxz3q4sicufblszq', 'NDczMDVlMjkyMDRkN2FiYTljYTcxMjg5YzhjZTliNjkwZjQyOWZjYjp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-05-25 08:50:07.583367');
INSERT INTO `django_session` VALUES ('l15jhfzgb66x5am3ht18uphvdb1oex3l', 'NDczMDVlMjkyMDRkN2FiYTljYTcxMjg5YzhjZTliNjkwZjQyOWZjYjp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-05-19 06:26:46.704049');
INSERT INTO `django_session` VALUES ('nskznd3j1j3aivgoz3lhlstpmums31hd', 'NDczMDVlMjkyMDRkN2FiYTljYTcxMjg5YzhjZTliNjkwZjQyOWZjYjp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-05-26 06:06:08.670186');
INSERT INTO `django_session` VALUES ('qdgi53mkiudyiz0lo2d62b8chpzvzewi', 'NDczMDVlMjkyMDRkN2FiYTljYTcxMjg5YzhjZTliNjkwZjQyOWZjYjp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-06-01 09:49:08.367536');

-- ----------------------------
-- Table structure for `Item_Config`
-- ----------------------------
DROP TABLE IF EXISTS `Item_Config`;
CREATE TABLE `Item_Config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(40) DEFAULT NULL,
  `item` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of Item_Config
-- ----------------------------
INSERT INTO `Item_Config` VALUES ('1', 'disk_io_write', 'disk_write_Bps');
INSERT INTO `Item_Config` VALUES ('2', 'disk_io_read', 'disk_read_Bps');
INSERT INTO `Item_Config` VALUES ('3', 'cpu_util', 'CPU_util');
INSERT INTO `Item_Config` VALUES ('4', 'alivable_mem', 'Available_memory');
INSERT INTO `Item_Config` VALUES ('5', 'total_mem', 'Total_memory');
INSERT INTO `Item_Config` VALUES ('6', 'tomcat_ping', '_Tomcat_ping');
INSERT INTO `Item_Config` VALUES ('7', 'thrift_ping', '_thrift_ping');
INSERT INTO `Item_Config` VALUES ('8', 'disk_used_space', 'Used_disk_space_on_');
INSERT INTO `Item_Config` VALUES ('9', 'nic_out', 'Outgoing_network_traffic_on_');
INSERT INTO `Item_Config` VALUES ('10', 'disk_total_space', 'Total_disk_space_on_');
INSERT INTO `Item_Config` VALUES ('11', 'nic_in', 'Incoming_network_traffic_on_');

-- ----------------------------
-- Table structure for `User`
-- ----------------------------
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(20) NOT NULL,
  `pwd` varchar(600) NOT NULL,
  `is_up` tinyint(1) NOT NULL,
  `is_show` tinyint(1) NOT NULL,
  `is_config` tinyint(1) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `create_time` datetime(6) NOT NULL,
  `update_time` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of User
-- ----------------------------
INSERT INTO `User` VALUES ('1', 'admin', '5c6054b5ac83d418ae3fee5607ebc6d1ee3c26f927bfa44b753379571afc005256152e2ba77308e47152c9e868af2ee3d63fd4498dfaef505dc21f98cb68197a', '1', '1', '1', '1', '2017-01-20 17:42:08.000000', '2017-01-20 17:42:12.000000');
INSERT INTO `User` VALUES ('2', 'suyue', '5c6054b5ac83d418ae3fee5607ebc6d1ee3c26f927bfa44b753379571afc005256152e2ba77308e47152c9e868af2ee3d63fd4498dfaef505dc21f98cb68197a', '1', '1', '1', '1', '2017-02-11 17:35:28.000000', '2017-02-24 17:35:31.000000');
