import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const GradesPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Calificaciones
      </Typography>
      <Typography variant="body1">
        Aquí podrás registrar y consultar las calificaciones de tus estudiantes.
      </Typography>
      {/* Contenido de calificaciones */}
    </Paper>
  );
};

export default GradesPage;
