import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const AdminDashboardPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administrador
      </Typography>
      <Typography variant="body1">
        Bienvenido al panel de administración. Aquí podrás gestionar usuarios, cursos, y más.
      </Typography>
      {/* Más contenido del dashboard del administrador aquí */}
    </Paper>
  );
};

export default AdminDashboardPage;
