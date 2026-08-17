require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function seed() {
  const adminId = 'admin1';
  const plainPassword = 'admin1234';
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await pool.query(
    'INSERT INTO admins (admin_id, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
    [adminId, passwordHash, passwordHash]
  );

  console.log(`Admin seeded: admin_id="${adminId}" password="${plainPassword}"`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
