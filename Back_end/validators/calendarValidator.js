const { body } = require('express-validator');

const EVENT_TYPES = ['holiday', 'event', 'exam', 'admission', 'meeting', 'sports'];

exports.createCalendar = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('event_type').isIn(EVENT_TYPES).withMessage('event_type must be holiday, event or exam'),
  body('start_date').isDate().withMessage('start_date must be a valid date (YYYY-MM-DD)'),
  body('end_date').optional({ checkFalsy: true }).isDate().withMessage('end_date must be a valid date (YYYY-MM-DD)')
];

exports.updateCalendar = [
  body('title').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('event_type').optional().isIn(EVENT_TYPES).withMessage('event_type must be holiday, event or exam'),
  body('start_date').optional({ checkFalsy: true }).isDate().withMessage('start_date must be a valid date (YYYY-MM-DD)'),
  body('end_date').optional({ checkFalsy: true }).isDate().withMessage('end_date must be a valid date (YYYY-MM-DD)')
];
