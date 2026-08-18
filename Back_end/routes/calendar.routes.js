const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const calendarController = require('../controllers/calendarController');

router.get('/', asyncHandler(calendarController.list));
router.get('/:id', asyncHandler(calendarController.get));

module.exports = router;
