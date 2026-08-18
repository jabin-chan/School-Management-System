const pool = require('../config/db');
const crypto = require('crypto');

const FIELDS = ['teacher_id', 'name', 'photo_url', 'designation', 'subject', 'qualification', 'email', 'phone_number', 'joining_date', 'bio', 'is_active'];

async function generateUniqueTeacherId() {
  for (let i = 0; i < 10; i += 1) {
    const candidate = `TCH${crypto.randomInt(10000, 99999)}`;
    const [rows] = await pool.query('SELECT teacher_id FROM teachers WHERE teacher_id = ? LIMIT 1', [candidate]);
    if (!rows.length) return candidate;
  }
  throw new Error('Could not generate a unique teacher ID');
}

async function create(teacher) {
  const teacherId = teacher.teacher_id || (await generateUniqueTeacherId());
  const isActive = teacher.is_active !== undefined ? teacher.is_active : true;
  const [result] = await pool.query(
    `INSERT INTO teachers (teacher_id, name, photo_url, designation, subject, qualification, email, phone_number, joining_date, bio, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      teacherId,
      teacher.name,
      teacher.photo_url || null,
      teacher.designation,
      teacher.subject || null,
      teacher.qualification || null,
      teacher.email,
      teacher.phone_number || null,
      teacher.joining_date || null,
      teacher.bio || null,
      isActive
    ]
  );
  return teacherId;
}

async function findAll({ isActive, q, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];
  if (isActive !== undefined) {
    conditions.push('is_active = ?');
    params.push(isActive);
  }
  if (q) {
    conditions.push('(name LIKE ? OR subject LIKE ? OR designation LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT ${FIELDS.join(', ')} FROM teachers ${where} ORDER BY name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM teachers ${where}`, params);
  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${FIELDS.join(', ')} FROM teachers WHERE teacher_id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function update(id, data) {
  const allowed = ['name', 'photo_url', 'designation', 'subject', 'qualification', 'email', 'phone_number', 'joining_date', 'bio', 'is_active'];
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
  const [result] = await pool.query(`UPDATE teachers SET ${updates.join(', ')} WHERE teacher_id = ?`, values);
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM teachers WHERE teacher_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, update, remove };
