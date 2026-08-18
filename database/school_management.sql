-- =========================================================
-- SCHOOL MANAGEMENT SYSTEM
-- MySQL Workbench
-- NO DUMMY DATA
-- =========================================================

CREATE DATABASE IF NOT EXISTS `school_management`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `school_management`;


-- =========================================================
-- 1. ACADEMIC SESSIONS
-- =========================================================

CREATE TABLE `academic_sessions` (
    `session_id` INT NOT NULL AUTO_INCREMENT,
    `session_name` VARCHAR(20) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `is_current` TINYINT(1) NOT NULL DEFAULT 0,

    PRIMARY KEY (`session_id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 2. ACADEMIC CALENDAR
-- =========================================================

CREATE TABLE `academic_calendar` (
    `event_id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `event_type` VARCHAR(50) DEFAULT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE DEFAULT NULL,

    PRIMARY KEY (`event_id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 3. ADMINS
-- =========================================================

CREATE TABLE `admins` (
    `admin_id` VARCHAR(20) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 4. ADMISSION APPLICATIONS
-- =========================================================

CREATE TABLE `admission_applications` (
    `application_id` INT NOT NULL AUTO_INCREMENT,
    `applicant_name` VARCHAR(100) NOT NULL,
    `photo_url` VARCHAR(255) DEFAULT NULL,
    `father_name` VARCHAR(100) DEFAULT NULL,
    `mother_name` VARCHAR(100) DEFAULT NULL,
    `date_of_birth` DATE DEFAULT NULL,
    `blood_group` VARCHAR(5) DEFAULT NULL,
    `present_address` VARCHAR(255) DEFAULT NULL,
    `permanent_address` VARCHAR(255) DEFAULT NULL,
    `guardian_number` VARCHAR(20) DEFAULT NULL,
    `guardian_email` VARCHAR(100) DEFAULT NULL,
    `relationship_with_guardian` VARCHAR(50) DEFAULT NULL,
    `class` VARCHAR(20) DEFAULT NULL,
    `previous_school_tc_url` VARCHAR(255) DEFAULT NULL,
    `status` ENUM('pending','passed','failed') NOT NULL DEFAULT 'pending',
    `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`application_id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 5. STUDENTS
-- =========================================================

CREATE TABLE `students` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `student_id` VARCHAR(20) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `application_id` INT DEFAULT NULL,
    `name` VARCHAR(100) NOT NULL,
    `photo_url` VARCHAR(255) DEFAULT NULL,
    `father_name` VARCHAR(100) DEFAULT NULL,
    `mother_name` VARCHAR(100) DEFAULT NULL,
    `date_of_birth` DATE DEFAULT NULL,
    `blood_group` VARCHAR(5) DEFAULT NULL,
    `present_address` VARCHAR(255) DEFAULT NULL,
    `permanent_address` VARCHAR(255) DEFAULT NULL,
    `guardian_number` VARCHAR(20) DEFAULT NULL,
    `phone_number` VARCHAR(20) DEFAULT NULL,
    `guardian_email` VARCHAR(100) DEFAULT NULL,
    `relationship_with_guardian` VARCHAR(50) DEFAULT NULL,
    `class` VARCHAR(20) DEFAULT NULL,
    `roll_number` VARCHAR(10) DEFAULT NULL,
    `session_id` INT DEFAULT NULL,
    `status` ENUM('active','inactive','graduated') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),

    UNIQUE KEY `student_id` (`student_id`),

    KEY `fk_students_application` (`application_id`),
    KEY `fk_students_session` (`session_id`),

    CONSTRAINT `fk_students_application`
        FOREIGN KEY (`application_id`)
        REFERENCES `admission_applications` (`application_id`)
        ON DELETE SET NULL,

    CONSTRAINT `fk_students_session`
        FOREIGN KEY (`session_id`)
        REFERENCES `academic_sessions` (`session_id`)
        ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 6. TEACHERS
-- =========================================================

CREATE TABLE `teachers` (
    `teacher_id` VARCHAR(20) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `photo_url` VARCHAR(255) DEFAULT NULL,
    `designation` VARCHAR(100) DEFAULT NULL,
    `subject` VARCHAR(100) DEFAULT NULL,
    `qualification` VARCHAR(150) DEFAULT NULL,
    `email` VARCHAR(100) DEFAULT NULL,
    `phone_number` VARCHAR(20) DEFAULT NULL,
    `joining_date` DATE DEFAULT NULL,
    `bio` TEXT DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,

    PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 7. FEES
-- =========================================================

CREATE TABLE `fees` (
    `fee_id` INT NOT NULL AUTO_INCREMENT,
    `fee_name` VARCHAR(150) NOT NULL,
    `fee_title` VARCHAR(100) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `due_date` DATE DEFAULT NULL,
    `class` VARCHAR(20) DEFAULT NULL,

    PRIMARY KEY (`fee_id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 8. STUDENT FEES
-- =========================================================

CREATE TABLE `student_fees` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `student_id` INT NOT NULL,
    `fee_id` INT NOT NULL,
    `is_paid` TINYINT(1) NOT NULL DEFAULT 0,
    `paid_at` DATETIME DEFAULT NULL,

    PRIMARY KEY (`id`),

    KEY `fk_studentfees_student` (`student_id`),
    KEY `fk_studentfees_fee` (`fee_id`),

    CONSTRAINT `fk_studentfees_student`
        FOREIGN KEY (`student_id`)
        REFERENCES `students` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_studentfees_fee`
        FOREIGN KEY (`fee_id`)
        REFERENCES `fees` (`fee_id`)
        ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 9. NOTICES
-- =========================================================

CREATE TABLE `notices` (
    `notice_id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `content` TEXT DEFAULT NULL,
    `category` VARCHAR(50) DEFAULT NULL,
    `attachment_url` VARCHAR(255) DEFAULT NULL,
    `is_pinned` TINYINT(1) NOT NULL DEFAULT 0,
    `expires_at` DATE DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 10. ANONYMOUS POSTS
-- =========================================================

CREATE TABLE `anonymous_posts` (
    `post_id` INT NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `submitted_by` INT DEFAULT NULL,
    `upvote_count` INT NOT NULL DEFAULT 0,
    `downvote_count` INT NOT NULL DEFAULT 0,
    `score` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`post_id`),

    KEY `fk_posts_student` (`submitted_by`),

    CONSTRAINT `fk_posts_student`
        FOREIGN KEY (`submitted_by`)
        REFERENCES `students` (`id`)
        ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 11. POST COMMENTS
-- =========================================================

CREATE TABLE `post_comments` (
    `comment_id` INT NOT NULL AUTO_INCREMENT,
    `post_id` INT NOT NULL,
    `commenter_id` INT DEFAULT NULL,
    `comment` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`comment_id`),

    KEY `fk_comments_post` (`post_id`),
    KEY `fk_comments_student` (`commenter_id`),

    CONSTRAINT `fk_comments_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `anonymous_posts` (`post_id`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_comments_student`
        FOREIGN KEY (`commenter_id`)
        REFERENCES `students` (`id`)
        ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- FINISHED
-- =========================================================

SELECT 'Database and tables created successfully!' AS message;