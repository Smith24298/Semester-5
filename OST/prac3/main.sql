-- ==========================================
-- Database Management with MySQL
-- ==========================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS CollegeDB;

-- 2. Use Database
USE CollegeDB;

-- 3. Create Student Table
CREATE TABLE Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    department VARCHAR(50),
    marks DECIMAL(5,2)
);

-- 4. Create Course Table
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL
);

-- 5. Create Enrollment Table
CREATE TABLE Enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    semester VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- ==========================================
-- Insert Sample Data
-- ==========================================

INSERT INTO Students (name, age, gender, department, marks) VALUES
('Smith Faldu', 20, 'Male', 'Computer Engineering', 89.5),
('Aarav Patel', 21, 'Male', 'Information Technology', 76.0),
('Riya Shah', 20, 'Female', 'Computer Engineering', 91.2),
('Neha Joshi', 22, 'Female', 'Electronics', 84.3),
('Yash Mehta', 21, 'Male', 'Mechanical', 68.5);

INSERT INTO Courses (course_name, credits) VALUES
('Database Management System', 4),
('Operating System', 4),
('Data Structures', 3),
('Computer Networks', 3);

INSERT INTO Enrollments (student_id, course_id, semester) VALUES
(1,1,'Semester 5'),
(1,2,'Semester 5'),
(2,1,'Semester 5'),
(3,3,'Semester 5'),
(4,4,'Semester 5'),
(5,2,'Semester 5');

-- ==========================================
-- SQL Queries
-- ==========================================

-- Display all students
SELECT * FROM Students;

-- Display all courses
SELECT * FROM Courses;

-- Students with marks greater than 80
SELECT * FROM Students
WHERE marks > 80;

-- Students sorted by marks
SELECT * FROM Students
ORDER BY marks DESC;

-- Count total students
SELECT COUNT(*) AS TotalStudents
FROM Students;

-- Average marks
SELECT AVG(marks) AS AverageMarks
FROM Students;

-- Highest marks
SELECT MAX(marks) AS HighestMarks
FROM Students;

-- Department-wise student count
SELECT department, COUNT(*) AS StudentCount
FROM Students
GROUP BY department;

-- Student and enrolled course details (JOIN)
SELECT
    s.student_id,
    s.name,
    c.course_name,
    e.semester
FROM Students s
JOIN Enrollments e
ON s.student_id = e.student_id
JOIN Courses c
ON e.course_id = c.course_id;

-- ==========================================
-- Update Example
-- ==========================================

UPDATE Students
SET marks = 92.5
WHERE student_id = 1;

-- Verify Update
SELECT * FROM Students
WHERE student_id = 1;

-- ==========================================
-- Delete Example
-- ==========================================

DELETE FROM Students
WHERE student_id = 5;

-- Verify Delete
SELECT * FROM Students;

-- ==========================================
-- Show Table Structure
-- ==========================================

DESCRIBE Students;
DESCRIBE Courses;
DESCRIBE Enrollments;

-- ==========================================
-- Show All Tables
-- ==========================================

SHOW TABLES;

-- ==========================================
-- End of Practical
-- ==========================================