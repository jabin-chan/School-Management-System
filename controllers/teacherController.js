const createError = require('http-errors');
const teacherModel = require('../models/teacherModel');

async function list(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await teacherModel.findAll({
    isActive: req.query.is_active !== undefined ? Number(req.query.is_active) : undefined,
    q: req.query.q,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function listPublic(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await teacherModel.findAll({
    isActive: 1,
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
  const teacher = await teacherModel.findById(req.params.id);
  if (!teacher) throw createError(404, 'Teacher not found');
  if (teacher.is_active !== 1 && !req.session.admin) throw createError(404, 'Teacher not found');
  res.json(teacher);
}

async function create(req, res) {
  const id = await teacherModel.create({
    ...req.body,
    photo_url: req.file ? `/uploads/photos/${req.file.filename}` : null
  });
  res.status(201).json(await teacherModel.findById(id));
}

async function update(req, res) {
  const existing = await teacherModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Teacher not found');

  const data = {
    ...req.body,
    photo_url: req.file ? `/uploads/photos/${req.file.filename}` : undefined
  };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  await teacherModel.update(existing.id, data);
  res.json(await teacherModel.findById(existing.id));
}

async function remove(req, res) {
  const existing = await teacherModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Teacher not found');

  await teacherModel.remove(existing.id);
  res.json({ message: 'Teacher deleted successfully' });
}

module.exports = { list, listPublic, get, create, update, remove };
