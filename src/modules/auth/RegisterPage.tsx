import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  TextField, 
  Box, 
  Typography, 
  Link,
  Button,
  Stack,
  CircularProgress,
  Alert,
  AlertTitle,
  MenuItem,
  InputAdornment,
  IconButton,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import type { UserRole } from '../../types/auth';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
}

/**
 * Página de registro de usuario
 */
const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: 'student',
    phone: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (formData.password && formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Correo electrónico inválido';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Omitir campos que no se enviarán al API
      const { confirmPassword, ...registrationData } = formData;
      
      await register(registrationData);
      
      // Mostrar mensaje de éxito y redirigir al login
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err: any) {
      // Manejar errores de API
      const errorMessage = err.response?.data?.detail || 
        'Error al registrar usuario. Por favor intenta nuevamente.';
        
      // Si tenemos errores de validación de campos específicos
      if (err.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value as string;
        });
        
        setValidationErrors({...validationErrors, ...apiErrors});
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error específico del campo
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  
  return (
    <AuthLayout>
      <Box 
        sx={{ 
          maxWidth: 600, 
          mx: 'auto', 
          p: 3
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Registro de Cuenta
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Nombre y Apellido */}
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                error={!!validationErrors.first_name}
                helperText={validationErrors.first_name}
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                fullWidth
                margin="normal"
                label="Apellido"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                error={!!validationErrors.last_name}
                helperText={validationErrors.last_name}
              />
            </Box>
          </Stack>
          
          {/* Correo electrónico */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
          </Box>
          
          {/* Teléfono */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Teléfono (opcional)"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
          </Box>
          
          {/* Tipo de usuario */}
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Tipo de usuario"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="student">Estudiante</MenuItem>
              <MenuItem value="parent">Padre/Tutor</MenuItem>
            </TextField>
            {formData.role === 'parent' && (
              <FormHelperText>
                Como padre/tutor podrá vincular estudiantes a su cuenta después del registro
              </FormHelperText>
            )}
          </Box>
          
          {/* Contraseñas */}
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                fullWidth
                margin="normal"
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                fullWidth
                margin="normal"
                label="Confirmar contraseña"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Stack>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            startIcon={!isLoading && <PersonAdd />}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Ya tienes una cuenta?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
