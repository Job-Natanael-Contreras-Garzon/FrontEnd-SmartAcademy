// Claves para el almacenamiento local
const TOKEN_KEY = 'smartacademy_token';
const USER_KEY = 'smartacademy_user';
const REMEMBER_ME_KEY = 'smartacademy_remember_me';

// Servicio para manejar el almacenamiento local y sesión
export class StorageService {
  // Determina automáticamente si usar localStorage o sessionStorage
  private static getStorage(): Storage {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }

  /**
   * Guarda el token de autenticación
   * @param token El token JWT
   * @param rememberMe Si debe persistir entre sesiones
   */
  static setToken(token: string, rememberMe = false): void {
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));
    const storage = this.getStorage();
    storage.setItem(TOKEN_KEY, token);
  }

  /**
   * Obtiene el token de autenticación
   * @returns El token JWT o null si no existe
   */
  static getToken(): string | null {
    return this.getStorage().getItem(TOKEN_KEY);
  }

  /**
   * Elimina el token de autenticación
   */
  static clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }

  /**
   * Guarda datos del usuario en el almacenamiento
   * @param user Datos del usuario a guardar
   */
  static setUser(user: any): void {
    this.getStorage().setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Obtiene los datos del usuario del almacenamiento
   * @returns Los datos del usuario o null si no existe
   */
  static getUser<T>(): T | null {
    const userData = this.getStorage().getItem(USER_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as T;
    } catch (error) {
      console.error('Error parsing user data', error);
      return null;
    }
  }

  /**
   * Elimina los datos del usuario del almacenamiento
   */
  static clearUser(): void {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  /**
   * Limpia todos los datos almacenados
   */
  static clearAll(): void {
    this.clearToken();
    this.clearUser();
  }
}
