const pool = require('../config/db');

async function create(session) {
  const [result] = await pool.query(
    `INSERT INTO academic_sessions (session_name, start_date, end_date, is_current)
     VALUES (?, ?, ?, ?)`,
    [session.session_name, session.start_date, session.end_date, session.is_current || false]
  );
  return result.insertId;
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM academic_sessions ORDER BY start_date DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM academic_sessions WHERE session_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findCurrent() {
  const [rows] = await pool.query('SELECT * FROM academic_sessions WHERE is_current = 1 LIMIT 1');
  return rows[0] || null;
}

async function update(id, data) {
  const allowed = ['session_name', 'start_date', 'end_date', 'is_current'];
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
  const [result] = await pool.query(`UPDATE academic_sessions SET ${updates.join(', ')} WHERE session_id = ?`, values);
  return result.affectedRows > 0;
}

async function setCurrent(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('UPDATE academic_sessions SET is_current = 0');
    const [result] = await connection.query('UPDATE academic_sessions SET is_current = 1 WHERE session_id = ?', [id]);
    await connection.commit();
    return result.affectedRows > 0;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM academic_sessions WHERE session_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, findCurrent, update, setCurrent, remove };
