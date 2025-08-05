const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: responseData
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

// Test functions
async function testHealthCheck() {
  console.log('\n=== Testing Health Check ===');
  try {
    const result = await makeRequest('GET', '/health');
    console.log('Status:', result.statusCode);
    console.log('Response:', result.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testApiTest() {
  console.log('\n=== Testing API Test Endpoint ===');
  try {
    const result = await makeRequest('GET', '/api/test');
    console.log('Status:', result.statusCode);
    console.log('Response:', result.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testPublicEndpoints() {
  console.log('\n=== Testing Public Endpoints ===');
  
  const endpoints = [
    '/api/public/foundations',
    '/api/public/item-categories',
    '/api/public/wishlist-items',
    '/api/public/content-pages'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting: ${endpoint}`);
      const result = await makeRequest('GET', endpoint);
      console.log('Status:', result.statusCode);
      console.log('Response:', result.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

async function testAuthEndpoints() {
  console.log('\n=== Testing Auth Endpoints ===');
  
  // Test registration
  try {
    console.log('\nTesting Registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    const result = await makeRequest('POST', '/api/auth/register', registerData);
    console.log('Status:', result.statusCode);
    console.log('Response:', result.data);
  } catch (error) {
    console.error('Registration Error:', error.message);
  }

  // Test login
  try {
    console.log('\nTesting Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    const result = await makeRequest('POST', '/api/auth/login', loginData);
    console.log('Status:', result.statusCode);
    console.log('Response:', result.data);
  } catch (error) {
    console.error('Login Error:', error.message);
  }
}

async function testInvalidEndpoint() {
  console.log('\n=== Testing Invalid Endpoint ===');
  try {
    const result = await makeRequest('GET', '/api/invalid-endpoint');
    console.log('Status:', result.statusCode);
    console.log('Response:', result.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Tests...');
  console.log(`Base URL: ${BASE_URL}`);
  
  await testHealthCheck();
  await testApiTest();
  await testPublicEndpoints();
  await testAuthEndpoints();
  await testInvalidEndpoint();
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  makeRequest,
  testHealthCheck,
  testApiTest,
  testPublicEndpoints,
  testAuthEndpoints,
  testInvalidEndpoint,
  runAllTests
}; 