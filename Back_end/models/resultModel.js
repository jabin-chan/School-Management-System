const pool = require('../config/db');

async function upsertResult({ student_id, exam_id, total_marks, obtained_marks, gpa, grade }) {
  const [existing] = await pool.query(
    'SELECT result_id FROM student_results WHERE student_id = ? AND exam_id = ? LIMIT 1',
    [student_id, exam_id]
  );

  if (existing.length) {
    await pool.query(
      `UPDATE student_results SET total_marks = ?, obtained_marks = ?, gpa = ?, grade = ?
       WHERE result_id = ?`,
      [total_marks, obtained_marks, gpa || null, grade || null, existing[0].result_id]
    );
    return existing[0].result_id;
  }

  const [result] = await pool.query(
    `INSERT INTO student_results (student_id, exam_id, total_marks, obtained_marks, gpa, grade)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [student_id, exam_id, total_marks, obtained_marks, gpa || null, grade || null]
  );
  return result.insertId;
}

async function findAll({ examId, klass, studentId, q, page = 1, limit = 20 } = {}) {
  const conditions = [];
  const params = [];
  if (examId) {
    conditions.push('sr.exam_id = ?');
    params.push(examId);
  }
  if (klass) {
    conditions.push('st.`class` = ?');
    params.push(klass);
  }
  if (studentId) {
    conditions.push('sr.student_id = ?');
    params.push(studentId);
  }
  if (q) {
    conditions.push('(st.name LIKE ? OR st.student_id LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT sr.*, st.student_id AS student_student_id, st.name AS student_name, st.\`class\` AS student_class,
       e.exam_name, e.class AS exam_class, ac.session_name
     FROM student_results sr
     JOIN students st ON st.id = sr.student_id
     JOIN exams e ON e.exam_id = sr.exam_id
     JOIN academic_sessions ac ON ac.session_id = e.session_id
     ${where}
     ORDER BY sr.result_id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM student_results sr
     JOIN students st ON st.id = sr.student_id
     JOIN exams e ON e.exam_id = sr.exam_id
     ${where}`,
    params
  );
  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT sr.*, st.student_id AS student_student_id, st.name AS student_name, st.\`class\` AS student_class,
       e.exam_name, e.class AS exam_class, ac.session_name
     FROM student_results sr
     JOIN students st ON st.id = sr.student_id
     JOIN exams e ON e.exam_id = sr.exam_id
     JOIN academic_sessions ac ON ac.session_id = e.session_id
     WHERE sr.result_id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findByStudentAndExam(studentId, examId) {
  const [rows] = await pool.query(
    'SELECT * FROM student_results WHERE student_id = ? AND exam_id = ? LIMIT 1',
    [studentId, examId]
  );
  return rows[0] || null;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM student_results WHERE result_id = ?', [id]);
  return result.affectedRows > 0;
}

async function upsertDetail({ result_id, class_subject_id, marks, grade, grade_point }) {
  const [existing] = await pool.query(
    'SELECT detail_id FROM result_details WHERE result_id = ? AND class_subject_id = ? LIMIT 1',
    [result_id, class_subject_id]
  );

  if (existing.length) {
    await pool.query(
      'UPDATE result_details SET marks = ?, grade = ?, grade_point = ? WHERE detail_id = ?',
      [marks, grade || null, grade_point || null, existing[0].detail_id]
    );
    return existing[0].detail_id;
  }

  const [result] = await pool.query(
    'INSERT INTO result_details (result_id, class_subject_id, marks, grade, grade_point) VALUES (?, ?, ?, ?, ?)',
    [result_id, class_subject_id, marks, grade || null, grade_point || null]
  );
  return result.insertId;
}

async function getDetails(resultId) {
  const [rows] = await pool.query(
    `SELECT rd.*, cs.class, cs.subject_id, s.subject_name, s.subject_code
     FROM result_details rd
     JOIN class_subjects cs ON cs.class_subject_id = rd.class_subject_id
     JOIN subjects s ON s.subject_id = cs.subject_id
     WHERE rd.result_id = ?
     ORDER BY s.subject_name ASC`,
    [resultId]
  );
  return rows;
}

async function findDetailById(id) {
  const [rows] = await pool.query('SELECT * FROM result_details WHERE detail_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function removeDetail(id) {
  const [result] = await pool.query('DELETE FROM result_details WHERE detail_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  upsertResult,
  findAll,
  findById,
  findByStudentAndExam,
  remove,
  upsertDetail,
  getDetails,
  findDetailById,
  removeDetail
};
