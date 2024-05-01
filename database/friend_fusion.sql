-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2024 at 12:19 AM
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
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `is_deleted` enum('0','1','true','false') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_rooms`
--

INSERT INTO `chat_rooms` (`room_id`, `room_name`, `user1_id`, `user2_id`, `created_at`, `is_deleted`) VALUES
(3, 'Muhammad Ali Pirzada', 41, 44, 'Wed, Apr 24, 2024, 5:00:28 PM', '0'),
(4, 'Muhammad Ali Pirzada', 41, 44, 'Fri, Apr 26, 2024, 8:53:53 PM', '0'),
(5, 'Muhammad Ali Pirzada', 41, 44, 'Fri, Apr 26, 2024, 8:56:05 PM', '0');

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
(20, 44, 44, 'With you my guy', 'Fri, Apr 19, 2024, 5:49:35 PM'),
(21, 46, 44, 'love❤', 'Tue, Apr 30, 2024, 3:47:58 PM'),
(22, 46, 44, '😁💕😂🤣😍😒👌😘🤷‍♂️🤷‍♂️💖😜🎶😢🤦‍♂️🥵', 'Tue, Apr 30, 2024, 3:49:07 PM');

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
(15, 44, 42, 'Fri, Apr 19, 2024, 2:40:44 PM'),
(16, 41, 43, 'Sat, Apr 20, 2024, 6:15:45 PM'),
(17, 42, 41, 'Mon, Apr 22, 2024, 2:01:06 PM'),
(18, 42, 43, 'Mon, Apr 22, 2024, 2:01:17 PM'),
(19, 42, 44, 'Mon, Apr 22, 2024, 2:01:22 PM'),
(20, 41, 42, 'Mon, Apr 22, 2024, 2:58:39 PM'),
(21, 45, 42, 'Tue, Apr 23, 2024, 3:30:01 PM'),
(22, 42, 45, 'Wed, Apr 24, 2024, 5:13:45 PM'),
(23, 46, 41, 'Mon, Apr 29, 2024, 3:20:13 PM'),
(24, 46, 42, 'Mon, Apr 29, 2024, 4:39:57 PM'),
(25, 46, 43, 'Mon, Apr 29, 2024, 8:04:03 PM');

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
(69, '45', '41', '0'),
(70, '46', '44', '0');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `media_id` int(11) NOT NULL,
  `chat_room_id` int(11) NOT NULL,
  `uploader_id` int(11) NOT NULL,
  `message_id` int(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `media_type` varchar(50) NOT NULL,
  `upload_timestamp` varchar(255) DEFAULT NULL,
  `is_deleted` enum('0','1','true','false') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `chat_room_id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `timestamp` varchar(255) DEFAULT NULL,
  `status` enum('pending','delivered','read','deleted') DEFAULT 'pending',
  `reply_to_message_id` int(11) DEFAULT NULL,
  `is_deleted` enum('0','1','true','false') DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `chat_room_id`, `from_user_id`, `to_user_id`, `content`, `timestamp`, `status`, `reply_to_message_id`, `is_deleted`) VALUES
(77, 3, 41, 44, 'baka yarooooo', 'Fri, Apr 26, 2024, 9:01:41 PM', 'pending', NULL, ''),
(78, 3, 41, 44, 'baka yarooooo', 'Fri, Apr 26, 2024, 9:02:28 PM', 'pending', NULL, ''),
(80, 3, 41, 44, 'hi kesay ho', 'Sun, Apr 28, 2024, 3:48:29 AM', 'pending', NULL, ''),
(81, 3, 41, 44, 'hi kesi ho', 'Sun, Apr 28, 2024, 3:50:08 AM', 'pending', NULL, ''),
(82, 3, 41, 44, 'hi kesi ho', 'Mon, Apr 29, 2024, 12:53:54 PM', 'pending', NULL, ''),
(83, 3, 41, 44, 'hi kesi ho', 'Mon, Apr 29, 2024, 12:58:07 PM', 'pending', NULL, ''),
(84, 3, 41, 44, 'hey there', 'Mon, Apr 29, 2024, 3:48:27 PM', 'pending', NULL, ''),
(85, 3, 41, 44, 'hey there', 'Mon, Apr 29, 2024, 4:07:09 PM', 'pending', NULL, ''),
(86, 3, 41, 44, 'hey there', 'Mon, Apr 29, 2024, 4:16:45 PM', 'pending', NULL, ''),
(87, 3, 41, 44, 'hey there', 'Mon, Apr 29, 2024, 4:25:01 PM', 'pending', NULL, ''),
(88, 3, 41, 44, 'baka', 'Mon, Apr 29, 2024, 4:25:28 PM', 'pending', NULL, '');

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
(44, 41, 'I love Anime', 'http://localhost:8000/uploads/posts/images/media-1713274855593-110948.jpg,http://localhost:8000/uploads/posts/videos/media-1713274855620-big_bro_ITACHI.mp4', 'Tue, Apr 16, 2024, 6:40:55 PM', 1, 5),
(46, 44, 'Gojo', 'http://localhost:8000/uploads/posts/images/media-1714474001509-a461da77001b2e4c94f9bcd9e81394fe.jpg', 'Tue, Apr 30, 2024, 3:46:41 PM', 1, 2);

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
(41, 'Ali', 'Pirzada', 'Ali Pirzada', 'ali@gmail.com', '$2a$10$FKppVBMFA6.Qwf2V1k00LOLoG.h4GFk6AmpL5SzDtN/YBcqJGTYxa', 'http://localhost:8000/uploads/profiles/profile-1713273367860-1 (132).jpg', 'http://localhost:8000/uploads/covers/cover--1714493937129-1_(117).jpg', 'Hey there, this is Ali Updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJpYXQiOjE3MTMzNjczMDgsImV4cCI6MTcxMzM3MDkwOH0.4oUJVdNgn10TFo9e43X6dvrZqbQ4I068NKSuwfgx6jE', 'Tue, Apr 16, 2024, 6:14:07 PM'),
(42, 'Muhammad Ali', 'Pirzada', 'Muhammad Ali Pirzada', 'mali@gmail.com', '$2a$10$QGjw/TCdVdSZR0LaG.gpYOWoFq0gpcOYWEbiyIjj43gf3krBup6XC', 'http://localhost:8000/uploads/profiles/profile--1713341962854-1_(125)(copy_compressed).jpg', 'http://localhost:8000/uploads/covers/cover--1713341962902-59.jpg', 'Hey there, this is Muhammad Ali a backend dev Updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, NULL, 'Wed, Apr 17, 2024, 1:16:29 PM'),
(43, 'Muhammad Ali', 'Pirzada', 'Muhammad Ali Pirzada', 'muhalipirzada@gmail.com', '$2a$10$teS9aU6hK1QCxSIh8QPztePxeROZN7fYPvYl24YUlI5CGbPtSjUE.', 'http://localhost:8000/uploads/profiles/profile--1713363951851-1_(125)(copy_compressed).jpg', 'http://localhost:8000/uploads/covers/cover--1713363951966-59.jpg', 'this is muhammad ali updating bio ', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, NULL, 'Wed, Apr 17, 2024, 7:25:11 PM'),
(44, 'Muhammad Ali', 'Pirzada', 'Muhammad Ali Pirzada', 'fireflyali19@gmail.com', '$2a$10$XbCvUh7HWoQBG4m./gDZcu0NNrGm1uyGZj3STNFmTq9VCs5zodcl6', 'http://localhost:8000/uploads/profiles/profile--1713367471671-1cb9d7d82c6149334f18adaf3f0c16a4.jpg', 'http://localhost:8000/uploads/covers/cover--1713367471681-1194220.jpg', 'Hey there, this is Muhammad Ali Pirzada a backend dev with knowledge of AI Updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, NULL, 'Wed, Apr 17, 2024, 8:22:40 PM'),
(45, 'Siraj', 'Umrani', 'Siraj Umrani', 'sirajumrani110@gmail.com', '$2a$10$g3IYBszVvPTGsCy97BPFi.xIBrledKA73fKiaqaL33KApKampgDNi', 'http://localhost:8000/uploads/profiles/profile--1713858549081-1_(244).jpg', 'http://localhost:8000/uploads/covers/cover--1713858549152-1_(246).jpg', 'Hey there, this is Siraj Umrani a frontend dev with knowledge of AI Updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, NULL, 'Tue, Apr 23, 2024, 12:47:13 PM'),
(46, 'Azan', 'Umrani', 'Azan Umrani', 'azan@gmail.com', '$2a$10$fQko/.KDYhTpCPYr8Dn21.bpMlAzankRKJQ1DxEkJVKWQmYkqdGxC', 'http://localhost:8000/uploads/profiles/profile--1714493149696-1_(125)(copy_compressed).jpg', 'http://localhost:8000/uploads/covers/cover--1714385702065-1_(228).jpg', 'Hey there, this is Azan Umrani a Full-Stack dev updating Bio.', NULL, NULL, NULL, NULL, '0', '0', 'user', 0, 1, NULL, 'Mon, Apr 29, 2024, 3:12:29 PM');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`room_id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`);

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
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`media_id`),
  ADD KEY `chat_room_id` (`chat_room_id`),
  ADD KEY `uploader_id` (`uploader_id`),
  ADD KEY `media_ibfk_3` (`message_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `from_user_id` (`from_user_id`),
  ADD KEY `to_user_id` (`to_user_id`),
  ADD KEY `chat_room_id` (`chat_room_id`),
  ADD KEY `reply_to_message_id` (`reply_to_message_id`);

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
-- AUTO_INCREMENT for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `followers`
--
ALTER TABLE `followers`
  MODIFY `follow_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `media_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chat_rooms_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`);

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
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_rooms` (`room_id`),
  ADD CONSTRAINT `media_ibfk_2` FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `media_ibfk_3` FOREIGN KEY (`message_id`) REFERENCES `messages` (`message_id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_4` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_rooms` (`room_id`),
  ADD CONSTRAINT `messages_ibfk_5` FOREIGN KEY (`reply_to_message_id`) REFERENCES `messages` (`message_id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
