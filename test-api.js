const axios = require('axios');

const API_URL = 'http://localhost:8080/api/admin/foundation-types';

const testApi = async () => {
  try {
    // Test GET all foundation types
    console.log('Testing GET /api/admin/foundation-types');
    const getAllResponse = await axios.get(API_URL);
    console.log('Response:', getAllResponse.data);

    // Test POST a new foundation type
    console.log('\nTesting POST /api/admin/foundation-types');
    const newFoundationType = {
      name: 'Test Foundation Type',
      description: 'This is a test foundation type.',
    };
    const createResponse = await axios.post(API_URL, newFoundationType);
    console.log('Response:', createResponse.data);
    const createdId = createResponse.data.data.id;

    // Test GET a single foundation type
    console.log(`\nTesting GET /api/admin/foundation-types/${createdId}`);
    const getOneResponse = await axios.get(`${API_URL}/${createdId}`);
    console.log('Response:', getOneResponse.data);

    // Test PUT (update) a foundation type
    console.log(`\nTesting PUT /api/admin/foundation-types/${createdId}`);
    const updatedFoundationType = {
      name: 'Updated Test Foundation Type',
      description: 'This is an updated test foundation type.',
    };
    const updateResponse = await axios.put(`${API_URL}/${createdId}`, updatedFoundationType);
    console.log('Response:', updateResponse.data);

    // Test DELETE a foundation type
    console.log(`\nTesting DELETE /api/admin/foundation-types/${createdId}`);
    const deleteResponse = await axios.delete(`${API_URL}/${createdId}`);
    console.log('Response status:', deleteResponse.status);

    console.log('\nAPI tests completed successfully!');
  } catch (error) {
    console.error('\nAPI test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testApi();