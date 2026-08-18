const createError = require('http-errors');
const classSubjectModel = require('../models/classSubjectModel');

async function list(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await classSubjectModel.findAll({
    klass: req.query.class,
    subjectId: req.query.subject_id,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function get(req, res) {
  const classSubject = await classSubjectModel.findById(req.params.id);
  if (!classSubject) throw createError(404, 'Class-subject assignment not found');
  res.json(classSubject);
}

async function create(req, res) {
  const existing = await classSubjectModel.findByClassAndSubject(req.body.class, req.body.subject_id);
  if (existing) throw createError(409, 'Subject already assigned to this class');

  const id = await classSubjectModel.create(req.body);
  res.status(201).json(await classSubjectModel.findById(id));
}

async function remove(req, res) {
  const existing = await classSubjectModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Class-subject assignment not found');

  await classSubjectModel.remove(existing.class_subject_id);
  res.json({ message: 'Class-subject assignment removed successfully' });
}

module.exports = { list, get, create, remove };
