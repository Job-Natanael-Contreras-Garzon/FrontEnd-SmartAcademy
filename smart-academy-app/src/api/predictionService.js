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

// Machine Learning Model Training
export const trainModel = async (modelType = 'random_forest', advanced = false) => {
  const response = await axios.post(`${API_BASE_URL}/predictions/train`, {}, {
    ...getTokenConfig(),
    params: { model_type: modelType, advanced }
  });
  return response.data;
};

// Student Performance Predictions
export const predictStudentPerformance = async (studentId, courseId = null, advanced = false) => {
  const params = { advanced };
  if (courseId) {
    params.course_id = courseId;
  }
  
  const response = await axios.get(`${API_BASE_URL}/predictions/student/${studentId}`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

// Dashboard Statistics for Predictions
export const getPredictionStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/predictions/dashboard/stats`, getTokenConfig());
  return response.data;
};

// At-Risk Students
export const getAtRiskStudents = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/predictions/at-risk`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

// Model types available
export const MODEL_TYPES = {
  RANDOM_FOREST: 'random_forest',
  LINEAR_REGRESSION: 'linear_regression',
  GRADIENT_BOOSTING: 'gradient_boosting'
};

export const getModelTypeLabel = (modelType) => {
  const labels = {
    random_forest: 'Random Forest',
    linear_regression: 'Regresión Lineal',
    gradient_boosting: 'Gradient Boosting'
  };
  return labels[modelType] || modelType;
};

// Risk levels
export const RISK_LEVELS = {
  LOW: 'Bajo',
  MEDIUM: 'Medio',
  HIGH: 'Alto',
  CRITICAL: 'Crítico'
};

export const getRiskLevelColor = (riskLevel) => {
  const colors = {
    'Bajo': 'success',
    'Medio': 'warning',
    'Alto': 'error',
    'Crítico': 'error'
  };
  return colors[riskLevel] || 'default';
};

// Performance prediction helpers
export const getPerformancePredictionColor = (prediction) => {
  if (prediction >= 0.8) return 'success';
  if (prediction >= 0.6) return 'warning';
  return 'error';
};

export const getPerformancePredictionLabel = (prediction) => {
  if (prediction >= 0.8) return 'Excelente';
  if (prediction >= 0.6) return 'Bueno';
  if (prediction >= 0.4) return 'Regular';
  return 'En Riesgo';
};

// Batch predictions for multiple students
export const predictMultipleStudents = async (studentIds, courseId = null, advanced = false) => {
  const promises = studentIds.map(studentId => 
    predictStudentPerformance(studentId, courseId, advanced)
  );
  return Promise.all(promises);
};

// Alias getPredictionStats as getDashboardStats for MLAnalyticsPage.jsx compatibility
export { getPredictionStats as getDashboardStats };