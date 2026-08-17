const { body } = require('express-validator');

exports.createTeacher = [
  body('name').trim().notEmpty().withMessage('Teacher name is required').isLength({ max: 100 }),
  body('designation').trim().notEmpty().withMessage('Designation is required').isLength({ max: 100 }),
  body('subject').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('qualification').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').isLength({ max: 100 }),
  body('phone_number').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Invalid phone number'),
  body('joining_date').optional({ checkFalsy: true }).isDate().withMessage('Joining date must be a valid date (YYYY-MM-DD)'),
  body('bio').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean').toBoolean()
];

exports.updateTeacher = [
  body('name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('designation').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('subject').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('qualification').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email').isLength({ max: 100 }),
  body('phone_number').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Invalid phone number'),
  body('joining_date').optional({ checkFalsy: true }).isDate().withMessage('Joining date must be a valid date (YYYY-MM-DD)'),
  body('bio').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean').toBoolean()
];
