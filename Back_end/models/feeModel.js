const pool = require('../config/db');

async function create(fee) {
  const [result] = await pool.query(
    'INSERT INTO fees (fee_name, fee_title, description, amount, due_date, `class`) VALUES (?, ?, ?, ?, ?, ?)',
    [fee.fee_name, fee.fee_title, fee.description || null, fee.amount, fee.due_date, fee.class || null]
  );
  return result.insertId;
}

async function findAll() {
  const [rows] = await pool.query(
    `SELECT f.*,
       (SELECT COUNT(*) FROM student_fees sf WHERE sf.fee_id = f.fee_id) AS total_count,
       (SELECT COUNT(*) FROM student_fees sf WHERE sf.fee_id = f.fee_id AND sf.is_paid = 1) AS paid_count
     FROM fees f
     ORDER BY f.fee_id DESC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM fees WHERE fee_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function update(id, data) {
  const allowed = ['fee_name', 'fee_title', 'description', 'amount', 'due_date', 'class'];
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
  const [result] = await pool.query(`UPDATE fees SET ${updates.join(', ')} WHERE fee_id = ?`, values);
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM fees WHERE fee_id = ?', [id]);
  return result.affectedRows > 0;
}

async function assignToClass(feeId, klass) {
  const [result] = await pool.query(
    `INSERT INTO student_fees (student_id, fee_id)
     SELECT s.id, ?
     FROM students s
     WHERE s.\`class\` = ? AND s.status = 'active'
       AND NOT EXISTS (
         SELECT 1 FROM student_fees sf WHERE sf.student_id = s.id AND sf.fee_id = ?
       )`,
    [feeId, klass, feeId]
  );
  return result.affectedRows;
}

async function getStudentFeesByStudentId(studentId) {
  const [rows] = await pool.query(
    `SELECT sf.id, sf.student_id, sf.fee_id, sf.is_paid, sf.paid_at, sf.created_at,
       f.fee_name, f.fee_title, f.description, f.amount, f.due_date, f.\`class\` AS fee_class
     FROM student_fees sf
     JOIN fees f ON f.id = sf.fee_id
     WHERE sf.student_id = ?
     ORDER BY sf.is_paid ASC, f.due_date ASC`,
    [studentId]
  );
  return rows;
}

async function listStudentFees({ klass, isPaid, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];
  if (klass) {
    conditions.push('s.`class` = ?');
    params.push(klass);
  }
  if (isPaid !== undefined) {
    conditions.push('sf.is_paid = ?');
    params.push(isPaid);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT sf.id, sf.student_id, sf.fee_id, sf.is_paid, sf.paid_at, sf.created_at,
       s.student_id AS student_student_id, s.name AS student_name, s.\`class\` AS student_class,
       f.fee_name, f.fee_title, f.amount, f.due_date
     FROM student_fees sf
     JOIN students s ON s.id = sf.student_id
     JOIN fees f ON f.id = sf.fee_id
     ${where}
     ORDER BY sf.is_paid ASC, f.due_date ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM student_fees sf JOIN students s ON s.id = sf.student_id ${where}`,
    params
  );

  return { rows, total };
}

async function findStudentFee(studentId, feeId) {
  const [rows] = await pool.query(
    `SELECT sf.*, f.fee_name, f.fee_title, f.amount, f.due_date,
       s.student_id AS student_student_id, s.name AS student_name, s.\`class\` AS student_class
     FROM student_fees sf
     JOIN fees f ON f.id = sf.fee_id
     JOIN students s ON s.id = sf.student_id
     WHERE sf.student_id = ? AND sf.fee_id = ?
     LIMIT 1`,
    [studentId, feeId]
  );
  return rows[0] || null;
}

async function markPaid(studentId, feeId) {
  await pool.query(
    'UPDATE student_fees SET is_paid = 1, paid_at = NOW() WHERE student_id = ? AND fee_id = ?',
    [studentId, feeId]
  );
  return findStudentFee(studentId, feeId);
}

async function markPaidByClass(klass, feeId) {
  const [result] = await pool.query(
    `UPDATE student_fees sf
     JOIN students s ON s.id = sf.student_id
     SET sf.is_paid = 1, sf.paid_at = NOW()
     WHERE s.\`class\` = ? AND sf.fee_id = ?`,
    [klass, feeId]
  );
  return result.affectedRows;
}

async function getStudentsByFeeId(feeId, { isPaid, page = 1, limit = 50 } = {}) {
  const conditions = ['sf.fee_id = ?'];
  const params = [feeId];
  if (isPaid !== undefined) {
    conditions.push('sf.is_paid = ?');
    params.push(isPaid);
  }
  const where = `WHERE ${conditions.join(' AND ')}`;
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT sf.id AS student_fee_id, sf.student_id, sf.is_paid, sf.paid_at,
       s.student_id AS student_number, s.name AS student_name, s.\`class\`
     FROM student_fees sf
     JOIN students s ON s.id = sf.student_id
     ${where}
     ORDER BY sf.is_paid ASC, s.name ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM student_fees sf ${where}`,
    params
  );

  return { rows, total };
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  assignToClass,
  getStudentFeesByStudentId,
  listStudentFees,
  findStudentFee,
  markPaid,
  markPaidByClass,
  getStudentsByFeeId
};
