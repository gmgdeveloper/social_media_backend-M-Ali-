-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2024 at 10:41 AM
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
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `post_id` varchar(255) DEFAULT '0',
  `user_id` varchar(255) DEFAULT '0',
  `comment_id` varchar(255) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `post_id`, `user_id`, `comment_id`) VALUES
(19, '1', '20', '0'),
(21, '8', '20', '0'),
(22, '9', '20', '0'),
(24, '10', '20', '0'),
(25, '11', '20', '0'),
(26, '1', '19', '0'),
(27, '2', '19', '0'),
(28, '4', '19', '0'),
(29, '8', '19', '0'),
(30, '9', '19', '0'),
(31, '10', '19', '0'),
(32, '11', '19', '0'),
(33, '12', '19', '0'),
(34, '12', '20', '0'),
(49, '4', '20', '0'),
(57, '13', '20', '0');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `media` varchar(255) NOT NULL,
  `post_date` varchar(200) DEFAULT NULL,
  `like_count` int(255) DEFAULT NULL,
  `comment_count` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `caption`, `media`, `post_date`, `like_count`, `comment_count`) VALUES
(1, 13, 'fav', 'public\\uploads\\posts\\images\\media-1711717171599-1 (132).jpg', NULL, 2, NULL),
(4, 19, 'king johnny', 'public\\uploads\\posts\\images\\media-1711921987764-6882326-cartoon-network-wallpaper.jpg', NULL, 2, NULL),
(8, 20, 'Eren Jeager...', 'public\\uploads\\posts\\images\\media-1712041849339-1 (24).jpg', NULL, 2, NULL),
(9, 20, 'Eren ', 'public\\uploads\\posts\\images\\media-1712041889202-1 (130).jpg', NULL, 2, NULL),
(10, 20, 'Eren\'s Shingeki no Kyojin', 'public\\uploads\\posts\\images\\media-1712043189100-1 (130).jpg', NULL, 2, NULL),
(11, 20, 'Shinzo wo Sasageyo', 'public\\uploads\\posts\\images\\media-1712043378594-1 (130).jpg', NULL, 2, NULL),
(12, 20, 'Eren\'s Attack Titan', 'public\\uploads\\posts\\images\\media-1712043547291-1 (130).jpg', NULL, 2, NULL),
(13, 20, 'I miss AOT', 'public\\uploads\\posts\\images\\media-1712043600640-1 (130).jpg', NULL, 1, NULL),
(14, 20, 'AOT Should have lasted longer', 'public\\uploads\\posts\\images\\media-1712043678749-1 (130).jpg', NULL, NULL, NULL),
(15, 20, 'AOT Should have been longer', 'public\\uploads\\posts\\images\\media-1712043768269-1 (130).jpg', '0000-00-00', NULL, NULL),
(16, 20, 'I wonder if AOT would have more Seasons...', 'public\\uploads\\posts\\images\\media-1712043912052-1 (130).jpg', '0000-00-00', NULL, NULL),
(17, 20, 'I need more Seasons of AOT...', 'public\\uploads\\posts\\images\\media-1712044370602-1 (130).jpg', 'Tue Apr 02 2024 12:52:50 GMT+0500 (Pakistan Standard Time),12:52:50.683', NULL, NULL),
(18, 20, 'Can we get more Seasons of AOT...?', 'public\\uploads\\posts\\images\\media-1712044428564-1 (130).jpg', 'Tue Apr 02 2024 12:53:48 GMT+0500 (Pakistan Standard Time)', NULL, NULL),
(19, 20, 'Are there hints about more Seasons of AOT...?', 'public\\uploads\\posts\\images\\media-1712044502752-1 (130).jpg', 'Tue Apr 02 2024 12:55:03 GMT+0500 (Pakistan Standard Time)', NULL, NULL),
(20, 20, 'Are there hints about more Seasons...?', 'public\\uploads\\posts\\images\\media-1712044523228-1 (130).jpg', 'Tue Apr 02 2024 12:55:23 GMT+0500 (Pakistan Standard Time)', NULL, NULL);

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
  `followers` varchar(11) NOT NULL DEFAULT '0',
  `following` varchar(11) NOT NULL DEFAULT '0',
  `role` varchar(11) NOT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `registration_date` int(111) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `full_name`, `username`, `email`, `password`, `profile_picture`, `cover`, `bio`, `phone`, `address`, `country`, `city`, `followers`, `following`, `role`, `is_admin`, `registration_date`) VALUES
(1, '', '', 'John Doe', 'johndoe123', 'john.doe@example.com', '$2a$10$axtElB58vQBgcAOnFA4oaeTm8PAkRKyeGooh4LgHgBTMKuDXQY09O', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum nec nisi non dapibus.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(2, '', '', 'John Doe', 'johndoe1234', 'johndoe@example.com', '$2a$10$ZYs6zDWOeTSVXjAppPxft.FLgoq8E0zVjrEUfsp7248Z.wNhX2QLu', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum nec nisi non dapibus.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(3, '', '', 'Jane Smith', 'janesmith456', 'jane.smith@example.com', '$2a$10$xu/hbqRAXCAELPwjLwDhw.7vv0NiFxttBAiNxbyVVmtQcXJovAJfi', 'default.png', NULL, 'Nullam vehicula velit ac lectus posuere, non fermentum neque auctor. Maecenas euismod nisl ut eros cursus fringilla.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(4, '', '', 'Michael Johnson', 'michaelj', 'michael.j@example.com', '$2a$10$KVYRpBCsTiQ/5gF9zaeBP./ujFatPTTBM3QkjmZUwE/TFTgr2bJXm', 'default.png', NULL, 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(5, '', '', 'Michael Johnson', 'michael.j', 'michael.jd@ex.com', '$2a$10$M7jHn5gaX.yWgv8L.rYIMeGSi2bDDW.5YAEGQS2Xy.j4Nqgc8uqZm', 'default.png', NULL, 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(6, '', '', 'Emily Davis', 'emily.d', 'emily.d@ex.com', '$2a$10$4ZrKjRPMivCeQA0rDDCIPOaYMC9xZmL8SNq4zJfPJQG/b801oSRB6', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed turpis semper placerat.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(7, '', '', 'Emily Davis', 'emily alex', 'emilyalex@ex.com', '$2a$10$6La4MCxYiPcay6UPzvOzlOND0Kij3zqhZSa1u7QmlSWM7PQMJYd5a', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed turpis semper placerat.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(8, '', '', 'Emily Davis', 'emilyAlex', 'emilyalexx@ex.com', '$2a$10$vFeNgsXRPJFtKitS7PBME.5m0tGbRGS8dAAs9juI/1gLy9yTEFbW.', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed turpis semper placerat.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(9, '', '', 'Emily Davis', 'emilyyalex', 'emilyyalexx@ex.com', '$2a$10$oQdpPyeKXyuNVXuVCn/Avuh8gu.KkRGTSJcX2A7/AYjpUsIHfIymS', 'default.png', NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed turpis semper placerat.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(10, '', '', 'Emily Davis', NULL, 'email@email.com', '$2a$10$BPBuxw2nLsaahm0sGmmWjegyLF38oQ/zqljTCHMkTzZJm3Jlj8RkK', 'default.png', NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(11, '', '', 'Emily Davis', 'user-1711006323921', 'email@gmail.com', '$2a$10$eQBSiND.gN9SapxDUrC.cuzTRvcTqwTwKfPbMc1tIxxD2mR6ZT7E2', 'default.png', NULL, 'Hi there, I\'m Emily Davis, I created this account on Thu Mar 21 2024', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(12, '', '', 'Ajaz', 'user-1711006508056', 'ajaz@gmail.com', '$2a$10$5/398dI8a7yCRBI7tmKm4eG859Z83S.bzBc9Nv.7eE8a4acjj/rwe', 'default.png', NULL, 'Hi there, I\'m Ajaz, I created this account on Thu Mar 21 2024', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(13, '', '', 'ahmed', 'user-1711006797385', 'ahmed@gmail.com', '$2a$10$22Z9P..vnGaGkFm4IjE3uuC8ArhBCUJWyAIMzRVItr2CEWo5GA25C', 'public\\uploads\\profiles\\profile-1711371371999-green-tech.png', NULL, 'hey there this is funcky funkster', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(14, '', '', 'ahmed', 'user-1711193826448', 'ahmedm@gmail.com', '$2a$10$azh6cMb1A6Z7FGe7oHQ7EuySKctBfPaVtjIC1tApCTqDeaMBDOJzy', 'public\\uploads\\profiles\\profile-1711369596267-green-tech.png.png', NULL, 'hey there this is funcky funkster chapri', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(15, 'ahmed', 'mujtaba', 'ahmed mujtaba', 'user-1711452362766', 'ahmedmujtaba@gmail.com', '$2a$10$hC5WP/sUOYlERTiPOuGYreefF7COE0KxXCfvzgIKRC3lgHCWHbuPm', 'default.png', NULL, 'Hi there, I\'m ahmed mujtaba, I created this account on Tue Mar 26 2024', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(16, 'ahmed', 'mujtaba', 'ahmed mujtaba', 'user-1711715865680', 'ahmedmujtaba12@gmail.com', '$2a$10$DONuJS9.PgHwpLQgGvNxg.fkqiWkiemEwbj38rPlMMqZ2/2PHy1HK', 'default.png', NULL, 'Hi there, I\'m ahmed mujtaba, I created this account on Fri Mar 29 2024', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(17, 'ahmed', 'mujtaba', 'ahmed mujtaba', 'user-1711715938170', 'ahmedmujtaba112@gmail.com', '$2a$10$bYZAWI/TXUiYDYAhx4mNjezStdpKo1XNJ8hzlKoCNfMhxvjC1QDwu', 'default.png', NULL, 'Hi there, I\'m ahmed mujtaba, I created this account on Fri Mar 29 2024', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(18, 'ammy', 'memonn', 'ammy memonn', 'user-1711835988061', 'ammymemon@gmail.com', '$2a$10$8hBUIw7DEHZlL12AJO9CL.RljcIMxIIyrPIAC91orHM3epLNPMEWu', 'default.png', NULL, 'Hi there, I\'m ammy memonn, I created this account on Sun Mar 31 2024', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(19, 'Ali', 'Pirzada', 'Ali Pirzada', 'user-1711905332404', 'ali@gmail.com', '$2a$10$lSn.NTqFVUIvyiRot7XBJuskyOreS6lz2WjdzloXlD4HAXzcMWzzu', 'default.png', NULL, 'Hi there, I\'m Ali Pirzada, I created this account on Sun Mar 31 2024', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024),
(20, 'Ali', 'Pirzada', 'Ali Pirzada', 'user-1712009022624', 'ali_pirzada@gmail.com', '$2a$10$J2X68yQyAXDm4Y4P34C5nui7F6Pucc01GmV1ZUE0bB0KVDxydBwmO', 'public\\uploads\\profiles\\profile-1712009126726-green-tech.png', NULL, 'hey there this is funcky funkster Ali the WP expert.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 2024);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
