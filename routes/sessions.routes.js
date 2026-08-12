const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const sessionController = require('../controllers/sessionController');

router.get('/', asyncHandler(sessionController.list));
router.get('/current', asyncHandler(sessionController.current));
router.get('/:id', asyncHandler(sessionController.get));

module.exports = router;
