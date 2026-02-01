/**
 * Create Test Products with Prices
 * This script creates products with pricing for testing cart/wishlist
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

let authToken = '';
let productIds = [];

async function login() {
  console.log(`${colors.blue}1. Logging in as admin...${colors.reset}`);
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'admin@shreejyot.com',
    password: 'Admin@123'
  });
  
  authToken = response.data.data.accessToken;
  console.log(`${colors.green}✓ Logged in successfully${colors.reset}\n`);
}

async function createProducts() {
  console.log(`${colors.blue}2. Creating test products...${colors.reset}`);
  
  const products = [
    {
      name: 'Designer Lehenga',
      description: 'Beautiful designer lehenga for weddings',
      base_price: 20000,  // Required by validator (will be ignored, use product_prices instead)
      sku: `LEHENGA-${Date.now()}`,
      category_id: 1,
      is_sale: true,
      is_rental: true,
    },
    {
      name: 'Silk Saree',
      description: 'Premium silk saree',
      base_price: 12000,  // Required by validator (will be ignored, use product_prices instead)
      sku: `SAREE-${Date.now()}`,
      category_id: 1,
      is_sale: true,
      is_rental: false,
    },
  ];

  for (const product of products) {
    try {
      const response = await axios.post(`${BASE_URL}/products`, product, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      productIds.push(response.data.data.id);
      console.log(`${colors.green}  ✓ Created: ${product.name} (ID: ${response.data.data.id})${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}  ✗ Failed to create ${product.name}${colors.reset}`);
      console.log(`    Error: ${error.response?.data?.message || error.message}`);
    }
  }
  console.log();
}

async function createPrices() {
  console.log(`${colors.blue}3. Creating product prices...${colors.reset}`);
  
  const prices = [
    {
      product_id: productIds[0],
      mrp: 25000,
      sale_price: 20000,
      discount_percentage: 20,
      rental_price_per_day: 2000,
      rental_price_3days: 5000,
      rental_price_7days: 10000,
      security_deposit: 10000,
    },
    {
      product_id: productIds[1],
      mrp: 15000,
      sale_price: 12000,
      discount_percentage: 20,
    },
  ];

  for (const price of prices) {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${price.product_id}/prices`,
        price,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log(`${colors.green}  ✓ Added price for product ${price.product_id}${colors.reset}`);
    } catch (error) {
      // If endpoint doesn't exist, insert directly via SQL
      console.log(`${colors.yellow}  ⚠ Price API not available, trying direct insert...${colors.reset}`);
      
      // Try direct database insert
      const { Pool } = require('pg');
      const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'shreejyot_fashion',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
      });

      try {
        await pool.query(`
          INSERT INTO product_prices (
            product_id, mrp, sale_price, discount_percentage,
            rental_price_per_day, rental_price_3days, rental_price_7days,
            security_deposit, is_current
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
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
        console.log(`${colors.green}  ✓ Inserted price directly for product ${price.product_id}${colors.reset}`);
      } catch (dbError) {
        console.log(`${colors.red}  ✗ Database insert failed: ${dbError.message}${colors.reset}`);
      } finally {
        await pool.end();
      }
    }
  }
  console.log();
}

async function createVariants() {
  console.log(`${colors.blue}4. Creating product variants...${colors.reset}`);
  
  const variants = [
    {
      product_id: productIds[0],
      size: 'M',
      color: 'Red',
      color_code: '#FF0000',
      stock_quantity: 5,
      sku_variant: `LEHENGA-M-RED-${Date.now()}`,
    },
    {
      product_id: productIds[1],
      size: 'Free Size',
      color: 'Blue',
      color_code: '#0000FF',
      stock_quantity: 10,
      sku_variant: `SAREE-FS-BLUE-${Date.now()}`,
    },
  ];

  for (const variant of variants) {
    try {
      const response = await axios.post(
        `${BASE_URL}/products/${variant.product_id}/variants`,
        variant,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log(`${colors.green}  ✓ Created variant for product ${variant.product_id}${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}  ✗ Failed to create variant${colors.reset}`);
      console.log(`    Error: ${error.response?.data?.message || error.message}`);
    }
  }
  console.log();
}

async function testCart() {
  console.log(`${colors.blue}5. Testing Cart with Pricing...${colors.reset}`);
  
  try {
    // Add first product to cart
    await axios.post(
      `${BASE_URL}/cart`,
      { product_id: productIds[0], quantity: 2 },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log(`${colors.green}  ✓ Added product to cart${colors.reset}`);

    // Get cart
    const cartResponse = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const cart = cartResponse.data.data;
    console.log(`\n${colors.yellow}  Cart Summary:${colors.reset}`);
    console.log(`  Items: ${cart.summary.total_items}`);
    console.log(`  Quantity: ${cart.summary.total_quantity}`);
    console.log(`  Subtotal: ₹${cart.summary.subtotal}`);
    console.log(`  Tax (18%): ₹${cart.summary.tax}`);
    console.log(`  Total: ₹${cart.summary.total}`);
    
    if (cart.items.length > 0) {
      console.log(`\n${colors.yellow}  First Item:${colors.reset}`);
      console.log(`  Name: ${cart.items[0].product_name}`);
      console.log(`  Price: ₹${cart.items[0].base_price}`);
      console.log(`  Quantity: ${cart.items[0].quantity}`);
      console.log(`  Subtotal: ₹${cart.items[0].subtotal}`);
    }

    // Verify pricing
    if (cart.summary.subtotal > 0) {
      console.log(`\n${colors.green}🎉 SUCCESS! Cart pricing is working!${colors.reset}`);
      return true;
    } else {
      console.log(`\n${colors.red}❌ WARNING: Cart total is still $0${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}  ✗ Cart test failed${colors.reset}`);
    console.log(`    Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function run() {
  console.log(`${colors.blue}=========================================`);
  console.log(`  Create Test Products with Pricing`);
  console.log(`==========================================${colors.reset}\n`);

  try {
    await login();
    await createProducts();
    await createPrices();
    await createVariants();
    const success = await testCart();

    if (success) {
      console.log(`\n${colors.green}✅ All tests passed! Cart pricing is enabled!${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}⚠️  Products created but pricing may need verification${colors.reset}`);
    }
  } catch (error) {
    console.log(`\n${colors.red}❌ Error: ${error.message}${colors.reset}`);
    if (error.response) {
      console.log(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

run();
