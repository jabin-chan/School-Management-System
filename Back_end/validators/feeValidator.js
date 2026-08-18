const { body } = require('express-validator');

exports.createFee = [
  body('fee_name').trim().notEmpty().withMessage('Fee name is required').isLength({ max: 100 }),
  body('fee_title').trim().notEmpty().withMessage('Fee title is required').isLength({ max: 100 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number').toFloat(),
  body('due_date').isDate().withMessage('Due date must be a valid date (YYYY-MM-DD)'),
  body('class').optional({ checkFalsy: true }).isInt({ min: 1, max: 12 }).toInt()
];

exports.updateFee = [
  body('fee_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('fee_title').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number').toFloat(),
  body('due_date').optional({ checkFalsy: true }).isDate().withMessage('Due date must be a valid date (YYYY-MM-DD)'),
  body('class').optional({ checkFalsy: true }).isInt({ min: 1, max: 12 }).toInt()
];

exports.assignToClass = [
  body('class').isInt({ min: 1, max: 12 }).withMessage('Class must be a number between 1 and 12').toInt()
];

exports.markPaid = [
  body('student_id').isInt().withMessage('student_id must be an integer').toInt(),
  body('fee_id').isInt().withMessage('fee_id must be an integer').toInt()
];

exports.markPaidByClass = [
  body('class').isInt({ min: 1, max: 12 }).withMessage('Class must be a number between 1 and 12').toInt(),
  body('fee_id').isInt().withMessage('fee_id must be an integer').toInt()
];
