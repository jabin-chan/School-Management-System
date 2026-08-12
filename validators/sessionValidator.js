const { body } = require('express-validator');

exports.createSession = [
  body('session_name').trim().notEmpty().withMessage('Session name is required').isLength({ max: 100 }),
  body('start_date').isDate().withMessage('start_date must be a valid date (YYYY-MM-DD)'),
  body('end_date').isDate().withMessage('end_date must be a valid date (YYYY-MM-DD)'),
  body('is_current').optional().isBoolean().withMessage('is_current must be a boolean').toBoolean()
];

exports.updateSession = [
  body('session_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('start_date').optional({ checkFalsy: true }).isDate().withMessage('start_date must be a valid date (YYYY-MM-DD)'),
  body('end_date').optional({ checkFalsy: true }).isDate().withMessage('end_date must be a valid date (YYYY-MM-DD)'),
  body('is_current').optional().isBoolean().withMessage('is_current must be a boolean').toBoolean()
];
