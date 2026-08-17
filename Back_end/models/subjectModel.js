const pool = require('../config/db');

async function create(subject) {
  const [result] = await pool.query(
    'INSERT INTO subjects (subject_name, subject_code) VALUES (?, ?)',
    [subject.subject_name, subject.subject_code || null]
  );
  return result.insertId;
}

async function findAll({ q, page = 1, limit = 20 } = {}) {
  const conditions = [];
  const params = [];
  if (q) {
    conditions.push('(subject_name LIKE ? OR subject_code LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT * FROM subjects ${where} ORDER BY subject_name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM subjects ${where}`, params);
  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM subjects WHERE subject_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function update(id, data) {
  const allowed = ['subject_name', 'subject_code'];
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
  const [result] = await pool.query(`UPDATE subjects SET ${updates.join(', ')} WHERE subject_id = ?`, values);
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM subjects WHERE subject_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, update, remove };
