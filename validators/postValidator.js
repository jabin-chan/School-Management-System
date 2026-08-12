const { body } = require('express-validator');

exports.createPost = [
  body('content').trim().notEmpty().withMessage('Post content is required').isLength({ max: 2000 }).withMessage('Post content is too long (max 2000 characters)')
];

exports.createComment = [
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ max: 500 }).withMessage('Comment is too long (max 500 characters)')
];
