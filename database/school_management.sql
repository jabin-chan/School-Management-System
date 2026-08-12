-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 12, 2026 at 06:11 PM
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
-- Database: `school_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_calendar`
--

CREATE TABLE `academic_calendar` (
  `event_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic_calendar`
--

INSERT INTO `academic_calendar` (`event_id`, `title`, `description`, `event_type`, `start_date`, `end_date`) VALUES
(1, 'Winter Vacation', 'শীতকালীন ছুটি', 'holiday', '2026-12-20', '2027-01-01'),
(2, 'Half-Yearly Exam', 'ষাণ্মাসিক পরীক্ষা', 'exam', '2026-06-15', '2026-06-25');

-- --------------------------------------------------------

--
-- Table structure for table `academic_sessions`
--

CREATE TABLE `academic_sessions` (
  `session_id` int(11) NOT NULL,
  `session_name` varchar(20) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic_sessions`
--

INSERT INTO `academic_sessions` (`session_id`, `session_name`, `start_date`, `end_date`, `is_current`) VALUES
(1, '2024-2025', '2024-01-01', '2024-12-31', 0),
(2, '2025-2026', '2025-01-01', '2025-12-31', 1);

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `password_hash`, `created_at`) VALUES
('ADM-001', '$2y$10$examplehashvalue1234567890abcdefg', '2026-08-12 15:48:37'),
('ADM-002', '$2y$10$examplehashvalue0987654321zyxwvuts', '2026-08-12 15:48:37');

-- --------------------------------------------------------

--
-- Table structure for table `admission_applications`
--

CREATE TABLE `admission_applications` (
  `application_id` int(11) NOT NULL,
  `applicant_name` varchar(100) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `present_address` varchar(255) DEFAULT NULL,
  `permanent_address` varchar(255) DEFAULT NULL,
  `guardian_number` varchar(20) DEFAULT NULL,
  `guardian_email` varchar(100) DEFAULT NULL,
  `relationship_with_guardian` varchar(50) DEFAULT NULL,
  `class` varchar(20) DEFAULT NULL,
  `previous_school_tc_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','passed','failed') NOT NULL DEFAULT 'pending',
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admission_applications`
--

INSERT INTO `admission_applications` (`application_id`, `applicant_name`, `photo_url`, `father_name`, `mother_name`, `date_of_birth`, `blood_group`, `present_address`, `permanent_address`, `guardian_number`, `guardian_email`, `relationship_with_guardian`, `class`, `previous_school_tc_url`, `status`, `applied_at`) VALUES
(1, 'Rafiul Islam', NULL, 'Abdul Karim', 'Nasrin Akter', '2012-05-14', 'B+', 'Pabna Sadar, Pabna', 'Pabna Sadar, Pabna', '01712345678', 'karim.guardian@example.com', 'Father', 'Class 7', NULL, 'passed', '2026-08-12 15:48:37'),
(2, 'Sadia Islam', NULL, 'Jahangir Alam', 'Rehana Begum', '2011-11-02', 'O+', 'Ishwardi, Pabna', 'Ishwardi, Pabna', '01898765432', 'jahangir.guardian@example.com', 'Father', 'Class 8', NULL, 'pending', '2026-08-12 15:48:37'),
(3, 'Tanvir Ahmed', NULL, 'Mostafizur Rahman', 'Shirin Sultana', '2013-02-20', 'A-', 'Bera, Pabna', 'Bera, Pabna', '01911223344', 'mostafiz.guardian@example.com', 'Father', 'Class 6', NULL, 'failed', '2026-08-12 15:48:37');

-- --------------------------------------------------------

--
-- Table structure for table `anonymous_posts`
--

CREATE TABLE `anonymous_posts` (
  `post_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `submitted_by` int(11) DEFAULT NULL,
  `upvote_count` int(11) NOT NULL DEFAULT 0,
  `downvote_count` int(11) NOT NULL DEFAULT 0,
  `score` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anonymous_posts`
--

INSERT INTO `anonymous_posts` (`post_id`, `content`, `submitted_by`, `upvote_count`, `downvote_count`, `score`, `created_at`) VALUES
(1, 'স্কুলের ক্যান্টিনের খাবারের মান আরও ভালো হওয়া দরকার।', 1, 15, 2, 13, '2026-08-12 15:48:37'),
(2, 'আজকের ক্লাস টেস্ট নিয়ে সবাই কেমন প্রস্তুতি নিচ্ছে?', 2, 8, 0, 8, '2026-08-12 15:48:37');

-- --------------------------------------------------------

--
-- Table structure for table `fees`
--

CREATE TABLE `fees` (
  `fee_id` int(11) NOT NULL,
  `fee_name` varchar(150) NOT NULL,
  `fee_title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date DEFAULT NULL,
  `class` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fees`
--

INSERT INTO `fees` (`fee_id`, `fee_name`, `fee_title`, `description`, `amount`, `due_date`, `class`) VALUES
(1, 'Tuition - January 2026', 'Tuition', 'মাসিক বেতন - জানুয়ারি', 1500.00, '2026-01-10', 'Class 7'),
(2, 'Annual Sports Fee 2026', 'Sports Fee', 'বার্ষিক ক্রীড়া চাঁদা', 500.00, '2026-02-01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `notice_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `expires_at` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notices`
--

INSERT INTO `notices` (`notice_id`, `title`, `content`, `category`, `attachment_url`, `is_pinned`, `expires_at`, `created_at`) VALUES
(1, 'Annual Sports Day 2026', 'বার্ষিক ক্রীড়া প্রতিযোগিতা আগামী ১৫ সেপ্টেম্বর অনুষ্ঠিত হবে।', 'event', NULL, 1, '2026-09-15', '2026-08-12 15:48:37'),
(2, 'Mid-Term Exam Routine', 'দ্বিতীয় সাময়িক পরীক্ষার সময়সূচি প্রকাশ করা হয়েছে।', 'exam', NULL, 0, '2026-10-01', '2026-08-12 15:48:37');

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `comment_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `commenter_id` int(11) DEFAULT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_comments`
--

INSERT INTO `post_comments` (`comment_id`, `post_id`, `commenter_id`, `comment`, `created_at`) VALUES
(1, 1, 2, 'একদম ঠিক কথা, আমিও একমত।', '2026-08-12 15:48:37'),
(2, 2, 1, 'আমি ভালোভাবে প্রস্তুতি নিচ্ছি!', '2026-08-12 15:48:37');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `application_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `present_address` varchar(255) DEFAULT NULL,
  `permanent_address` varchar(255) DEFAULT NULL,
  `guardian_number` varchar(20) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `guardian_email` varchar(100) DEFAULT NULL,
  `relationship_with_guardian` varchar(50) DEFAULT NULL,
  `class` varchar(20) DEFAULT NULL,
  `roll_number` varchar(10) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive','graduated') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `password_hash`, `application_id`, `name`, `photo_url`, `father_name`, `mother_name`, `date_of_birth`, `blood_group`, `present_address`, `permanent_address`, `guardian_number`, `phone_number`, `guardian_email`, `relationship_with_guardian`, `class`, `roll_number`, `session_id`, `status`, `created_at`) VALUES
(1, 'STU-2025-001', '$2y$10$studenthash1example1234567890abc', 1, 'Rafiul Islam', NULL, 'Abdul Karim', 'Nasrin Akter', '2012-05-14', 'B+', 'Pabna Sadar, Pabna', 'Pabna Sadar, Pabna', '01712345678', '01700000001', 'karim.guardian@example.com', 'Father', 'Class 7', '01', 2, 'active', '2026-08-12 15:48:37'),
(2, 'STU-2025-002', '$2y$10$studenthash2example1234567890abc', NULL, 'Mim Akter', NULL, 'Habibur Rahman', 'Selina Begum', '2012-09-09', 'A+', 'Pabna Sadar, Pabna', 'Pabna Sadar, Pabna', '01622334455', '01700000002', 'habibur.guardian@example.com', 'Father', 'Class 7', '02', 2, 'active', '2026-08-12 15:48:37');

-- --------------------------------------------------------

--
-- Table structure for table `student_fees`
--

CREATE TABLE `student_fees` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `fee_id` int(11) NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `paid_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_fees`
--

INSERT INTO `student_fees` (`id`, `student_id`, `fee_id`, `is_paid`, `paid_at`) VALUES
(1, 1, 1, 1, '2026-01-08 10:30:00'),
(2, 1, 2, 0, NULL),
(3, 2, 1, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `teacher_id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `qualification` varchar(150) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`teacher_id`, `name`, `photo_url`, `designation`, `subject`, `qualification`, `email`, `phone_number`, `joining_date`, `bio`, `is_active`) VALUES
('TCH-001', 'Kamal Hossain', NULL, 'Senior Teacher', 'Mathematics', 'MSc in Mathematics', 'kamal.hossain@school.edu', '01555000111', '2018-03-01', 'Teaches math for Class 6-8.', 1),
('TCH-002', 'Farida Yasmin', NULL, 'Assistant Teacher', 'English', 'MA in English', 'farida.yasmin@school.edu', '01555000222', '2020-07-15', 'Teaches English literature and grammar.', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_calendar`
--
ALTER TABLE `academic_calendar`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `academic_sessions`
--
ALTER TABLE `academic_sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `admission_applications`
--
ALTER TABLE `admission_applications`
  ADD PRIMARY KEY (`application_id`);

--
-- Indexes for table `anonymous_posts`
--
ALTER TABLE `anonymous_posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `fk_posts_student` (`submitted_by`);

--
-- Indexes for table `fees`
--
ALTER TABLE `fees`
  ADD PRIMARY KEY (`fee_id`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`notice_id`);

--
-- Indexes for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `fk_comments_post` (`post_id`),
  ADD KEY `fk_comments_student` (`commenter_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD KEY `fk_students_application` (`application_id`),
  ADD KEY `fk_students_session` (`session_id`);

--
-- Indexes for table `student_fees`
--
ALTER TABLE `student_fees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_studentfees_student` (`student_id`),
  ADD KEY `fk_studentfees_fee` (`fee_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`teacher_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_calendar`
--
ALTER TABLE `academic_calendar`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `academic_sessions`
--
ALTER TABLE `academic_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `admission_applications`
--
ALTER TABLE `admission_applications`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `anonymous_posts`
--
ALTER TABLE `anonymous_posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fees`
--
ALTER TABLE `fees`
  MODIFY `fee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `notice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_fees`
--
ALTER TABLE `student_fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anonymous_posts`
--
ALTER TABLE `anonymous_posts`
  ADD CONSTRAINT `fk_posts_student` FOREIGN KEY (`submitted_by`) REFERENCES `students` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `fk_comments_post` FOREIGN KEY (`post_id`) REFERENCES `anonymous_posts` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comments_student` FOREIGN KEY (`commenter_id`) REFERENCES `students` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_application` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`application_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_students_session` FOREIGN KEY (`session_id`) REFERENCES `academic_sessions` (`session_id`) ON DELETE SET NULL;

--
-- Constraints for table `student_fees`
--
ALTER TABLE `student_fees`
  ADD CONSTRAINT `fk_studentfees_fee` FOREIGN KEY (`fee_id`) REFERENCES `fees` (`fee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_studentfees_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
