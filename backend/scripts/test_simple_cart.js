/**
 * Simple Cart & Wishlist API Test
 * Tests basic endpoint availability
 */

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
let userId = '';

async function login() {
  try {
    console.log(`${colors.blue}1. Logging in as admin...${colors.reset}`);
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@shreejyot.com',
      password: 'Admin@123'
    });
    
    authToken = response.data.data.accessToken;
    userId = response.data.data.user.id;
    console.log(`${colors.green}✓ Login successful${colors.reset}`);
    console.log(`  User ID: ${userId}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Login failed${colors.reset}`);
    console.log(error.response?.data || error.message);
    return false;
  }
}

async function testCartEndpoints() {
  console.log(`\n${colors.blue}2. Testing Cart Endpoints...${colors.reset}`);
  
  try {
    // Test GET /api/cart
    console.log(`${colors.yellow}  Testing GET /api/cart...${colors.reset}`);
    const response = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`${colors.green}  ✓ GET /api/cart works${colors.reset}`);
    console.log(`    Cart items: ${response.data.data.items.length}`);
    console.log(`    Summary: ${JSON.stringify(response.data.data.summary)}`);
    
    // Test GET /api/cart/count
    console.log(`${colors.yellow}  Testing GET /api/cart/count...${colors.reset}`);
    const countResponse = await axios.get(`${BASE_URL}/cart/count`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`${colors.green}  ✓ GET /api/cart/count works${colors.reset}`);
    console.log(`    Count: ${countResponse.data.data.count}`);
    
    return true;
  } catch (error) {
    console.log(`${colors.red}  ✗ Cart endpoint test failed${colors.reset}`);
    console.log(`    Status: ${error.response?.status}`);
    console.log(`    Data: ${JSON.stringify(error.response?.data, null, 2)}`);
    return false;
  }
}

async function testWishlistEndpoints() {
  console.log(`\n${colors.blue}3. Testing Wishlist Endpoints...${colors.reset}`);
  
  try {
    // Test GET /api/wishlist
    console.log(`${colors.yellow}  Testing GET /api/wishlist...${colors.reset}`);
    const response = await axios.get(`${BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`${colors.green}  ✓ GET /api/wishlist works${colors.reset}`);
    console.log(`    Wishlist items: ${response.data.data.length}`);
    
    // Test GET /api/wishlist/count
    console.log(`${colors.yellow}  Testing GET /api/wishlist/count...${colors.reset}`);
    const countResponse = await axios.get(`${BASE_URL}/wishlist/count`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`${colors.green}  ✓ GET /api/wishlist/count works${colors.reset}`);
    console.log(`    Count: ${countResponse.data.data.count}`);
    
    return true;
  } catch (error) {
    console.log(`${colors.red}  ✗ Wishlist endpoint test failed${colors.reset}`);
    console.log(`    Status: ${error.response?.status}`);
    console.log(`    Data: ${JSON.stringify(error.response?.data, null, 2)}`);
    return false;
  }
}

async function runTests() {
  console.log(`${colors.blue}=========================================`);
  console.log(`  Simple Cart & Wishlist API Test`);
  console.log(`==========================================${colors.reset}\n`);
  
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log(`${colors.red}\nTests aborted - login failed${colors.reset}`);
    return;
  }
  
  const cartSuccess = await testCartEndpoints();
  const wishlistSuccess = await testWishlistEndpoints();
  
  console.log(`\n${colors.blue}=========================================`);
  console.log(`  Test Summary`);
  console.log(`==========================================${colors.reset}`);
  console.log(`Login: ${loginSuccess ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`Cart Endpoints: ${cartSuccess ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`Wishlist Endpoints: ${wishlistSuccess ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  
  const allPassed = loginSuccess && cartSuccess && wishlistSuccess;
  if (allPassed) {
    console.log(`\n${colors.green}🎉 All basic tests passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ Some tests failed${colors.reset}`);
  }
}

runTests();
