-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2024 at 11:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social_app_demo1`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `media` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `caption`, `media`) VALUES
(1, 13, 'fav', 'public\\uploads\\posts\\videos\\media-1711537654282-♡_.ɳαɾυƚσ._♡_7089857799521307931.mp4'),
(2, 13, 'fav', 'public\\uploads\\posts\\videos\\media-1711537725275-♡_.ɳαɾυƚσ._♡_7133642635813637377.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `bio` varchar(2555) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `role` varchar(11) NOT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `registration_date` int(111) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `full_name`, `username`, `email`, `password`, `profile_picture`, `cover`, `bio`, `phone`, `address`, `country`, `city`, `role`, `is_admin`, `registration_date`) VALUES
(1, '', '', 'John Doe', 'johndoe123', 'john.doe@example.com', '$2a$10$axtElB58vQBgcAOnFA4oaeTm8PAkRKyeGooh4LgHgBTMKuDXQY09O', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum nec nisi non dapibus.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(2, '', '', 'John Doe', 'johndoe1234', 'johndoe@example.com', '$2a$10$ZYs6zDWOeTSVXjAppPxft.FLgoq8E0zVjrEUfsp7248Z.wNhX2QLu', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum nec nisi non dapibus.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(3, '', '', 'Jane Smith', 'janesmith456', 'jane.smith@example.com', '$2a$10$xu/hbqRAXCAELPwjLwDhw.7vv0NiFxttBAiNxbyVVmtQcXJovAJfi', 'default.png', NULL, 'Nullam vehicula velit ac lectus posuere, non fermentum neque auctor. Maecenas euismod nisl ut eros cursus fringilla.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(4, '', '', 'Michael Johnson', 'michaelj', 'michael.j@example.com', '$2a$10$KVYRpBCsTiQ/5gF9zaeBP./ujFatPTTBM3QkjmZUwE/TFTgr2bJXm', 'default.png', NULL, 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(5, '', '', 'Michael Johnson', 'michael.j', 'michael.jd@ex.com', '$2a$10$M7jHn5gaX.yWgv8L.rYIMeGSi2bDDW.5YAEGQS2Xy.j4Nqgc8uqZm', 'default.png', NULL, 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(6, '', '', 'Emily Davis', 'emily.d', 'emily.d@ex.com', '$2a$10$4ZrKjRPMivCeQA0rDDCIPOaYMC9xZmL8SNq4zJfPJQG/b801oSRB6', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed turpis semper placerat.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(7, '', '', 'Emily Davis', 'emily alex', 'emilyalex@ex.com', '$2a$10$6La4MCxYiPcay6UPzvOzlOND0Kij3zqhZSa1u7QmlSWM7PQMJYd5a', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed turpis semper placerat.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(8, '', '', 'Emily Davis', 'emilyAlex', 'emilyalexx@ex.com', '$2a$10$vFeNgsXRPJFtKitS7PBME.5m0tGbRGS8dAAs9juI/1gLy9yTEFbW.', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed turpis semper placerat.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(9, '', '', 'Emily Davis', 'emilyyalex', 'emilyyalexx@ex.com', '$2a$10$oQdpPyeKXyuNVXuVCn/Avuh8gu.KkRGTSJcX2A7/AYjpUsIHfIymS', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed turpis semper placerat.', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(10, '', '', 'Emily Davis', NULL, 'email@email.com', '$2a$10$BPBuxw2nLsaahm0sGmmWjegyLF38oQ/zqljTCHMkTzZJm3Jlj8RkK', 'default.png', NULL, NULL, NULL, NULL, NULL, NULL, 'user', 0, 2024),
(11, '', '', 'Emily Davis', 'user-1711006323921', 'email@gmail.com', '$2a$10$eQBSiND.gN9SapxDUrC.cuzTRvcTqwTwKfPbMc1tIxxD2mR6ZT7E2', 'default.png', NULL, 'Hi there, I\'m Emily Davis, I created this account on Thu Mar 21 2024', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(12, '', '', 'Ajaz', 'user-1711006508056', 'ajaz@gmail.com', '$2a$10$5/398dI8a7yCRBI7tmKm4eG859Z83S.bzBc9Nv.7eE8a4acjj/rwe', 'default.png', NULL, 'Hi there, I\'m Ajaz, I created this account on Thu Mar 21 2024', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(13, '', '', 'ahmed', 'user-1711006797385', 'ahmed@gmail.com', '$2a$10$22Z9P..vnGaGkFm4IjE3uuC8ArhBCUJWyAIMzRVItr2CEWo5GA25C', 'public\\uploads\\profiles\\profile-1711371371999-green-tech.png', NULL, 'hey there this is funcky funkster', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(14, '', '', 'ahmed', 'user-1711193826448', 'ahmedm@gmail.com', '$2a$10$azh6cMb1A6Z7FGe7oHQ7EuySKctBfPaVtjIC1tApCTqDeaMBDOJzy', 'public\\uploads\\profiles\\profile-1711369596267-green-tech.png.png', NULL, 'hey there this is funcky funkster chapri', NULL, NULL, NULL, NULL, 'user', 0, 2024),
(15, 'ahmed', 'mujtaba', 'ahmed mujtaba', 'user-1711452362766', 'ahmedmujtaba@gmail.com', '$2a$10$hC5WP/sUOYlERTiPOuGYreefF7COE0KxXCfvzgIKRC3lgHCWHbuPm', 'default.png', NULL, 'Hi there, I\'m ahmed mujtaba, I created this account on Tue Mar 26 2024', NULL, NULL, NULL, NULL, 'user', 0, 2024);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
