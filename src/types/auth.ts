// Re-exportación de tipos de usuario para ser usados en contexto de autenticación
import type { 
  User as UserBase,
  UserRole,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  PasswordChangeRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest
} from './user';

// Tipo extendido de User para el dashboard
export interface User extends UserBase {
  last_login?: string;
}

// Re-exportación de tipos
export type {
  UserRole,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  PasswordChangeRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest
};
