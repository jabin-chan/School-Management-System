const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const teacherController = require('../controllers/teacherController');

router.get('/', asyncHandler(teacherController.listPublic));
router.get('/:id', asyncHandler(teacherController.get));

module.exports = router;
