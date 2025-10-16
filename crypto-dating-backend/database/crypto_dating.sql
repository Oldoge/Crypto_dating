-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2025 at 02:04 PM
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
-- Database: `crypto_dating`
--
CREATE DATABASE IF NOT EXISTS `crypto_dating` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `crypto_dating`;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_10_05_121907_create_personal_access_tokens_table', 1),
(5, '2025_10_05_131638_create_personal_access_tokens_table', 2),
(6, '2025_10_07_000001_create_predictions_table', 2),
(7, '2025_10_07_000000_add_correct_answers_to_users_table', 3),
(8, '2025_10_09_000000_create_predictions_table', 4),
(9, '2025_10_09_080500_add_missing_columns_to_predictions_table', 5),
(10, '2025_10_09_081800_alter_predictions_coin_id_nullable', 6);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '2c082d458d446305644ce04b604df949c315deb23213b15103735cf4e0693949', '[\"*\"]', '2025-10-05 11:19:49', NULL, '2025-10-05 11:19:15', '2025-10-05 11:19:49'),
(2, 'App\\Models\\User', 1, 'auth_token', 'e9108e1c575af877c1a40feae65ba91723e610f4ebe84a4789f321dd8fe82f90', '[\"*\"]', '2025-10-05 11:20:50', NULL, '2025-10-05 11:20:40', '2025-10-05 11:20:50'),
(3, 'App\\Models\\User', 1, 'auth_token', '60a11fb347cc3c3dbceec0a1969bd0db45e819944e533230d1b60d0ece35d72b', '[\"*\"]', '2025-10-05 11:44:09', NULL, '2025-10-05 11:35:25', '2025-10-05 11:44:09'),
(4, 'App\\Models\\User', 1, 'auth_token', '50b914f1b830cb42c58cc863c54c3e909a1d6ca96849d83ccd24c05474fac325', '[\"*\"]', NULL, NULL, '2025-10-05 12:21:54', '2025-10-05 12:21:54'),
(5, 'App\\Models\\User', 1, 'auth_token', '229f14fd8482345a9d9ce99eff5b896bbe625a1d0cb031522b57a297bf60f4c1', '[\"*\"]', NULL, NULL, '2025-10-05 12:21:57', '2025-10-05 12:21:57'),
(10, 'App\\Models\\User', 3, 'auth_token', '2c8e6bb9483be8a155542499f1f2a5605d576f8e7e3b01d165968f5b4fe0e2c9', '[\"*\"]', '2025-10-07 07:50:46', NULL, '2025-10-05 12:34:15', '2025-10-07 07:50:46'),
(11, 'App\\Models\\User', 3, 'auth_token', 'f17c4a47d10b8d5fd98452a9e78d949912282829c04631e9930cd7ec983d0be2', '[\"*\"]', '2025-10-07 08:21:57', NULL, '2025-10-07 08:18:31', '2025-10-07 08:21:57'),
(13, 'App\\Models\\User', 3, 'auth_token', '17731bb61fa2bc58c811ca72d6045993d6b6624c9caa2a9fba353c48b70d6dc3', '[\"*\"]', '2025-10-07 08:25:57', NULL, '2025-10-07 08:25:56', '2025-10-07 08:25:57'),
(14, 'App\\Models\\User', 3, 'auth_token', 'edea63d02b0dec184fe4fdf277b41be88ad0ec6acf063ade7828aaaf88e19f5d', '[\"*\"]', '2025-10-07 11:55:46', NULL, '2025-10-07 11:51:28', '2025-10-07 11:55:46'),
(15, 'App\\Models\\User', 3, 'auth_token', '19ef6483ebe1f240da9abd74c5e18c67e8f03684a891aee351cca598c8a4e765', '[\"*\"]', '2025-10-07 12:30:05', NULL, '2025-10-07 12:29:54', '2025-10-07 12:30:05'),
(16, 'App\\Models\\User', 3, 'auth_token', 'a4d8a56281a9d1d590358bc04a34bf8a88b18aa5af087907fc1e8d6e4a549bed', '[\"*\"]', '2025-10-07 12:32:16', NULL, '2025-10-07 12:31:07', '2025-10-07 12:32:16'),
(17, 'App\\Models\\User', 3, 'auth_token', 'c67c359438daa85e4b5c9abb8a8b1226ca67811e85a51866274a704ef5d7de69', '[\"*\"]', '2025-10-07 14:05:32', NULL, '2025-10-07 12:32:33', '2025-10-07 14:05:32'),
(18, 'App\\Models\\User', 3, 'auth_token', 'b58195a9f35234019d007a6679105bf8f7108d943aa0ba8db0163421d78bc1fc', '[\"*\"]', '2025-10-09 03:29:49', NULL, '2025-10-09 03:24:01', '2025-10-09 03:29:49'),
(21, 'App\\Models\\User', 3, 'auth_token', '9e98c74249113b5bc0b69497db15d5e3530d13e7fd241fecaa2ef97f466f614d', '[\"*\"]', '2025-10-09 05:10:48', NULL, '2025-10-09 04:54:58', '2025-10-09 05:10:48');

-- --------------------------------------------------------

--
-- Table structure for table `predictions`
--

CREATE TABLE `predictions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `coin_id` varchar(255) DEFAULT NULL,
  `coin_name` varchar(255) NOT NULL,
  `coin_symbol` varchar(255) NOT NULL,
  `action` enum('like','dislike') NOT NULL,
  `initial_price` decimal(18,8) NOT NULL,
  `predicted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `result_checked` tinyint(1) NOT NULL DEFAULT 0,
  `actual_outcome` enum('up','down') DEFAULT NULL,
  `was_correct` tinyint(1) DEFAULT NULL,
  `checked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payload`)),
  `score` decimal(8,3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `correct_answers` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `correct_answers`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'oldoge', 'admin@motormania.com', '2025-10-05 11:19:15', 0, '$2y$12$R62GWb6W8NvjD8ocl/FpW.Spu28TiirBXgQgD9m7aAv0YGybaLIJ.', 'ZPprUp8Gqe', '2025-10-05 11:19:15', '2025-10-05 11:19:15'),
(2, 'antonio', 'cdsd@gmail.com', '2025-10-05 12:22:31', 0, '$2y$12$4ReutYtycrKUyVSrfi6tHe2NaBs0/mVw9cTKd.Hs5GYRfTgID8Pgm', 'wOcozrRWez', '2025-10-05 12:22:31', '2025-10-05 12:22:31'),
(3, 'aaron', 'elf-paying-frosty@duck.com', '2025-10-05 12:34:15', 5, '$2y$12$u36YBcDmWUY.u9KPaovHDufdZqAhf5jZoL80Ojo8XeAPBzNPfuT9K', '4lUZeUPgeZ', '2025-10-05 12:34:15', '2025-10-09 05:10:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `predictions`
--
ALTER TABLE `predictions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `predictions_user_id_client_id_unique` (`user_id`,`client_id`),
  ADD KEY `predictions_user_id_coin_id_index` (`user_id`,`coin_id`),
  ADD KEY `predictions_predicted_at_index` (`predicted_at`),
  ADD KEY `predictions_user_id_type_index` (`user_id`,`type`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `predictions`
--
ALTER TABLE `predictions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `predictions`
--
ALTER TABLE `predictions`
  ADD CONSTRAINT `predictions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
