-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.13 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- hawawa 데이터베이스 구조 내보내기
DROP DATABASE IF EXISTS `hawawa`;
CREATE DATABASE IF NOT EXISTS `hawawa` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `hawawa`;

-- 테이블 hawawa.Boards 구조 내보내기
DROP TABLE IF EXISTS `Boards`;
CREATE TABLE IF NOT EXISTS `Boards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `domain` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `isAdminOnly` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `domain` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Boards:~0 rows (대략적) 내보내기
DELETE FROM `Boards`;
/*!40000 ALTER TABLE `Boards` DISABLE KEYS */;
INSERT INTO `Boards` (`id`, `domain`, `name`, `created`, `isAdminOnly`) VALUES
	(1, 'talk', '자유', '2018-12-06 14:32:44', 0);
/*!40000 ALTER TABLE `Boards` ENABLE KEYS */;

-- 테이블 hawawa.Categories 구조 내보내기
DROP TABLE IF EXISTS `Categories`;
CREATE TABLE IF NOT EXISTS `Categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `boardDomain` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `boardName` (`boardDomain`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Categories:~2 rows (대략적) 내보내기
DELETE FROM `Categories`;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` (`id`, `boardDomain`, `name`, `created`) VALUES
	(1, 'talk', '잡담', '2018-12-06 14:33:09'),
	(2, 'talk', '유머', '2018-12-06 14:33:13');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;

-- 테이블 hawawa.TopicCounts 구조 내보내기
DROP TABLE IF EXISTS `TopicCounts`;
CREATE TABLE IF NOT EXISTS `TopicCounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `topicId` bigint(20) unsigned DEFAULT NULL,
  `hits` int(10) unsigned DEFAULT '0',
  `likes` int(10) unsigned DEFAULT '0',
  `hates` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `topicId` (`topicId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.TopicCounts:~0 rows (대략적) 내보내기
DELETE FROM `TopicCounts`;
/*!40000 ALTER TABLE `TopicCounts` DISABLE KEYS */;
INSERT INTO `TopicCounts` (`id`, `topicId`, `hits`, `likes`, `hates`) VALUES
	(1, 1, 0, 0, 0),
	(2, 2, 0, 0, 0),
	(3, 3, 0, 0, 0),
	(4, 4, 0, 0, 0),
	(5, 5, 0, 0, 0),
	(6, 6, 0, 0, 0),
	(7, 7, 0, 0, 0),
	(8, 8, 0, 0, 0),
	(9, 9, 0, 0, 0),
	(10, 10, 0, 0, 0),
	(11, 11, 0, 0, 0),
	(12, 12, 0, 0, 0),
	(13, 13, 0, 0, 0),
	(14, 14, 0, 0, 0),
	(15, 15, 0, 0, 0),
	(16, 16, 0, 0, 0),
	(17, 17, 0, 0, 0),
	(18, 18, 0, 0, 0),
	(19, 19, 0, 0, 0),
	(20, 20, 0, 0, 0),
	(21, 21, 0, 0, 0),
	(22, 22, 0, 0, 0),
	(23, 23, 0, 0, 0),
	(24, 24, 0, 0, 0),
	(25, 25, 0, 0, 0),
	(26, 26, 0, 0, 0),
	(27, 27, 0, 0, 0),
	(28, 28, 0, 0, 0),
	(29, 29, 0, 9, 0),
	(30, 30, 0, 0, 0);
/*!40000 ALTER TABLE `TopicCounts` ENABLE KEYS */;

-- 테이블 hawawa.Topics 구조 내보내기
DROP TABLE IF EXISTS `Topics`;
CREATE TABLE IF NOT EXISTS `Topics` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) unsigned DEFAULT NULL,
  `boardDomain` varchar(20) DEFAULT NULL,
  `originBoardDomain` varchar(20) DEFAULT NULL,
  `category` varchar(10) DEFAULT NULL,
  `author` varchar(20) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `content` longtext,
  `ip` varchar(20) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Topics:~0 rows (대략적) 내보내기
DELETE FROM `Topics`;
/*!40000 ALTER TABLE `Topics` DISABLE KEYS */;
INSERT INTO `Topics` (`id`, `userId`, `boardDomain`, `originBoardDomain`, `category`, `author`, `title`, `content`, `ip`, `header`, `created`, `updated`, `deleted`, `isImage`, `isBest`, `isNotice`, `isAllowed`) VALUES
	(1, 1, 'talk', NULL, '', 'test', 'ㅎㅇㅎㅇㅎ첫글', '입니다 첫글 ㅎㅇ 신병 받아라~', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-06 17:02:14', '2018-12-06 17:02:14', NULL, 0, 0, 0, 1),
	(2, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:19:46', '2018-12-11 16:19:46', NULL, 0, 0, 0, 1),
	(3, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:20:26', '2018-12-11 16:20:26', NULL, 0, 0, 0, 1),
	(4, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:22:16', '2018-12-11 16:22:16', NULL, 0, 0, 0, 1),
	(5, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:22:38', '2018-12-11 16:22:38', NULL, 0, 0, 0, 1),
	(6, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:22:41', '2018-12-11 16:22:41', NULL, 0, 0, 0, 1),
	(7, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:22:44', '2018-12-11 16:22:44', NULL, 0, 0, 0, 1),
	(8, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:22:48', '2018-12-11 16:22:48', NULL, 0, 0, 0, 1),
	(9, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:23:26', '2018-12-11 16:23:26', NULL, 0, 0, 0, 1),
	(10, 1, NULL, NULL, '', 'test', '', '', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:23:42', '2018-12-11 16:23:42', NULL, 0, 0, 0, 1),
	(11, 1, NULL, NULL, '', 'test', 'test', 'test', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:24:56', '2018-12-11 16:24:56', NULL, 0, 0, 0, 1),
	(12, 1, NULL, NULL, '', 'test', '야', '이 ㅁㅈㄹㅈㄷ\n\n\nㅁ치친\n\n\nㅅㄷ\nㅅ\nㅄㅂㅇㄴㅁㄹㄴㅇㅈㄷ', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:25:07', '2018-12-11 16:25:07', NULL, 0, 0, 0, 1),
	(13, 1, 'talk', NULL, '', 'test', 'ㅅㄷㄴㅅ', 'ㅁㄴㄹㅇㅈㄷㄹㅋㅋㅋㅋㅋㅋㅋ', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:26:01', '2018-12-11 16:26:01', NULL, 0, 0, 0, 1),
	(14, 1, 'talk', NULL, '', 'test', 'ㅎㅇ', 'ㅎㅇ', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:27:40', '2018-12-11 16:27:40', NULL, 0, 0, 0, 1),
	(15, 1, 'talk', NULL, '', 'test', 'ㄹㄹ', 'ㄹ', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:27:43', '2018-12-11 16:27:43', NULL, 0, 0, 0, 1),
	(16, 1, 'talk', NULL, '', 'test', 'ㄴㅁㄹㅇ', 'ㄴㅁㅇㄹ', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:27:47', '2018-12-11 16:27:47', NULL, 0, 0, 0, 1),
	(17, 1, 'talk', NULL, '', 'test', 'af', 'wef', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 16:32:42', '2018-12-11 16:32:42', NULL, 0, 0, 0, 1),
	(18, 1, 'talk', NULL, '', 'test', 'test', 'test', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 17:10:10', '2018-12-11 17:10:10', NULL, 0, 0, 0, 1),
	(19, 1, 'talk', NULL, '', 'test', '안녕하세요.', '<p>반갑습니다. ㅎ</p>\n<p>&nbsp;</p>\n<p>ㅎㅇ<strong>ㅎㅇㅎ</strong>ㅇㅎㅇㅎ</p>\n<h1>ㅋㅋㅋㅋㅋㅋ<em>ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ</em>ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ</h1>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 17:37:27', '2018-12-11 17:37:27', NULL, 0, 0, 0, 1),
	(20, 1, 'talk', NULL, '', 'test', 'gd', '<p>gdg<strong>dgd</strong></p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 17:39:31', '2018-12-11 17:39:31', NULL, 0, 0, 0, 1),
	(21, 1, 'talk', NULL, '', 'test', 'test', '<p>test</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 18:07:17', '2018-12-11 18:07:17', NULL, 0, 0, 0, 1),
	(22, 1, 'talk', NULL, '', 'test', 'test', '<p>tet</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 18:07:30', '2018-12-11 18:07:30', NULL, 0, 0, 0, 1),
	(23, 1, 'talk', NULL, '', 'test', 'zzzzz', '<p>zsdfasd</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 18:07:35', '2018-12-11 18:07:35', NULL, 0, 0, 0, 1),
	(24, 1, 'talk', NULL, '', 'test', 'zzzzz', '<p>zzfsafsad</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 18:07:38', '2018-12-11 18:07:38', NULL, 0, 0, 0, 1),
	(25, 2, 'talk', NULL, '', '여덟글자이상이다', 'sfasd', '<p>sfasd</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 18:07:41', '2018-12-11 18:07:41', NULL, 0, 2, 0, 1),
	(26, 1, 'talk', NULL, '나나', 'test', 'zz', '<p>wefwafwe</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 18:08:37', '2018-12-11 18:08:37', NULL, 0, 1, 0, 1),
	(27, 2, 'talk', NULL, '', '관리자', 'awef', '<p>awef</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 18:50:18', '2018-12-11 18:50:18', NULL, 0, 0, 0, 1),
	(28, 1, 'talk', NULL, '', 'test', 'asdfasfd', '<p>sd</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 21:06:38', '2018-12-11 21:06:38', NULL, 0, 2, 0, 1),
	(29, 2, 'talk', NULL, '', 'test', 'awfewf', '<p>awfew</p>', '::ffff:127.0.0.2', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 21:06:50', '2018-12-11 21:06:50', NULL, 0, 2, 0, 1),
	(30, 1, 'talk', NULL, '', 'test', 'awfe', '<p>zzzfwe</p>', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', '2018-12-11 21:07:01', '2018-12-11 21:07:01', NULL, 0, 0, 0, 1);
/*!40000 ALTER TABLE `Topics` ENABLE KEYS */;

-- 테이블 hawawa.TopicVotes 구조 내보내기
DROP TABLE IF EXISTS `TopicVotes`;
CREATE TABLE IF NOT EXISTS `TopicVotes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) unsigned DEFAULT NULL,
  `topicId` bigint(20) unsigned DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `topicId` (`topicId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.TopicVotes:~0 rows (대략적) 내보내기
DELETE FROM `TopicVotes`;
/*!40000 ALTER TABLE `TopicVotes` DISABLE KEYS */;
INSERT INTO `TopicVotes` (`id`, `userId`, `topicId`, `ip`, `created`) VALUES
	(1, 1, 29, '::ffff:127.0.0.1', '2018-12-12 12:52:48');
/*!40000 ALTER TABLE `TopicVotes` ENABLE KEYS */;

-- 테이블 hawawa.Users 구조 내보내기
DROP TABLE IF EXISTS `Users`;
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
  `exp` int(10) unsigned DEFAULT '0',
  `point` int(10) unsigned DEFAULT '0',
  `isAdmin` tinyint(1) unsigned DEFAULT '0',
  `isVerified` tinyint(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Users:~5 rows (대략적) 내보내기
DELETE FROM `Users`;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` (`id`, `username`, `nickname`, `email`, `password`, `salt`, `profileImageUrl`, `registerDate`, `blockDate`, `level`, `exp`, `point`, `isAdmin`, `isVerified`) VALUES
	(1, 'test', '난는좋아요', 'test@test.com', 'iucoZU7dWrlm3RgfJs0kYLuYU5JWFF0MWbTs40WCRQP5vGtcJXpKRTyXvx0VmCzp+ZxxWAsW/lgk5iDx8m+790PB13PNGY7gHdB4vqM9JbF3hMfVw2gIwtdnM3E3fcW3cqPLa49imI24iuMcvv4vRFNAZrgdJYpmJJia0cHB4Kk=', 'AZcp8/TwXGV2kOd/72sJ7byife7isDDbSFbPk88QBRqqnef/9Up9Pn0JT3pnLeE8zl9jtQBSEsyjXG94UrmTfg==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 0, 0),
	(2, 'test2', 'test2', 'eunnamu094@gmail.com2', 'H9IYnH9RXySDqSJ1QJtGacAht0yjXkw0zxEqTotkD+uFUNUctjQ3pea6Km1BjJZgbuxInvUo0fTWn0kea9VHhNGoZZT7b7EUKWEooGkpoG9XC+fIf0rAyyMR9yqwoTB4oVgu9F9WqWJmVqf3OPa1XAkwy22VX6kgqRzETuhBYJI=', '7HlGiWGPwxbi2th4kOP+mb35CX3q3MJ8ETdFNZcIY1f2DAfsBcyfKEUy6EN27/t0I6vkZVty1k/AXjMFDVaXjA==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 1, 0),
	(3, 'test3', 'test3', 'eunnamu094@gmail.com3', 'roP1i0tSyECSWYiqVlJwCKpv5QvyP5/s4+qsWlWAH8+AuSxD0l1LPxZTnn/vscGwkdg0aOXxiESwQHLownZl1WHpAQu++seefZRnEW4OVme5TqqOcmjUS9P8WB+zTMdglRyPvkEYi+CrPg1GQl5LA9WH8TFARSBAaA3NvVAcqV4=', '5Sfol7eDOzYDTbAstb66/RkVG85umrgbPYbUgfQAvKuhordamwTk2fsqDz51Ez1BrJMe7XKGPFZFO8I4jx8W0Q==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 0, 0),
	(4, 'test4', 'test4', 'eunnamu094@gmail.com', 'IeUkpYeoOKgh0turDnF3Lpobr1y1Rc1alnNdtHD9FNM+34b8mduOP1QC2E4wY9q9NHB5yhsh8zZkwO+9p1q9sBI0/hBFtLvPsaEr87QfwtS+OznH4S8W7SI7FDScCkRGvCqctcxto+pTQN/c+7w419+XdVzhpxbaOqk2/AcGaMY=', '8edjFzyFym7i28wZ0M5dw3sDbvAmb187hi9WyUWbllSENAzyviNquyLNFrXSCu0bAP8NmmSSIv6XA6NLqEG0XQ==', NULL, '2018-12-06 12:25:20', '2018-12-06 12:25:20', 1, 0, 0, 0, 1),
	(5, 'test1', 'test1', 'eunnamu094@lab543.com', 'fKLDd/CN6qrG62KL6ioGBwyZHkckLImDEaRXv7VMQS6d2RUO4cGGVwvCdfnW1v8ZERZDlqZRdR3dIg20yMM3H9JK5Lj8wPE7nZUcw6FPx+MNostVNVephhPs84i0ab4HZw/mOSrsfY67HdGRBqouNhIwcyyMM/Vgd14wO8+9BxU=', 'ozQ+o0MkXzNaxNfMOfAYrHTjC96UKT5WNxR9EQftsRe3Mn2QTO8Uo55SV9aA2HyXgykiA+y2DHDX85bC/x3Kpg==', NULL, '2018-12-11 14:26:10', '2018-12-11 14:26:10', 1, 0, 0, 0, 1);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
