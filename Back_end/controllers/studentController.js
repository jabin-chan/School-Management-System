const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const studentModel = require('../models/studentModel');
const authModel = require('../models/authModel');
const feeModel = require('../models/feeModel');

async function me(req, res) {
  const student = await studentModel.findById(req.session.student.id);
  if (!student) throw createError(404, 'Student not found');
  res.json(student);
}

async function updateMe(req, res) {
  const data = {
    phone_number: req.body.phone_number,
    guardian_number: req.body.guardian_number,
    guardian_email: req.body.guardian_email,
    present_address: req.body.present_address,
    permanent_address: req.body.permanent_address,
    photo_url: req.file ? `/uploads/photos/${req.file.filename}` : undefined
  };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  await studentModel.updateProfile(req.session.student.id, data);
  res.json(await studentModel.findById(req.session.student.id));
}

async function myFees(req, res) {
  const fees = await feeModel.getStudentFeesByStudentId(req.session.student.id);
  res.json({ fees });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const student = await authModel.findStudentById(req.session.student.id);
  if (!student) throw createError(404, 'Student not found');

  const valid = await bcrypt.compare(currentPassword, student.password_hash);
  if (!valid) throw createError(400, 'Current password is incorrect');

  await studentModel.updatePassword(student.id, await bcrypt.hash(newPassword, 10));
  res.json({ message: 'Password changed successfully' });
}

async function list(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await studentModel.findAll({
    klass: req.query.class,
    status: req.query.status,
    q: req.query.q,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function get(req, res) {
  const student = await studentModel.findById(req.params.id);
  if (!student) throw createError(404, 'Student not found');
  res.json(student);
}

async function create(req, res) {
  const created = await studentModel.createManual({
    ...req.body,
    photo_url: req.file ? `/uploads/photos/${req.file.filename}` : null
  });
  res.status(201).json({
    message: 'Student created successfully',
    student: {
      id: created.id,
      student_id: created.student_id,
      roll_number: created.roll_number
    },
    temporary_password: created.temporary_password
  });
}

async function update(req, res) {
  const existing = await studentModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Student not found');

  const data = {
    ...req.body,
    photo_url: req.file ? `/uploads/photos/${req.file.filename}` : undefined
  };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  await studentModel.update(existing.id, data);
  res.json(await studentModel.findById(existing.id));
}

async function setStatus(req, res) {
  const existing = await studentModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Student not found');

  await studentModel.update(existing.id, { status: req.body.status });
  res.json(await studentModel.findById(existing.id));
}

async function remove(req, res) {
  const existing = await studentModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Student not found');

  await studentModel.remove(existing.id);
  res.json({ message: 'Student deleted successfully' });
}

module.exports = { me, updateMe, myFees, changePassword, list, get, create, update, setStatus, remove };
