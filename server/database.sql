# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: clever_mock
# Generation Time: 2018-12-13 06:02:00 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table api
# ------------------------------------------------------------

DROP TABLE IF EXISTS `api`;

CREATE TABLE `api` (
  `id` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(1000) DEFAULT '',
  `description` longtext,
  `path` varchar(1000) DEFAULT '' COMMENT '接口路径，支持正则表达式',
  `method` varchar(100) DEFAULT '',
  `params` longtext,
  `res_structure` longtext,
  `group_id` varchar(100) DEFAULT NULL,
  `create_time` bigint(20) DEFAULT NULL COMMENT '创建时间',
  `res_format_script` text COMMENT '响应结果的格式化脚本',
  `last_call_time` bigint(20) DEFAULT NULL COMMENT '上次调用时间',
  `project_id` varchar(100) DEFAULT NULL,
  `mock_data` longtext COMMENT 'mock数据',
  `mock_script` longtext COMMENT 'mock脚本',
  `run_style` varchar(100) DEFAULT '' COMMENT '运行方式:mock还是代理还是怎样',
  `proxy_url` varchar(1000) DEFAULT '' COMMENT '代理服务地址，比project配置的优先级高',
  `auto_update` int(1) DEFAULT '1' COMMENT '是否自动更新请求参数和响应结果',
  `delay` int(100) DEFAULT '0' COMMENT '接口代理延时',
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `api_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `apigroup` (`id`),
  CONSTRAINT `api_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table apigroup
# ------------------------------------------------------------

DROP TABLE IF EXISTS `apigroup`;

CREATE TABLE `apigroup` (
  `id` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(1000) DEFAULT NULL,
  `reg` varchar(1000) DEFAULT NULL,
  `project_id` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `apigroup_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table call_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `call_history`;

CREATE TABLE `call_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `api_id` varchar(100) DEFAULT NULL,
  `call_time` bigint(20) DEFAULT NULL COMMENT '调用时间',
  `duration` int(100) DEFAULT NULL COMMENT '调用耗时',
  `url` varchar(1000) DEFAULT NULL COMMENT '调用的实际url',
  `res_code` int(100) DEFAULT NULL COMMENT '响应状态吗',
  PRIMARY KEY (`id`),
  KEY `api_id` (`api_id`),
  CONSTRAINT `call_history_ibfk_1` FOREIGN KEY (`api_id`) REFERENCES `api` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(200) DEFAULT NULL,
  `proxy_url` varchar(1000) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  `running_status` int(1) DEFAULT NULL,
  `auto_add` int(1) DEFAULT NULL COMMENT '是否自动检测并添加api配置',
  `secret_key` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table proxy_server
# ------------------------------------------------------------

DROP TABLE IF EXISTS `proxy_server`;

CREATE TABLE `proxy_server` (
  `id` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(20) DEFAULT NULL,
  `url` varchar(100) DEFAULT '',
  `project_id` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `proxy_server_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(2) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table status_code
# ------------------------------------------------------------

DROP TABLE IF EXISTS `status_code`;

CREATE TABLE `status_code` (
  `id` varchar(1000) NOT NULL DEFAULT '',
  `code` int(10) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `project_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `status_code_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `group` varchar(200) DEFAULT NULL,
  `wechat` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user_project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_project`;

CREATE TABLE `user_project` (
  `user_id` varchar(100) NOT NULL DEFAULT '',
  `project_id` varchar(100) NOT NULL DEFAULT '',
  `role` int(2) DEFAULT '0' COMMENT '角色',
  KEY `user_id` (`user_id`),
  KEY `project_id` (`project_id`),
  KEY `role` (`role`),
  CONSTRAINT `user_project_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_project_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `user_project_ibfk_3` FOREIGN KEY (`role`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
