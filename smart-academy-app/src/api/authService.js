import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const USER_DATA_KEY = 'smartAcademyUser';

const storeUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

const getStoredUserData = () => {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data && response.data.access_token) {
    // Store essential user info along with the token
    // The login response (memory 4960e8d5-69db-46dc-9607-7fee4f31a585) includes:
    // access_token, token_type, user_id, email, full_name, role, is_superuser
    storeUserData(response.data);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem(USER_DATA_KEY);
  // Optionally, redirect to login or inform other parts of the app
};

const getAuthToken = () => {
  const userData = getStoredUserData();
  return userData ? userData.access_token : null;
};

const getCurrentUser = async () => {
  const token = getAuthToken();
  if (!token) {
    // console.log('No token found, cannot fetch current user.');
    return null;
  }
  try {
    const response = await axios.get(`${API_URL}/auth/me`, { // Corrected endpoint
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // The /me endpoint (memory d0233670-a65d-4693-9ecb-cb417bd5a49e) returns user details.
    // We should ensure the stored user data is updated/consistent with this response.
    // For now, let's assume the login response is the primary source of truth for is_superuser and role stored initially.
    // This function primarily validates the token and fetches fresh profile data.
    return response.data; 
  } catch (error) {
    console.error('Error fetching current user:', error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token might be invalid or expired, clear stored data
      logout();
    }
    return null;
  }
};

const registerAdmin = async (adminData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found.');
  }
  try {
    const response = await axios.post(`${API_URL}/auth/register-admin`, adminData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Should be UserResponse
  } catch (error) {
    console.error('Error registering admin:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Admin registration failed');
  }
};

export { login, logout, getCurrentUser, getAuthToken, getStoredUserData, registerAdmin };
