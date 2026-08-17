const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { admissionUpload } = require('../middleware/upload');
const { apply } = require('../validators/admissionValidator');
const admissionController = require('../controllers/admissionController');

router.post(
  '/apply',
  admissionUpload,
  apply,
  validate,
  asyncHandler(admissionController.apply)
);

module.exports = router;
