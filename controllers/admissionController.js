const createError = require('http-errors');
const admissionModel = require('../models/admissionModel');
const studentModel = require('../models/studentModel');
const sessionModel = require('../models/sessionModel');

async function apply(req, res) {
  const files = req.files || {};
  const photo = files.photo && files.photo[0];
  const tc = files.previousSchoolTc && files.previousSchoolTc[0];

  const application = {
    ...req.body,
    photo_url: photo ? `/uploads/photos/${photo.filename}` : null,
    previous_school_tc_url: tc ? `/uploads/tc/${tc.filename}` : null
  };

  const id = await admissionModel.create(application);
  res.status(201).json({
    message: 'Application submitted successfully',
    application_id: id,
    status: 'pending'
  });
}

async function list(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await admissionModel.findAll({
    status: req.query.status,
    page,
    limit
  });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function get(req, res) {
  const application = await admissionModel.findById(req.params.id);
  if (!application) throw createError(404, 'Application not found');
  res.json(application);
}

async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const application = await admissionModel.findById(id);
  if (!application) throw createError(404, 'Application not found');

  if (status === 'passed') {
    const existing = await studentModel.findByApplicationId(id);
    if (existing) throw createError(409, 'A student has already been created for this application');

    const currentSession = await sessionModel.findCurrent();
    application.session_id = currentSession ? currentSession.id : null;

    const created = await studentModel.createFromApplication(application);
    return res.status(201).json({
      message: 'Application approved — student created',
      student: {
        id: created.id,
        student_id: created.student_id,
        class: application.class,
        roll_number: created.roll_number
      },
      temporary_password: created.temporary_password
    });
  }

  await admissionModel.updateStatus(id, status);
  res.json({ message: `Application status updated to ${status}`, status });
}

module.exports = { apply, list, get, updateStatus };
