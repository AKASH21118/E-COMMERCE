import { pool } from '../config/db.js';

// After seeding products with explicit IDs, the PostgreSQL SERIAL sequence
// needs to be reset to the current max ID so new INSERTs don't conflict.
const [rows] = await pool.query('SELECT MAX(id) as max_id FROM products');
const maxId = rows[0].max_id || 0;
await pool.query(`SELECT setval('products_id_seq', ${maxId})`);
console.log(`products_id_seq reset to ${maxId}`);

// Also reset other tables just in case
const tables = ['users', 'orders', 'order_items', 'carts', 'cart_items', 'coupons', 'reviews', 'carousel_items', 'shoppable_videos'];
for (const table of tables) {
  const [r] = await pool.query(`SELECT MAX(id) as max_id FROM ${table}`);
  const max = r[0].max_id || 0;
  if (max > 0) {
    await pool.query(`SELECT setval('${table}_id_seq', ${max})`);
    console.log(`${table}_id_seq reset to ${max}`);
  }
}

process.exit(0);
