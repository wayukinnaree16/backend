const axios = require('axios');

// Test rejecting foundation
async function testRejectFoundation() {
  try {
    console.log('Testing foundation rejection...');
    
    // First, let's try to get a valid admin token
    // For testing, we'll use a direct API call
    const rejectData = {
      verification_notes: 'ดกเกดเกหดหฟดหกดหกดหกดดเ' // Same rejection reason from the error
    };
    
    console.log('Sending rejection request with data:', rejectData);
    
    const response = await axios.patch(
      'https://backend-lcjt.onrender.comapi/admin/foundations/900000005/reject-account',
      rejectData,
      {
        headers: {
          'Content-Type': 'application/json',
          // We need to add proper authorization header
          // For now, let's see what happens without it
        }
      }
    );
    
    console.log('Success:', response.data);
    
  } catch (error) {
    console.log('Error details:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Response Data:', error.response?.data);
    console.log('Request Data:', error.config?.data);
  }
}

testRejectFoundation();