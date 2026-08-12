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
    await sessionModel.setCurrent(existing.id);
    return res.json(await sessionModel.findById(existing.id));
  }

  await sessionModel.update(existing.id, data);
  res.json(await sessionModel.findById(existing.id));
}

async function setCurrent(req, res) {
  const existing = await sessionModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Academic session not found');

  await sessionModel.setCurrent(existing.id);
  res.json(await sessionModel.findById(existing.id));
}

async function remove(req, res) {
  const existing = await sessionModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Academic session not found');

  await sessionModel.remove(existing.id);
  res.json({ message: 'Academic session deleted successfully' });
}

module.exports = { list, get, current, create, update, setCurrent, remove };
