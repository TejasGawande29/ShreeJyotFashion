// Test health endpoint
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET'
};

console.log('Testing health endpoint...');
console.log('URL: http://localhost:5000/health\n');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('\nResponse:');
    try {
      const parsed = JSON.parse(body);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.status === 'ok') {
        console.log('\n✅ Server is healthy!');
      }
    } catch (e) {
      console.log(body);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request Error:', error.message);
});

req.end();
