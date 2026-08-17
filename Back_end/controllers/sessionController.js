const createError = require('http-errors');
const sessionModel = require('../models/sessionModel');

async function list(req, res) {
  res.json({ sessions: await sessionModel.findAll() });
}

async function get(req, res) {
  const session = await sessionModel.findById(req.params.id);
  if (!session) throw createError(404, 'Academic session not found');
  res.json(session);
}

async function current(req, res) {
  const session = await sessionModel.findCurrent();
  if (!session) throw createError(404, 'No current academic session set');
  res.json(session);
}

async function create(req, res) {
  const id = await sessionModel.create(req.body);
  res.status(201).json(await sessionModel.findById(id));
}

async function update(req, res) {
  const existing = await sessionModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Academic session not found');

  const data = { ...req.body };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  if (data.is_current) {
    await sessionModel.setCurrent(existing.session_id);
    return res.json(await sessionModel.findById(existing.session_id));
  }

  await sessionModel.update(existing.session_id, data);
  res.json(await sessionModel.findById(existing.session_id));
}

async function setCurrent(req, res) {
  const existing = await sessionModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Academic session not found');

  await sessionModel.setCurrent(existing.session_id);
  res.json(await sessionModel.findById(existing.session_id));
}

async function remove(req, res) {
  const existing = await sessionModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Academic session not found');

  await sessionModel.remove(existing.session_id);
  res.json({ message: 'Academic session deleted successfully' });
}

module.exports = { list, get, current, create, update, setCurrent, remove };
