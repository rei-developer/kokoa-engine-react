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
  `isAdmin` tinyint(1) DEFAULT '0',
  `isVerified` tinyint(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- 테이블 데이터 hawawa.Users:~0 rows (대략적) 내보내기
DELETE FROM `Users`;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` (`id`, `username`, `nickname`, `email`, `password`, `salt`, `profileImageUrl`, `registerDate`, `blockDate`, `level`, `exp`, `point`, `isAdmin`, `isVerified`) VALUES
	(1, 'test', 'test', 'test@test.com', 'iucoZU7dWrlm3RgfJs0kYLuYU5JWFF0MWbTs40WCRQP5vGtcJXpKRTyXvx0VmCzp+ZxxWAsW/lgk5iDx8m+790PB13PNGY7gHdB4vqM9JbF3hMfVw2gIwtdnM3E3fcW3cqPLa49imI24iuMcvv4vRFNAZrgdJYpmJJia0cHB4Kk=', 'AZcp8/TwXGV2kOd/72sJ7byife7isDDbSFbPk88QBRqqnef/9Up9Pn0JT3pnLeE8zl9jtQBSEsyjXG94UrmTfg==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 0, 0),
	(2, 'test2', 'test2', 'eunnamu094@gmail.com2', 'H9IYnH9RXySDqSJ1QJtGacAht0yjXkw0zxEqTotkD+uFUNUctjQ3pea6Km1BjJZgbuxInvUo0fTWn0kea9VHhNGoZZT7b7EUKWEooGkpoG9XC+fIf0rAyyMR9yqwoTB4oVgu9F9WqWJmVqf3OPa1XAkwy22VX6kgqRzETuhBYJI=', '7HlGiWGPwxbi2th4kOP+mb35CX3q3MJ8ETdFNZcIY1f2DAfsBcyfKEUy6EN27/t0I6vkZVty1k/AXjMFDVaXjA==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 0, 0),
	(3, 'test3', 'test3', 'eunnamu094@gmail.com', 'roP1i0tSyECSWYiqVlJwCKpv5QvyP5/s4+qsWlWAH8+AuSxD0l1LPxZTnn/vscGwkdg0aOXxiESwQHLownZl1WHpAQu++seefZRnEW4OVme5TqqOcmjUS9P8WB+zTMdglRyPvkEYi+CrPg1GQl5LA9WH8TFARSBAaA3NvVAcqV4=', '5Sfol7eDOzYDTbAstb66/RkVG85umrgbPYbUgfQAvKuhordamwTk2fsqDz51Ez1BrJMe7XKGPFZFO8I4jx8W0Q==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 0, 0);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
