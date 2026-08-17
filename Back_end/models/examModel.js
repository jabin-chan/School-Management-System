const pool = require('../config/db');

async function create(exam) {
  const [result] = await pool.query(
    `INSERT INTO exams (exam_name, session_id, class, start_date, end_date)
     VALUES (?, ?, ?, ?, ?)`,
    [exam.exam_name, exam.session_id, exam.class, exam.start_date || null, exam.end_date || null]
  );
  return result.insertId;
}

async function findAll({ sessionId, klass, q, page = 1, limit = 20 } = {}) {
  const conditions = [];
  const params = [];
  if (sessionId) {
    conditions.push('e.session_id = ?');
    params.push(sessionId);
  }
  if (klass) {
    conditions.push('e.class = ?');
    params.push(klass);
  }
  if (q) {
    conditions.push('e.exam_name LIKE ?');
    params.push(`%${q}%`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT e.*, ac.session_name
     FROM exams e
     JOIN academic_sessions ac ON ac.session_id = e.session_id
     ${where}
     ORDER BY e.start_date DESC, e.exam_name ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM exams e ${where}`,
    params
  );
  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT e.*, ac.session_name
     FROM exams e
     JOIN academic_sessions ac ON ac.session_id = e.session_id
     WHERE e.exam_id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function update(id, data) {
  const allowed = ['exam_name', 'session_id', 'class', 'start_date', 'end_date'];
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
  const [result] = await pool.query(`UPDATE exams SET ${updates.join(', ')} WHERE exam_id = ?`, values);
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM exams WHERE exam_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, update, remove };
