const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const authModel = require('../models/authModel');

function sanitizeStudent(row) {
  if (!row) return null;
  const { password_hash, ...rest } = row;
  return rest;
}

async function adminLogin(req, res) {
  const { admin_id, password } = req.body;
  const admin = await authModel.findAdminByAdminId(admin_id);
  if (!admin) throw createError(401, 'Invalid admin credentials');

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) throw createError(401, 'Invalid admin credentials');

  req.session.admin = { id: admin.id, admin_id: admin.admin_id };
  res.json({
    message: 'Login successful',
    role: 'admin',
    admin: { id: admin.id, admin_id: admin.admin_id }
  });
}

async function studentLogin(req, res) {
  const { student_id, password } = req.body;
  const student = await authModel.findStudentByStudentId(student_id);
  if (!student) throw createError(401, 'Invalid student credentials');

  const valid = await bcrypt.compare(password, student.password_hash);
  if (!valid) throw createError(401, 'Invalid student credentials');
  if (student.status !== 'active') throw createError(403, 'Your account is not active');

  req.session.student = {
    id: student.id,
    student_id: student.student_id,
    name: student.name,
    class: student.class,
    status: student.status
  };

  res.json({
    message: 'Login successful',
    role: 'student',
    student: sanitizeStudent(student)
  });
}

async function logout(req, res) {
  await new Promise((resolve, reject) => {
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });
  res.clearCookie(process.env.SESSION_COOKIE_NAME || 'school_session');
  res.json({ message: 'Logged out successfully' });
}

async function me(req, res) {
  if (req.session && req.session.admin) {
    return res.json({ role: 'admin', admin: req.session.admin });
  }
  if (req.session && req.session.student) {
    const student = await authModel.findStudentById(req.session.student.id);
    if (!student) throw createError(401, 'Session invalid — student no longer exists');
    return res.json({ role: 'student', student: sanitizeStudent(student) });
  }
  return res.json({ role: null, user: null });
}

module.exports = { adminLogin, studentLogin, logout, me };
