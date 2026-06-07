import axios from 'axios';

const test = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@vaizai.com',
      // role:"Admin",
      password: 'password123'
    });
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.log('Error Status:', err.response?.status);
    console.log('Error Data:', JSON.stringify(err.response?.data, null, 2));
  }
};

test();
