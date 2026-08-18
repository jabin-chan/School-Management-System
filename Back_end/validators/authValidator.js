const { body } = require('express-validator');

exports.loginAdmin = [
  body('admin_id').trim().notEmpty().withMessage('Admin ID is required').isLength({ max: 50 }).withMessage('Admin ID is too long'),
  body('password').notEmpty().withMessage('Password is required').isLength({ max: 72 }).withMessage('Password is too long')
];

exports.loginStudent = [
  body('student_id').trim().notEmpty().withMessage('Student ID is required').isLength({ max: 50 }).withMessage('Student ID is too long'),
  body('password').notEmpty().withMessage('Password is required').isLength({ max: 72 }).withMessage('Password is too long')
];
