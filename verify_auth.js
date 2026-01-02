const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function run() {
  try {
    // 1. Create a dynamic user
    const timestamp = Date.now();
    const user = {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123'
    };

    console.log('1. Registering user...');
    const registerRes = await axios.post(`${BASE_URL}/users`, user);
    console.log('Registration successful:', registerRes.status);
    const userId = registerRes.data._id;
    const token = registerRes.data.token;
    console.log('Token received:', token ? 'Yes' : 'No');

    // 2. Access protected route with valid token
    console.log('\n2. Accessing protected route WITH Bearer token...');
    try {
      const protectedRes = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Access successful:', protectedRes.status);
      console.log('User data retrieved:', protectedRes.data.email);
    } catch (err) {
      console.error('Access failed:', err.response ? err.response.data : err.message);
    }

    // 3. Access protected route WITHOUT Bearer prefix (Simulating common mistake)
    console.log('\n3. Accessing protected route WITHOUT Bearer prefix...');
    try {
      await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: token // Wrong format
        }
      });
    } catch (err) {
      console.log('Expected failure:', err.response ? err.response.data : err.message);
    }

  } catch (err) {
    console.error('Unexpected error:', err.response ? err.response.data : err.message);
  }
}

run();
