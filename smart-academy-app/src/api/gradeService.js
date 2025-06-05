import axios from 'axios';
import { getAuthToken } from './authService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const getTokenConfig = () => {
  const token = getAuthToken();
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

// Grades CRUD
export const getGrades = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/grades/`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

export const getGrade = async (gradeId) => {
  const response = await axios.get(`${API_BASE_URL}/grades/${gradeId}`, getTokenConfig());
  return response.data;
};

export const createGrade = async (gradeData) => {
  const response = await axios.post(`${API_BASE_URL}/grades/`, gradeData, getTokenConfig());
  return response.data;
};

export const updateGrade = async (gradeId, gradeData) => {
  const response = await axios.put(`${API_BASE_URL}/grades/${gradeId}`, gradeData, getTokenConfig());
  return response.data;
};

export const deleteGrade = async (gradeId) => {
  const response = await axios.delete(`${API_BASE_URL}/grades/${gradeId}`, getTokenConfig());
  return response.data;
};

// Grade statistics and analytics
export const getStudentGrades = async (studentId, params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/grades/`, {
    ...getTokenConfig(),
    params: { student_id: studentId, ...params }
  });
  return response.data;
};

export const getCourseGrades = async (courseId, params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/grades/`, {
    ...getTokenConfig(),
    params: { course_id: courseId, ...params }
  });
  return response.data;
};

// Bulk grade operations
export const createBulkGrades = async (gradesData) => {
  const promises = gradesData.map(grade => createGrade(grade));
  return Promise.all(promises);
};