-- =========================================================
-- SEED DATA - Dummy Students, Teachers, Notices, Fees, Calendar Events
-- Run this AFTER creating the schema
-- =========================================================

USE `school_management`;

-- Academic Session
INSERT INTO `academic_sessions` (`session_name`, `start_date`, `end_date`, `is_current`)
VALUES ('2026-2027', '2026-01-01', '2026-12-31', 1);

SET @current_session = LAST_INSERT_ID();

-- Admin (password: admin123)
INSERT INTO `admins` (`admin_id`, `password_hash`)
VALUES ('ADMIN001', '$2a$10$YQ8GvFO6DfvDh.8qjK3YJ.KzL5g5Z5X5X5X5X5X5X5X5X5X5X');

-- =========================================================
-- TEACHERS
-- =========================================================
INSERT INTO `teachers` (`teacher_id`, `name`, `designation`, `subject`, `qualification`, `email`, `phone_number`, `joining_date`, `bio`, `is_active`) VALUES
('TCH001', 'Mr. Rafiqul Islam', 'Head Teacher', 'Mathematics', 'M.Sc in Mathematics', 'rafiq@school.edu', '01712345001', '2015-03-01', 'Experienced educator with 15+ years in teaching mathematics. Passionate about making math fun and accessible for every student.', 1),
('TCH002', 'Mrs. Fatema Begum', 'Senior Teacher', 'English', 'M.A in English Literature', 'fatema@school.edu', '01712345002', '2017-06-15', 'Dedicated English teacher who loves creative writing and drama. Leads the school debate club.', 1),
('TCH003', 'Mr. Karim Ahmed', 'Teacher', 'Physics', 'B.Sc in Physics', 'karim@school.edu', '01712345003', '2019-01-10', 'Physics enthusiast who brings experiments to life in the classroom.', 1),
('TCH004', 'Ms. Nusrat Jahan', 'Teacher', 'Chemistry', 'M.Sc in Chemistry', 'nusrat@school.edu', '01712345004', '2020-08-01', 'Makes chemistry easy with real-world applications and fun lab experiments.', 1),
('TCH005', 'Mr. Hossain Ali', 'Teacher', 'Biology', 'M.Sc in Biology', 'hossain@school.edu', '01712345005', '2018-02-20', 'Nature lover who inspires students through biology field trips.', 1),
('TCH006', 'Mrs. Sabrina Yesmin', 'Teacher', 'Bangla', 'M.A in Bangla', 'sabrina@school.edu', '01712345006', '2016-11-05', 'Preserves Bangla literature and culture through engaging classes.', 1),
('TCH007', 'Mr. Tanvir Alam', 'Teacher', 'ICT', 'B.Sc in CSE', 'tanvir@school.edu', '01712345007', '2021-01-15', 'Tech-savvy teacher who makes coding and ICT exciting for students.', 1);

-- =========================================================
-- STUDENTS (Class 9 and Class 10)
-- =========================================================
INSERT INTO `students` (`student_id`, `password_hash`, `name`, `father_name`, `mother_name`, `date_of_birth`, `blood_group`, `present_address`, `permanent_address`, `guardian_number`, `phone_number`, `guardian_email`, `relationship_with_guardian`, `class`, `roll_number`, `session_id`, `status`) VALUES
-- Class 10
('STU2026001', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Ahmed Khan', 'Karim Khan', 'Fatima Khan', '2010-03-15', 'B+', '123 Mirpur, Dhaka', '123 Mirpur, Dhaka', '01711111001', '01811111001', 'karim@gmail.com', 'Father', 'Class 10', '01', @current_session, 'active'),
('STU2026002', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Sara Ahmed', 'Jamal Ahmed', 'Roksana Ahmed', '2010-07-22', 'O+', '456 Uttara, Dhaka', '456 Uttara, Dhaka', '01711111002', '01811111002', 'jamal@gmail.com', 'Father', 'Class 10', '02', @current_session, 'active'),
('STU2026003', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Rahim Uddin', 'Abdul Uddin', 'Salma Begum', '2010-01-05', 'A+', '789 Banani, Dhaka', '789 Banani, Dhaka', '01711111003', '01811111003', 'abdul@gmail.com', 'Father', 'Class 10', '03', @current_session, 'active'),
('STU2026004', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Fatima Begum', 'Nurul Begum', 'Rahima Begum', '2010-11-18', 'AB-', '321 Dhanmondi, Dhaka', '321 Dhanmondi, Dhaka', '01711111004', '01811111004', 'nurul@gmail.com', 'Father', 'Class 10', '04', @current_session, 'active'),
('STU2026005', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Karim Hassan', 'Mizan Hassan', 'Jesmin Hassan', '2010-05-30', 'B-', '654 Gulshan, Dhaka', '654 Gulshan, Dhaka', '01711111005', '01811111005', 'mizan@gmail.com', 'Father', 'Class 10', '05', @current_session, 'active'),
('STU2026006', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Tasnim Rahman', 'Farid Rahman', 'Nasrin Rahman', '2010-09-12', 'O-', '987 Mohammadpur, Dhaka', '987 Mohammadpur, Dhaka', '01711111006', '01811111006', 'farid@gmail.com', 'Father', 'Class 10', '06', @current_session, 'active'),
('STU2026007', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Zara Islam', 'Amin Islam', 'Sumaiya Islam', '2010-02-28', 'A-', '147 Motijheel, Dhaka', '147 Motijheel, Dhaka', '01711111007', '01811111007', 'amin@gmail.com', 'Father', 'Class 10', '07', @current_session, 'active'),
('STU2026008', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Nafis Chowdhury', 'Salam Chowdhury', 'Ruma Chowdhury', '2010-06-14', 'B+', '258 Tejgaon, Dhaka', '258 Tejgaon, Dhaka', '01711111008', '01811111008', 'salam@gmail.com', 'Father', 'Class 10', '08', @current_session, 'active'),

-- Class 9
('STU2026009', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Anika Sultana', 'Rafiq Sultana', 'Ayesha Sultana', '2011-04-10', 'O+', '369 Badda, Dhaka', '369 Badda, Dhaka', '01711111009', '01811111009', 'rafiq@gmail.com', 'Father', 'Class 9', '01', @current_session, 'active'),
('STU2026010', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Shihab Hossain', 'Bashir Hossain', 'Khaleda Hossain', '2011-08-25', 'A+', '741 Rampura, Dhaka', '741 Rampura, Dhaka', '01711111010', '01811111010', 'bashir@gmail.com', 'Father', 'Class 9', '02', @current_session, 'active'),
('STU2026011', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Tanvir Alam', 'Shahid Alam', 'Nargis Alam', '2011-12-03', 'B-', '852 Vatara, Dhaka', '852 Vatara, Dhaka', '01711111011', '01811111011', 'shahid@gmail.com', 'Father', 'Class 9', '03', @current_session, 'active'),
('STU2026012', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Sumaiya Khatun', 'Monir Khatun', 'Rashida Khatun', '2011-10-17', 'AB+', '963 Uttarkhan, Dhaka', '963 Uttarkhan, Dhaka', '01711111012', '01811111012', 'monir@gmail.com', 'Father', 'Class 9', '04', @current_session, 'active'),
('STU2026013', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Arif Hossain', 'Kamal Hossain', 'Farzana Hossain', '2011-01-29', 'O-', '159 Turag, Dhaka', '159 Turag, Dhaka', '01711111013', '01811111013', 'kamal@gmail.com', 'Father', 'Class 9', '05', @current_session, 'active'),
('STU2026014', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Nusrat Jahan', 'Aftab Jahan', 'Sonia Jahan', '2011-07-08', 'A+', '753 Savar, Dhaka', '753 Savar, Dhaka', '01711111014', '01811111014', 'aftab@gmail.com', 'Father', 'Class 9', '06', @current_session, 'active'),
('STU2026015', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Imran Sheikh', 'Rashid Sheikh', 'Halima Sheikh', '2011-03-21', 'B+', '357 Keraniganj, Dhaka', '357 Keraniganj, Dhaka', '01711111015', '01811111015', 'rashid@gmail.com', 'Father', 'Class 9', '07', @current_session, 'active'),
('STU2026016', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Raihan Mia', 'Sohel Mia', 'Aklima Mia', '2011-09-14', 'O+', '481 Nawabganj, Dhaka', '481 Nawabganj, Dhaka', '01711111016', '01811111016', 'sohel@gmail.com', 'Father', 'Class 9', '08', @current_session, 'active');

-- =========================================================
-- FEES
-- =========================================================
INSERT INTO `fees` (`fee_name`, `fee_title`, `description`, `amount`, `due_date`, `class`) VALUES
('Tuition', 'Q1 Tuition Fee', 'First quarter tuition fee for all classes', 15000.00, '2026-09-30', NULL),
('Library', 'Library Fee', 'Annual library usage fee', 2000.00, '2026-09-15', NULL),
('Lab', 'Lab Fee', 'Science laboratory fee for classes 9-10', 3500.00, '2026-09-20', NULL),
('Sports', 'Sports Fee', 'Annual sports and activities fee', 1500.00, '2026-08-31', NULL),
('Exam', 'Exam Fee', 'Mid-term examination fee', 2500.00, '2026-09-10', NULL),
('Annual', 'Annual Day Fee', 'Annual day celebration fee', 5000.00, '2026-10-15', NULL);

-- Assign fees to all active students
INSERT INTO `student_fees` (`student_id`, `fee_id`, `is_paid`, `paid_at`)
SELECT s.id, f.fee_id,
  CASE
    WHEN RAND() < 0.55 THEN 1
    ELSE 0
  END,
  CASE
    WHEN RAND() < 0.55 THEN DATE_ADD(NOW(), INTERVAL FLOOR(RAND() * 30) DAY)
    ELSE NULL
  END
FROM students s
CROSS JOIN fees f
WHERE s.status = 'active';

-- =========================================================
-- NOTICES
-- =========================================================
INSERT INTO `notices` (`title`, `content`, `category`, `is_pinned`, `expires_at`) VALUES
('Mid-term Examination Schedule Released', 'The mid-term examination for all classes will commence from September 15, 2026. Students are advised to check their respective class schedules on the school portal. Hall tickets will be distributed one week before the exam.', 'exam', 1, '2026-09-20'),
('Science Fair 2026 - Register Now!', 'We are excited to announce the annual Science Fair 2026! Theme: Innovation for Sustainability. Students from classes 6-12 can participate individually or in teams of up to 3. Registration closes on August 30. Prizes worth BDT 50,000.', 'event', 0, '2026-08-30'),
('Holiday Notice - Independence Day', 'The school will remain closed on August 15, 2026, on account of Independence Day. Regular classes will resume on August 16, 2026.', 'holiday', 0, NULL),
('Admission Open for Session 2027', 'Admissions for the academic session 2027 are now open for classes KG-1 through Class 11. Application forms available at the school office. Last date: October 31, 2026.', 'admission', 1, '2026-10-31'),
('Parent-Teacher Meeting Scheduled', 'A Parent-Teacher Meeting is scheduled for August 23, 2026 (Saturday) from 9:00 AM to 1:00 PM. Parents are requested to collect their child progress report.', 'general', 0, '2026-08-23'),
('Urgent: Water Supply Maintenance', 'Due to essential maintenance of the water supply system, there will be no water availability in the school building on August 18, 2026. Students are advised to bring water bottles from home.', 'urgent', 0, '2026-08-18'),
('Library Hours Extended for Exam Prep', 'The school library will remain open until 5:00 PM from August 20 to September 14, 2026, to support students preparing for mid-term examinations.', 'general', 0, '2026-09-14'),
('Sports Day 2026 - Volunteer Registration', 'Annual Sports Day will be held on September 5, 2026. We need student volunteers for event management, first aid, and commentary. Register with the sports department by August 25.', 'event', 0, '2026-09-05'),
('Annual Cultural Program Rehearsals', 'Rehearsals for the annual cultural program will begin from September 1. All participating students must attend practice sessions every day after school hours.', 'event', 0, '2026-09-15'),
('PTA Fund Collection Drive', 'The Parent-Teacher Association is organizing a fund collection drive for building a new computer lab. Contributions are welcome from all families.', 'general', 0, '2026-09-30');

-- =========================================================
-- ACADEMIC CALENDAR EVENTS
-- =========================================================
INSERT INTO `academic_calendar` (`title`, `description`, `event_type`, `start_date`, `end_date`) VALUES
('Mid-term Examinations', 'All classes will have their mid-term examinations. Check your class schedule for specific dates and subjects.', 'exam', '2026-09-15', '2026-09-25'),
('Independence Day Holiday', 'School closed in observance of Independence Day. Celebrate with pride!', 'holiday', '2026-08-15', NULL),
('Science Fair 2026', 'Annual science fair with the theme Innovation for Sustainability. Open to all students.', 'event', '2026-09-01', '2026-09-02'),
('Sports Day 2026', 'Annual sports day with track and field events, team sports, and fun activities.', 'sports', '2026-09-05', NULL),
('Parent-Teacher Meeting', 'Parents invited to discuss student progress with class teachers. Bring student ID.', 'meeting', '2026-08-23', NULL),
('Admission Test 2027', 'Entrance examination for new student admissions for session 2027.', 'admission', '2026-11-15', '2026-11-17'),
('Annual Cultural Program', 'Students showcase their talents in music, dance, drama, and art.', 'event', '2026-10-20', '2026-10-21'),
('Winter Vacation', 'Winter vacation for all students. Classes resume on January 2, 2027.', 'holiday', '2026-12-24', '2027-01-01'),
('Result Publication', 'Mid-term results will be published on the school portal.', 'exam', '2026-10-05', NULL),
('Teacher Training Day', 'No classes for students. Teachers attending professional development workshop.', 'meeting', '2026-09-12', NULL),
('Math Olympiad', 'School-level mathematics olympiad for classes 8-10. Top performers will advance to district level.', 'event', '2026-10-10', NULL),
('Career Guidance Seminar', 'Seminar on career options and higher education opportunities for class 10 students.', 'event', '2026-10-28', NULL),
('Urdu Day Celebration', 'Special assembly and cultural performances to celebrate Urdu Language Day.', 'event', '2026-11-09', NULL),
('Final Examinations Begin', 'Final examinations for the academic session 2026-2027.', 'exam', '2026-11-20', '2026-12-10'),
('Annual Day Celebration', 'Annual prize-giving ceremony and cultural showcase. Parents are cordially invited.', 'event', '2026-12-15', NULL);

SELECT 'Seed data inserted successfully!' AS message;
