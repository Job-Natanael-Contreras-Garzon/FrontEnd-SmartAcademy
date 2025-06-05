import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../../api/authService'; // Importamos nuestro servicio

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // Para el estado de carga

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(''); // Para errores de validación del formulario

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      console.log('Login onSuccess triggered. Data:', data); // <--- NUEVO LOG
      // La API devuelve: access_token, token_type, user_id, email, full_name, role, is_superuser
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_role', data.role); // Guardamos el rol del usuario
      localStorage.setItem('user_full_name', data.full_name); // Guardamos el nombre completo
      localStorage.setItem('user_email', data.email); // Guardamos el email
      localStorage.setItem('user_id', data.user_id); // Guardamos el user_id
      // Podrías guardar más datos si es necesario
      
      // Limpiar errores de formulario si los hubo
      setFormError(''); 
      
      console.log('Attempting to navigate to /'); // <--- NUEVO LOG
      // Redirigir según el rol o a un dashboard general
      // Por ahora, redirigimos a la raíz, y App.jsx manejará la lógica de ProtectedRoute
      navigate('/'); 
    },
    onError: (error) => {
      console.error('Login onError triggered. Error:', error); // <--- NUEVO LOG
      console.error('Login failed:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        setFormError(error.response.data.detail);
      } else {
        setFormError('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      }
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login handleSubmit triggered.'); // <--- NUEVO LOG
    setFormError(''); // Limpiar errores previos del formulario

    if (!email || !password) {
      setFormError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }
    console.log('Calling mutation.mutate with:', { email, password }); // <--- NUEVO LOG
    mutation.mutate({ email, password });
  };

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Iniciar Sesión
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!formError || mutation.isError} // Marcar error si hay error de formulario o de mutación
          disabled={mutation.isPending}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!formError || mutation.isError} // Marcar error
          disabled={mutation.isPending}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Recordarme"
          disabled={mutation.isPending}
        />
        {(formError || mutation.isError) && (
          <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            {formError || (mutation.error?.response?.data?.detail || 'Ocurrió un error inesperado')}
          </Typography>
        )}
        <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
          {mutation.isPending && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              ¿Olvidaste tu contraseña?
            </Link>
          </Grid>
          <Grid item>
            {/* <Link href="#" variant="body2">
              {"¿No tienes una cuenta? Regístrate"}
            </Link> */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LoginPage;
