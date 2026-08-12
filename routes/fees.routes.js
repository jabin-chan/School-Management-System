const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const feeController = require('../controllers/feeController');

router.get('/', asyncHandler(feeController.list));
router.get('/:id', asyncHandler(feeController.get));

module.exports = router;
