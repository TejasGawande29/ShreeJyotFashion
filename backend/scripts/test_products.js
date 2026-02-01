/**
 * Test script for Product API endpoints
 * Run with: node backend/scripts/test_products.js
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 5000;
const BASE_URL = `/api/products`;
const CATEGORY_URL = '/api/categories';
const AUTH_URL = '/api/auth/login';

let adminToken = '';
let categoryId = null;
let createdProductId = null;

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
 * Test 2: Create a test category first
 */
async function testCreateCategory() {
  console.log('\n========================================');
  console.log('TEST 2: Create Test Category');
  console.log('========================================');

  const newCategory = {
    name: 'Wedding Collection',
    description: 'Premium wedding wear',
    is_active: true,
  };

  try {
    const response = await makeRequest('POST', CATEGORY_URL, newCategory, adminToken);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 201 && response.body.success) {
      categoryId = response.body.data.id;
      console.log('✅ Category created successfully. ID:', categoryId);
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
 * Test 3: Create a new product (admin only)
 */
async function testCreateProduct() {
  console.log('\n========================================');
  console.log('TEST 3: Create Product');
  console.log('========================================');

  if (!categoryId) {
    console.log('⚠️ Skipping: No category created');
    return false;
  }

  const newProduct = {
    name: 'Royal Wedding Lehenga',
    category_id: categoryId,
    brand: 'Shreejyot Exclusive',
    description: 'Exquisite handcrafted wedding lehenga with intricate embroidery',
    short_description: 'Premium wedding lehenga with beautiful embroidery work',
    base_price: 45000.00,
    sale_price: 39999.00,
    is_sale: true,
    is_featured: true,
    stock_quantity: 5,
    material: 'Silk with zari work',
    care_instructions: 'Dry clean only',
    meta_title: 'Royal Wedding Lehenga - Shreejyot Fashion',
    meta_description: 'Buy premium wedding lehenga online',
  };

  try {
    const response = await makeRequest('POST', BASE_URL, newProduct, adminToken);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 201 && response.body.success) {
      createdProductId = response.body.data.id;
      console.log('✅ Product created successfully. ID:', createdProductId);
      return true;
    } else {
      console.log('❌ Product creation failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 4: Get all products (public)
 */
async function testGetAllProducts() {
  console.log('\n========================================');
  console.log('TEST 4: Get All Products');
  console.log('========================================');

  try {
    const response = await makeRequest('GET', `${BASE_URL}?page=1&limit=10`);

    console.log('Status:', response.statusCode);
    console.log('Products count:', response.body.data?.products?.length || 0);
    console.log('Total:', response.body.data?.pagination?.total || 0);

    if (response.statusCode === 200 && response.body.success) {
      console.log('Pagination:', JSON.stringify(response.body.data?.pagination, null, 2));
      console.log('✅ Retrieved all products successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve products');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 5: Get products with filters
 */
async function testGetProductsWithFilters() {
  console.log('\n========================================');
  console.log('TEST 5: Get Products with Filters');
  console.log('========================================');

  if (!categoryId) {
    console.log('⚠️ Skipping: No category created');
    return false;
  }

  try {
    const response = await makeRequest('GET', `${BASE_URL}?category_id=${categoryId}&is_sale=true&min_price=30000&max_price=50000`);

    console.log('Status:', response.statusCode);
    console.log('Filtered products count:', response.body.data?.products?.length || 0);

    if (response.statusCode === 200 && response.body.success) {
      console.log('Products:', JSON.stringify(response.body.data?.products, null, 2));
      console.log('✅ Retrieved filtered products successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve filtered products');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 6: Search products
 */
async function testSearchProducts() {
  console.log('\n========================================');
  console.log('TEST 6: Search Products');
  console.log('========================================');

  try {
    const response = await makeRequest('GET', `${BASE_URL}/search?q=wedding`);

    console.log('Status:', response.statusCode);
    console.log('Search results count:', response.body.data?.length || 0);

    if (response.statusCode === 200 && response.body.success) {
      const results = response.body.data || [];
      if (Array.isArray(results)) {
        console.log('Results:', JSON.stringify(results.slice(0, 2), null, 2));
      } else {
        console.log('Results:', JSON.stringify(results, null, 2));
      }
      console.log('✅ Product search successful');
      return true;
    } else {
      console.log('❌ Product search failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 7: Get featured products
 */
async function testGetFeaturedProducts() {
  console.log('\n========================================');
  console.log('TEST 7: Get Featured Products');
  console.log('========================================');

  try {
    const response = await makeRequest('GET', `${BASE_URL}/featured?limit=5`);

    console.log('Status:', response.statusCode);
    console.log('Featured products count:', response.body.data?.length || 0);

    if (response.statusCode === 200 && response.body.success) {
      console.log('Featured products:', JSON.stringify(response.body.data, null, 2));
      console.log('✅ Retrieved featured products successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve featured products');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 8: Get product by ID (public)
 */
async function testGetProductById() {
  console.log('\n========================================');
  console.log('TEST 8: Get Product by ID');
  console.log('========================================');

  if (!createdProductId) {
    console.log('⚠️ Skipping: No product created');
    return false;
  }

  try {
    const response = await makeRequest('GET', `${BASE_URL}/${createdProductId}`);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Retrieved product by ID successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve product');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 9: Get product by slug (public)
 */
async function testGetProductBySlug() {
  console.log('\n========================================');
  console.log('TEST 9: Get Product by Slug');
  console.log('========================================');

  const slug = 'royal-wedding-lehenga';

  try {
    const response = await makeRequest('GET', `${BASE_URL}/${slug}`);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Retrieved product by slug successfully');
      return true;
    } else {
      console.log('❌ Failed to retrieve product by slug');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 10: Update product (admin only)
 */
async function testUpdateProduct() {
  console.log('\n========================================');
  console.log('TEST 10: Update Product');
  console.log('========================================');

  if (!createdProductId) {
    console.log('⚠️ Skipping: No product created');
    return false;
  }

  const updateData = {
    sale_price: 37999.00,
    stock_quantity: 10,
    is_featured: true,
  };

  try {
    const response = await makeRequest('PUT', `${BASE_URL}/${createdProductId}`, updateData, adminToken);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Product updated successfully');
      return true;
    } else {
      console.log('❌ Failed to update product');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 11: Try to create product without authentication
 */
async function testUnauthorizedCreate() {
  console.log('\n========================================');
  console.log('TEST 11: Unauthorized Product Creation');
  console.log('========================================');

  const newProduct = {
    name: 'Test Product',
    category_id: 1,
    base_price: 1000,
  };

  try {
    const response = await makeRequest('POST', BASE_URL, newProduct);

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
 * Test 12: Delete product (admin only)
 */
async function testDeleteProduct() {
  console.log('\n========================================');
  console.log('TEST 12: Delete Product');
  console.log('========================================');

  if (!createdProductId) {
    console.log('⚠️ Skipping: No product created');
    return false;
  }

  try {
    const response = await makeRequest('DELETE', `${BASE_URL}/${createdProductId}`, null, adminToken);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Product deleted successfully');
      return true;
    } else {
      console.log('❌ Failed to delete product');
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
  console.log('║   Product API Test Suite               ║');
  console.log('╚════════════════════════════════════════╝');

  const results = {
    passed: 0,
    failed: 0,
    total: 12,
  };

  // Run tests in sequence
  if (await testAdminLogin()) results.passed++; else results.failed++;
  if (await testCreateCategory()) results.passed++; else results.failed++;
  if (await testCreateProduct()) results.passed++; else results.failed++;
  if (await testGetAllProducts()) results.passed++; else results.failed++;
  if (await testGetProductsWithFilters()) results.passed++; else results.failed++;
  if (await testSearchProducts()) results.passed++; else results.failed++;
  if (await testGetFeaturedProducts()) results.passed++; else results.failed++;
  if (await testGetProductById()) results.passed++; else results.failed++;
  if (await testGetProductBySlug()) results.passed++; else results.failed++;
  if (await testUpdateProduct()) results.passed++; else results.failed++;
  if (await testUnauthorizedCreate()) results.passed++; else results.failed++;
  if (await testDeleteProduct()) results.passed++; else results.failed++;

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
