/*
Navicat MySQL Data Transfer

Source Server         : opsweb
Source Server Version : 50635
Source Host           : 172.20.11.95:3306
Source Database       : opsweb

Target Server Type    : MYSQL
Target Server Version : 50635
File Encoding         : 65001

Date: 2017-03-15 18:05:33
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of django_migrations
-- ----------------------------
INSERT INTO `django_migrations` VALUES ('1', 'sessions', '0001_initial', '2017-01-20 09:41:07.771497');
INSERT INTO `django_migrations` VALUES ('2', 'user', '0001_initial', '2017-01-20 09:41:07.872503');
INSERT INTO `django_migrations` VALUES ('3', 'api', '0001_initial', '2017-02-17 07:46:42.663302');
INSERT INTO `django_migrations` VALUES ('4', 'api', '0002_auto_20170221_1508', '2017-02-22 03:31:24.252677');
INSERT INTO `django_migrations` VALUES ('5', 'api', '0003_auto_20170221_1518', '2017-02-22 03:31:24.274678');

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
INSERT INTO `django_session` VALUES ('0ytm54c8uf38c8q82zidv1sdwzmljbuh', 'NDczMDVlMjkyMDRkN2FiYTljYTcxMjg5YzhjZTliNjkwZjQyOWZjYjp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-03-16 10:17:38.611701');
INSERT INTO `django_session` VALUES ('1plit63ecfn5pvgsxqx3ptblv6fa7ftc', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 08:59:58.130645');
INSERT INTO `django_session` VALUES ('3qvzbkj347wulywd7hmnbwhsyaij433t', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-06 01:58:15.460974');
INSERT INTO `django_session` VALUES ('529x4anl6vbgtj1du25qmga44i47qiu8', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-17 02:38:01.835645');
INSERT INTO `django_session` VALUES ('59g7mm465o5xd4zgphzimq6ss6wdz6vn', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-06 01:38:34.776500');
INSERT INTO `django_session` VALUES ('5lkw51hc0u7wq5b8ilotvtto97i2q0mu', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 08:16:02.699907');
INSERT INTO `django_session` VALUES ('6niahri9qcvjgnen2g410r17n8xfonpa', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 09:18:54.534644');
INSERT INTO `django_session` VALUES ('7sf6e8pfmcod2887n1laawxummde2t4z', 'MTY5ODE2ZGIxODE0MGEzYTg5MmQ3MGFkNTI0ZjRlY2U5NTQxOTZiNjp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6InN1eXVlIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-02-20 02:52:55.926501');
INSERT INTO `django_session` VALUES ('8k7l7shq1d21pkez5ieb4k6rqht7tbrv', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-06 03:29:58.841529');
INSERT INTO `django_session` VALUES ('8uo2cy435gbuie83k5rie7wkeux1lfhe', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-06 01:50:18.201483');
INSERT INTO `django_session` VALUES ('8xvsc2nk8y0uenxe12kt7jiglhe6d6nh', 'NDczMDVlMjkyMDRkN2FiYTljYTcxMjg5YzhjZTliNjkwZjQyOWZjYjp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-03-29 09:19:57.154113');
INSERT INTO `django_session` VALUES ('a7w7co7flcpm4iefl8dda9tgrr3sacoa', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 08:18:01.001674');
INSERT INTO `django_session` VALUES ('dkmkwe0aforfalsl5qkod58u1u3nu2nm', 'NjYzYTk1NzJlZTkyOWE0NzNlMTIwZWQyYTdkYTQ4Njk4NjI5ODdlMTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-02-20 01:52:53.377321');
INSERT INTO `django_session` VALUES ('fr0as806hkgmnfys5pm7zn59imun10qy', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-06 01:44:49.064986');
INSERT INTO `django_session` VALUES ('gg2o36ha9blhiso4cvud2pyojzafmnyu', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 03:00:21.705377');
INSERT INTO `django_session` VALUES ('grjjhcjaauvyjxubfqqnldyxwvek55oq', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 08:59:44.649874');
INSERT INTO `django_session` VALUES ('hartqcaolg4826kbl4rgluf0e6xnnbgy', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 09:05:54.309017');
INSERT INTO `django_session` VALUES ('j8vb3vlah6v1p8qx1hyzgn9nf75qxurw', 'MjVkNDAwZmYwNWVlZWQxNjY2MGQzMDhmM2QxMmZlZTUyMWQ0ZDI1NDp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6InN1eXVlIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOmZhbHNlLCJpc19zaG93Ijp0cnVlLCJpc191cCI6ZmFsc2V9fQ==', '2017-02-18 06:54:16.582287');
INSERT INTO `django_session` VALUES ('jc93l97us7qd61x3wdrrnsbj1uvee9yp', 'ZGQ3NWU3MGQwZGIzNmQ4ODNmZDc4YzFmYmRlNGM0NTQwN2Y3MDRiYzp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6InN1eXVlIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-03-21 10:01:28.006251');
INSERT INTO `django_session` VALUES ('kvobkrmsj26qqc23wvlykr10g0jfgd8r', 'ZGQ3NWU3MGQwZGIzNmQ4ODNmZDc4YzFmYmRlNGM0NTQwN2Y3MDRiYzp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6InN1eXVlIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-03-14 09:55:49.802951');
INSERT INTO `django_session` VALUES ('lh2jeck7j6sf02fxsgyddmvj3l9mdijv', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 10:25:28.113660');
INSERT INTO `django_session` VALUES ('ocq4y312veni3uw8z8u8yd3fdcc48w6i', 'ZTIxNWJkN2FjY2JkYjE2OTAzZTRkOTE4NmU5MjIyOWQxMjQzYjQ1NTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOmZhbHNlLCJpc19zaG93Ijp0cnVlLCJpc191cCI6ZmFsc2V9fQ==', '2017-02-18 07:19:01.792233');
INSERT INTO `django_session` VALUES ('rp7qkcso9r15kxxa78xr76tbmwnh1dvl', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 08:09:03.969957');
INSERT INTO `django_session` VALUES ('rprqf35q5ojq1r22jgsya7ef5spz0fnc', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 07:57:43.313026');
INSERT INTO `django_session` VALUES ('s1q0zv9rhuc75w4x0d52td5osh1wzai6', 'NjYzYTk1NzJlZTkyOWE0NzNlMTIwZWQyYTdkYTQ4Njk4NjI5ODdlMTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-03-23 03:41:15.810805');
INSERT INTO `django_session` VALUES ('sh8w1byc6w0jc2a6xsuzlvuvffh4eldu', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-18 06:56:32.200610');
INSERT INTO `django_session` VALUES ('tayjg40xbz47zuanvwuzwlhk10g6kop5', 'NDczMDVlMjkyMDRkN2FiYTljYTcxMjg5YzhjZTliNjkwZjQyOWZjYjp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-03-15 09:59:44.273984');
INSERT INTO `django_session` VALUES ('v0z11zwmda5vb2wd7mlvt0xswfy2dsie', 'MjVkNDAwZmYwNWVlZWQxNjY2MGQzMDhmM2QxMmZlZTUyMWQ0ZDI1NDp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6InN1eXVlIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOmZhbHNlLCJpc19zaG93Ijp0cnVlLCJpc191cCI6ZmFsc2V9fQ==', '2017-02-18 09:39:19.596186');
INSERT INTO `django_session` VALUES ('v1ic3c06ywkcpsli9ds1440nzvro82yl', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 07:35:38.270238');
INSERT INTO `django_session` VALUES ('v50vscyjktar0325yxh4sqgbitgfy4vs', 'NjYzYTk1NzJlZTkyOWE0NzNlMTIwZWQyYTdkYTQ4Njk4NjI5ODdlMTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-02-20 06:23:36.644717');
INSERT INTO `django_session` VALUES ('w5eweri8pdk33xdb75jswkd0d3gulxsk', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 07:59:19.931552');
INSERT INTO `django_session` VALUES ('y138bjz29oa3escg6uy45p54fk8d467x', 'NDczMDVlMjkyMDRkN2FiYTljYTcxMjg5YzhjZTliNjkwZjQyOWZjYjp7Il9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwidXNlciI6ImFkbWluIiwianVyaXNkaWN0aW9uIjp7ImlzX2FkbWluIjp0cnVlLCJpc19jb25maWciOnRydWUsImlzX3Nob3ciOnRydWUsImlzX3VwIjp0cnVlfX0=', '2017-03-22 10:17:53.234032');
INSERT INTO `django_session` VALUES ('z62pfbc6h5uvfjn4wm6j0pfkqob357ow', 'NWFhZTI1ODdlMGI2ZDQzNzkyZTE2YmI1ZmNmMmE0ZDJjYWQ1ZDVjNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6InN1eXVlIn0=', '2017-02-17 09:35:53.691027');
INSERT INTO `django_session` VALUES ('zzvfmjgu0ka416tputc8dx4dyow5kbm4', 'ZGZmZGVjZmNjY2Y1MWIwNjRiZTQyODE3MDI3MDU0MjYwMTVmZGZkNTp7Il9zZXNzaW9uX2V4cGlyeSI6MCwidXNlciI6ImFkbWluIn0=', '2017-02-05 08:43:11.320059');

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
