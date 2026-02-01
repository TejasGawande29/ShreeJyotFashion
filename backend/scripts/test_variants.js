const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testProductId = null;
let testVariantId = null;

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}→ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
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
    return true;
  } else {
    log.error('Failed to login as admin');
    console.log(result.error);
    return false;
  }
}

// Test 2: Create a test product for variants
async function createTestProduct() {
  log.test('Test 2: Create Test Product');
  const result = await makeRequest('post', '/products', {
    name: 'Test Lehenga for Variants',
    description: 'Test product for variant testing',
    base_price: 25000,
    category_id: 1,
    sku: 'TEST-VARIANT-001',
  });

  if (result.success && result.data.data?.id) {
    testProductId = result.data.data.id;
    log.success(`Test product created with ID: ${testProductId}`);
    return true;
  } else {
    log.error('Failed to create test product');
    console.log(result.error);
    return false;
  }
}

// Test 3: Create a product variant
async function testCreateVariant() {
  log.test('Test 3: Create Product Variant');
  const result = await makeRequest('post', `/products/${testProductId}/variants`, {
    size: 'Large',
    color: 'Red',
    color_code: '#FF0000',
    stock_quantity: 50,
    sku_variant: 'TEST-VARIANT-001-L-RED',
  });

  if (result.success && result.data.data?.id) {
    testVariantId = result.data.data.id;
    log.success(`Variant created with ID: ${testVariantId}`);
    console.log('Variant details:', result.data.data);
    return true;
  } else {
    log.error('Failed to create variant');
    console.log(result.error);
    return false;
  }
}

// Test 4: Get all variants for product
async function testGetVariants() {
  log.test('Test 4: Get All Variants');
  const result = await makeRequest('get', `/products/${testProductId}/variants`);

  if (result.success && Array.isArray(result.data.data)) {
    log.success(`Retrieved ${result.data.data.length} variants`);
    console.log('Variants:', JSON.stringify(result.data.data, null, 2));
    return true;
  } else {
    log.error('Failed to get variants');
    console.log(result.error);
    return false;
  }
}

// Test 5: Get single variant
async function testGetVariant() {
  log.test('Test 5: Get Single Variant');
  const result = await makeRequest('get', `/products/${testProductId}/variants/${testVariantId}`);

  if (result.success && result.data.data) {
    log.success('Variant retrieved successfully');
    console.log('Variant:', result.data.data);
    return true;
  } else {
    log.error('Failed to get variant');
    console.log(result.error);
    return false;
  }
}

// Test 6: Update variant
async function testUpdateVariant() {
  log.test('Test 6: Update Variant');
  const result = await makeRequest('put', `/products/${testProductId}/variants/${testVariantId}`, {
    stock_quantity: 75,
    color: 'Crimson Red',
  });

  if (result.success && result.data.data) {
    log.success('Variant updated successfully');
    console.log('Updated variant:', result.data.data);
    return true;
  } else {
    log.error('Failed to update variant');
    console.log(result.error);
    return false;
  }
}

// Test 7: Reserve stock
async function testReserveStock() {
  log.test('Test 7: Reserve Stock');
  const result = await makeRequest(
    'post',
    `/products/${testProductId}/variants/${testVariantId}/reserve`,
    {
      quantity: 10,
    }
  );

  if (result.success) {
    log.success('Stock reserved successfully');
    console.log('Stock after reservation:', result.data.data);
    return true;
  } else {
    log.error('Failed to reserve stock');
    console.log(result.error);
    return false;
  }
}

// Test 8: Release stock
async function testReleaseStock() {
  log.test('Test 8: Release Stock');
  const result = await makeRequest(
    'post',
    `/products/${testProductId}/variants/${testVariantId}/release`,
    {
      quantity: 5,
    }
  );

  if (result.success) {
    log.success('Stock released successfully');
    console.log('Stock after release:', result.data.data);
    return true;
  } else {
    log.error('Failed to release stock');
    console.log(result.error);
    return false;
  }
}

// Test 9: Add stock
async function testAddStock() {
  log.test('Test 9: Add Stock');
  const result = await makeRequest(
    'post',
    `/products/${testProductId}/variants/${testVariantId}/add-stock`,
    {
      quantity: 25,
    }
  );

  if (result.success) {
    log.success('Stock added successfully');
    console.log('Stock after addition:', result.data.data);
    return true;
  } else {
    log.error('Failed to add stock');
    console.log(result.error);
    return false;
  }
}

// Test 10: Reduce stock
async function testReduceStock() {
  log.test('Test 10: Reduce Stock');
  const result = await makeRequest(
    'post',
    `/products/${testProductId}/variants/${testVariantId}/reduce-stock`,
    {
      quantity: 10,
    }
  );

  if (result.success) {
    log.success('Stock reduced successfully');
    console.log('Stock after reduction:', result.data.data);
    return true;
  } else {
    log.error('Failed to reduce stock');
    console.log(result.error);
    return false;
  }
}

// Test 11: Create duplicate variant (should fail)
async function testDuplicateVariant() {
  log.test('Test 11: Create Duplicate Variant (should fail)');
  const result = await makeRequest('post', `/products/${testProductId}/variants`, {
    size: 'Large',
    color: 'Crimson Red', // Same as updated variant
    stock_quantity: 20,
  });

  if (!result.success && result.status === 400) {
    log.success('Duplicate variant correctly rejected');
    return true;
  } else {
    log.error('Duplicate variant should have been rejected');
    console.log(result);
    return false;
  }
}

// Test 12: Delete variant
async function testDeleteVariant() {
  log.test('Test 12: Delete Variant (Soft Delete)');
  const result = await makeRequest(
    'delete',
    `/products/${testProductId}/variants/${testVariantId}`
  );

  if (result.success) {
    log.success('Variant deleted successfully (soft delete)');
    return true;
  } else {
    log.error('Failed to delete variant');
    console.log(result.error);
    return false;
  }
}

// Test 13: Verify variant is inactive
async function testVerifyInactive() {
  log.test('Test 13: Verify Variant is Inactive');
  const result = await makeRequest('get', `/products/${testProductId}/variants/${testVariantId}`);

  if (!result.success && result.status === 404) {
    log.success('Deleted variant is not accessible (as expected)');
    return true;
  } else {
    log.warn('Deleted variant is still accessible (check soft delete logic)');
    return false;
  }
}

// Test 14: Cleanup - Delete test product
async function cleanupTestProduct() {
  log.test('Test 14: Cleanup - Delete Test Product');
  const result = await makeRequest('delete', `/products/${testProductId}`);

  if (result.success) {
    log.success('Test product cleaned up successfully');
    return true;
  } else {
    log.warn('Failed to cleanup test product (may need manual cleanup)');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 Product Variants API Test Suite');
  console.log('='.repeat(60) + '\n');

  const tests = [
    testLogin,
    createTestProduct,
    testCreateVariant,
    testGetVariants,
    testGetVariant,
    testUpdateVariant,
    testReserveStock,
    testReleaseStock,
    testAddStock,
    testReduceStock,
    testDuplicateVariant,
    testDeleteVariant,
    testVerifyInactive,
    cleanupTestProduct,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
      console.log(''); // Empty line between tests
    } catch (error) {
      log.error(`Test crashed: ${error.message}`);
      failed++;
      console.log('');
    }
  }

  console.log('='.repeat(60));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch((error) => {
  log.error(`Test suite crashed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
