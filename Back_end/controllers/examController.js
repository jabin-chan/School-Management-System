const createError = require('http-errors');
const examModel = require('../models/examModel');

async function list(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await examModel.findAll({
    sessionId: req.query.session_id,
    klass: req.query.class,
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
  const exam = await examModel.findById(req.params.id);
  if (!exam) throw createError(404, 'Exam not found');
  res.json(exam);
}

async function create(req, res) {
  const id = await examModel.create(req.body);
  res.status(201).json(await examModel.findById(id));
}

async function update(req, res) {
  const existing = await examModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Exam not found');

  const data = { ...req.body };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  await examModel.update(existing.exam_id, data);
  res.json(await examModel.findById(existing.exam_id));
}

async function remove(req, res) {
  const existing = await examModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Exam not found');

  await examModel.remove(existing.exam_id);
  res.json({ message: 'Exam deleted successfully' });
}

module.exports = { list, get, create, update, remove };
