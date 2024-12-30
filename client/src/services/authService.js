import api from '../api.js';

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authorization required.');
  }
  return token;
};

export const handleRegister = async (username, password, fullName, setError, navigate) => {
  try {
    const registerResponse = await api.post('/register', {
      username,
      password,
      full_name: fullName,
    });
    console.log('Registration successful', registerResponse.data);

    const loginResponse = await api.post(
      '/login',
      new URLSearchParams({ username, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    localStorage.setItem('token', loginResponse.data.access_token);
    console.log('Token saved');

    navigate('/shorten');
  } catch (err) {
    setError('This login is already taken or another error occurred');
    console.error('Error during registration:', err);
  }
};

export const loginUser = async (username, password, setError, navigate) => {
  try {
    const response = await api.post(
      '/login',
      new URLSearchParams({ username, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    localStorage.setItem('token', response.data.access_token);
    console.log('Login successful');
    navigate('/shorten');
    return response.data;
  } catch (err) {
    setError('Invalid login or password');
    console.error('Error during login:', err);
  }
};

export const shortenUrl = async (url) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    };

    const response = await api.post('/me/urls', { url }, { headers });

    console.log('URL shortened:', response.data.short);
    return response.data;
  } catch (err) {
    console.error('Error during URL shortening:', err.response || err.message);
    throw err;
  }
};

export const getUserUrls = async () => {
  try {
    const headers = { Authorization: `Bearer ${getToken()}` };
    const response = await api.get('/me/urls', { headers });
    return response.data;
  } catch (err) {
    console.error('Failed to fetch URL:', err);
    throw err;
  }
};

export const getUserName = async () => {
  try {
    const headers = { Authorization: `Bearer ${getToken()}` };
    const response = await api.get('/me', { headers });
    return response.data;
  } catch (err) {
    console.error('Failed to fetch user name:', err);
    throw err;
  }
};

export const fetchLinkRedirects = async (short) => {
  try {
    const headers = { Authorization: `Bearer ${getToken()}` };
    const response = await api.get(`/me/links/${short}/redirects`, { headers });

    console.log('Redirect data:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('Error fetching redirects:', err);
    throw err;
  }
};
