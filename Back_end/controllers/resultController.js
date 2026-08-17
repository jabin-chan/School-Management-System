const createError = require('http-errors');
const resultModel = require('../models/resultModel');

async function list(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await resultModel.findAll({
    examId: req.query.exam_id,
    klass: req.query.class,
    studentId: req.query.student_id,
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
  const result = await resultModel.findById(req.params.id);
  if (!result) throw createError(404, 'Result not found');

  const details = await resultModel.getDetails(result.result_id);
  res.json({ ...result, details });
}

async function createOrUpdate(req, res) {
  const { student_id, exam_id, total_marks, obtained_marks, gpa, grade, details } = req.body;

  const resultId = await resultModel.upsertResult({
    student_id,
    exam_id,
    total_marks,
    obtained_marks,
    gpa,
    grade
  });

  if (Array.isArray(details)) {
    for (const d of details) {
      await resultModel.upsertDetail({
        result_id: resultId,
        class_subject_id: d.class_subject_id,
        marks: d.marks,
        grade: d.grade,
        grade_point: d.grade_point
      });
    }
  }

  const result = await resultModel.findById(resultId);
  const resultDetails = await resultModel.getDetails(resultId);
  res.status(201).json({ ...result, details: resultDetails });
}

async function remove(req, res) {
  const existing = await resultModel.findById(req.params.id);
  if (!existing) throw createError(404, 'Result not found');

  await resultModel.remove(existing.result_id);
  res.json({ message: 'Result deleted successfully' });
}

async function myResults(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await resultModel.findAll({
    studentId: req.session.student.id,
    examId: req.query.exam_id,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function addDetail(req, res) {
  const result = await resultModel.findById(req.body.result_id);
  if (!result) throw createError(404, 'Result not found');

  const id = await resultModel.upsertDetail(req.body);
  const detail = await resultModel.findDetailById(id);
  res.status(201).json(detail);
}

async function removeDetail(req, res) {
  const existing = await resultModel.findDetailById(req.params.id);
  if (!existing) throw createError(404, 'Result detail not found');

  await resultModel.removeDetail(existing.detail_id);
  res.json({ message: 'Result detail deleted successfully' });
}

module.exports = { list, get, createOrUpdate, remove, myResults, addDetail, removeDetail };
