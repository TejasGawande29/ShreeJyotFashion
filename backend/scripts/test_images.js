const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testProductId = null;
let testImageIds = [];

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

// Test 2: Create a test product for images
async function createTestProduct() {
  log.test('Test 2: Create Test Product');
  const result = await makeRequest('post', '/products', {
    name: 'Test Saree for Images',
    description: 'Test product for image testing',
    base_price: 15000,
    category_id: 2,
    sku: 'TEST-IMAGE-001',
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

// Test 3: Create primary image
async function testCreatePrimaryImage() {
  log.test('Test 3: Create Primary Image');
  const result = await makeRequest('post', `/products/${testProductId}/images`, {
    image_url: 'https://example.com/saree-front.jpg',
    image_type: 'primary',
    alt_text: 'Saree Front View',
    is_primary: true,
  });

  if (result.success && result.data.data?.id) {
    testImageIds.push(result.data.data.id);
    log.success(`Primary image created with ID: ${result.data.data.id}`);
    console.log('Image details:', result.data.data);
    return true;
  } else {
    log.error('Failed to create primary image');
    console.log(result.error);
    return false;
  }
}

// Test 4: Create gallery images
async function testCreateGalleryImages() {
  log.test('Test 4: Create Gallery Images');
  const images = [
    {
      image_url: 'https://example.com/saree-back.jpg',
      image_type: 'gallery',
      alt_text: 'Saree Back View',
    },
    {
      image_url: 'https://example.com/saree-detail.jpg',
      image_type: 'gallery',
      alt_text: 'Saree Detail View',
    },
    {
      image_url: 'https://example.com/saree-side.jpg',
      image_type: 'gallery',
      alt_text: 'Saree Side View',
    },
  ];

  let allSuccess = true;
  for (const imgData of images) {
    const result = await makeRequest('post', `/products/${testProductId}/images`, imgData);
    if (result.success && result.data.data?.id) {
      testImageIds.push(result.data.data.id);
      log.success(`Gallery image created: ${imgData.alt_text}`);
    } else {
      log.error(`Failed to create gallery image: ${imgData.alt_text}`);
      allSuccess = false;
    }
  }

  return allSuccess;
}

// Test 5: Get all images for product
async function testGetImages() {
  log.test('Test 5: Get All Images');
  const result = await makeRequest('get', `/products/${testProductId}/images`);

  if (result.success && Array.isArray(result.data.data)) {
    log.success(`Retrieved ${result.data.data.length} images`);
    console.log('Images:', JSON.stringify(result.data.data, null, 2));
    return true;
  } else {
    log.error('Failed to get images');
    console.log(result.error);
    return false;
  }
}

// Test 6: Get single image
async function testGetSingleImage() {
  log.test('Test 6: Get Single Image');
  const imageId = testImageIds[0];
  const result = await makeRequest('get', `/products/${testProductId}/images/${imageId}`);

  if (result.success && result.data.data) {
    log.success('Image retrieved successfully');
    console.log('Image:', result.data.data);
    return true;
  } else {
    log.error('Failed to get image');
    console.log(result.error);
    return false;
  }
}

// Test 7: Update image
async function testUpdateImage() {
  log.test('Test 7: Update Image');
  const imageId = testImageIds[1];
  const result = await makeRequest('put', `/products/${testProductId}/images/${imageId}`, {
    alt_text: 'Saree Back View - Updated',
    image_type: 'thumbnail',
  });

  if (result.success && result.data.data) {
    log.success('Image updated successfully');
    console.log('Updated image:', result.data.data);
    return true;
  } else {
    log.error('Failed to update image');
    console.log(result.error);
    return false;
  }
}

// Test 8: Set new primary image
async function testSetPrimaryImage() {
  log.test('Test 8: Set New Primary Image');
  const imageId = testImageIds[2]; // Set third image as primary
  const result = await makeRequest(
    'put',
    `/products/${testProductId}/images/${imageId}/set-primary`
  );

  if (result.success) {
    log.success('Primary image updated successfully');
    console.log('New primary image:', result.data.data);
    return true;
  } else {
    log.error('Failed to set primary image');
    console.log(result.error);
    return false;
  }
}

// Test 9: Verify only one primary image
async function testVerifyOnePrimary() {
  log.test('Test 9: Verify Only One Primary Image');
  const result = await makeRequest('get', `/products/${testProductId}/images`);

  if (result.success && Array.isArray(result.data.data)) {
    const primaryImages = result.data.data.filter((img) => img.is_primary);
    if (primaryImages.length === 1) {
      log.success('Correctly has exactly one primary image');
      console.log('Primary image ID:', primaryImages[0].id);
      return true;
    } else {
      log.error(`Found ${primaryImages.length} primary images (should be 1)`);
      return false;
    }
  } else {
    log.error('Failed to verify primary images');
    return false;
  }
}

// Test 10: Reorder images
async function testReorderImages() {
  log.test('Test 10: Reorder Images');
  const imageOrders = [
    { id: testImageIds[3], display_order: 0 },
    { id: testImageIds[2], display_order: 1 },
    { id: testImageIds[1], display_order: 2 },
    { id: testImageIds[0], display_order: 3 },
  ];

  const result = await makeRequest('put', `/products/${testProductId}/images/reorder`, {
    imageOrders,
  });

  if (result.success) {
    log.success('Images reordered successfully');
    console.log('Reordered images:', result.data.data);
    return true;
  } else {
    log.error('Failed to reorder images');
    console.log(result.error);
    return false;
  }
}

// Test 11: Verify image order
async function testVerifyOrder() {
  log.test('Test 11: Verify Image Order');
  const result = await makeRequest('get', `/products/${testProductId}/images`);

  if (result.success && Array.isArray(result.data.data)) {
    log.success('Image order retrieved');
    result.data.data.forEach((img, idx) => {
      console.log(
        `Position ${idx + 1}: ID=${img.id}, display_order=${img.display_order}, is_primary=${
          img.is_primary
        }`
      );
    });
    return true;
  } else {
    log.error('Failed to verify order');
    return false;
  }
}

// Test 12: Delete an image
async function testDeleteImage() {
  log.test('Test 12: Delete Image');
  const imageId = testImageIds[1]; // Delete second image
  const result = await makeRequest('delete', `/products/${testProductId}/images/${imageId}`);

  if (result.success) {
    log.success('Image deleted successfully');
    return true;
  } else {
    log.error('Failed to delete image');
    console.log(result.error);
    return false;
  }
}

// Test 13: Verify image deleted
async function testVerifyDeleted() {
  log.test('Test 13: Verify Image Deleted');
  const result = await makeRequest('get', `/products/${testProductId}/images`);

  if (result.success && Array.isArray(result.data.data)) {
    const deletedImageExists = result.data.data.find((img) => img.id === testImageIds[1]);
    if (!deletedImageExists) {
      log.success('Deleted image is not in the list (as expected)');
      console.log(`Remaining images: ${result.data.data.length}`);
      return true;
    } else {
      log.error('Deleted image still exists');
      return false;
    }
  } else {
    log.error('Failed to verify deletion');
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
  console.log('🖼️  Product Images API Test Suite');
  console.log('='.repeat(60) + '\n');

  const tests = [
    testLogin,
    createTestProduct,
    testCreatePrimaryImage,
    testCreateGalleryImages,
    testGetImages,
    testGetSingleImage,
    testUpdateImage,
    testSetPrimaryImage,
    testVerifyOnePrimary,
    testReorderImages,
    testVerifyOrder,
    testDeleteImage,
    testVerifyDeleted,
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
