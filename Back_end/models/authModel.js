const pool = require('../config/db');

async function findAdminByAdminId(adminId) {
  const [rows] = await pool.query('SELECT * FROM admins WHERE admin_id = ? LIMIT 1', [adminId]);
  return rows[0] || null;
}

async function findStudentByStudentId(studentId) {
  const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ? LIMIT 1', [studentId]);
  return rows[0] || null;
}

async function findStudentById(id) {
  const [rows] = await pool.query('SELECT * FROM students WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

module.exports = { findAdminByAdminId, findStudentByStudentId, findStudentById };
