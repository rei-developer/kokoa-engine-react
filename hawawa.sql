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

-- 테이블 데이터 hawawa.users:~0 rows (대략적) 내보내기
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `nickname`, `email`, `password`, `salt`, `profileImageUrl`, `level`, `exp`, `point`, `isAdmin`, `isVerified`) VALUES
	(1, 'test', 'test', 'test@test.com', 'iucoZU7dWrlm3RgfJs0kYLuYU5JWFF0MWbTs40WCRQP5vGtcJXpKRTyXvx0VmCzp+ZxxWAsW/lgk5iDx8m+790PB13PNGY7gHdB4vqM9JbF3hMfVw2gIwtdnM3E3fcW3cqPLa49imI24iuMcvv4vRFNAZrgdJYpmJJia0cHB4Kk=', 'AZcp8/TwXGV2kOd/72sJ7byife7isDDbSFbPk88QBRqqnef/9Up9Pn0JT3pnLeE8zl9jtQBSEsyjXG94UrmTfg==', NULL, 1, 0, 0, 0, 0),
	(3, 'test2', 'test2', 'test', '/KzbU/KEaLBTDzDfv9PPx35N1okOQiWB9cx/bl5yJqxtHdOAPBx5a72YIMDO4BV6Io3/tczkxrZvGqOR2q/pJX7RAfXoRL5KERo9xdIn4AOCb0KmhhvhKXQz4DWUCMxQAIf++Z+Xjtu5IVPfOV0BbKu3eWFNrCs5LyATuP+5RMs=', 'YWvCsITRHcTJOAnnU6W2jnMR62cRaC5WSDb1Tz5AIVWgs48lgJDxNcgm1+IIviicvzTrmRjBYGenBXUWdf0kRA==', NULL, 1, 0, 0, 0, 0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
