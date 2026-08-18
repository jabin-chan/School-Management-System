const { body } = require('express-validator');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STUDENT_STATUSES = ['active', 'inactive', 'graduated'];

exports.createStudent = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('father_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('mother_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('date_of_birth').optional({ checkFalsy: true }).isDate().withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),
  body('blood_group').optional({ checkFalsy: true }).isIn(BLOOD_GROUPS).withMessage('Invalid blood group'),
  body('present_address').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('permanent_address').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('guardian_number').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Invalid guardian phone number'),
  body('phone_number').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Invalid phone number'),
  body('guardian_email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid guardian email'),
  body('relationship_with_guardian').optional({ checkFalsy: true }).trim().isLength({ max: 50 }),
  body('class').isInt({ min: 1, max: 12 }).withMessage('Class must be a number between 1 and 12').toInt(),
  body('roll_number').optional({ checkFalsy: true }).isInt().withMessage('Roll number must be an integer').toInt(),
  body('session_id').optional({ checkFalsy: true }).isInt().withMessage('Session id must be an integer').toInt(),
  body('status').optional().isIn(STUDENT_STATUSES).withMessage('Invalid student status'),
  body('password').optional({ checkFalsy: true }).isLength({ min: 6, max: 72 }).withMessage('Password must be between 6 and 72 characters')
];

exports.updateStudent = [
  body('name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('father_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('mother_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('date_of_birth').optional({ checkFalsy: true }).isDate().withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),
  body('blood_group').optional({ checkFalsy: true }).isIn(BLOOD_GROUPS).withMessage('Invalid blood group'),
  body('present_address').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('permanent_address').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('guardian_number').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Invalid guardian phone number'),
  body('phone_number').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Invalid phone number'),
  body('guardian_email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid guardian email'),
  body('relationship_with_guardian').optional({ checkFalsy: true }).trim().isLength({ max: 50 }),
  body('class').optional({ checkFalsy: true }).isInt({ min: 1, max: 12 }).toInt(),
  body('roll_number').optional({ checkFalsy: true }).isInt().withMessage('Roll number must be an integer').toInt(),
  body('session_id').optional({ checkFalsy: true }).isInt().toInt(),
  body('status').optional().isIn(STUDENT_STATUSES).withMessage('Invalid student status')
];

exports.updateProfile = [
  body('phone_number').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Invalid phone number'),
  body('guardian_number').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Invalid guardian phone number'),
  body('guardian_email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid guardian email'),
  body('present_address').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('permanent_address').optional({ checkFalsy: true }).trim().isLength({ max: 255 })
];

exports.changePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6, max: 72 }).withMessage('New password must be between 6 and 72 characters')
];

exports.studentStatus = [
  body('status').isIn(STUDENT_STATUSES).withMessage('Invalid student status')
];
