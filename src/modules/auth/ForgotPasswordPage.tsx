import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  TextField, 
  Box, 
  Typography, 
  Link, 
  Button, 
  Alert, 
  AlertTitle,
  CircularProgress
} from '@mui/material';
import { Email } from '@mui/icons-material';
import AuthLayout from '../../layouts/AuthLayout';
import { AuthService } from '../../services/auth';

/**
 * Página de recuperación de contraseña
 */
const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al procesar la solicitud. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout>
      <Box 
        sx={{ 
          maxWidth: 450, 
          mx: 'auto', 
          p: 3,
          textAlign: 'center' 
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Recuperar Contraseña
        </Typography>
        
        {isSubmitted ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Correo enviado</AlertTitle>
              Hemos enviado un enlace de recuperación a tu correo electrónico. 
              Por favor revisa tu bandeja de entrada y sigue las instrucciones.
            </Alert>
            
            <Button 
              component={RouterLink} 
              to="/login" 
              variant="outlined"
              fullWidth
            >
              Volver al inicio de sesión
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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
                label="Correo electrónico"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
                disabled={isLoading}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                startIcon={!isLoading && <Email />}
                sx={{ mt: 3, py: 1.5 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar enlace de recuperación'}
              </Button>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <Link component={RouterLink} to="/login" underline="hover">
                    Volver al inicio de sesión
                  </Link>
                </Typography>
              </Box>
            </form>
          </>
        )}
      </Box>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
