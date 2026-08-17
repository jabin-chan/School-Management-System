const { body } = require('express-validator');

exports.createClassSubject = [
  body('class').isInt({ min: 1, max: 12 }).withMessage('Class must be a number between 1 and 12').toInt(),
  body('subject_id').isInt().withMessage('subject_id must be an integer').toInt()
];
