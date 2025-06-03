import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface LoginErrorMessageProps {
  message: string;
}

/**
 * Componente para mostrar mensajes de error en el formulario de login
 */
const LoginErrorMessage: React.FC<LoginErrorMessageProps> = ({ message }) => {
  return (
    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
      <AlertTitle>Error de inicio de sesión</AlertTitle>
      {message}
    </Alert>
  );
};

export default LoginErrorMessage;
