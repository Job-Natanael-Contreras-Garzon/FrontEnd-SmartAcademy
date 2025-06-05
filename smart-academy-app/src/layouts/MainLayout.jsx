import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School'; // Para cursos en general (admin)
import ClassIcon from '@mui/icons-material/Class'; // Para "Mis Cursos" (teacher)
import AssignmentIcon from '@mui/icons-material/Assignment'; // Para Calificaciones/Tareas
import EventNoteIcon from '@mui/icons-material/EventNote'; // Para Asistencia
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GradeIcon from '@mui/icons-material/Grade';
import TaskIcon from '@mui/icons-material/Task';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PsychologyIcon from '@mui/icons-material/Psychology';

const drawerWidth = 240;

const allNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: (role) => role === 'ADMINISTRATOR' ? '/admin/dashboard' : '/teacher/dashboard', roles: ['ADMINISTRATOR', 'teacher'] },
  { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/profile', roles: ['ADMINISTRATOR', 'teacher'] },
  { divider: true, roles: ['ADMINISTRATOR', 'teacher'] }, // Separador
  // Admin Roles
  { text: 'Gestión de Usuarios', icon: <PeopleIcon />, path: '/admin/users', roles: ['ADMINISTRATOR'] },
  { text: 'Gestión de Cursos', icon: <SchoolIcon />, path: '/admin/courses', roles: ['ADMINISTRATOR'] },
  { text: 'Gestión de Matrículas', icon: <AssignmentIcon />, path: '/admin/enrollments', roles: ['ADMINISTRATOR'] },
  { text: 'Gestión de Calificaciones', icon: <GradeIcon />, path: '/admin/grades', roles: ['ADMINISTRATOR'] },
  { text: 'Gestión de Asistencia', icon: <EventNoteIcon />, path: '/admin/attendance', roles: ['ADMINISTRATOR'] },
  { text: 'Gestión de Tareas', icon: <TaskIcon />, path: '/admin/tasks', roles: ['ADMINISTRATOR'] },
  { divider: true, roles: ['ADMINISTRATOR'] }, // Separador para predicciones
  { text: 'Predicciones', icon: <PsychologyIcon />, path: '/admin/predictions', roles: ['ADMINISTRATOR'] },
  { text: 'Análisis ML Completo', icon: <AnalyticsIcon />, path: '/admin/ml-analytics', roles: ['ADMINISTRATOR'] },
  { divider: true, roles: ['ADMINISTRATOR'] }, // Separador para configuración
  { text: 'Configuración General', icon: <SettingsIcon />, path: '/admin/settings', roles: ['ADMINISTRATOR'] },
  { divider: true, roles: ['ADMINISTRATOR'] }, // Separador para admin
  // Teacher Roles
  { text: 'Mis Cursos', icon: <ClassIcon />, path: '/teacher/my-courses', roles: ['teacher'] },
  { text: 'Calificaciones', icon: <AssignmentIcon />, path: '/teacher/grades', roles: ['teacher'] },
  { text: 'Asistencia', icon: <EventNoteIcon />, path: '/teacher/attendance', roles: ['teacher'] },
];


const MainLayout = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [visibleNavItems, setVisibleNavItems] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setUserRole(role);
    if (role) {
      const filtered = allNavItems.filter(item => item.roles.includes(role));
      const processedItems = filtered.map(item => {
        if (typeof item.path === 'function') {
          return { ...item, path: item.path(role) };
        }
        return item;
      });
      setVisibleNavItems(processedItems);
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_full_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    navigate('/auth/login');
  };

  const drawerContent = (
    <div>
      <Toolbar /> {/* Para alinear con el AppBar */}
      <Divider />
      <List>
        {visibleNavItems.map((item, index) => {
          if (item.divider) {
            return <Divider key={`divider-${index}`} />;
          }
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }} // Oculto en pantallas grandes
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Smart Academy
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Drawer para mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Drawer para desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open // El drawer permanente siempre está "open" en su lógica, pero se muestra/oculta con display
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // Altura del AppBar
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
