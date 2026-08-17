const createError = require('http-errors');
const postModel = require('../models/postModel');

async function listPublic(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await postModel.findPublic({ page, limit });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function createPost(req, res) {
  const submittedBy = req.session && req.session.student ? req.session.student.id : null;
  const id = await postModel.create({ content: req.body.content, submitted_by: submittedBy });
  const post = await postModel.findById(id);
  res.status(201).json(post);
}

async function upvote(req, res) {
  const post = await postModel.findById(req.params.id);
  if (!post) throw createError(404, 'Post not found');
  await postModel.upvote(post.post_id);
  res.json({
    upvote_count: post.upvote_count + 1,
    downvote_count: post.downvote_count,
    score: post.score + 1
  });
}

async function downvote(req, res) {
  const post = await postModel.findById(req.params.id);
  if (!post) throw createError(404, 'Post not found');
  await postModel.downvote(post.post_id);
  res.json({
    upvote_count: post.upvote_count,
    downvote_count: post.downvote_count + 1,
    score: post.score - 1
  });
}

async function getComments(req, res) {
  const post = await postModel.findById(req.params.id);
  if (!post) throw createError(404, 'Post not found');
  res.json({ post_id: post.post_id, comments: await postModel.getComments(post.post_id) });
}

async function addComment(req, res) {
  const post = await postModel.findById(req.params.id);
  if (!post) throw createError(404, 'Post not found');
  const commenterId = req.session && req.session.student ? req.session.student.id : null;
  const comment = await postModel.createComment({
    post_id: post.post_id,
    commenter_id: commenterId,
    comment: req.body.comment
  });
  res.status(201).json(comment);
}

async function listAdmin(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const { rows, total } = await postModel.findAllAdmin({ page, limit });
  res.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

async function getCommentsAdmin(req, res) {
  const post = await postModel.findById(req.params.id);
  if (!post) throw createError(404, 'Post not found');
  res.json({ post_id: post.post_id, comments: await postModel.getCommentsAdmin(post.post_id) });
}

async function deletePost(req, res) {
  const post = await postModel.findById(req.params.id);
  if (!post) throw createError(404, 'Post not found');
  await postModel.remove(post.post_id);
  res.json({ message: 'Post deleted successfully' });
}

async function deleteComment(req, res) {
  const comment = await postModel.findCommentById(req.params.id);
  if (!comment) throw createError(404, 'Comment not found');
  await postModel.removeComment(comment.comment_id);
  res.json({ message: 'Comment deleted successfully' });
}

module.exports = {
  listPublic,
  createPost,
  upvote,
  downvote,
  getComments,
  addComment,
  listAdmin,
  getCommentsAdmin,
  deletePost,
  deleteComment
};
