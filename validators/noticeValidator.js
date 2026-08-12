const { body } = require('express-validator');

const CATEGORIES = ['general', 'exam', 'admission', 'holiday', 'event', 'urgent'];

exports.createNotice = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 5000 }),
  body('category').isIn(CATEGORIES).withMessage('Invalid notice category'),
  body('is_pinned').optional().isBoolean().withMessage('is_pinned must be a boolean').toBoolean(),
  body('published_at').optional({ checkFalsy: true }).isDate().withMessage('published_at must be a valid date (YYYY-MM-DD)'),
  body('expires_at').optional({ checkFalsy: true }).isDate().withMessage('expires_at must be a valid date (YYYY-MM-DD)')
];

exports.updateNotice = [
  body('title').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('content').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
  body('category').optional().isIn(CATEGORIES).withMessage('Invalid notice category'),
  body('is_pinned').optional().isBoolean().withMessage('is_pinned must be a boolean').toBoolean(),
  body('published_at').optional({ checkFalsy: true }).isDate().withMessage('published_at must be a valid date (YYYY-MM-DD)'),
  body('expires_at').optional({ checkFalsy: true }).isDate().withMessage('expires_at must be a valid date (YYYY-MM-DD)')
];
