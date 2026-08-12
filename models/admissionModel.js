const pool = require('../config/db');

const FIELDS = [
  'applicant_name',
  'photo_url',
  'father_name',
  'mother_name',
  'date_of_birth',
  'blood_group',
  'present_address',
  'permanent_address',
  'guardian_number',
  'guardian_email',
  'relationship_with_guardian',
  '`class`',
  'previous_school_tc_url'
];

async function create(application) {
  const cols = FIELDS.join(', ');
  const placeholders = FIELDS.map(() => '?').join(', ');
  const values = FIELDS.map((f) => {
    const key = f.replace(/`/g, '');
    return application[key] ?? null;
  });
  const [result] = await pool.query(
    `INSERT INTO admission_applications (${cols}) VALUES (${placeholders})`,
    values
  );
  return result.insertId;
}

async function findAll({ status, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];
  if (status) {
    conditions.push('a.status = ?');
    params.push(status);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT a.*, st.id AS linked_student_id, st.student_id AS linked_student_student_id
     FROM admission_applications a
     LEFT JOIN students st ON st.application_id = a.id
     ${where}
     ORDER BY a.id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM admission_applications a ${where}`,
    params
  );

  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM admission_applications WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const [result] = await pool.query('UPDATE admission_applications SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, updateStatus };
