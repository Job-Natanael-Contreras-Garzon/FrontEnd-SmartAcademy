import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface LoginButtonProps {
  isLoading: boolean;
}

/**
 * Botón de inicio de sesión con estado de carga
 */
const LoginButton: React.FC<LoginButtonProps> = ({ isLoading }) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      startIcon={!isLoading && <LockOpenIcon />}
      disabled={isLoading}
      sx={{ mt: 2, py: 1.5 }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
    </Button>
  );
};

export default LoginButton;
