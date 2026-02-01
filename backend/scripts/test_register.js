// Test registration endpoint directly
const http = require('http');

const data = JSON.stringify({
  email: 'test.user@example.com',
  phone: '+919876543210',
  password: 'SecurePass@123',
  confirmPassword: 'SecurePass@123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testing registration endpoint...');
console.log('URL: http://localhost:5000/api/auth/register');

const req = http.request(options, (res) => {
  console.log(`\nStatus Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      console.log(JSON.stringify(JSON.parse(body), null, 2));
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
