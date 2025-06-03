import React, { ReactNode } from 'react';
import { Box, Container, Paper, Grid, useTheme, useMediaQuery } from '@mui/material';

interface AuthLayoutProps {
  children: ReactNode;
  imageUrl?: string;
}

/**
 * Layout para páginas de autenticación como login y registro
 * Muestra una imagen de fondo en un lado y el contenido en el otro
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  imageUrl = '/assets/images/school-background.jpg' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: theme.palette.background.default
      }}
    >
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Paper 
          elevation={3} 
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            minHeight: isMobile ? 'auto' : '80vh',
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          {/* Imagen lateral (oculta en móviles) */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          
          {/* Contenido del formulario */}
          <Grid 
            container 
            item 
            xs={12} 
            md={6} 
            alignItems="center" 
            justifyContent="center"
            sx={{ p: { xs: 3, sm: 6, md: 8 } }}
          >
            <Box width="100%">
              {children}
            </Box>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
