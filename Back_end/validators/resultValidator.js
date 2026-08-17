const { body } = require('express-validator');

exports.createOrUpdateResult = [
  body('student_id').isInt().withMessage('student_id must be an integer').toInt(),
  body('exam_id').isInt().withMessage('exam_id must be an integer').toInt(),
  body('total_marks').isFloat({ min: 0 }).withMessage('total_marks must be a positive number').toFloat(),
  body('obtained_marks').isFloat({ min: 0 }).withMessage('obtained_marks must be a positive number').toFloat(),
  body('gpa').optional({ checkFalsy: true }).isFloat({ min: 0, max: 5 }).withMessage('gpa must be between 0 and 5').toFloat(),
  body('grade').optional({ checkFalsy: true }).trim().isLength({ max: 5 }),
  body('details').optional().isArray(),
  body('details.*.class_subject_id').optional().isInt().toInt(),
  body('details.*.marks').optional().isFloat({ min: 0 }).toFloat(),
  body('details.*.grade').optional({ checkFalsy: true }).trim().isLength({ max: 5 }),
  body('details.*.grade_point').optional({ checkFalsy: true }).isFloat({ min: 0, max: 5 }).toFloat()
];

exports.addDetail = [
  body('result_id').isInt().withMessage('result_id must be an integer').toInt(),
  body('class_subject_id').isInt().withMessage('class_subject_id must be an integer').toInt(),
  body('marks').isFloat({ min: 0 }).withMessage('marks must be a positive number').toFloat(),
  body('grade').optional({ checkFalsy: true }).trim().isLength({ max: 5 }),
  body('grade_point').optional({ checkFalsy: true }).isFloat({ min: 0, max: 5 }).toFloat()
];
