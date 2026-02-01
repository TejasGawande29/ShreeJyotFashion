// Test protected /me endpoint with authentication
const http = require('http');

// First, login to get a token
const loginData = JSON.stringify({
  email: 'test.user@example.com',
  password: 'SecurePass@123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('Step 1: Login to get access token...\n');

const loginReq = http.request(loginOptions, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      const loginResponse = JSON.parse(body);
      
      if (loginResponse.success) {
        const accessToken = loginResponse.data.accessToken;
        console.log('✅ Login successful!');
        console.log('Access Token:', accessToken.substring(0, 50) + '...\n');
        
        // Now test the /me endpoint with the token
        console.log('Step 2: Testing /api/auth/me with token...\n');
        testMeEndpoint(accessToken);
      } else {
        console.error('❌ Login failed:', loginResponse.message);
      }
    } catch (e) {
      console.error('Error parsing login response:', e.message);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('❌ Login request error:', error.message);
});

loginReq.write(loginData);
loginReq.end();

// Function to test /me endpoint
function testMeEndpoint(token) {
  const meOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const meReq = http.request(meOptions, (res) => {
    console.log(`Status Code: ${res.statusCode}\n`);

    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      console.log('Response:');
      try {
        const parsed = JSON.parse(body);
        console.log(JSON.stringify(parsed, null, 2));
        
        if (parsed.success) {
          console.log('\n✅ Protected route works!');
          console.log('User ID:', parsed.data.id);
          console.log('Email:', parsed.data.email);
          console.log('Role:', parsed.data.role);
        } else {
          console.log('\n❌ Request failed:', parsed.message);
        }
      } catch (e) {
        console.log(body);
      }
    });
  });

  meReq.on('error', (error) => {
    console.error('❌ /me request error:', error.message);
  });

  meReq.end();
}

// Also test without token (should fail)
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  console.log('Step 3: Testing /api/auth/me WITHOUT token (should fail)...\n');
  
  const noTokenOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET'
  };

  const noTokenReq = http.request(noTokenOptions, (res) => {
    console.log(`Status Code: ${res.statusCode}\n`);

    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      console.log('Response:');
      try {
        const parsed = JSON.parse(body);
        console.log(JSON.stringify(parsed, null, 2));
        
        if (res.statusCode === 401) {
          console.log('\n✅ Correctly rejected unauthorized request!');
        }
      } catch (e) {
        console.log(body);
      }
    });
  });

  noTokenReq.on('error', (error) => {
    console.error('❌ Request error:', error.message);
  });

  noTokenReq.end();
}, 2000);
