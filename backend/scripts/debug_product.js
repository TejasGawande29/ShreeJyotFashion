const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testProductCreation() {
  try {
    // Login
    console.log('1. Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@shreejyot.com',
      password: 'Admin@123',
    });
    
    const token = loginRes.data.data.accessToken;
    console.log('✓ Logged in successfully\n');

    // Try creating product
    console.log('2. Creating product...');
    const timestamp = Date.now();
    
    const productRes = await axios.post(
      `${BASE_URL}/products`,
      {
        name: 'Test Product',
        description: 'Test description',
        base_price: 1000,
        category_id: 1,
        sku: `TEST-${timestamp}`,
        is_sale: true,
        is_rental: false,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log('✓ Product created successfully');
    console.log('Product ID:', productRes.data.data.id);
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
  }
}

testProductCreation();
