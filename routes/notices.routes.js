const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const noticeController = require('../controllers/noticeController');

router.get('/', asyncHandler(noticeController.listPublic));
router.get('/:id', asyncHandler(noticeController.getPublic));

module.exports = router;
