const pool = require('../config/db');

const PUBLIC_SELECT = `SELECT p.post_id, p.content, p.upvote_count, p.downvote_count, p.score, p.created_at,
  (SELECT COUNT(*) FROM post_comments c WHERE c.post_id = p.post_id) AS comment_count
  FROM anonymous_posts p`;

async function create({ content, submitted_by }) {
  const [result] = await pool.query(
    'INSERT INTO anonymous_posts (content, submitted_by) VALUES (?, ?)',
    [content, submitted_by || null]
  );
  return result.insertId;
}

async function findPublic({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `${PUBLIC_SELECT} ORDER BY p.score DESC, p.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM anonymous_posts');
  return { rows, total };
}

async function findAllAdmin({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT p.post_id, p.content, p.submitted_by, p.upvote_count, p.downvote_count, p.score, p.created_at,
       s.student_id AS submitted_student_id, s.name AS submitted_student_name,
       (SELECT COUNT(*) FROM post_comments c WHERE c.post_id = p.post_id) AS comment_count
     FROM anonymous_posts p
     LEFT JOIN students s ON s.id = p.submitted_by
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM anonymous_posts');
  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query(`${PUBLIC_SELECT} WHERE p.post_id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function upvote(id) {
  const [result] = await pool.query(
    'UPDATE anonymous_posts SET upvote_count = upvote_count + 1, score = score + 1 WHERE post_id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

async function downvote(id) {
  const [result] = await pool.query(
    'UPDATE anonymous_posts SET downvote_count = downvote_count + 1, score = score - 1 WHERE post_id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM anonymous_posts WHERE post_id = ?', [id]);
  return result.affectedRows > 0;
}

async function createComment({ post_id, commenter_id, comment }) {
  const [result] = await pool.query(
    'INSERT INTO post_comments (post_id, commenter_id, comment) VALUES (?, ?, ?)',
    [post_id, commenter_id || null, comment]
  );
  const [rows] = await pool.query('SELECT comment_id, post_id, comment, created_at FROM post_comments WHERE comment_id = ? LIMIT 1', [result.insertId]);
  return rows[0] || null;
}

async function getComments(postId) {
  const [rows] = await pool.query(
    'SELECT comment_id, post_id, comment, created_at FROM post_comments WHERE post_id = ? ORDER BY created_at ASC',
    [postId]
  );
  return rows;
}

async function getCommentsAdmin(postId) {
  const [rows] = await pool.query(
    `SELECT c.comment_id, c.post_id, c.commenter_id, c.comment, c.created_at,
       s.student_id AS commenter_student_id, s.name AS commenter_name
     FROM post_comments c
     LEFT JOIN students s ON s.id = c.commenter_id
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return rows;
}

async function findCommentById(id) {
  const [rows] = await pool.query('SELECT * FROM post_comments WHERE comment_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function removeComment(id) {
  const [result] = await pool.query('DELETE FROM post_comments WHERE comment_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findPublic,
  findAllAdmin,
  findById,
  upvote,
  downvote,
  remove,
  createComment,
  getComments,
  getCommentsAdmin,
  findCommentById,
  removeComment
};
