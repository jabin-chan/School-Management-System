const createError = require('http-errors');
const feeModel = require('../models/feeModel');

async function list(req, res) {
  const fees = await feeModel.findAll();
  res.json({ data: fees });
}

async function get(req, res) {
  const fee = await feeModel.findById(req.params.id);
  if (!fee) throw createError(404, 'Fee not found');
  res.json(fee);
}

async function create(req, res) {
  const feeId = await feeModel.create(req.body);
  const fee = await feeModel.findById(feeId);
  res.status(201).json({ message: 'Fee created', fee });
}

async function update(req, res) {
  const existing = await feeModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Fee not found');
  await feeModel.update(req.params.id, req.body);
  res.json(await feeModel.findById(req.params.id));
}

async function remove(req, res) {
  const existing = await feeModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Fee not found');
  await feeModel.remove(req.params.id);
  res.json({ message: 'Fee deleted' });
}

async function assign(req, res) {
  const fee = await feeModel.findById(req.params.id);
  if (!fee) throw createError(404, 'Fee not found');
  const count = await feeModel.assignToClass(req.params.id, fee.class || req.body.class);
  res.json({ message: `Assigned to ${count} students`, count });
}

async function studentsByFee(req, res) {
  const fee = await feeModel.findById(req.params.id);
  if (!fee) throw createError(404, 'Fee not found');
  const isPaid = req.query.isPaid !== undefined ? Number(req.query.isPaid) : undefined;
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '50', 10);
  const result = await feeModel.getStudentsByFeeId(req.params.id, { isPaid, page, limit });
  res.json({ fee, data: result.rows, total: result.total });
}

async function markStudentPaid(req, res) {
  const { id, studentId } = req.params;
  const existing = await feeModel.findStudentFee(studentId, id);
  if (!existing) throw createError(404, 'Student fee record not found');
  const updated = await feeModel.markPaid(studentId, id);
  res.json({ message: 'Marked as paid', studentFee: updated });
}

module.exports = { list, get, create, update, remove, assign, studentsByFee, markStudentPaid };
