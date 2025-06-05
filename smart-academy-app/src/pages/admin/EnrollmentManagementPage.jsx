import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const EnrollmentManagementPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Matrículas
      </Typography>
      <Typography variant="body1">
        Aquí podrás administrar las matrículas de los estudiantes en los cursos.
      </Typography>
      {/* Contenido de gestión de matrículas */}
    </Paper>
  );
};

export default EnrollmentManagementPage;
