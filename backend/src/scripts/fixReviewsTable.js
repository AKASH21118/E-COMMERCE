import { pool } from '../config/db.js';

/**
 * Migration script to fix the reviews table
 * - Change product_id from NOT NULL to NULL (allows admin-created reviews without product)
 * - Change foreign key from ON DELETE CASCADE to ON DELETE SET NULL
 */

async function fixReviewsTable() {
  try {
    console.log('Starting reviews table migration...');

    // Check if product_id is currently NOT NULL
    const [columns] = await pool.query(`
      SELECT column_name, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'reviews' AND column_name = 'product_id'
    `);

    if (columns.length === 0) {
      console.log('❌ reviews table does not exist or product_id column not found');
      return;
    }

    const isNullable = columns[0].is_nullable === 'YES';

    if (isNullable) {
      console.log('✅ product_id is already nullable - no migration needed');
      return;
    }

    console.log('📝 Altering product_id to allow NULL values...');
    await pool.query('ALTER TABLE reviews ALTER COLUMN product_id DROP NOT NULL');
    console.log('✅ product_id is now nullable');

    // Drop the old foreign key constraint
    console.log('📝 Dropping old foreign key constraint...');
    await pool.query('ALTER TABLE reviews DROP CONSTRAINT fk_review_product');
    console.log('✅ Old constraint dropped');

    // Add the new foreign key constraint with ON DELETE SET NULL
    console.log('📝 Adding new foreign key constraint with ON DELETE SET NULL...');
    await pool.query(`
      ALTER TABLE reviews
      ADD CONSTRAINT fk_review_product
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    `);
    console.log('✅ New constraint added');

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixReviewsTable();
