import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography } from '@mui/material';

interface ForgotPasswordLinkProps {
  to: string;
}

/**
 * Enlace para recuperación de contraseña
 */
const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ to }) => {
  return (
    <Typography variant="body2" align="right">
      <Link component={RouterLink} to={to} underline="hover">
        ¿Olvidaste tu contraseña?
      </Link>
    </Typography>
  );
};

export default ForgotPasswordLink;
