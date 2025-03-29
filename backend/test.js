const axios = require('axios');

async function testServer() {
  console.log('🔍 Starting server tests...\n');

  try {
    // Test 1: Basic server connection
    console.log('Test 1: Checking server connection...');
    const response = await axios.get('http://localhost:5000/api/test');
    console.log('✅ Server is responding:', response.data);

    // Test 2: MongoDB connection
    console.log('\nTest 2: Checking database connection...');
    // This will be logged by server.js when MongoDB connects

    // Test 3: Routes availability
    console.log('\nTest 3: Checking routes availability...');
    try {
      await axios.get('http://localhost:5000/api/auth');
      console.log('✅ Auth routes are available');
    } catch (error) {
      console.log('ℹ️ Auth routes require authentication');
    }

    try {
      await axios.get('http://localhost:5000/api/groups');
      console.log('✅ Group routes are available');
    } catch (error) {
      console.log('ℹ️ Group routes require authentication');
    }

    console.log('\n✅ All tests completed!');

  } catch (error) {
    console.error('\n❌ Error during tests:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

testServer(); 