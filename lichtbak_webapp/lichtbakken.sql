-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 26 jan 2018 om 13:40
-- Serverversie: 10.1.21-MariaDB
-- PHP-versie: 7.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lichtbakken`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `box`
--

DROP TABLE IF EXISTS `box`;
CREATE TABLE IF NOT EXISTS `box` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `latitude` decimal(11,7) NOT NULL,
  `longitude` decimal(11,7) NOT NULL,
  `location` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `datum_toegevoegd` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `box`
--

INSERT INTO `box` (`id`, `latitude`, `longitude`, `location`, `details`, `datum_toegevoegd`) VALUES
(1, '52.1674390', '4.4712860', 'Leiden, Zernikedreef', 'De eerste LaserBox.', '2018-01-18 15:22:14'),
(2, '52.1667370', '4.4988900', 'Marnixstraat, Leiden', 'Thuisbox', '2018-01-18 09:44:16'),
(3, '52.1628990', '4.4851120', 'MC Donalds, Leiden', 'Goed voedsel', '2018-01-18 15:13:12'),
(4, '52.1636900', '4.4913390', 'Langegracht, Leiden', 'De box vlakbij Hubspot', '2018-01-18 12:10:36');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `fietser`
--

DROP TABLE IF EXISTS `fietser`;
CREATE TABLE IF NOT EXISTS `fietser` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `heeft_licht` tinyint(1) NOT NULL,
  `box_id` int(10) NOT NULL,
  `datum` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=943 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Gegevens worden geëxporteerd voor tabel `fietser`
--

INSERT INTO `fietser` (`id`, `heeft_licht`, `box_id`, `datum`) VALUES
(905, 1, 1, '2018-01-25 14:22:37'),
(906, 1, 1, '2018-01-25 14:22:37'),
(907, 1, 1, '2018-01-25 14:22:37'),
(908, 1, 1, '2018-01-25 14:22:37'),
(909, 1, 1, '2018-01-25 14:22:37'),
(910, 1, 1, '2018-01-25 14:22:37'),
(911, 1, 1, '2018-01-25 14:22:37'),
(912, 1, 1, '2018-01-25 12:30:23'),
(913, 1, 1, '2018-01-25 12:30:23'),
(914, 1, 1, '2018-01-25 12:30:23'),
(915, 1, 1, '2018-01-25 12:30:23'),
(916, 1, 1, '2018-01-25 12:30:23'),
(917, 1, 1, '2018-01-25 12:30:23'),
(918, 1, 1, '2018-01-25 12:30:50'),
(919, 1, 1, '2018-01-25 12:30:50'),
(920, 1, 1, '2018-01-25 12:30:50'),
(921, 1, 1, '2018-01-25 12:30:50'),
(922, 1, 1, '2018-01-25 12:30:50'),
(923, 1, 1, '2018-01-25 12:30:50'),
(924, 0, 1, '2018-01-25 12:43:27'),
(925, 0, 1, '2018-01-25 12:43:27'),
(926, 0, 1, '2018-01-25 12:43:27'),
(927, 0, 1, '2018-01-25 12:43:27'),
(928, 0, 1, '2018-01-25 12:43:27'),
(929, 0, 1, '2018-01-25 12:43:27'),
(930, 1, 1, '2018-01-25 12:43:27'),
(931, 1, 1, '2018-01-25 12:43:27'),
(932, 1, 1, '2018-01-25 12:43:27'),
(933, 1, 1, '2018-01-25 12:43:27'),
(934, 1, 1, '2018-01-25 12:43:27'),
(935, 1, 1, '2018-01-25 12:43:27'),
(936, 0, 1, '2018-01-25 12:48:20'),
(937, 1, 1, '2018-01-25 12:48:20'),
(938, 1, 1, '2018-01-25 12:48:20'),
(939, 1, 1, '2018-01-25 12:48:20'),
(940, 1, 1, '2018-01-25 12:48:20'),
(941, 1, 1, '2018-01-25 12:48:20'),
(942, 1, 1, '2018-01-25 12:48:20');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Gegevens worden geëxporteerd voor tabel `user`
--

INSERT INTO `user` (`id`, `email`, `password`) VALUES
(1, 'admin@laserbox.nl', '$2y$10$zGzzPzpPHVb3LfD.GAa5xOZlXTE7uN2pv.aqBr6Y/XTS4HO6E93ye');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
