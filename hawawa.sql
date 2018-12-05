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

-- 테이블 데이터 hawawa.boardcategories:~0 rows (대략적) 내보내기
DELETE FROM `boardcategories`;
/*!40000 ALTER TABLE `boardcategories` DISABLE KEYS */;
/*!40000 ALTER TABLE `boardcategories` ENABLE KEYS */;

-- 테이블 데이터 hawawa.boards:~0 rows (대략적) 내보내기
DELETE FROM `boards`;
/*!40000 ALTER TABLE `boards` DISABLE KEYS */;
/*!40000 ALTER TABLE `boards` ENABLE KEYS */;

-- 테이블 데이터 hawawa.ipblocks:~0 rows (대략적) 내보내기
DELETE FROM `ipblocks`;
/*!40000 ALTER TABLE `ipblocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `ipblocks` ENABLE KEYS */;

-- 테이블 데이터 hawawa.notices:~0 rows (대략적) 내보내기
DELETE FROM `notices`;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;

-- 테이블 데이터 hawawa.postvotes:~0 rows (대략적) 내보내기
DELETE FROM `postvotes`;
/*!40000 ALTER TABLE `postvotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `postvotes` ENABLE KEYS */;

-- 테이블 데이터 hawawa.topiccounts:~0 rows (대략적) 내보내기
DELETE FROM `topiccounts`;
/*!40000 ALTER TABLE `topiccounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `topiccounts` ENABLE KEYS */;

-- 테이블 데이터 hawawa.topicimages:~0 rows (대략적) 내보내기
DELETE FROM `topicimages`;
/*!40000 ALTER TABLE `topicimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `topicimages` ENABLE KEYS */;

-- 테이블 데이터 hawawa.topics:~0 rows (대략적) 내보내기
DELETE FROM `topics`;
/*!40000 ALTER TABLE `topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `topics` ENABLE KEYS */;

-- 테이블 데이터 hawawa.topicvotes:~0 rows (대략적) 내보내기
DELETE FROM `topicvotes`;
/*!40000 ALTER TABLE `topicvotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `topicvotes` ENABLE KEYS */;

-- 테이블 데이터 hawawa.userblinds:~0 rows (대략적) 내보내기
DELETE FROM `userblinds`;
/*!40000 ALTER TABLE `userblinds` DISABLE KEYS */;
/*!40000 ALTER TABLE `userblinds` ENABLE KEYS */;

-- 테이블 데이터 hawawa.users:~0 rows (대략적) 내보내기
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `nickname`, `email`, `password`, `salt`, `profileImageUrl`, `registerDate`, `blockDate`, `level`, `exp`, `point`, `isAdmin`, `isVerified`) VALUES
	(1, 'test', 'test', 'test@test.com', 'iucoZU7dWrlm3RgfJs0kYLuYU5JWFF0MWbTs40WCRQP5vGtcJXpKRTyXvx0VmCzp+ZxxWAsW/lgk5iDx8m+790PB13PNGY7gHdB4vqM9JbF3hMfVw2gIwtdnM3E3fcW3cqPLa49imI24iuMcvv4vRFNAZrgdJYpmJJia0cHB4Kk=', 'AZcp8/TwXGV2kOd/72sJ7byife7isDDbSFbPk88QBRqqnef/9Up9Pn0JT3pnLeE8zl9jtQBSEsyjXG94UrmTfg==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 0, 0),
	(2, 'test2', 'test2', 'eunnamu094@gmail.com2', 'H9IYnH9RXySDqSJ1QJtGacAht0yjXkw0zxEqTotkD+uFUNUctjQ3pea6Km1BjJZgbuxInvUo0fTWn0kea9VHhNGoZZT7b7EUKWEooGkpoG9XC+fIf0rAyyMR9yqwoTB4oVgu9F9WqWJmVqf3OPa1XAkwy22VX6kgqRzETuhBYJI=', '7HlGiWGPwxbi2th4kOP+mb35CX3q3MJ8ETdFNZcIY1f2DAfsBcyfKEUy6EN27/t0I6vkZVty1k/AXjMFDVaXjA==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 0, 0),
	(3, 'test3', 'test3', 'eunnamu094@gmail.com', 'roP1i0tSyECSWYiqVlJwCKpv5QvyP5/s4+qsWlWAH8+AuSxD0l1LPxZTnn/vscGwkdg0aOXxiESwQHLownZl1WHpAQu++seefZRnEW4OVme5TqqOcmjUS9P8WB+zTMdglRyPvkEYi+CrPg1GQl5LA9WH8TFARSBAaA3NvVAcqV4=', '5Sfol7eDOzYDTbAstb66/RkVG85umrgbPYbUgfQAvKuhordamwTk2fsqDz51Ez1BrJMe7XKGPFZFO8I4jx8W0Q==', NULL, '2018-12-05 16:44:09', NULL, 1, 0, 0, 0, 0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
