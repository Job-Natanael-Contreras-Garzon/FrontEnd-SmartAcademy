export type UserRole = 'administrator' | 'teacher' | 'student' | 'parent';

export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  direction?: string;
  birth_date?: string;
  gender?: Gender;
  role: UserRole;
  photo?: string | null;
  is_active: boolean;
  is_superuser: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_superuser: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  direction?: string;
  birth_date?: string;
  gender?: Gender;
  role?: UserRole;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
}
