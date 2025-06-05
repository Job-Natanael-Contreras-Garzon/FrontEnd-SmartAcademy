import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const AttendancePage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Asistencia
      </Typography>
      <Typography variant="body1">
        Aquí podrás registrar y consultar la asistencia de tus estudiantes.
      </Typography>
      {/* Contenido de asistencia */}
    </Paper>
  );
};

export default AttendancePage;
