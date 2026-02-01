/**
 * Test script for Category API endpoints
 * Run with: node backend/scripts/test_categories.js
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 5000;
const BASE_URL = `/api/categories`;
const AUTH_URL = '/api/auth/login';

let adminToken = '';
let createdCategoryId = null;

/**
 * Make HTTP request
 */
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body),
          };
          resolve(response);
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Test 1: Login as admin to get token
 */
async function testAdminLogin() {
  console.log('\n========================================');
  console.log('TEST 1: Admin Login');
  console.log('========================================');

  try {
    const response = await makeRequest('POST', AUTH_URL, {
      email: 'admin@shreejyot.com',
      password: 'Admin@123',
    });

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.data?.accessToken) {
      adminToken = response.body.data.accessToken;
      console.log('✅ Admin login successful');
      return true;
    } else {
      console.log('❌ Admin login failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 2: Create a new category (admin only)
 */
async function testCreateCategory() {
  console.log('\n========================================');
  console.log('TEST 2: Create Category');
  console.log('========================================');

  const newCategory = {
    name: 'Women\'s Ethnic Wear',
    description: 'Traditional and ethnic clothing for women',
    display_order: 1,
    is_active: true,
    meta_title: 'Women\'s Ethnic Wear - Shreejyot Fashion',
    meta_description: 'Explore our collection of traditional ethnic wear for women',
  };

  try {
    const response = await makeRequest('POST', BASE_URL, newCategory, adminToken);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 201 && response.body.success) {
      createdCategoryId = response.body.data.id;
      console.log('✅ Category created successfully. ID:', createdCategoryId);
      return true;
    } else {
      console.log('❌ Category creation failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 3: Create subcategory
 */
async function testCreateSubcategory() {
  console.log('\n========================================');
  console.log('TEST 3: Create Subcategory');
  console.log('========================================');

  if (!createdCategoryId) {
    console.log('⚠️ Skipping: No parent category created');
    return false;
  }

  const subcategory = {
    name: 'Lehengas',
    description: 'Beautiful designer lehengas',
    parent_id: createdCategoryId,
    display_order: 1,
    is_active: true,
  };

  try {
    const response = await makeRequest('POST', BASE_URL, subcategory, adminToken);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 201 && response.body.success) {
      console.log('✅ Subcategory created successfully');
      return true;
    } else {
      console.log('❌ Subcategory creation failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 4: Get all categories (public)
 */
async function testGetAllCategories() {
  console.log('\n========================================');
  console.log('TEST 4: Get All Categories');
  console.log('========================================');

  try {
    const response = await makeRequest('GET', BASE_URL);

    console.log('Status:', response.statusCode);
    console.log('Categories count:', response.body.data?.length || 0);

    if (response.statusCode === 200 && response.body.success) {
      console.log('First few categories:', JSON.stringify(response.body.data?.slice(0, 2), null, 2));
      console.log('✅ Retrieved all categories successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve categories');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 5: Get root categories (public)
 */
async function testGetRootCategories() {
  console.log('\n========================================');
  console.log('TEST 5: Get Root Categories');
  console.log('========================================');

  try {
    const response = await makeRequest('GET', `${BASE_URL}/roots`);

    console.log('Status:', response.statusCode);
    console.log('Root categories count:', response.body.data?.length || 0);

    if (response.statusCode === 200 && response.body.success) {
      console.log('Root categories:', JSON.stringify(response.body.data, null, 2));
      console.log('✅ Retrieved root categories successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve root categories');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 6: Get category by ID (public)
 */
async function testGetCategoryById() {
  console.log('\n========================================');
  console.log('TEST 6: Get Category by ID');
  console.log('========================================');

  if (!createdCategoryId) {
    console.log('⚠️ Skipping: No category created');
    return false;
  }

  try {
    const response = await makeRequest('GET', `${BASE_URL}/${createdCategoryId}`);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Retrieved category by ID successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve category');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 7: Get category by slug (public)
 */
async function testGetCategoryBySlug() {
  console.log('\n========================================');
  console.log('TEST 7: Get Category by Slug');
  console.log('========================================');

  const slug = 'womens-ethnic-wear';

  try {
    const response = await makeRequest('GET', `${BASE_URL}/${slug}`);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Retrieved category by slug successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve category by slug');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 8: Update category (admin only)
 */
async function testUpdateCategory() {
  console.log('\n========================================');
  console.log('TEST 8: Update Category');
  console.log('========================================');

  if (!createdCategoryId) {
    console.log('⚠️ Skipping: No category created');
    return false;
  }

  const updateData = {
    description: 'Updated: Premium traditional and ethnic clothing for women',
    display_order: 5,
  };

  try {
    const response = await makeRequest('PUT', `${BASE_URL}/${createdCategoryId}`, updateData, adminToken);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Category updated successfully');
      return true;
    } else {
      console.log('❌ Failed to update category');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 9: Try to create category without authentication
 */
async function testUnauthorizedCreate() {
  console.log('\n========================================');
  console.log('TEST 9: Unauthorized Category Creation');
  console.log('========================================');

  const newCategory = {
    name: 'Test Category',
    description: 'This should fail',
  };

  try {
    const response = await makeRequest('POST', BASE_URL, newCategory);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 401) {
      console.log('✅ Correctly rejected unauthorized request');
      return true;
    } else {
      console.log('❌ Should have rejected unauthorized request');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 10: Delete category (admin only)
 */
async function testDeleteCategory() {
  console.log('\n========================================');
  console.log('TEST 10: Delete Category');
  console.log('========================================');

  if (!createdCategoryId) {
    console.log('⚠️ Skipping: No category created');
    return false;
  }

  try {
    const response = await makeRequest('DELETE', `${BASE_URL}/${createdCategoryId}`, null, adminToken);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Category deleted successfully');
      return true;
    } else {
      console.log('❌ Failed to delete category');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Category API Test Suite              ║');
  console.log('╚════════════════════════════════════════╝');

  const results = {
    passed: 0,
    failed: 0,
    total: 10,
  };

  // Run tests in sequence
  if (await testAdminLogin()) results.passed++; else results.failed++;
  if (await testCreateCategory()) results.passed++; else results.failed++;
  if (await testCreateSubcategory()) results.passed++; else results.failed++;
  if (await testGetAllCategories()) results.passed++; else results.failed++;
  if (await testGetRootCategories()) results.passed++; else results.failed++;
  if (await testGetCategoryById()) results.passed++; else results.failed++;
  if (await testGetCategoryBySlug()) results.passed++; else results.failed++;
  if (await testUpdateCategory()) results.passed++; else results.failed++;
  if (await testUnauthorizedCreate()) results.passed++; else results.failed++;
  if (await testDeleteCategory()) results.passed++; else results.failed++;

  // Print summary
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   TEST SUMMARY                         ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);
  console.log(`Success rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('========================================\n');

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
