const createError = require('http-errors');
const subjectModel = require('../models/subjectModel');

async function list(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await subjectModel.findAll({
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
  const subject = await subjectModel.findById(req.params.id);
  if (!subject) throw createError(404, 'Subject not found');
  res.json(subject);
}

async function create(req, res) {
  const id = await subjectModel.create(req.body);
  res.status(201).json(await subjectModel.findById(id));
}

async function update(req, res) {
  const existing = await subjectModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Subject not found');

  const data = { ...req.body };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  await subjectModel.update(existing.subject_id, data);
  res.json(await subjectModel.findById(existing.subject_id));
}

async function remove(req, res) {
  const existing = await subjectModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Subject not found');

  await subjectModel.remove(existing.subject_id);
  res.json({ message: 'Subject deleted successfully' });
}

module.exports = { list, get, create, update, remove };
