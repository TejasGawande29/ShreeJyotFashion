/**
 * Simple script to insert product prices for existing products
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function insertPrices() {
  try {
    // Get recent products
    const productsResult = await pool.query(`
      SELECT id, name FROM products 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log('\nRecent Products:');
    productsResult.rows.forEach(p => {
      console.log(`  ${p.id}: ${p.name}`);
    });

    // Insert prices for products 19 and 20 (from last test)
    const prices = [
      { product_id: 19, mrp: 25000, sale_price: 20000, discount_percentage: 20, rental_price_per_day: 2000, rental_price_3days: 5000, rental_price_7days: 10000, security_deposit: 10000 },
      { product_id: 20, mrp: 15000, sale_price: 12000, discount_percentage: 20 },
    ];

    console.log('\nInserting prices...');
    for (const price of prices) {
      try {
        await pool.query(`
          INSERT INTO product_prices (
            product_id, mrp, sale_price, discount_percentage,
            rental_price_per_day, rental_price_3days, rental_price_7days,
            security_deposit, is_current, effective_from
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
          ON CONFLICT DO NOTHING
        `, [
          price.product_id,
          price.mrp,
          price.sale_price || null,
          price.discount_percentage || 0,
          price.rental_price_per_day || null,
          price.rental_price_3days || null,
          price.rental_price_7days || null,
          price.security_deposit || null,
        ]);
        console.log(`  ✓ Inserted price for product ${price.product_id}`);
      } catch (error) {
        console.log(`  ✗ Failed for product ${price.product_id}: ${error.message}`);
      }
    }

    // Verify
    const checkResult = await pool.query(`
      SELECT pp.product_id, p.name, pp.mrp, pp.sale_price
      FROM product_prices pp
      JOIN products p ON p.id = pp.product_id
      WHERE pp.is_current = true
      ORDER BY pp.created_at DESC
      LIMIT 5
    `);

    console.log('\nCurrent Prices:');
    checkResult.rows.forEach(row => {
      console.log(`  Product ${row.product_id} (${row.name}): MRP ₹${row.mrp}, Sale ₹${row.sale_price || 'N/A'}`);
    });

    console.log('\n✅ Done!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

insertPrices();
