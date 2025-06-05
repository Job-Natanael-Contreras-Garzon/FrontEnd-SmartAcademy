import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const GeneralSettingsPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configuración General
      </Typography>
      <Typography variant="body1">
        Aquí podrás ajustar la configuración general de la aplicación.
      </Typography>
      {/* Contenido de configuración general */}
    </Paper>
  );
};

export default GeneralSettingsPage;
