import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Paper, 
  Typography, 
  Skeleton,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Avatar
} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import type { AdminStats, AdminActivity } from '../../types/admin';
import ApiService from '../../services/api';
import WelcomeBar from '../../components/dashboard/WelcomeBar';
import { StatCard } from '../../components/dashboard/StatCard';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  AutoStories as AutoStoriesIcon,
  Grade as GradeIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Event as EventIcon,
  PeopleAlt as PeopleAltIcon,
  Face as FaceIcon,
  Group as GroupIcon
} from '@mui/icons-material';

import React from 'react';

export const AdminDashboard: React.FC = () => {
  const theme = useTheme();

  // Registrar componentes de Chart.js
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
  );

  // Configurar Chart.js
  ChartJS.defaults.color = theme.palette.text.primary;

  // Estado inicial
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Obtener estadísticas generales del sistema
        const response = await ApiService.get('/api/v1/admin/stats');
        const data = response.data as AdminStats;
        
        // Actualizar estados
        setStats(data);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar algunos datos. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Datos para el gráfico de distribución de usuarios
  const getUserDistributionData = () => {
    if (!stats) return { labels: [], datasets: [] };
    
    return {
      labels: ['Estudiantes', 'Profesores', 'Padres'],
      datasets: [{
        data: [stats.total_students, stats.total_teachers, stats.total_parents],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main
        ]
      }]
    };
  };

  // Obtener icono según tipo de actividad
  const getActivityIcon = (activityType: AdminActivity['activity_type']) => {
    switch (activityType) {
      case 'user_creation':
        return <PersonIcon />;
      case 'course_creation':
        return <SchoolIcon />;
      case 'enrollment':
        return <AutoStoriesIcon />;
      case 'grade_submission':
        return <GradeIcon />;
      case 'system_update':
        return <AdminPanelSettingsIcon />;
      default:
        return <EventIcon />;
    }
  };

  return (
    <DashboardLayout>
      {/* Error general */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Barra de bienvenida */}
      {isLoading ? (
        <Skeleton variant="rectangular" height={120} sx={{ mb: 3, borderRadius: 2 }} />
      ) : (
        <WelcomeBar 
          username={currentUser?.full_name || 'Administrador'} 
          role="Administrator"
          lastLogin={currentUser?.last_login}
        />
      )}
      
      {/* Estadísticas generales */}
      <Stack 
        direction="row" 
        spacing={3} 
        sx={{ 
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          mb: 3
        }}
      >
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Estudiantes" 
              value={stats?.total_students || 0}
              icon={<PeopleAltIcon />} 
              color="primary"
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Profesores" 
              value={stats?.total_teachers || 0}
              icon={<FaceIcon />} 
              color="secondary"
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Cursos activos" 
              value={stats?.active_courses || 0}
              icon={<SchoolIcon />} 
              color="info"
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Padres" 
              value={stats?.total_parents || 0}
              icon={<GroupIcon />} 
              color="success"
            />
          )}
        </Box>
      </Stack>

      {/* Gráfico de distribución de usuarios */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Distribución de usuarios
        </Typography>
        <Box sx={{ height: 300 }}>
          <Pie data={getUserDistributionData()} />
        </Box>
      </Paper>

      {/* Actividad reciente */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Actividad reciente
        </Typography>
        <Paper sx={{ p: 2 }}>
          <List>
            {stats?.recent_activities?.map((activity) => (
              <React.Fragment key={activity.id}>
                <ListItem 
                  secondaryAction={
                    <Chip 
                      label={activity.user_role}
                      size="small"
                      color={activity.user_role === 'administrator' ? 'primary' : 
                            activity.user_role === 'teacher' ? 'secondary' : 
                            activity.user_role === 'student' ? 'success' : 
                            'warning'}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {getActivityIcon(activity.activity_type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.description}
                    secondary={format(new Date(activity.timestamp), 'd MMM yyyy HH:mm', { locale: es })}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default AdminDashboard;
