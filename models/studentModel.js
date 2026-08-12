const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const PUBLIC_FIELDS = `id, student_id, application_id, name, photo_url, father_name, mother_name,
  date_of_birth, blood_group, present_address, permanent_address, guardian_number,
  phone_number, guardian_email, relationship_with_guardian, \`class\`, roll_number,
  session_id, status, created_at`;

const INSERT_COLS = [
  'student_id',
  'password_hash',
  'application_id',
  'name',
  'photo_url',
  'father_name',
  'mother_name',
  'date_of_birth',
  'blood_group',
  'present_address',
  'permanent_address',
  'guardian_number',
  'phone_number',
  'guardian_email',
  'relationship_with_guardian',
  '`class`',
  'roll_number',
  'session_id',
  'status'
];

function buildInsert(data) {
  const cols = INSERT_COLS.join(', ');
  const placeholders = INSERT_COLS.map(() => '?').join(', ');
  const values = INSERT_COLS.map((c) => {
    const key = c.replace(/`/g, '');
    return data[key] ?? null;
  });
  return { sql: `INSERT INTO students (${cols}) VALUES (${placeholders})`, values };
}

async function generateUniqueStudentId(conn) {
  const exec = conn || pool;
  for (let i = 0; i < 10; i += 1) {
    const candidate = `STU${crypto.randomInt(10000000, 99999999)}`;
    const [rows] = await exec.query('SELECT id FROM students WHERE student_id = ? LIMIT 1', [candidate]);
    if (!rows.length) return candidate;
  }
  throw new Error('Could not generate a unique student ID');
}

async function nextRollNumber(conn, klass) {
  const exec = conn || pool;
  const [[row]] = await exec.query(
    'SELECT COALESCE(MAX(roll_number), 0) + 1 AS next_roll FROM students WHERE `class` = ?',
    [klass]
  );
  return row.next_roll;
}

async function createFromApplication(application) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const studentId = await generateUniqueStudentId(connection);
    const rollNumber = await nextRollNumber(connection, application.class);
    const rawPassword = crypto.randomBytes(6).toString('hex');
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const data = {
      student_id: studentId,
      password_hash: passwordHash,
      application_id: application.id,
      name: application.applicant_name,
      photo_url: application.photo_url,
      father_name: application.father_name,
      mother_name: application.mother_name,
      date_of_birth: application.date_of_birth,
      blood_group: application.blood_group,
      present_address: application.present_address,
      permanent_address: application.permanent_address,
      guardian_number: application.guardian_number,
      phone_number: application.guardian_number,
      guardian_email: application.guardian_email,
      relationship_with_guardian: application.relationship_with_guardian,
      class: application.class,
      roll_number: rollNumber,
      session_id: application.session_id,
      status: 'active'
    };

    const { sql, values } = buildInsert(data);
    const [result] = await connection.query(sql, values);

    await connection.query('UPDATE admission_applications SET status = ? WHERE id = ?', ['passed', application.id]);

    await connection.commit();
    return { id: result.insertId, student_id: studentId, roll_number: rollNumber, temporary_password: rawPassword };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function createManual(studentData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const studentId = studentData.student_id || (await generateUniqueStudentId(connection));
    const rawPassword = studentData.password || crypto.randomBytes(6).toString('hex');
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const rollNumber =
      studentData.roll_number != null ? studentData.roll_number : await nextRollNumber(connection, studentData.class);

    const data = {
      student_id: studentId,
      password_hash: passwordHash,
      application_id: null,
      name: studentData.name,
      photo_url: studentData.photo_url || null,
      father_name: studentData.father_name || null,
      mother_name: studentData.mother_name || null,
      date_of_birth: studentData.date_of_birth || null,
      blood_group: studentData.blood_group || null,
      present_address: studentData.present_address || null,
      permanent_address: studentData.permanent_address || null,
      guardian_number: studentData.guardian_number || null,
      phone_number: studentData.phone_number || studentData.guardian_number || null,
      guardian_email: studentData.guardian_email || null,
      relationship_with_guardian: studentData.relationship_with_guardian || null,
      class: studentData.class,
      roll_number: rollNumber,
      session_id: studentData.session_id || null,
      status: studentData.status || 'active'
    };

    const { sql, values } = buildInsert(data);
    const [result] = await connection.query(sql, values);

    await connection.commit();
    return { id: result.insertId, student_id: studentId, roll_number: rollNumber, temporary_password: rawPassword };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function findAll({ klass, status, q, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];
  if (klass) {
    conditions.push('`class` = ?');
    params.push(klass);
  }
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (q) {
    conditions.push('(name LIKE ? OR student_id LIKE ? OR phone_number LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM students ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM students ${where}`, params);

  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM students WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByApplicationId(applicationId) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM students WHERE application_id = ? LIMIT 1`,
    [applicationId]
  );
  return rows[0] || null;
}

async function update(id, data) {
  const allowed = [
    'name',
    'photo_url',
    'father_name',
    'mother_name',
    'date_of_birth',
    'blood_group',
    'present_address',
    'permanent_address',
    'guardian_number',
    'phone_number',
    'guardian_email',
    'relationship_with_guardian',
    'class',
    'roll_number',
    'session_id',
    'status'
  ];

  const updates = [];
  const values = [];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      updates.push(key === 'class' ? '`class` = ?' : `${key} = ?`);
      values.push(data[key]);
    }
  }
  if (!updates.length) return false;

  values.push(id);
  const [result] = await pool.query(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, values);
  return result.affectedRows > 0;
}

async function updateProfile(id, data) {
  const allowed = ['phone_number', 'guardian_number', 'guardian_email', 'present_address', 'permanent_address', 'photo_url'];
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
  const [result] = await pool.query(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, values);
  return result.affectedRows > 0;
}

async function updatePassword(id, passwordHash) {
  const [result] = await pool.query('UPDATE students SET password_hash = ? WHERE id = ?', [passwordHash, id]);
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createFromApplication,
  createManual,
  findAll,
  findById,
  findByApplicationId,
  update,
  updateProfile,
  updatePassword,
  remove
};
