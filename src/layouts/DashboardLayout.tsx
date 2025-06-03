import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';

// Iconos
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
// Componentes personalizados
import NotificationCenter from '../components/notifications/NotificationCenter';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';

// Hooks
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/user';

// Ancho del drawer lateral
const DRAWER_WIDTH = 280;

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal para las páginas autenticadas con sidebar y header
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Manejador para abrir/cerrar el drawer en móviles
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Manejadores para menús desplegables
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };



  // Manejo de cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define los elementos del menú según el rol del usuario
  const getMenuItems = (role?: UserRole) => {
    const baseItems = [
      { 
        text: 'Dashboard', 
        icon: <DashboardIcon />,
        path: '/dashboard'
      },
      { 
        text: 'Cursos', 
        icon: <SchoolIcon />,
        path: '/courses'
      },
    ];

    const adminItems = [
      ...baseItems,
      { 
        text: 'Usuarios', 
        icon: <PeopleIcon />, 
        path: '/admin/users'
      },
      { 
        text: 'Gestión Académica', 
        icon: <EventNoteIcon />, 
        path: '/admin/academic' 
      },
      { 
        text: 'Configuración', 
        icon: <SettingsIcon />, 
        path: '/admin/settings' 
      },
    ];

    const teacherItems = [
      ...baseItems,
      { 
        text: 'Mis Clases', 
        icon: <SchoolIcon />, 
        path: '/teacher/classes' 
      },
      { 
        text: 'Calificaciones', 
        icon: <EventNoteIcon />, 
        path: '/teacher/grades' 
      },
      { 
        text: 'Asistencia', 
        icon: <PeopleIcon />, 
        path: '/teacher/attendance' 
      },
    ];

    const studentItems = [
      ...baseItems,
      { 
        text: 'Mis Calificaciones', 
        icon: <EventNoteIcon />, 
        path: '/student/grades' 
      },
      { 
        text: 'Asistencia', 
        icon: <EventNoteIcon />, 
        path: '/student/attendance' 
      },
      { 
        text: 'Tareas', 
        icon: <EventNoteIcon />, 
        path: '/student/assignments' 
      },
    ];

    const parentItems = [
      ...baseItems,
      { 
        text: 'Mis Estudiantes', 
        icon: <PeopleIcon />, 
        path: '/parent/students' 
      },
      { 
        text: 'Progreso Académico', 
        icon: <EventNoteIcon />, 
        path: '/parent/academic-progress' 
      },
    ];

    // Selecciona los items según el rol
    switch (role) {
      case 'administrator':
        return adminItems;
      case 'teacher':
        return teacherItems;
      case 'student':
        return studentItems;
      case 'parent':
        return parentItems;
      default:
        return baseItems;
    }
  };

  // Obtiene los elementos del menú según el rol del usuario actual
  const menuItems = getMenuItems(currentUser?.role);

  // Contenido del sidebar (drawer)
  const drawer = (
    <Box>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: [1],
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Smart Academy
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Barra superior (AppBar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Título de la página actual */}
          </Typography>

          {/* Notificaciones */}
          <NotificationCenter />
          
          {/* Menú de perfil de usuario */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title="Abrir configuración">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {currentUser?.photo ? (
                  <Avatar alt={currentUser.full_name} src={currentUser.photo} />
                ) : (
                  <Avatar>
                    {currentUser?.full_name?.charAt(0) || <AccountCircleIcon />}
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Mi Perfil</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Configuración</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleCloseUserMenu(); handleLogout(); }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
          

        </Toolbar>
      </AppBar>
      
      {/* Sidebar (Drawer) */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="menu lateral"
      >
        {/* Drawer para móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Drawer permanente para escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* Espaciado para que el contenido no quede debajo del AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
