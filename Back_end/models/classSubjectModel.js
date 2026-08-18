const pool = require('../config/db');

async function create(classSubject) {
  const [result] = await pool.query(
    'INSERT INTO class_subjects (class, subject_id) VALUES (?, ?)',
    [classSubject.class, classSubject.subject_id]
  );
  return result.insertId;
}

async function findAll({ klass, subjectId, page = 1, limit = 20 } = {}) {
  const conditions = [];
  const params = [];
  if (klass) {
    conditions.push('cs.class = ?');
    params.push(klass);
  }
  if (subjectId) {
    conditions.push('cs.subject_id = ?');
    params.push(subjectId);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT cs.class_subject_id, cs.class, cs.subject_id,
       s.subject_name, s.subject_code
     FROM class_subjects cs
     JOIN subjects s ON s.subject_id = cs.subject_id
     ${where}
     ORDER BY cs.class ASC, s.subject_name ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM class_subjects cs ${where}`,
    params
  );
  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT cs.class_subject_id, cs.class, cs.subject_id,
       s.subject_name, s.subject_code
     FROM class_subjects cs
     JOIN subjects s ON s.subject_id = cs.subject_id
     WHERE cs.class_subject_id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findByClassAndSubject(klass, subjectId) {
  const [rows] = await pool.query(
    'SELECT * FROM class_subjects WHERE class = ? AND subject_id = ? LIMIT 1',
    [klass, subjectId]
  );
  return rows[0] || null;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM class_subjects WHERE class_subject_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, findByClassAndSubject, remove };
