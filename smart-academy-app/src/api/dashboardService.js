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

// General Dashboard Statistics
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, getTokenConfig());
  return response.data;
};

// Student-specific Dashboard
export const getStudentDashboard = async (studentId) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/student/${studentId}`, getTokenConfig());
  return response.data;
};

// Enrollment Management
export const getEnrollments = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/enrollments/`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

export const createEnrollment = async (enrollmentData) => {
  const response = await axios.post(`${API_BASE_URL}/enrollments/`, enrollmentData, getTokenConfig());
  return response.data;
};

export const updateEnrollment = async (enrollmentId, enrollmentData) => {
  const response = await axios.put(`${API_BASE_URL}/enrollments/${enrollmentId}`, enrollmentData, getTokenConfig());
  return response.data;
};

export const deleteEnrollment = async (enrollmentId) => {
  const response = await axios.delete(`${API_BASE_URL}/enrollments/${enrollmentId}`, getTokenConfig());
  return response.data;
};

// Quick stats helpers
export const getQuickStats = async () => {
  try {
    const stats = await getDashboardStats();
    return {
      totalStudents: stats.total_students || 0,
      totalTeachers: stats.total_teachers || 0,
      totalCourses: stats.total_courses || 0,
      activeEnrollments: stats.active_enrollments || 0,
      averageAttendance: stats.average_attendance || 0,
      averageGrade: stats.average_grade || 0
    };
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    return {
      totalStudents: 0,
      totalTeachers: 0,
      totalCourses: 0,
      activeEnrollments: 0,
      averageAttendance: 0,
      averageGrade: 0
    };
  }
};

// Recent activity helpers
export const getRecentActivity = async (limit = 10) => {
  try {
    // This would typically come from a dedicated endpoint
    // For now, we'll simulate with recent grades and attendance
    const [grades, attendance] = await Promise.all([
      axios.get(`${API_BASE_URL}/grades/`, {
        ...getTokenConfig(),
        params: { limit: limit / 2, order_by: '-created_at' }
      }),
      axios.get(`${API_BASE_URL}/attendance/`, {
        ...getTokenConfig(),
        params: { limit: limit / 2, order_by: '-date' }
      })
    ]);
    
    return {
      recentGrades: grades.data.items || [],
      recentAttendance: attendance.data.items || []
    };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return {
      recentGrades: [],
      recentAttendance: []
    };
  }
};