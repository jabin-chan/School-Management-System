require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_management',
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, '..', '..', 'DataBase', 'seed_data.sql'), 'utf8');

  try {
    await conn.query(sql);
    console.log('Seed data inserted successfully!');
  } catch (e) {
    console.error('Error:', e.message);
  }

  // Verify
  const [teachers] = await conn.query('SELECT COUNT(*) as n FROM teachers');
  const [students] = await conn.query('SELECT COUNT(*) as n FROM students');
  const [fees] = await conn.query('SELECT COUNT(*) as n FROM fees');
  const [sf] = await conn.query('SELECT COUNT(*) as n FROM student_fees');
  const [notices] = await conn.query('SELECT COUNT(*) as n FROM notices');
  const [events] = await conn.query('SELECT COUNT(*) as n FROM academic_calendar');
  const [sessions] = await conn.query('SELECT COUNT(*) as n FROM academic_sessions');

  console.log(`Teachers: ${teachers[0].n}`);
  console.log(`Students: ${students[0].n}`);
  console.log(`Fees: ${fees[0].n}`);
  console.log(`Student_Fees: ${sf[0].n}`);
  console.log(`Notices: ${notices[0].n}`);
  console.log(`Events: ${events[0].n}`);
  console.log(`Sessions: ${sessions[0].n}`);

  await conn.end();
}

seed().catch(console.error);
