import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const MyCoursesPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mis Cursos
      </Typography>
      <Typography variant="body1">
        Aquí podrás ver y gestionar los cursos que tienes asignados.
      </Typography>
      {/* Contenido de mis cursos */}
    </Paper>
  );
};

export default MyCoursesPage;
