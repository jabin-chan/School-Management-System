const pool = require('../config/db');

async function create(calendarEvent) {
  const [result] = await pool.query(
    `INSERT INTO academic_calendar (title, description, event_type, start_date, end_date)
     VALUES (?, ?, ?, ?, ?)`,
    [
      calendarEvent.title,
      calendarEvent.description || null,
      calendarEvent.event_type,
      calendarEvent.start_date,
      calendarEvent.end_date || null
    ]
  );
  return result.insertId;
}

async function findAll({ eventType, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];
  if (eventType) {
    conditions.push('event_type = ?');
    params.push(eventType);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT * FROM academic_calendar ${where} ORDER BY start_date ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM academic_calendar ${where}`,
    params
  );
  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM academic_calendar WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function update(id, data) {
  const allowed = ['title', 'description', 'event_type', 'start_date', 'end_date'];
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
  const [result] = await pool.query(`UPDATE academic_calendar SET ${updates.join(', ')} WHERE id = ?`, values);
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM academic_calendar WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, update, remove };
