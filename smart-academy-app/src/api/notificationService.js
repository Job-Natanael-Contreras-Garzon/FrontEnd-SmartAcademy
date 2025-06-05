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

// Notifications CRUD
export const createNotification = async (notificationData) => {
  const response = await axios.post(`${API_BASE_URL}/notifications/`, notificationData, getTokenConfig());
  return response.data;
};

export const createBulkNotifications = async (bulkData) => {
  const response = await axios.post(`${API_BASE_URL}/notifications/bulk`, bulkData, getTokenConfig());
  return response.data;
};

export const getUserNotifications = async (userId, params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/notifications/user/${userId}`, {
    ...getTokenConfig(),
    params
  });
  return response.data;
};

export const getNotificationDetail = async (notificationId) => {
  const response = await axios.get(`${API_BASE_URL}/notifications/${notificationId}`, getTokenConfig());
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, getTokenConfig());
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, getTokenConfig());
  return response.data;
};

// Notification types and priorities
export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  ACADEMIC: 'academic',
  PAYMENT: 'payment',
  ATTENDANCE: 'attendance',
  GRADE: 'grade',
  GENERAL: 'general'
};

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const getNotificationTypeLabel = (type) => {
  const labels = {
    system: 'Sistema',
    academic: 'Académico',
    payment: 'Pago',
    attendance: 'Asistencia',
    grade: 'Calificación',
    general: 'General'
  };
  return labels[type] || type;
};

export const getNotificationPriorityLabel = (priority) => {
  const labels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente'
  };
  return labels[priority] || priority;
};

export const getNotificationPriorityColor = (priority) => {
  const colors = {
    low: 'info',
    medium: 'primary',
    high: 'warning',
    urgent: 'error'
  };
  return colors[priority] || 'default';
};

export const getNotificationTypeIcon = (type) => {
  const icons = {
    system: 'Settings',
    academic: 'School',
    payment: 'Payment',
    attendance: 'EventNote',
    grade: 'Grade',
    general: 'Info'
  };
  return icons[type] || 'Notifications';
};