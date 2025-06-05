import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const TeacherDashboardPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Profesor
      </Typography>
      <Typography variant="body1">
        Bienvenido a tu panel. Aquí podrás gestionar tus cursos, estudiantes, calificaciones y asistencia.
      </Typography>
      {/* Más contenido del dashboard del profesor aquí */}
    </Paper>
  );
};

export default TeacherDashboardPage;
