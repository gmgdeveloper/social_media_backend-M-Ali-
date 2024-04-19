-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2024 at 11:43 AM
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
-- Database: `friend_fusion`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `user_id`, `comment_text`, `created_at`) VALUES
(11, 44, 42, 'Fav Anime?', 'Wed, Apr 17, 2024, 1:25:27 PM'),
(15, 44, 42, 'Want to watch it together???', 'Wed, Apr 17, 2024, 2:13:21 PM'),
(16, 44, 42, 'How long have you been watching Anime?', 'Wed, Apr 17, 2024, 2:16:05 PM'),
(17, 44, 41, 'How long have you been watching Anime?', 'Wed, Apr 17, 2024, 5:53:32 PM'),
(18, 45, 41, 'Which Car is your Fav?', 'Thu, Apr 18, 2024, 1:04:03 PM');

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `follow_id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL,
  `follow_date` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`follow_id`, `follower_id`, `following_id`, `follow_date`) VALUES
(14, 44, 41, 'Fri, Apr 19, 2024, 2:40:27 PM'),
(15, 44, 42, 'Fri, Apr 19, 2024, 2:40:44 PM');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `user_id`, `photo`, `video`, `description`, `created_at`) VALUES
(3, 44, 'http://localhost:8000/uploads/gallery/images/media-1713454013481-1_(117).jpg', NULL, NULL, 'Thu, Apr 18, 2024, 8:26:53 PM');

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
(66, '44', '42', '0'),
(68, '43', '41', '0'),
(69, '45', '41', '0');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `media` varchar(255) DEFAULT NULL,
  `post_date` varchar(200) DEFAULT NULL,
  `like_count` int(255) DEFAULT 0,
  `comment_count` int(255) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `caption`, `media`, `post_date`, `like_count`, `comment_count`) VALUES
(42, 41, 'Will AI really take our jobs...?', 'http://localhost:8000/uploads/posts/images/media-1713274534001-1 (203).jpg', 'Tue, Apr 16, 2024, 6:35:34 PM', 0, 0),
(43, 41, 'I love Anime', 'http://localhost:8000/uploads/posts/videos/media-1713274625620-zhenyaaa_6981054971030686981.mp4', 'Tue, Apr 16, 2024, 6:37:05 PM', 1, 0),
(44, 41, 'I love Anime', 'http://localhost:8000/uploads/posts/images/media-1713274855593-110948.jpg,http://localhost:8000/uploads/posts/videos/media-1713274855620-big_bro_ITACHI.mp4', 'Tue, Apr 16, 2024, 6:40:55 PM', 1, 4),
(45, 41, 'I love cars', 'http://localhost:8000/uploads/posts/images/media-1713353345605-1_(203).jpg', 'Wed, Apr 17, 2024, 4:29:06 PM', 1, 1);

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
  `reset_token` varchar(255) DEFAULT NULL,
  `registration_date` varchar(111) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `full_name`, `email`, `password`, `profile_picture`, `cover_picture`, `bio`, `phone`, `address`, `country`, `city`, `followers`, `following`, `role`, `is_admin`, `is_active`, `reset_token`, `registration_date`) VALUES
(41, 'Ali', 'Pirzada', 'Ali Pirzada', 'ali@gmail.com', '$2a$10$FKppVBMFA6.Qwf2V1k00LOLoG.h4GFk6AmpL5SzDtN/YBcqJGTYxa', 'http://localhost:8000/uploads/profiles/profile-1713273367860-1 (132).jpg', 'http://localhost:8000/uploads/covers/cover-1713273368564-1 (248).jpg', 'Hey there, this is Ali Updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJpYXQiOjE3MTMzNjczMDgsImV4cCI6MTcxMzM3MDkwOH0.4oUJVdNgn10TFo9e43X6dvrZqbQ4I068NKSuwfgx6jE', 'Tue, Apr 16, 2024, 6:14:07 PM'),
(42, 'Muhammad Ali', 'Pirzada', 'Muhammad Ali Pirzada', 'mali@gmail.com', '$2a$10$QGjw/TCdVdSZR0LaG.gpYOWoFq0gpcOYWEbiyIjj43gf3krBup6XC', 'http://localhost:8000/uploads/profiles/profile--1713341962854-1_(125)(copy_compressed).jpg', 'http://localhost:8000/uploads/covers/cover--1713341962902-59.jpg', 'Hey there, this is Muhammad Ali a backend dev Updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, NULL, 'Wed, Apr 17, 2024, 1:16:29 PM'),
(43, 'Muhammad Ali', 'Pirzada', 'Muhammad Ali Pirzada', 'muhalipirzada@gmail.com', '$2a$10$teS9aU6hK1QCxSIh8QPztePxeROZN7fYPvYl24YUlI5CGbPtSjUE.', 'http://localhost:8000/uploads/profiles/profile--1713363951851-1_(125)(copy_compressed).jpg', 'http://localhost:8000/uploads/covers/cover--1713363951966-59.jpg', 'this is muhammad ali updating bio ', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, NULL, 'Wed, Apr 17, 2024, 7:25:11 PM'),
(44, 'Muhammad Ali', 'Pirzada', 'Muhammad Ali Pirzada', 'fireflyali19@gmail.com', '$2a$10$bMOj1YVq.4bgHvI6BktQ6O0Q2YuC2WSR1rYERXcV97PJ39F9eVz/K', 'http://localhost:8000/uploads/profiles/profile--1713367471671-1cb9d7d82c6149334f18adaf3f0c16a4.jpg', 'http://localhost:8000/uploads/covers/cover--1713367471681-1194220.jpg', 'Hey there, this is Muhammad Ali Pirzada a backend dev with knowledge of AI Updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, NULL, 'Wed, Apr 17, 2024, 8:22:40 PM');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`follow_id`),
  ADD KEY `fk_follower` (`follower_id`),
  ADD KEY `fk_following` (`following_id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `followers`
--
ALTER TABLE `followers`
  MODIFY `follow_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `fk_follower` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_following` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `gallery`
--
ALTER TABLE `gallery`
  ADD CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
