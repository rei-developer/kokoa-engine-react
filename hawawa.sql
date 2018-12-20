-- --------------------------------------------------------
-- 호스트:                          ec2-54-180-144-253.ap-northeast-2.compute.amazonaws.com
-- 서버 버전:                        5.7.24-0ubuntu0.18.04.1 - (Ubuntu)
-- 서버 OS:                        Linux
-- HeidiSQL 버전:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- hawawa 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `hawawa` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `hawawa`;

-- 테이블 hawawa.Blinds 구조 내보내기
CREATE TABLE IF NOT EXISTS `Blinds` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) unsigned DEFAULT NULL,
  `targetUserId` bigint(20) unsigned DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Blinds:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `Blinds` DISABLE KEYS */;
/*!40000 ALTER TABLE `Blinds` ENABLE KEYS */;

-- 테이블 hawawa.Boards 구조 내보내기
CREATE TABLE IF NOT EXISTS `Boards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `domain` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `isAdminOnly` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `domain` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Boards:~8 rows (대략적) 내보내기
/*!40000 ALTER TABLE `Boards` DISABLE KEYS */;
INSERT INTO `Boards` (`id`, `domain`, `name`, `created`, `isAdminOnly`) VALUES
	(1, 'notice', '공지사항', '2018-12-06 14:32:44', 0),
	(2, 'feedback', '건의', '2018-12-17 12:51:18', 0),
	(3, 'trash', '휴지통', '2018-12-17 12:51:19', 0),
	(4, 'talk', '자유', '2018-12-17 12:51:22', 0),
	(5, 'girl', '연예', '2018-12-17 12:51:33', 0),
	(6, 'anime', '서브컬쳐', '2018-12-17 12:51:35', 0),
	(7, 'draw', '그림', '2018-12-17 12:51:43', 0),
	(8, 'compet', '공모전', '2018-12-17 12:51:45', 0);
/*!40000 ALTER TABLE `Boards` ENABLE KEYS */;

-- 테이블 hawawa.Categories 구조 내보내기
CREATE TABLE IF NOT EXISTS `Categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `boardDomain` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `boardName` (`boardDomain`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Categories:~2 rows (대략적) 내보내기
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` (`id`, `boardDomain`, `name`, `created`) VALUES
	(1, 'talk', '잡담', '2018-12-06 14:33:09'),
	(2, 'talk', '유머', '2018-12-06 14:33:13');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;

-- 테이블 hawawa.TopicCounts 구조 내보내기
CREATE TABLE IF NOT EXISTS `TopicCounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `topicId` bigint(20) unsigned DEFAULT NULL,
  `hits` int(10) unsigned DEFAULT '0',
  `likes` int(10) unsigned DEFAULT '0',
  `hates` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `topicId` (`topicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.TopicCounts:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `TopicCounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `TopicCounts` ENABLE KEYS */;

-- 테이블 hawawa.TopicImages 구조 내보내기
CREATE TABLE IF NOT EXISTS `TopicImages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `topicId` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `imageUrl` text,
  `deletehash` varchar(15) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `topicId` (`topicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.TopicImages:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `TopicImages` DISABLE KEYS */;
/*!40000 ALTER TABLE `TopicImages` ENABLE KEYS */;

-- 테이블 hawawa.Topics 구조 내보내기
CREATE TABLE IF NOT EXISTS `Topics` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) unsigned DEFAULT NULL,
  `boardDomain` varchar(20) DEFAULT NULL,
  `originBoardDomain` varchar(20) DEFAULT NULL,
  `category` varchar(10) DEFAULT NULL,
  `author` varchar(20) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `content` longtext,
  `ip` varchar(50) DEFAULT NULL,
  `header` varchar(200) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT NULL,
  `isImage` tinyint(1) unsigned DEFAULT '0',
  `isBest` tinyint(1) unsigned DEFAULT '0',
  `isNotice` tinyint(1) unsigned DEFAULT '0',
  `isAllowed` tinyint(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `boardDomain` (`boardDomain`),
  FULLTEXT KEY `author` (`author`),
  FULLTEXT KEY `title` (`title`),
  FULLTEXT KEY `content` (`content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Topics:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `Topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `Topics` ENABLE KEYS */;

-- 테이블 hawawa.TopicVotes 구조 내보내기
CREATE TABLE IF NOT EXISTS `TopicVotes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) unsigned DEFAULT NULL,
  `topicId` bigint(20) unsigned DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `topicId` (`topicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.TopicVotes:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `TopicVotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `TopicVotes` ENABLE KEYS */;

-- 테이블 hawawa.Users 구조 내보내기
CREATE TABLE IF NOT EXISTS `Users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(172) DEFAULT NULL,
  `salt` varchar(88) DEFAULT NULL,
  `profileImageUrl` text,
  `registerDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `blockDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `level` tinyint(3) unsigned DEFAULT '1',
  `exp` int(10) DEFAULT '0',
  `point` int(10) DEFAULT '0',
  `isAdmin` tinyint(1) unsigned DEFAULT '0',
  `isVerified` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Users:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
