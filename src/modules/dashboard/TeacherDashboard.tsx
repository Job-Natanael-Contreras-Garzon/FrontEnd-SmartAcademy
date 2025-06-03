import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Skeleton,
  Alert,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Button,
  AvatarGroup,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Componentes
import DashboardLayout from '../../layouts/DashboardLayout';
import WelcomeBar from '../../components/dashboard/WelcomeBar';
import StatCard from '../../components/dashboard/StatCard';
import RecentNotifications from '../../components/dashboard/RecentNotifications';

// Contextos y servicios
import { useAuth } from '../../contexts/AuthContext';
import { ApiService } from '../../services/api';

// Tipos
import type { User } from '../../types/auth';

// Tipos temporales para el dashboard de profesores
interface TeacherClass {
  id: number;
  name: string;
  schedule: string;
  students_count: number;
  next_session?: string;
  students?: {
    id: number;
    name: string;
    photo?: string;
  }[];
}

interface PendingGradingAssignment {
  id: number;
  title: string;
  course_name: string;
  due_date: string;
  submissions_count: number;
  pending_count: number;
}

/**
 * Dashboard principal para profesores
 */
const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  // Asegurarnos de que currentUser tenga el tipo correcto con last_login
  const typedUser = currentUser as User;
  const theme = useTheme();
  
  // Estados para datos
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<PendingGradingAssignment[]>([]);
  const [todayClasses, setTodayClasses] = useState<TeacherClass[]>([]);
  const [studentCount, setStudentCount] = useState<number>(0);
  
  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // En una implementación real, estos serían endpoints diferentes
        // Aquí simulamos las llamadas a la API utilizando ApiService
        
        // Obtener clases del profesor
        const classesResponse = await ApiService.get<TeacherClass[]>('/teachers/me/classes');
        const classesData = Array.isArray(classesResponse.data) ? classesResponse.data : [];
        setClasses(classesData);
        
        // Contar estudiantes totales (sin duplicados)
        const uniqueStudentIds = new Set<number>();
        classesData.forEach((cls: TeacherClass) => {
          cls.students?.forEach(student => uniqueStudentIds.add(student.id));
        });
        setStudentCount(uniqueStudentIds.size);
        
        // Obtener tareas pendientes de calificar
        const assignmentsResponse = await ApiService.get<PendingGradingAssignment[]>('/teachers/me/assignments/pending');
        const assignmentsData = Array.isArray(assignmentsResponse.data) ? assignmentsResponse.data : [];
        setPendingAssignments(assignmentsData);
        
        // Filtrar clases de hoy
        const today = new Date().toDateString();
        const todaysClasses = classesData.filter((cls: TeacherClass) => {
          return cls.next_session && new Date(cls.next_session).toDateString() === today;
        });
        setTodayClasses(todaysClasses);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar algunos datos. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

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
          username={typedUser?.full_name || 'Profesor'}
          role={typedUser?.role}
          photo={typedUser?.photo || undefined}
          lastLogin={typedUser?.last_login}
        />
      )}
      
      {/* Tarjetas de estadísticas */}
      <Stack direction="row" spacing={3} sx={{ mb: 3 }} flexWrap="wrap">
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Clases" 
              value={classes.length}
              icon={<ClassIcon />} 
              color="primary"
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Estudiantes" 
              value={studentCount}
              icon={<PeopleAltIcon />} 
              color="secondary"
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Clases hoy" 
              value={todayClasses.length}
              icon={<CalendarTodayIcon />} 
              color="info"
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Por calificar" 
              value={pendingAssignments.reduce((acc, a) => acc + a.pending_count, 0)}
              icon={<AssignmentIcon />} 
              color={pendingAssignments.length > 5 ? "warning" : "success"}
            />
          )}
        </Box>
      </Stack>
      
      {/* Segunda fila - Clases de hoy, tareas pendientes y notificaciones */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={3} 
        sx={{ mb: 3 }}
      >
        {/* Clases de hoy */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Mis clases</Typography>
              <Button 
                size="small" 
                sx={{ textTransform: 'none' }}
                onClick={() => console.log('Ver todas las clases')}
              >
                Ver todas
              </Button>
            </Box>
            
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" />
                  <Skeleton variant="text" height={20} width="80%" />
                </Box>
              ))
            ) : classes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">
                  No tienes clases asignadas actualmente.
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {classes.slice(0, 4).map((cls, index) => (
                  <React.Fragment key={cls.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        px: 2, 
                        py: 2,
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: cls.next_session && new Date(cls.next_session).toDateString() === new Date().toDateString() 
                          ? `${theme.palette.success.light}20` 
                          : 'transparent'
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {cls.name}
                          </Typography>
                          
                          <Chip 
                            size="small"
                            icon={<PeopleAltIcon fontSize="small" />}
                            label={`${cls.students_count} estudiantes`}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Horario: {cls.schedule}
                        </Typography>
                        
                        {cls.next_session && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <AccessTimeIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                              Próxima clase: {format(new Date(cls.next_session), "EEEE d 'de' MMMM, HH:mm", { locale: es })}
                            </Typography>
                          </Box>
                        )}
                        
                        {cls.students && cls.students.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <AvatarGroup max={5} sx={{ justifyContent: 'flex-start' }}>
                              {cls.students.map(student => (
                                <Tooltip key={student.id} title={student.name}>
                                  <Avatar 
                                    src={student.photo} 
                                    alt={student.name}
                                    sx={{ width: 30, height: 30 }}
                                  >
                                    {student.name.charAt(0)}
                                  </Avatar>
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                          </Box>
                        )}
                      </Box>
                    </ListItem>
                    {index < classes.slice(0, 4).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
            
            {classes.length > 4 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ textTransform: 'none' }}
                  onClick={() => console.log('Ver todas las clases')}
                >
                  Ver todas las clases ({classes.length})
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
        
        {/* Tareas por calificar */}
        <Box sx={{ width: { xs: '100%', md: '41.66%', lg: '33.33%' } }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Tareas por calificar</Typography>
              <Button 
                size="small" 
                sx={{ textTransform: 'none' }}
                onClick={() => console.log('Ver todas las tareas')}
              >
                Ver todas
              </Button>
            </Box>
            
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" />
                </Box>
              ))
            ) : pendingAssignments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">
                  No tienes tareas pendientes por calificar.
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {pendingAssignments.slice(0, 5).map((assignment, index) => (
                  <React.Fragment key={assignment.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ px: 0, py: 2 }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {assignment.title}
                            </Typography>
                            <Chip 
                              size="small"
                              color={assignment.pending_count > 5 ? 'warning' : 'default'}
                              label={`${assignment.pending_count} pendientes`}
                            />
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography 
                              component="span" 
                              variant="body2" 
                              color="text.primary"
                              sx={{ display: 'block' }}
                            >
                              {assignment.course_name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, fontSize: '0.875rem' }}>
                              <Typography variant="caption" color="text.secondary">
                                Fecha límite: {format(new Date(assignment.due_date), "d 'de' MMMM", { locale: es })}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                • {assignment.submissions_count} entregas
                              </Typography>
                            </Box>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < pendingAssignments.slice(0, 5).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
            
            {pendingAssignments.length > 5 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ textTransform: 'none' }}
                  onClick={() => console.log('Ver todas las tareas')}
                >
                  Ver todas las tareas ({pendingAssignments.length})
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Stack>

      {/* Tercera fila - Notificaciones recientes */}
      <Box sx={{ mb: 3 }}>
        <RecentNotifications limit={5} />
      </Box>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
