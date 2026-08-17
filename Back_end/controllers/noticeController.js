const createError = require('http-errors');
const noticeModel = require('../models/noticeModel');

async function listPublic(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await noticeModel.findPublic({
    category: req.query.category,
    q: req.query.q,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function listAdmin(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await noticeModel.findAllAdmin({
    category: req.query.category,
    q: req.query.q,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function getPublic(req, res) {
  const notice = await noticeModel.findPublicById(req.params.id);
  if (!notice) throw createError(404, 'Notice not found');
  res.json(notice);
}

async function get(req, res) {
  const notice = await noticeModel.findById(req.params.id);
  if (!notice) throw createError(404, 'Notice not found');
  res.json(notice);
}

async function create(req, res) {
  const id = await noticeModel.create({
    ...req.body,
    attachment_url: req.file ? `/uploads/notices/${req.file.filename}` : null
  });
  res.status(201).json(await noticeModel.findById(id));
}

async function update(req, res) {
  const existing = await noticeModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Notice not found');

  const data = {
    ...req.body,
    attachment_url: req.file ? `/uploads/notices/${req.file.filename}` : undefined
  };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  await noticeModel.update(existing.notice_id, data);
  res.json(await noticeModel.findById(existing.notice_id));
}

async function remove(req, res) {
  const existing = await noticeModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Notice not found');

  await noticeModel.remove(existing.notice_id);
  res.json({ message: 'Notice deleted successfully' });
}

module.exports = { listPublic, listAdmin, getPublic, get, create, update, remove };
