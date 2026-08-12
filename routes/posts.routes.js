const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { postCreateLimiter, voteLimiter } = require('../middleware/rateLimiters');
const { createPost, createComment } = require('../validators/postValidator');
const postController = require('../controllers/postController');

router.get('/', asyncHandler(postController.listPublic));

router.post(
  '/',
  postCreateLimiter,
  createPost,
  validate,
  asyncHandler(postController.createPost)
);

router.post('/:id/upvote', voteLimiter, asyncHandler(postController.upvote));
router.post('/:id/downvote', voteLimiter, asyncHandler(postController.downvote));

router.get('/:id/comments', asyncHandler(postController.getComments));
router.post(
  '/:id/comments',
  createComment,
  validate,
  asyncHandler(postController.addComment)
);

module.exports = router;
