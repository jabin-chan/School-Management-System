const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { adminLoginLimiter, studentLoginLimiter } = require('../middleware/rateLimiters');
const { loginAdmin, loginStudent } = require('../validators/authValidator');
const authController = require('../controllers/authController');

router.post(
  '/admin/login',
  adminLoginLimiter,
  loginAdmin,
  validate,
  asyncHandler(authController.adminLogin)
);

router.post(
  '/student/login',
  studentLoginLimiter,
  loginStudent,
  validate,
  asyncHandler(authController.studentLogin)
);

router.post('/logout', asyncHandler(authController.logout));
router.get('/me', asyncHandler(authController.me));

module.exports = router;
