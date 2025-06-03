import ApiService from './api';
import { StorageService } from './storage';
import type { User } from '../types/auth';
import type { 
  LoginResponse, 
  RegistrationRequest
} from '../types/user';

/**
 * Servicio de autenticación para manejar login, registro y operaciones relacionadas
 */
export class AuthService {
  /**
   * Realiza el inicio de sesión del usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @param rememberMe Indica si se debe recordar la sesión
   * @returns Datos del usuario autenticado
   */
  static async login(email: string, password: string, rememberMe = false): Promise<LoginResponse> {
    try {
      const response = await ApiService.post<LoginResponse>(
        '/api/v1/auth/login', 
        { email, password }
      );
      
      const userData = response.data;
      
      // Guardar el token y los datos del usuario
      StorageService.setToken(userData.access_token, rememberMe);
      StorageService.setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Registra un nuevo usuario
   * @param userData Datos del nuevo usuario
   * @returns Datos del usuario registrado
   */
  static async register(userData: RegistrationRequest): Promise<User> {
    const response = await ApiService.post<User>('/api/v1/auth/register', userData);
    return response.data;
  }
  
  /**
   * Registra un nuevo administrador (solo superusuarios)
   * @param userData Datos del nuevo administrador
   * @returns Datos del administrador registrado
   */
  static async registerAdmin(userData: RegistrationRequest): Promise<User> {
    const response = await ApiService.post<User>('/api/v1/auth/register-admin', userData);
    return response.data;
  }
  
  /**
   * Obtiene el perfil del usuario autenticado
   * @returns Datos completos del perfil del usuario
   */
  static async getProfile(): Promise<User> {
    const response = await ApiService.get<User>('/api/v1/auth/users/me/');
    return response.data;
  }
  
  /**
   * Cambia la contraseña del usuario autenticado
   * @param currentPassword Contraseña actual
   * @param newPassword Nueva contraseña
   * @returns Mensaje de confirmación
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await ApiService.post<{ message: string }>(
      '/api/v1/auth/change-password',
      { current_password: currentPassword, new_password: newPassword }
    );
    return response.data;
  }
  
  /**
   * Solicita la recuperación de contraseña
   * @param email Email del usuario que olvidó su contraseña
   * @returns Mensaje de confirmación
   */
  static async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await ApiService.post<{ message: string }>(
      '/api/v1/auth/password-recovery',
      { email }
    );
    return response.data;
  }
  
  /**
   * Restablece la contraseña con un token válido
   * @param token Token de recuperación
   * @param newPassword Nueva contraseña
   * @returns Mensaje de confirmación
   */
  static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await ApiService.post<{ message: string }>(
      '/api/v1/auth/reset-password',
      { token, new_password: newPassword }
    );
    return response.data;
  }
  
  /**
   * Cierra la sesión del usuario actual
   */
  static logout(): void {
    StorageService.clearAll();
  }
  
  /**
   * Verifica si hay un usuario autenticado
   * @returns true si hay un usuario autenticado
   */
  static isAuthenticated(): boolean {
    return !!StorageService.getToken();
  }
  
  /**
   * Obtiene el rol del usuario autenticado
   * @returns El rol del usuario o null si no está autenticado
   */
  static getUserRole(): string | null {
    const user = StorageService.getUser<LoginResponse>();
    return user ? user.role : null;
  }
}
