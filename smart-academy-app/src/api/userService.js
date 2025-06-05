import axios from 'axios';
import { getAuthToken } from './authService.js'; // Import getAuthToken

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const getTokenConfig = () => {
  const token = getAuthToken(); // Use getAuthToken from authService
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  // Consider how to handle missing token: throw error or let API call fail?
  // For now, returning empty config which will likely lead to 401/403 if token is required.
  return {}; 
};

export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/`, getTokenConfig());
  return response.data;
};

export const createUser = async (userData) => {
  // userData debe incluir: email, password, full_name, role (string, e.g., 'STUDENT', 'TEACHER')
  const response = await axios.post(`${API_BASE_URL}/users/`, userData, getTokenConfig());
  return response.data;
};

export const getRoles = async () => {
  const response = await axios.get(`${API_BASE_URL}/roles/`, getTokenConfig());
  return response.data;
};

export const updateUser = async (userId, userData) => {
  // userData should include fields to be updated, e.g., { full_name, email, role_id, is_active }
  const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, getTokenConfig());
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, getTokenConfig());
  return response.data; // Or handle as needed, often DELETE requests return 204 No Content
};
