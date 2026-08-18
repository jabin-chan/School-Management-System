require('dotenv').config();
const pool = require('./config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah', 'David', 'Emma', 'Daniel', 'Olivia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const relationships = ['Father', 'Mother', 'Uncle', 'Aunt', 'Guardian'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomDigits(n) { return String(Math.floor(Math.random() * 10 ** n)).padStart(n, '0'); }

async function main() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Generate unique student ID
    let studentId;
    for (let i = 0; i < 10; i++) {
      const candidate = `STU${crypto.randomInt(10000000, 99999999)}`;
      const [rows] = await connection.query('SELECT id FROM students WHERE student_id = ? LIMIT 1', [candidate]);
      if (!rows.length) { studentId = candidate; break; }
    }
    if (!studentId) throw new Error('Could not generate unique student ID');

    const klass = Math.floor(Math.random() * 12) + 1;
    const rawPassword = crypto.randomBytes(6).toString('hex');
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const [[{ next_roll }]] = await connection.query(
      'SELECT COALESCE(MAX(CAST(roll_number AS UNSIGNED)), 0) + 1 AS next_roll FROM students WHERE `class` = ?',
      [klass]
    );

    const name = `${pick(firstNames)} ${pick(lastNames)}`;

    const data = {
      student_id: studentId,
      password_hash: passwordHash,
      application_id: null,
      name,
      photo_url: null,
      father_name: `${pick(firstNames)} ${pick(lastNames)}`,
      mother_name: `${pick(firstNames)} ${pick(lastNames)}`,
      date_of_birth: `${2005 + Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      blood_group: pick(bloodGroups),
      present_address: `House ${Math.floor(Math.random() * 200) + 1}, Road ${Math.floor(Math.random() * 50) + 1}, Dhaka`,
      permanent_address: `Village ${pick(firstNames).toLowerCase()}, District ${pick(lastNames).toLowerCase()}`,
      guardian_number: `017${randomDigits(8)}`,
      phone_number: `018${randomDigits(8)}`,
      guardian_email: `${pick(firstNames).toLowerCase()}.${pick(lastNames).toLowerCase()}@email.com`,
      relationship_with_guardian: pick(relationships),
      class: klass,
      roll_number: next_roll,
      session_id: null,
      status: 'active'
    };

    const cols = Object.keys(data).map(k => k === 'class' ? '`class`' : k).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const [result] = await connection.query(`INSERT INTO students (${cols}) VALUES (${placeholders})`, values);
    await connection.commit();

    console.log('=== Random Student Created ===');
    console.log(`Name:            ${name}`);
    console.log(`Student ID:      ${studentId}`);
    console.log(`Password:        ${rawPassword}`);
    console.log(`Class:           ${klass}`);
    console.log(`Roll Number:     ${next_roll}`);
    console.log(`Database ID:     ${result.insertId}`);
    console.log('==============================');
  } catch (err) {
    await connection.rollback();
    console.error('Error:', err.message);
  } finally {
    connection.release();
    await pool.end();
  }
}

main();
