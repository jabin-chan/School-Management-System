const createError = require('http-errors');
const feeModel = require('../models/feeModel');

async function create(req, res) {
  const id = await feeModel.create(req.body);
  res.status(201).json(await feeModel.findById(id));
}

async function list(req, res) {
  res.json({ fees: await feeModel.findAll() });
}

async function get(req, res) {
  const fee = await feeModel.findById(req.params.id);
  if (!fee) throw createError(404, 'Fee not found');
  res.json(fee);
}

async function update(req, res) {
  const existing = await feeModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Fee not found');

  const data = { ...req.body };
  Object.keys(data).forEach((k) => {
    if (data[k] === undefined) delete data[k];
  });

  await feeModel.update(existing.id, data);
  res.json(await feeModel.findById(existing.id));
}

async function remove(req, res) {
  const existing = await feeModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Fee not found');

  await feeModel.remove(existing.id);
  res.json({ message: 'Fee deleted successfully' });
}

async function assignToClass(req, res) {
  const fee = await feeModel.findById(req.params.id);
  if (!fee) throw createError(404, 'Fee not found');

  const assigned = await feeModel.assignToClass(fee.id, req.body.class);
  res.json({ message: `Fee assigned to ${assigned} student(s)`, assigned });
}

async function listStudentFees(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await feeModel.listStudentFees({
    klass: req.query.class,
    isPaid: req.query.is_paid !== undefined ? Number(req.query.is_paid) : undefined,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function markPaid(req, res) {
  const { student_id, fee_id } = req.body;
  const row = await feeModel.findStudentFee(student_id, fee_id);
  if (!row) throw createError(404, 'Fee assignment not found for this student');

  const updated = await feeModel.markPaid(student_id, fee_id);
  res.json({ message: 'Fee marked as paid', student_fee: updated });
}

async function markPaidByClass(req, res) {
  const { class: klass, fee_id } = req.body;
  const fee = await feeModel.findById(fee_id);
  if (!fee) throw createError(404, 'Fee not found');

  const updated = await feeModel.markPaidByClass(klass, fee_id);
  res.json({ message: `Marked ${updated} fee record(s) as paid`, updated });
}

module.exports = { create, list, get, update, remove, assignToClass, listStudentFees, markPaid, markPaidByClass };
