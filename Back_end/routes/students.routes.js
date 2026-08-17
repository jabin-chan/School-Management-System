const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { requireStudent } = require('../middleware/auth');
const { photoUpload } = require('../middleware/upload');
const { updateProfile, changePassword } = require('../validators/studentValidator');
const studentController = require('../controllers/studentController');
const resultController = require('../controllers/resultController');

router.get('/me', requireStudent, asyncHandler(studentController.me));

router.patch(
  '/me',
  requireStudent,
  photoUpload.single('photo'),
  updateProfile,
  validate,
  asyncHandler(studentController.updateMe)
);

router.get('/me/fees', requireStudent, asyncHandler(studentController.myFees));

router.get('/me/results', requireStudent, asyncHandler(resultController.myResults));

router.post(
  '/me/change-password',
  requireStudent,
  changePassword,
  validate,
  asyncHandler(studentController.changePassword)
);

module.exports = router;
