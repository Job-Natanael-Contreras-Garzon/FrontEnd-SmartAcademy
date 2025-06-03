import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

/**
 * Componente para proteger rutas por autenticación y roles
 * Si el usuario no está autenticado, redirige a la página de login
 * Si el usuario no tiene un rol permitido, redirige a una página de acceso denegado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = []
}) => {
  const { currentUser, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Mostrar un indicador de carga mientras verificamos el estado de autenticación
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si se requiere un rol específico y el usuario no lo tiene
  if (
    allowedRoles.length > 0 && 
    currentUser && 
    !allowedRoles.includes(currentUser.role)
  ) {
    return <Navigate to="/access-denied" replace />;
  }
  
  // Si todo está bien, muestra el contenido de la ruta
  return <Outlet />;
};

export default ProtectedRoute;
