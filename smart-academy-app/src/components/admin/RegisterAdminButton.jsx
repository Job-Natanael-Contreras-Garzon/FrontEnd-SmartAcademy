import React from 'react';
import Button from '@mui/material/Button';

const RegisterAdminButton = ({ onClick, isSuperuser }) => {
  if (!isSuperuser) {
    return null;
  }

  return (
    <Button variant="contained" color="secondary" onClick={onClick}>
      Registrar Administrador
    </Button>
  );
};

export default RegisterAdminButton;
