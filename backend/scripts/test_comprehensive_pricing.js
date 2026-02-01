/**
 * Comprehensive Cart & Wishlist Test with Pricing
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

let token = '';
let userId = '';
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  const color = passed ? colors.green : colors.red;
  log(`  ${status}: ${name}`, color);
  if (details) log(`    ${details}`, colors.cyan);
  
  testResults.tests.push({ name, passed });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

async function login() {
  log('\n1. Authentication Test', colors.blue);
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@shreejyot.com',
      password: 'Admin@123'
    });
    token = response.data.data.accessToken;
    userId = response.data.data.user.id;
    logTest('Admin Login', true, `User ID: ${userId}`);
    return true;
  } catch (error) {
    logTest('Admin Login', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testCartPricing() {
  log('\n2. Cart Pricing Tests', colors.blue);
  
  try {
    // Clear cart first
    await axios.delete(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Add product 19 (Designer Lehenga - ₹20,000) × 2
    const addResponse = await axios.post(
      `${BASE_URL}/cart`,
      { product_id: 19, quantity: 2 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    logTest('Add to Cart', true, 'Added Designer Lehenga × 2');
    
    // Get cart and verify pricing
    const cartResponse = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const cart = cartResponse.data.data;
    const expectedSubtotal = 40000; // 2 × 20000
    const expectedTax = 7200; // 18% of 40000
    const expectedTotal = 47200;
    
    const subtotalMatch = cart.summary.subtotal === expectedSubtotal;
    const taxMatch = cart.summary.tax === expectedTax;
    const totalMatch = cart.summary.total === expectedTotal;
    
    logTest(
      'Cart Subtotal Calculation',
      subtotalMatch,
      `Expected: ₹${expectedSubtotal}, Got: ₹${cart.summary.subtotal}`
    );
    
    logTest(
      'Cart Tax Calculation (18%)',
      taxMatch,
      `Expected: ₹${expectedTax}, Got: ₹${cart.summary.tax}`
    );
    
    logTest(
      'Cart Total Calculation',
      totalMatch,
      `Expected: ₹${expectedTotal}, Got: ₹${cart.summary.total}`
    );
    
    // Check item price
    const item = cart.items[0];
    const itemPriceMatch = parseFloat(item.base_price) === 20000;
    logTest(
      'Item Price from ProductPrice',
      itemPriceMatch,
      `Expected: ₹20000, Got: ₹${item.base_price}`
    );
    
    // Update quantity
    const updateResponse = await axios.put(
      `${BASE_URL}/cart/${item.id}`,
      { quantity: 3 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    logTest('Update Cart Quantity', true, 'Updated to 3 items');
    
    // Verify updated total
    const updatedCartResponse = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedCart = updatedCartResponse.data.data;
    const updatedSubtotal = 60000; // 3 × 20000
    logTest(
      'Updated Cart Subtotal',
      updatedCart.summary.subtotal === updatedSubtotal,
      `Expected: ₹${updatedSubtotal}, Got: ₹${updatedCart.summary.subtotal}`
    );
    
    return true;
  } catch (error) {
    logTest('Cart Pricing Test', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testWishlistPricing() {
  log('\n3. Wishlist Pricing Tests', colors.blue);
  
  try {
    // Clear wishlist
    await axios.delete(`${BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Add product 20 (Silk Saree - ₹12,000)
    const addResponse = await axios.post(
      `${BASE_URL}/wishlist`,
      { product_id: 20 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    logTest('Add to Wishlist', true, 'Added Silk Saree');
    
    // Get wishlist and verify pricing
    const wishlistResponse = await axios.get(`${BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const wishlist = wishlistResponse.data.data;
    const item = wishlist.items[0];
    const priceMatch = parseFloat(item.base_price) === 12000;
    
    logTest(
      'Wishlist Item Price',
      priceMatch,
      `Expected: ₹12000, Got: ₹${item.base_price}`
    );
    
    return true;
  } catch (error) {
    logTest('Wishlist Pricing Test', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testMultipleProducts() {
  log('\n4. Multiple Products Cart Test', colors.blue);
  
  try {
    // Clear cart
    await axios.delete(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Add product 19 (₹20,000) × 1
    await axios.post(
      `${BASE_URL}/cart`,
      { product_id: 19, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Add product 20 (₹12,000) × 2
    await axios.post(
      `${BASE_URL}/cart`,
      { product_id: 20, quantity: 2 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    logTest('Add Multiple Products', true, 'Added 2 different products');
    
    // Get cart
    const cartResponse = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const cart = cartResponse.data.data;
    const expectedSubtotal = 44000; // (1 × 20000) + (2 × 12000)
    const expectedTotal = Math.round(expectedSubtotal * 1.18);
    
    logTest(
      'Multiple Products Subtotal',
      cart.summary.subtotal === expectedSubtotal,
      `Expected: ₹${expectedSubtotal}, Got: ₹${cart.summary.subtotal}`
    );
    
    logTest(
      'Cart Item Count',
      cart.summary.total_items === 2,
      `Expected: 2 items, Got: ${cart.summary.total_items}`
    );
    
    logTest(
      'Cart Total Quantity',
      cart.summary.total_quantity === 3,
      `Expected: 3 quantity, Got: ${cart.summary.total_quantity}`
    );
    
    return true;
  } catch (error) {
    logTest('Multiple Products Test', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testCartCount() {
  log('\n5. Cart Count Test', colors.blue);
  
  try {
    const countResponse = await axios.get(`${BASE_URL}/cart/count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const count = countResponse.data.data.count;
    logTest('Get Cart Count', count >= 0, `Count: ${count}`);
    
    return true;
  } catch (error) {
    logTest('Cart Count Test', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), colors.blue);
  log('  Cart & Wishlist Pricing - Comprehensive Test Suite', colors.blue);
  log('='.repeat(60), colors.blue);
  
  const loginSuccess = await login();
  if (!loginSuccess) {
    log('\n❌ Authentication failed. Aborting tests.', colors.red);
    return;
  }
  
  await testCartPricing();
  await testWishlistPricing();
  await testMultipleProducts();
  await testCartCount();
  
  // Summary
  log('\n' + '='.repeat(60), colors.blue);
  log('  Test Summary', colors.blue);
  log('='.repeat(60), colors.blue);
  
  const total = testResults.passed + testResults.failed;
  const percentage = ((testResults.passed / total) * 100).toFixed(1);
  
  log(`Total Tests: ${total}`, colors.cyan);
  log(`Passed: ${testResults.passed}`, colors.green);
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? colors.red : colors.green);
  log(`Success Rate: ${percentage}%`, percentage >= 90 ? colors.green : colors.yellow);
  
  if (testResults.failed === 0) {
    log('\n🎉 All tests passed! Cart and Wishlist pricing is fully functional!', colors.green);
  } else {
    log(`\n⚠️  ${testResults.failed} test(s) failed. Review results above.`, colors.yellow);
  }
  
  log('\n' + '='.repeat(60), colors.blue);
}

runAllTests();
