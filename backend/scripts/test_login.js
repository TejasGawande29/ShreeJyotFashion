// Test login endpoint directly
const http = require('http');

const data = JSON.stringify({
  email: 'test.user@example.com',
  password: 'SecurePass@123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testing login endpoint...');
console.log('URL: http://localhost:5000/api/auth/login');
console.log('Email: test.user@example.com');

const req = http.request(options, (res) => {
  console.log(`\nStatus Code: ${res.statusCode}`);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const parsed = JSON.parse(body);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.success) {
        console.log('\n✅ Login successful!');
        console.log('Access Token:', parsed.data.accessToken.substring(0, 50) + '...');
        console.log('Refresh Token:', parsed.data.refreshToken.substring(0, 50) + '...');
      }
    } catch (e) {
      console.log(body);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request Error:', error.message);
  console.error('Full error:', error);
});

req.write(data);
req.end();
