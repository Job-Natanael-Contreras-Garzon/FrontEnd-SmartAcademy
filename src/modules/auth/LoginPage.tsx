import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Link } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

// Componentes
import AuthLayout from '../../layouts/AuthLayout';
import LoginCard from '../../components/auth/LoginCard';
import LoginErrorMessage from '../../components/auth/LoginErrorMessage';
import PasswordField from '../../components/auth/PasswordField';
import RememberMeCheckbox from '../../components/auth/RememberMeCheckbox';
import ForgotPasswordLink from '../../components/auth/ForgotPasswordLink';
import LoginButton from '../../components/auth/LoginButton';

// Logo o imagen placeholder
const Logo: React.FC = () => (
  <Box sx={{ mb: 2, textAlign: 'center' }}>
    <img 
      src="/assets/images/logo.png" 
      alt="Smart Academy" 
      style={{ height: 80, width: 'auto' }} 
      onError={(e) => {
        // Fallback si no se encuentra la imagen
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  </Box>
);

/**
 * Página de inicio de sesión
 */
const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    rememberMe: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await login(
        formData.email, 
        formData.password, 
        formData.rememberMe
      );
      
      // Redirigir según rol
      if (userData.role === 'student') {
        navigate('/dashboard/student');
      } else if (userData.role === 'teacher') {
        navigate('/dashboard/teacher');
      } else if (userData.role === 'administrator') {
        navigate('/dashboard/admin');
      } else if (userData.role === 'parent') {
        navigate('/dashboard/parent');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error de autenticación. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  return (
    <AuthLayout imageUrl="/assets/images/school-background.jpg">
      <LoginCard>
        <Logo />
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        
        {error && <LoginErrorMessage message={error} />}
        
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth
            margin="normal"
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
            required
          />
          
          <PasswordField 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1
            }}
          >
            <RememberMeCheckbox 
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
            />
            <ForgotPasswordLink to="/forgot-password" />
          </Box>
          
          <LoginButton isLoading={isLoading} />
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" underline="hover">
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        </form>
      </LoginCard>
    </AuthLayout>
  );
};

export default LoginPage;
