/**
 * Migration: Add Google OAuth columns to the users table
 *
 * Run once before enabling Google sign-in:
 *   node src/scripts/addGoogleAuthColumns.js
 */
import { pool } from '../config/db.js';

async function migrate() {
  console.log('Running Google auth migration...');

  // 1. Make password_hash nullable so Google-only accounts don't need a password
  await pool.query(`
    ALTER TABLE users
    MODIFY COLUMN password_hash VARCHAR(255) NULL
  `);
  console.log('✓ password_hash is now nullable');

  // 2. Add google_id column (unique per Google account)
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN google_id VARCHAR(255) NULL UNIQUE
    `);
    console.log('✓ google_id column added');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('  google_id already exists, skipping');
    } else throw err;
  }

  // 3. Add avatar_url column (stores Google profile picture URL)
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN avatar_url VARCHAR(500) NULL
    `);
    console.log('✓ avatar_url column added');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('  avatar_url already exists, skipping');
    } else throw err;
  }

  console.log('\nMigration complete! Your users table now supports Google OAuth.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
