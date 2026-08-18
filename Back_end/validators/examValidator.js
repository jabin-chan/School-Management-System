const { body } = require('express-validator');

exports.createExam = [
  body('exam_name').trim().notEmpty().withMessage('Exam name is required').isLength({ max: 100 }),
  body('session_id').isInt().withMessage('session_id must be an integer').toInt(),
  body('class').isInt({ min: 1, max: 12 }).withMessage('Class must be a number between 1 and 12').toInt(),
  body('start_date').optional({ checkFalsy: true }).isDate().withMessage('start_date must be a valid date (YYYY-MM-DD)'),
  body('end_date').optional({ checkFalsy: true }).isDate().withMessage('end_date must be a valid date (YYYY-MM-DD)')
];

exports.updateExam = [
  body('exam_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('session_id').optional().isInt().withMessage('session_id must be an integer').toInt(),
  body('class').optional({ checkFalsy: true }).isInt({ min: 1, max: 12 }).toInt(),
  body('start_date').optional({ checkFalsy: true }).isDate().withMessage('start_date must be a valid date (YYYY-MM-DD)'),
  body('end_date').optional({ checkFalsy: true }).isDate().withMessage('end_date must be a valid date (YYYY-MM-DD)')
];
