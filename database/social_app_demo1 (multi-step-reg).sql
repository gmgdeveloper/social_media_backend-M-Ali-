-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2024 at 12:14 PM
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
(61, '24', '29', '0');

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
(24, 29, 'Are there hints about more Seasons...? I\'d love to see more seasons of Arcane...', 'public\\uploads\\posts\\images\\media-1712221556308-1192524.png', 'Thu Apr 04 2024 14:05:56 GMT+0500 (Pakistan Standard Time)', 1, NULL),
(25, 29, 'lets freaking go', 'default.png', '5/3/24', 0, '0');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `cover_picture` varchar(255) DEFAULT NULL,
  `bio` varchar(2555) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `followers` varchar(11) NOT NULL DEFAULT '0',
  `following` varchar(11) NOT NULL DEFAULT '0',
  `role` varchar(11) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `registration_date` varchar(111) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `full_name`, `email`, `password`, `profile_picture`, `cover_picture`, `bio`, `phone`, `address`, `country`, `city`, `followers`, `following`, `role`, `is_admin`, `is_active`, `registration_date`) VALUES
(29, 'Muhammad Ali', 'Pirzada', 'Muhammad Ali Pirzada', 'mali@gmail.com', '$2a$10$BynIw/3XncQDrQP9/ZpXM.ttLgMeRzk3ZOIkgd5wUUBfYkixxUls6', 'public\\uploads\\profiles\\profile-1712228712929-1 (125)(copy_compressed).jpg', NULL, 'Hey there, this is Muhammad Ali the WP Expert and jr API developer.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, 'Thu Apr 04 2024 15:32:55 GMT+0500 (Pakistan Standard Time)'),
(30, 'Ali', 'Pirzada', 'Ali Pirzada', 'ali@gmail.com', '$2a$10$mJwS.TTTQ9oDBh3LY24gGuqJ0Yf5ml9tK.z24dtSK3pd.xgUj7NNO', 'profile-1712235832660-green-tech.png', NULL, 'Hey there, this is Ali the WP Expert, Inserting Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, 'Thu Apr 04 2024 17:00:02 GMT+0500 (Pakistan Standard Time)'),
(31, 'Azan', 'Umrani', 'Azan Umrani', 'azan@gmail.com', '$2a$10$WVq8kCIG6FrxYWC0QczxGuDTbG1.nHdIAmvdwg0SQh5052XnNRZHW', '/uploads/profiles/default.jpg', NULL, 'Hey there, this is Azan the Over-All Full-Stack Pro Developer.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 0, 'Thu Apr 04 2024 18:02:16 GMT+0500 (Pakistan Standard Time)'),
(32, 'Ahmed', 'Memon', 'Ahmed Memon', 'ammy@gmail.com', '$2a$10$ECkXYbsiCwyZmZKwSq0Pq.2YdIOKUm73uFZi3flmy0991EluZ9g1y', 'profile-1712236241243-3.jpg', NULL, 'Hey there, this is Ahmed the Chapri Graphic Designer.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, 'Thu Apr 04 2024 18:08:03 GMT+0500 (Pakistan Standard Time)'),
(33, 'Amjad', 'Sehtar', 'Amjad Sehtar', 'ajmad@gmail.com', '$2a$10$H8FB9yy/Xn86UYY.pNsQjuUQCCi.k5ZZheg4Gpb4NgcAzW13YJR4a', 'profile-1712310539571-1 (55).jpg', NULL, 'Hey there, this is Amjad Updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, 'Fri Apr 05 2024 14:47:29 GMT+0500 (Pakistan Standard Time)');

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
