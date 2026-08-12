const createError = require('http-errors');
const calendarModel = require('../models/calendarModel');

async function list(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  const { rows, total } = await calendarModel.findAll({
    eventType: req.query.event_type,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function get(req, res) {
  const event = await calendarModel.findById(req.params.id);
  if (!event) throw createError(404, 'Calendar event not found');
  res.json(event);
}

async function create(req, res) {
  const id = await calendarModel.create(req.body);
  res.status(201).json(await calendarModel.findById(id));
}

async function update(req, res) {
  const existing = await calendarModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Calendar event not found');

  const data = { ...req.body };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  await calendarModel.update(existing.id, data);
  res.json(await calendarModel.findById(existing.id));
}

async function remove(req, res) {
  const existing = await calendarModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Calendar event not found');

  await calendarModel.remove(existing.id);
  res.json({ message: 'Calendar event deleted successfully' });
}

module.exports = { list, get, create, update, remove };
