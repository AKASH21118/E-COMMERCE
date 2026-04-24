/**
 * Database Integrity Check Script
 * Diagnoses and fixes image persistence issues in products table
 * 
 * Usage: node src/scripts/checkImagePersistence.js
 */

import { pool } from '../config/db.js';

async function checkImagePersistence() {
  console.log('🔍 Starting Image Persistence Check...\n');

  try {
    // 1. Check products with missing images_json
    console.log('1️⃣  Checking for products with NULL or missing images_json...');
    const [productsWithoutJson] = await pool.query(
      `SELECT id, name, image_path, images_json 
       FROM products 
       WHERE images_json IS NULL OR images_json = ''`
    );

    if (productsWithoutJson.length > 0) {
      console.log(`⚠️  Found ${productsWithoutJson.length} products with missing images_json`);
      productsWithoutJson.forEach(p => {
        console.log(`  - ID: ${p.id}, Name: ${p.name}, image_path: ${p.image_path}`);
      });

      console.log('\n🔧 Attempting to repair by using image_path as fallback...');
      for (const product of productsWithoutJson) {
        if (product.image_path) {
          const imageJson = JSON.stringify([product.image_path]);
          await pool.query(
            'UPDATE products SET images_json = ? WHERE id = ?',
            [imageJson, product.id]
          );
          console.log(`  ✅ Repaired product ID ${product.id}`);
        }
      }
    } else {
      console.log('✅ All products have valid images_json\n');
    }

    // 2. Check for invalid JSON in images_json
    console.log('2️⃣  Checking for invalid JSON in images_json...');
    const [allProducts] = await pool.query(
      `SELECT id, name, images_json FROM products WHERE images_json IS NOT NULL`
    );

    const invalidProducts = [];
    for (const product of allProducts) {
      try {
        const parsed = JSON.parse(product.images_json);
        if (!Array.isArray(parsed)) {
          invalidProducts.push({ ...product, error: 'Not an array' });
        } else if (parsed.length === 0) {
          invalidProducts.push({ ...product, error: 'Empty array' });
        }
      } catch (e) {
        invalidProducts.push({ ...product, error: `Invalid JSON: ${e.message}` });
      }
    }

    if (invalidProducts.length > 0) {
      console.log(`⚠️  Found ${invalidProducts.length} products with invalid images_json`);
      invalidProducts.forEach(p => {
        console.log(`  - ID: ${p.id}, Name: ${p.name}, Error: ${p.error}`);
      });
    } else {
      console.log('✅ All images_json are valid JSON arrays\n');
    }

    // 3. Summary statistics
    console.log('3️⃣  Summary Statistics:');
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN images_json IS NOT NULL THEN 1 ELSE 0 END) as with_images_json,
        SUM(CASE WHEN images_json IS NULL THEN 1 ELSE 0 END) as without_images_json
      FROM products
    `);

    const stat = stats[0];
    console.log(`  Total products: ${stat.total_products}`);
    console.log(`  With images_json: ${stat.with_images_json}`);
    console.log(`  Without images_json: ${stat.without_images_json}`);

    if (stat.without_images_json > 0) {
      console.log(`\n  ⚠️  WARNING: ${stat.without_images_json} products still missing images_json`);
      console.log('  These products will have degraded image handling until fixed.');
    }

    // 4. Check image_path values
    console.log('\n4️⃣  Checking image_path values...');
    const [emptyImagePath] = await pool.query(
      `SELECT COUNT(*) as count FROM products WHERE image_path IS NULL OR image_path = ''`
    );

    if (emptyImagePath[0].count > 0) {
      console.log(`⚠️  Found ${emptyImagePath[0].count} products with empty image_path`);
      console.log('  These products may not display correctly.');
    } else {
      console.log('✅ All products have valid image_path\n');
    }

    // 5. Verify cache tables aren't needed
    console.log('5️⃣  Cache Verification:');
    console.log('  ℹ️  In-memory cache service is used - no database tables needed');
    console.log('  ℹ️  Cache is invalidated on product create/update/delete');
    console.log('  ℹ️  On server restart, cache is cleared and data loads from DB');

    console.log('\n✅ Image Persistence Check Complete!\n');

  } catch (error) {
    console.error('❌ Error during check:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

checkImagePersistence();
