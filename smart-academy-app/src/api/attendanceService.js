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

// Attendance CRUD
export const getAttendances = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/attendance/`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

export const getAttendance = async (attendanceId) => {
  const response = await axios.get(`${API_BASE_URL}/attendance/${attendanceId}`, getTokenConfig());
  return response.data;
};

export const createAttendance = async (attendanceData) => {
  const response = await axios.post(`${API_BASE_URL}/attendance/`, attendanceData, getTokenConfig());
  return response.data;
};

export const updateAttendance = async (attendanceId, attendanceData) => {
  const response = await axios.put(`${API_BASE_URL}/attendance/${attendanceId}`, attendanceData, getTokenConfig());
  return response.data;
};

export const deleteAttendance = async (attendanceId) => {
  const response = await axios.delete(`${API_BASE_URL}/attendance/${attendanceId}`, getTokenConfig());
  return response.data;
};

// Attendance statistics
export const getCourseAttendanceStats = async (courseId, params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/attendance/stats/course/${courseId}`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

export const getStudentCourseAttendanceStats = async (studentId, courseId, params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/attendance/stats/student/${studentId}/course/${courseId}`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

// Bulk attendance operations
export const createBulkAttendance = async (attendanceData) => {
  const promises = attendanceData.map(attendance => createAttendance(attendance));
  return Promise.all(promises);
};

// Helper functions for attendance status
export const ATTENDANCE_STATUS = {
  PRESENTE: 'presente',
  AUSENTE: 'ausente',
  TARDE: 'tarde',
  JUSTIFICADO: 'justificado'
};

export const getAttendanceStatusLabel = (status) => {
  const labels = {
    presente: 'Presente',
    ausente: 'Ausente',
    tarde: 'Tarde',
    justificado: 'Justificado'
  };
  return labels[status] || status;
};

export const getAttendanceStatusColor = (status) => {
  const colors = {
    presente: 'success',
    ausente: 'error',
    tarde: 'warning',
    justificado: 'info'
  };
  return colors[status] || 'default';
};

// Placeholder for general attendance stats, requested by AttendanceManagementPage
export const getAttendanceStats = async (params = {}) => {
  console.warn('API CALL (mock): getAttendanceStats. Consider using getCourseAttendanceStats or getStudentCourseAttendanceStats for more specific data.', params);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return a generic stats object structure
  return {
    total_records: 0,
    present_count: 0,
    absent_count: 0,
    late_count: 0,
    justified_count: 0,
    // Add other generic stats as needed
  };
};