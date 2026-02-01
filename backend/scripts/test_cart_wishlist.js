const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testProductId1 = null;
let testProductId2 = null;
let testVariantId1 = null;
let testVariantId2 = null;
let testCartItemId = null;
let testWishlistItemId = null;

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}→ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.magenta}${'='.repeat(60)}\n  ${msg}\n${'='.repeat(60)}${colors.reset}\n`),
};

// Helper function to make authenticated requests
const makeRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    };
    if (data) {
      config.data = data;
    }
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
};

// Test counter
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

const recordTest = (passed) => {
  testsRun++;
  if (passed) {
    testsPassed++;
  } else {
    testsFailed++;
  }
};

// ============================================================================
// SETUP TESTS
// ============================================================================

// Test 1: Login as admin
async function testLogin() {
  log.test('Test 1: Admin Login');
  const result = await makeRequest('post', '/auth/login', {
    email: 'admin@shreejyot.com',
    password: 'Admin@123',
  });

  if (result.success && result.data.data?.accessToken) {
    authToken = result.data.data.accessToken;
    log.success('Admin logged in successfully');
    recordTest(true);
    return true;
  } else {
    log.error('Failed to login as admin');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 2: Create test products
async function createTestProducts() {
  log.test('Test 2: Create Test Products for Cart & Wishlist');
  
  // Generate unique SKUs with timestamp
  const timestamp = Date.now();
  
  // Create first product
  try {
    const response1 = await axios.post(`${BASE_URL}/products`, {
      name: 'Blue Silk Saree',
      description: 'Beautiful blue silk saree for testing',
      base_price: 5000,
      category_id: 1,
      sku: `CART-TEST-${timestamp}-001`,
      is_sale: true,
      is_rental: false,
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testProductId1 = response1.data.data.id;
    log.success(`Test product 1 created with ID: ${testProductId1}`);
  } catch (error) {
    log.error('Failed to create test product 1');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    recordTest(false);
    return false;
  }

  // Create second product
  try {
    const response2 = await axios.post(`${BASE_URL}/products`, {
      name: 'Red Designer Lehenga',
      description: 'Elegant red lehenga for testing',
      base_price: 15000,
      category_id: 1,
      sku: `CART-TEST-${timestamp}-002`,
      is_sale: true,
      is_rental: false,
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testProductId2 = response2.data.data.id;
    log.success(`Test product 2 created with ID: ${testProductId2}`);
    recordTest(true);
    return true;
  } catch (error) {
    log.error('Failed to create test product 2');
    console.log('Error:', error.response?.data || error.message);
    recordTest(false);
    return false;
  }
}

// Test 3: Create test variants
async function createTestVariants() {
  log.test('Test 3: Create Test Variants');
  
  // Generate unique SKUs with timestamp
  const timestamp = Date.now();
  
  // Create variant for product 1
  try {
    const response1 = await axios.post(`${BASE_URL}/products/${testProductId1}/variants`, {
      sku_variant: `CART-VAR-${timestamp}-001-M-BLUE`,
      size: 'M',
      color: 'Blue',
      color_code: '#0000FF',
      stock_quantity: 10,
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testVariantId1 = response1.data.data.id;
    log.success(`Test variant 1 created with ID: ${testVariantId1}`);
  } catch (error) {
    log.error('Failed to create test variant 1');
    console.log('Error:', error.response?.data || error.message);
    recordTest(false);
    return false;
  }

  // Create variant for product 2
  try {
    const response2 = await axios.post(`${BASE_URL}/products/${testProductId2}/variants`, {
      sku_variant: `CART-VAR-${timestamp}-002-L-RED`,
      size: 'L',
      color: 'Red',
      color_code: '#FF0000',
      stock_quantity: 5,
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testVariantId2 = response2.data.data.id;
    log.success(`Test variant 2 created with ID: ${testVariantId2}`);
    recordTest(true);
    return true;
  } catch (error) {
    log.error('Failed to create test variant 2');
    console.log('Error:', error.response?.data || error.message);
    recordTest(false);
    return false;
  }
}

// ============================================================================
// CART TESTS
// ============================================================================

// Test 4: Add item to cart
async function testAddToCart() {
  log.test('Test 4: Add Item to Cart');
  const result = await makeRequest('post', '/cart', {
    product_id: testProductId1,
    variant_id: testVariantId1,
    quantity: 2,
  });

  if (result.success && result.data.success) {
    testCartItemId = result.data.data.cartItem.id;
    log.success('Item added to cart successfully');
    log.info(`Cart item ID: ${testCartItemId}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to add item to cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 5: Get cart
async function testGetCart() {
  log.test('Test 5: Get User Cart');
  const result = await makeRequest('get', '/cart');

  if (result.success && result.data.success && result.data.data.items.length > 0) {
    log.success('Cart retrieved successfully');
    log.info(`Total items: ${result.data.data.summary.total_items}`);
    log.info(`Total quantity: ${result.data.data.summary.total_quantity}`);
    log.info(`Subtotal: ₹${result.data.data.summary.subtotal}`);
    log.info(`Tax: ₹${result.data.data.summary.tax}`);
    log.info(`Total: ₹${result.data.data.summary.total}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to get cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 6: Update cart item quantity
async function testUpdateCartItem() {
  log.test('Test 6: Update Cart Item Quantity');
  const result = await makeRequest('put', `/cart/${testCartItemId}`, {
    quantity: 3,
  });

  if (result.success && result.data.success) {
    log.success('Cart item quantity updated successfully');
    log.info(`New quantity: ${result.data.data.cartItem.quantity}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to update cart item quantity');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 7: Add another item to cart
async function testAddSecondItem() {
  log.test('Test 7: Add Second Item to Cart');
  const result = await makeRequest('post', '/cart', {
    product_id: testProductId2,
    variant_id: testVariantId2,
    quantity: 1,
  });

  if (result.success && result.data.success) {
    log.success('Second item added to cart successfully');
    recordTest(true);
    return true;
  } else {
    log.error('Failed to add second item to cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 8: Get cart count
async function testGetCartCount() {
  log.test('Test 8: Get Cart Count');
  const result = await makeRequest('get', '/cart/count');

  if (result.success && result.data.success) {
    log.success('Cart count retrieved successfully');
    log.info(`Total unique items: ${result.data.data.count}`);
    log.info(`Total quantity: ${result.data.data.total_quantity}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to get cart count');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 9: Validate cart
async function testValidateCart() {
  log.test('Test 9: Validate Cart Before Checkout');
  const result = await makeRequest('get', '/cart/validate');

  if (result.success && result.data.success) {
    log.success('Cart validation completed');
    log.info(`Cart valid: ${result.data.data.valid}`);
    log.info(`Issues found: ${result.data.data.issues.length}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to validate cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 10: Add duplicate item (should update quantity)
async function testAddDuplicateItem() {
  log.test('Test 10: Add Duplicate Item (Should Update Quantity)');
  const result = await makeRequest('post', '/cart', {
    product_id: testProductId1,
    variant_id: testVariantId1,
    quantity: 1,
  });

  if (result.success && result.data.success && result.data.data.action === 'updated') {
    log.success('Duplicate item quantity updated correctly');
    log.info(`Action: ${result.data.data.action}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to handle duplicate item correctly');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 11: Remove item from cart
async function testRemoveFromCart() {
  log.test('Test 11: Remove Item from Cart');
  const result = await makeRequest('delete', `/cart/${testCartItemId}`);

  if (result.success && result.data.success) {
    log.success('Item removed from cart successfully');
    recordTest(true);
    return true;
  } else {
    log.error('Failed to remove item from cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// ============================================================================
// WISHLIST TESTS
// ============================================================================

// Test 12: Add item to wishlist
async function testAddToWishlist() {
  log.test('Test 12: Add Item to Wishlist');
  const result = await makeRequest('post', '/wishlist', {
    product_id: testProductId1,
  });

  if (result.success && result.data.success) {
    testWishlistItemId = result.data.data.wishlistItem.id;
    log.success('Item added to wishlist successfully');
    log.info(`Wishlist item ID: ${testWishlistItemId}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to add item to wishlist');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 13: Get wishlist
async function testGetWishlist() {
  log.test('Test 13: Get User Wishlist');
  const result = await makeRequest('get', '/wishlist');

  if (result.success && result.data.success && result.data.data.items.length > 0) {
    log.success('Wishlist retrieved successfully');
    log.info(`Total items: ${result.data.data.total}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to get wishlist');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 14: Check if product is in wishlist
async function testCheckWishlist() {
  log.test('Test 14: Check if Product is in Wishlist');
  const result = await makeRequest('get', `/wishlist/check/${testProductId1}`);

  if (result.success && result.data.success && result.data.data.inWishlist === true) {
    log.success('Product found in wishlist');
    log.info(`Wishlist item ID: ${result.data.data.wishlistItemId}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to check wishlist');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 15: Get wishlist count
async function testGetWishlistCount() {
  log.test('Test 15: Get Wishlist Count');
  const result = await makeRequest('get', '/wishlist/count');

  if (result.success && result.data.success) {
    log.success('Wishlist count retrieved successfully');
    log.info(`Total items: ${result.data.data.count}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to get wishlist count');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 16: Add second item to wishlist
async function testAddSecondToWishlist() {
  log.test('Test 16: Add Second Item to Wishlist');
  const result = await makeRequest('post', '/wishlist', {
    product_id: testProductId2,
  });

  if (result.success && result.data.success) {
    log.success('Second item added to wishlist successfully');
    recordTest(true);
    return true;
  } else {
    log.error('Failed to add second item to wishlist');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 17: Try adding duplicate to wishlist (should fail)
async function testAddDuplicateToWishlist() {
  log.test('Test 17: Try Adding Duplicate to Wishlist (Should Fail)');
  const result = await makeRequest('post', '/wishlist', {
    product_id: testProductId1,
  });

  if (!result.success && result.error.message?.includes('already in wishlist')) {
    log.success('Duplicate prevented correctly');
    recordTest(true);
    return true;
  } else {
    log.error('Failed to prevent duplicate in wishlist');
    console.log(result);
    recordTest(false);
    return false;
  }
}

// Test 18: Move wishlist item to cart
async function testMoveToCart() {
  log.test('Test 18: Move Wishlist Item to Cart');
  const result = await makeRequest('post', `/wishlist/${testWishlistItemId}/move-to-cart`, {
    variant_id: testVariantId1,
    quantity: 2,
  });

  if (result.success && result.data.success) {
    log.success('Item moved to cart successfully');
    log.info('Item removed from wishlist and added to cart');
    recordTest(true);
    return true;
  } else {
    log.error('Failed to move item to cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 19: Verify item removed from wishlist after moving
async function testVerifyRemovedFromWishlist() {
  log.test('Test 19: Verify Item Removed from Wishlist');
  const result = await makeRequest('get', `/wishlist/check/${testProductId1}`);

  if (result.success && result.data.success && result.data.data.inWishlist === false) {
    log.success('Item correctly removed from wishlist');
    recordTest(true);
    return true;
  } else {
    log.error('Item still in wishlist (should be removed)');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 20: Remove item from wishlist by product ID
async function testRemoveByProductId() {
  log.test('Test 20: Remove Item from Wishlist by Product ID');
  const result = await makeRequest('delete', `/wishlist/product/${testProductId2}`);

  if (result.success && result.data.success) {
    log.success('Item removed from wishlist by product ID');
    recordTest(true);
    return true;
  } else {
    log.error('Failed to remove item from wishlist by product ID');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 21: Clear entire cart
async function testClearCart() {
  log.test('Test 21: Clear Entire Cart');
  const result = await makeRequest('delete', '/cart');

  if (result.success && result.data.success) {
    log.success('Cart cleared successfully');
    log.info(`Items deleted: ${result.data.data.deletedCount}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to clear cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 22: Merge cart (for guest to user migration)
async function testMergeCart() {
  log.test('Test 22: Merge Guest Cart with User Cart');
  const result = await makeRequest('post', '/cart/merge', {
    items: [
      {
        product_id: testProductId1,
        variant_id: testVariantId1,
        quantity: 1,
      },
      {
        product_id: testProductId2,
        variant_id: testVariantId2,
        quantity: 2,
      },
    ],
  });

  if (result.success && result.data.success) {
    log.success('Cart merged successfully');
    log.info(`Items merged: ${result.data.data.merged_items}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to merge cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// Test 23: Verify merged cart
async function testVerifyMergedCart() {
  log.test('Test 23: Verify Merged Cart Has Items');
  const result = await makeRequest('get', '/cart');

  if (result.success && result.data.success && result.data.data.items.length > 0) {
    log.success('Merged cart verified');
    log.info(`Total items in cart: ${result.data.data.summary.total_items}`);
    recordTest(true);
    return true;
  } else {
    log.error('Failed to verify merged cart');
    console.log(result.error);
    recordTest(false);
    return false;
  }
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  CART & WISHLIST API TEST SUITE');
  console.log('='.repeat(60) + '\n');

  // Setup tests
  log.section('SETUP TESTS');
  if (!(await testLogin())) return;
  if (!(await createTestProducts())) return;
  if (!(await createTestVariants())) return;

  // Cart tests
  log.section('CART TESTS');
  await testAddToCart();
  await testGetCart();
  await testUpdateCartItem();
  await testAddSecondItem();
  await testGetCartCount();
  await testValidateCart();
  await testAddDuplicateItem();
  await testRemoveFromCart();

  // Wishlist tests
  log.section('WISHLIST TESTS');
  await testAddToWishlist();
  await testGetWishlist();
  await testCheckWishlist();
  await testGetWishlistCount();
  await testAddSecondToWishlist();
  await testAddDuplicateToWishlist();
  await testMoveToCart();
  await testVerifyRemovedFromWishlist();
  await testRemoveByProductId();

  // Additional tests
  log.section('ADDITIONAL TESTS');
  await testClearCart();
  await testMergeCart();
  await testVerifyMergedCart();

  // Test summary
  console.log('\n' + '='.repeat(60));
  console.log('  TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests run: ${testsRun}`);
  console.log(`${colors.green}Passed: ${testsPassed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testsFailed}${colors.reset}`);
  console.log(`Success rate: ${((testsPassed / testsRun) * 100).toFixed(1)}%`);
  console.log('='.repeat(60) + '\n');

  if (testsFailed === 0) {
    log.success('ALL TESTS PASSED! 🎉');
  } else {
    log.error(`${testsFailed} test(s) failed. Please review the errors above.`);
  }
}

// Run the tests
runAllTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
