const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

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

// Test 2: Get CSV template
async function testGetCSVTemplate() {
  log.test('Test 2: Get CSV Template');
  const result = await makeRequest('get', '/products/bulk/template/csv');

  if (result.success) {
    log.success('CSV template retrieved successfully');
    console.log('Template preview (first 200 chars):');
    console.log(typeof result.data === 'string' ? result.data.substring(0, 200) : result.data);
    return true;
  } else {
    log.error('Failed to get CSV template');
    console.log(result.error);
    return false;
  }
}

// Test 3: Get JSON template
async function testGetJSONTemplate() {
  log.test('Test 3: Get JSON Template');
  const result = await makeRequest('get', '/products/bulk/template/json');

  if (result.success && result.data.data) {
    log.success('JSON template retrieved successfully');
    console.log('Template items:', result.data.data.length);
    console.log('First item:', JSON.stringify(result.data.data[0], null, 2));
    return true;
  } else {
    log.error('Failed to get JSON template');
    console.log(result.error);
    return false;
  }
}

// Test 4: Import products from JSON
async function testImportJSON() {
  log.test('Test 4: Import Products from JSON');
  const products = [
    {
      name: 'Bulk Import Lehenga 1',
      description: 'Beautiful wedding lehenga imported via JSON',
      price: 30000,
      discount_price: 27000,
      category_id: 1,
      sku: 'BULK-JSON-001',
      stock_quantity: 15,
      is_featured: true,
      is_active: true,
      tags: 'wedding,bulk-import',
      variant_size: 'Medium',
      variant_color: 'Gold',
      variant_color_code: '#FFD700',
      variant_stock: 10,
      variant_sku: 'BULK-JSON-001-M-GOLD',
      image_url: 'https://example.com/bulk-lehenga-1.jpg',
      image_type: 'primary',
      image_alt_text: 'Bulk Import Lehenga Gold',
    },
    {
      name: 'Bulk Import Saree 1',
      description: 'Elegant silk saree imported via JSON',
      price: 18000,
      category_id: 2,
      sku: 'BULK-JSON-002',
      stock_quantity: 25,
      is_featured: false,
      is_active: true,
      tags: 'silk,bulk-import',
    },
    {
      name: 'Bulk Import Suit 1',
      description: 'Designer suit imported via JSON',
      price: 12000,
      discount_price: 10000,
      category_id: 3,
      sku: 'BULK-JSON-003',
      stock_quantity: 20,
      is_active: true,
    },
  ];

  const result = await makeRequest('post', '/products/bulk/import/json', { products });

  if (result.success) {
    log.success('Products imported from JSON successfully');
    console.log('Import result:', {
      total: result.data.data.total,
      imported: result.data.data.imported,
      skipped: result.data.data.skipped,
      errors: result.data.data.errors.length,
    });
    if (result.data.data.errors.length > 0) {
      console.log('Errors:', result.data.data.errors);
    }
    return result.data.data.imported > 0;
  } else {
    log.error('Failed to import products from JSON');
    console.log(result.error);
    return false;
  }
}

// Test 5: Import products from CSV
async function testImportCSV() {
  log.test('Test 5: Import Products from CSV');
  const csvData = `name,description,price,discount_price,category_id,sku,stock_quantity,is_featured,is_active,tags,variant_size,variant_color,variant_color_code,variant_stock,variant_sku,image_url,image_type,image_alt_text
Bulk Import Lehenga 2,Red bridal lehenga via CSV,28000,25000,1,BULK-CSV-001,12,true,true,"bridal,red,bulk-import",Large,Red,#FF0000,8,BULK-CSV-001-L-RED,https://example.com/bulk-lehenga-2.jpg,primary,Bulk Lehenga Red
Bulk Import Saree 2,Cotton saree via CSV,8000,,2,BULK-CSV-002,30,false,true,"cotton,bulk-import",,,,,,,
Bulk Import Kurta,Designer kurta via CSV,5000,4500,4,BULK-CSV-003,40,false,true,"kurta,bulk-import",,,,,,https://example.com/kurta.jpg,gallery,Designer Kurta`;

  const result = await makeRequest('post', '/products/bulk/import/csv', { csvData });

  if (result.success) {
    log.success('Products imported from CSV successfully');
    console.log('Import result:', {
      total: result.data.data.total,
      imported: result.data.data.imported,
      skipped: result.data.data.skipped,
      errors: result.data.data.errors.length,
    });
    if (result.data.data.errors.length > 0) {
      console.log('Errors:', result.data.data.errors);
    }
    return result.data.data.imported > 0;
  } else {
    log.error('Failed to import products from CSV');
    console.log(result.error);
    return false;
  }
}

// Test 6: Test duplicate SKU handling
async function testDuplicateImport() {
  log.test('Test 6: Test Duplicate SKU Handling');
  const products = [
    {
      name: 'Duplicate Product',
      price: 10000,
      sku: 'BULK-JSON-001', // This SKU already exists from Test 4
    },
  ];

  const result = await makeRequest('post', '/products/bulk/import/json', { products });

  if (result.success && result.data.data.skipped > 0) {
    log.success('Duplicate SKU correctly rejected');
    console.log('Import result:', result.data.data);
    return true;
  } else {
    log.error('Duplicate SKU should have been rejected');
    console.log(result);
    return false;
  }
}

// Test 7: Export products to JSON
async function testExportJSON() {
  log.test('Test 7: Export Products to JSON');
  const result = await makeRequest('get', '/products/bulk/export/json');

  if (result.success && result.data.data) {
    log.success(`Exported ${result.data.count} products to JSON`);
    console.log('First exported product:', JSON.stringify(result.data.data[0], null, 2));
    return true;
  } else {
    log.error('Failed to export products to JSON');
    console.log(result.error);
    return false;
  }
}

// Test 8: Export products to CSV
async function testExportCSV() {
  log.test('Test 8: Export Products to CSV');
  
  try {
    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/products/bulk/export/csv`,
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data && typeof response.data === 'string') {
      const lines = response.data.split('\n');
      log.success(`Exported products to CSV (${lines.length} lines including header)`);
      console.log('CSV header:', lines[0]);
      console.log('First data row:', lines[1]);
      return true;
    } else {
      log.error('CSV export did not return string data');
      return false;
    }
  } catch (error) {
    log.error('Failed to export products to CSV');
    console.log(error.message);
    return false;
  }
}

// Test 9: Export with filters (category)
async function testExportWithFilters() {
  log.test('Test 9: Export with Category Filter');
  const result = await makeRequest('get', '/products/bulk/export/json?categoryId=1');

  if (result.success && result.data.data) {
    log.success(`Exported ${result.data.count} products from category 1`);
    // Verify all products are from category 1
    const allFromCategory = result.data.data.every((p) => p.category_id === 1);
    if (allFromCategory) {
      log.success('All exported products are from the correct category');
    } else {
      log.warn('Some products are not from the specified category');
    }
    return true;
  } else {
    log.error('Failed to export with category filter');
    console.log(result.error);
    return false;
  }
}

// Test 10: Export with variants included
async function testExportWithVariants() {
  log.test('Test 10: Export with Variants Included');
  const result = await makeRequest('get', '/products/bulk/export/json?includeVariants=true');

  if (result.success && result.data.data) {
    log.success(`Exported ${result.data.count} product/variant combinations`);
    // Check if any have variant data
    const withVariants = result.data.data.filter((p) => p.variant_id);
    console.log(`Products with variants: ${withVariants.length}`);
    if (withVariants.length > 0) {
      console.log('Sample variant data:', {
        variant_id: withVariants[0].variant_id,
        variant_size: withVariants[0].variant_size,
        variant_color: withVariants[0].variant_color,
      });
    }
    return true;
  } else {
    log.error('Failed to export with variants');
    console.log(result.error);
    return false;
  }
}

// Test 11: Cleanup - Delete bulk imported products
async function cleanupBulkProducts() {
  log.test('Test 11: Cleanup - Delete Bulk Imported Products');
  
  // Get all products
  const result = await makeRequest('get', '/products?limit=100');
  
  if (result.success && result.data.data?.products) {
    const bulkProducts = result.data.data.products.filter(
      (p) => p.sku && (p.sku.startsWith('BULK-JSON-') || p.sku.startsWith('BULK-CSV-'))
    );
    
    log.info(`Found ${bulkProducts.length} bulk imported products to delete`);
    
    let deleted = 0;
    for (const product of bulkProducts) {
      const delResult = await makeRequest('delete', `/products/${product.id}`);
      if (delResult.success) {
        deleted++;
      }
    }
    
    log.success(`Cleaned up ${deleted} bulk imported products`);
    return deleted === bulkProducts.length;
  } else {
    log.warn('Failed to cleanup bulk products');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('📦 Bulk Import/Export API Test Suite');
  console.log('='.repeat(60) + '\n');

  const tests = [
    testLogin,
    testGetCSVTemplate,
    testGetJSONTemplate,
    testImportJSON,
    testImportCSV,
    testDuplicateImport,
    testExportJSON,
    testExportCSV,
    testExportWithFilters,
    testExportWithVariants,
    cleanupBulkProducts,
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
