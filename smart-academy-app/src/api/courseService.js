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

// Courses CRUD
export const getCourses = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/courses/`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

export const getCourse = async (courseId) => {
  const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`, getTokenConfig());
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await axios.post(`${API_BASE_URL}/courses/`, courseData, getTokenConfig());
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await axios.put(`${API_BASE_URL}/courses/${courseId}`, courseData, getTokenConfig());
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await axios.delete(`${API_BASE_URL}/courses/${courseId}`, getTokenConfig());
  return response.data;
};

// Subjects
export const getSubjects = async () => {
  const response = await axios.get(`${API_BASE_URL}/subjects/`, getTokenConfig());
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await axios.post(`${API_BASE_URL}/subjects/`, subjectData, getTokenConfig());
  return response.data;
};

// Groups
export const getGroups = async () => {
  const response = await axios.get(`${API_BASE_URL}/groups/`, getTokenConfig());
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await axios.post(`${API_BASE_URL}/groups/`, groupData, getTokenConfig());
  return response.data;
};

// Periods
export const getPeriods = async () => {
  const response = await axios.get(`${API_BASE_URL}/periods/`, getTokenConfig());
  return response.data;
};

export const createPeriod = async (periodData) => {
  const response = await axios.post(`${API_BASE_URL}/periods/`, periodData, getTokenConfig());
  return response.data;
};