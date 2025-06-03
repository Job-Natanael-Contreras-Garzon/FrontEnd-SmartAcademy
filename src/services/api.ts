import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { StorageService } from './storage';

// Definimos la URL base de la API según el ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Creamos una instancia de axios con la configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones autenticadas
apiClient.interceptors.request.use(
  (config) => {
    const token = StorageService.getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 (no autorizado) y no es una petición de refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Implementar lógica de refresh token si es necesario
      // Por ahora simplemente redirigimos al login
      StorageService.clearToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Clase ApiService para encapsular las llamadas a la API
export class ApiService {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiClient.get<T>(url, config);
  }

  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, data, config);
  }

  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiClient.put<T>(url, data, config);
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiClient.delete<T>(url, config);
  }
}

export default ApiService;
