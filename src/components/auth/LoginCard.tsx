import React from 'react';
import type { ReactNode } from 'react';
import { Box, Paper } from '@mui/material';

interface LoginCardProps {
  children: ReactNode;
}

/**
 * Componente contenedor para el formulario de login
 */
const LoginCard: React.FC<LoginCardProps> = ({ children }) => {
  return (
    <Paper 
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Box sx={{ width: '100%' }}>
        {children}
      </Box>
    </Paper>
  );
};

export default LoginCard;
