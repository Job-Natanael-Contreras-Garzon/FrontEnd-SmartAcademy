import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services/auth';
import type { User } from '../types/auth';
import type { LoginResponse } from '../types/user';

// Interfaz para el contexto de autenticación
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>;
  logout: () => void;
  register: (userData: any) => Promise<User>;
  updateUser: (userData: Partial<User>) => void;
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el proveedor de autenticación
interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargamos el usuario al iniciar la aplicación
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userData = await AuthService.getProfile();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error loading user profile', error);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const userData = await AuthService.login(email, password, rememberMe);
      
      // Cargamos el perfil completo del usuario
      const fullProfile = await AuthService.getProfile();
      setCurrentUser(fullProfile);
      
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // Función para registrar un nuevo usuario
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      return await AuthService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar datos del usuario actual
  const updateUser = (userData: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...userData });
    }
  };

  // Valor del contexto
  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    login,
    logout,
    register,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};
