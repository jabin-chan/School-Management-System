const pool = require('../config/db');

async function create(notice) {
  const [result] = await pool.query(
    `INSERT INTO notices (title, content, category, attachment_url, is_pinned, published_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      notice.title,
      notice.content,
      notice.category,
      notice.attachment_url || null,
      notice.is_pinned !== undefined ? notice.is_pinned : false,
      notice.published_at || new Date(),
      notice.expires_at || null
    ]
  );
  return result.insertId;
}

async function findPublic({ category, q, page = 1, limit = 20 }) {
  const conditions = ['(published_at IS NULL OR published_at <= NOW())', '(expires_at IS NULL OR expires_at > NOW())'];
  const params = [];
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (q) {
    conditions.push('(title LIKE ? OR content LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like);
  }
  const where = `WHERE ${conditions.join(' AND ')}`;
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT * FROM notices ${where} ORDER BY is_pinned DESC, published_at DESC, id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM notices ${where}`, params);
  return { rows, total };
}

async function findAllAdmin({ category, q, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (q) {
    conditions.push('(title LIKE ? OR content LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT * FROM notices ${where} ORDER BY is_pinned DESC, published_at DESC, id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM notices ${where}`, params);
  return { rows, total };
}

async function findPublicById(id) {
  const [rows] = await pool.query(
    `SELECT * FROM notices WHERE id = ? AND (published_at IS NULL OR published_at <= NOW())
     AND (expires_at IS NULL OR expires_at > NOW()) LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM notices WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function update(id, data) {
  const allowed = ['title', 'content', 'category', 'attachment_url', 'is_pinned', 'published_at', 'expires_at'];
  const updates = [];
  const values = [];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (!updates.length) return false;

  values.push(id);
  const [result] = await pool.query(`UPDATE notices SET ${updates.join(', ')} WHERE id = ?`, values);
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM notices WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findPublic, findAllAdmin, findPublicById, findById, update, remove };
