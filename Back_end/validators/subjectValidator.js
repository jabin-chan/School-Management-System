const { body } = require('express-validator');

exports.createSubject = [
  body('subject_name').trim().notEmpty().withMessage('Subject name is required').isLength({ max: 100 }),
  body('subject_code').optional({ checkFalsy: true }).trim().isLength({ max: 20 })
];

exports.updateSubject = [
  body('subject_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('subject_code').optional({ checkFalsy: true }).trim().isLength({ max: 20 })
];
