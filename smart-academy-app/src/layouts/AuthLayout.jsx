import React from 'react';
import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const AuthLayout = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Aquí podrías poner un logo o título común para las páginas de auth */}
        <Outlet /> {/* Las rutas anidadas (ej. LoginPage) se renderizarán aquí */}
      </Box>
    </Container>
  );
};

export default AuthLayout;
