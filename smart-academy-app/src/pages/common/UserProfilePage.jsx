import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const UserProfilePage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mi Perfil
      </Typography>
      <Typography variant="body1">
        Aquí podrás ver y editar la información de tu perfil.
      </Typography>
      {/* Más contenido del perfil aquí */}
    </Paper>
  );
};

export default UserProfilePage;
