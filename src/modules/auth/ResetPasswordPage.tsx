import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Box, 
  Typography, 
  Button, 
  Alert, 
  AlertTitle,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset } from '@mui/icons-material';
import AuthLayout from '../../layouts/AuthLayout';
import { AuthService } from '../../services/auth';

/**
 * Página para restablecer la contraseña con token
 */
const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
  // Validar token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setError('Token inválido o faltante');
        return;
      }
      
      try {
        setIsLoading(true);
        // Aquí podríamos verificar si el token es válido con una llamada al API
        // Por ahora, solo verificamos que existe
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        setError('El enlace de recuperación ha expirado o no es válido');
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm() || !token) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.resetPassword(token, formData.password);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al restablecer la contraseña. Intenta nuevamente.');
      
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value as string;
        });
        setValidationErrors({...validationErrors, ...apiErrors});
      }
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
  
  // Mostrar pantalla de carga mientras se valida el token
  if (tokenValid === null) {
    return (
      <AuthLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </AuthLayout>
    );
  }
  
  // Si el token es inválido
  if (tokenValid === false) {
    return (
      <AuthLayout>
        <Box sx={{ maxWidth: 450, mx: 'auto', p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Enlace inválido</AlertTitle>
            {error || 'El enlace de recuperación no es válido o ha expirado.'}
          </Alert>
          <Button 
            component={RouterLink} 
            to="/forgot-password" 
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          >
            Solicitar nuevo enlace
          </Button>
          <Button 
            component={RouterLink} 
            to="/login" 
            variant="text"
            fullWidth
          >
            Volver al inicio de sesión
          </Button>
        </Box>
      </AuthLayout>
    );
  }
  
  // Si se ha completado el proceso
  if (isSubmitted) {
    return (
      <AuthLayout>
        <Box sx={{ maxWidth: 450, mx: 'auto', p: 3, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>¡Contraseña restablecida!</AlertTitle>
            Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </Alert>
          <Button 
            component={RouterLink} 
            to="/login" 
            variant="contained"
            color="primary"
            fullWidth
          >
            Ir a inicio de sesión
          </Button>
        </Box>
      </AuthLayout>
    );
  }
  
  // Formulario para establecer nueva contraseña
  return (
    <AuthLayout>
      <Box sx={{ maxWidth: 450, mx: 'auto', p: 3 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Restablecer Contraseña
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Ingresa tu nueva contraseña a continuación.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nueva contraseña"
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
          
          <TextField
            fullWidth
            margin="normal"
            label="Confirmar nueva contraseña"
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
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            startIcon={!isLoading && <LockReset />}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Cambiar contraseña'}
          </Button>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              <Link component={RouterLink} to="/login" underline="hover">
                Volver al inicio de sesión
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
