const { body } = require('express-validator');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

exports.apply = [
  body('applicant_name').trim().notEmpty().withMessage('Applicant name is required').isLength({ max: 100 }).withMessage('Applicant name is too long'),
  body('father_name').trim().notEmpty().withMessage('Father name is required').isLength({ max: 100 }),
  body('mother_name').trim().notEmpty().withMessage('Mother name is required').isLength({ max: 100 }),
  body('date_of_birth').trim().notEmpty().withMessage('Date of birth is required').isDate().withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),
  body('blood_group').isIn(BLOOD_GROUPS).withMessage('Invalid blood group'),
  body('present_address').trim().notEmpty().withMessage('Present address is required').isLength({ max: 255 }),
  body('permanent_address').trim().notEmpty().withMessage('Permanent address is required').isLength({ max: 255 }),
  body('guardian_number').trim().notEmpty().withMessage('Guardian number is required').isMobilePhone('any').withMessage('Invalid guardian phone number'),
  body('guardian_email').trim().isEmail().withMessage('Invalid guardian email').isLength({ max: 100 }),
  body('relationship_with_guardian').trim().notEmpty().withMessage('Relationship with guardian is required').isLength({ max: 50 }),
  body('class').isInt({ min: 1, max: 12 }).withMessage('Class must be a number between 1 and 12').toInt()
];

exports.updateStatus = [
  body('status').isIn(['pending', 'passed', 'failed']).withMessage('Status must be pending, passed or failed'),
  body('student_id').optional().trim().isLength({ min: 1, max: 20 }).withMessage('Student ID must be at most 20 characters'),
  body('password').optional().isLength({ min: 6, max: 72 }).withMessage('Password must be at least 6 characters')
];
