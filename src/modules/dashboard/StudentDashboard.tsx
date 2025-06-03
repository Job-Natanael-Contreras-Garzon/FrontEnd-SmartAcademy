import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Skeleton,
  Alert,
  useTheme, 
  Stack
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GradeIcon from '@mui/icons-material/Grade';

// Componentes
import DashboardLayout from '../../layouts/DashboardLayout';
import WelcomeBar from '../../components/dashboard/WelcomeBar';
import StatCard from '../../components/dashboard/StatCard';
import AssignmentList from '../../components/dashboard/AssignmentList';
import AcademicPerformanceChart from '../../components/dashboard/AcademicPerformanceChart';

// Contextos y servicios
import { useAuth } from '../../contexts/AuthContext';
import { ApiService } from '../../services/api';

// Tipos
import type { Assignment, Course, Grade, AttendanceSummary } from '../../types/academic';

/**
 * Dashboard principal para estudiantes
 */
const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  
  // Estados para datos
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  
  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // En una implementación real, estos serían endpoints diferentes
        // Aquí simulamos las llamadas a la API utilizando ApiService
        
        // Obtener cursos del estudiante
        const coursesResponse = await ApiService.get('/students/me/courses');
        setCourses(coursesResponse.data as Course[] || []);
        
        // Obtener tareas pendientes
        const assignmentsResponse = await ApiService.get('/students/me/assignments');
        setAssignments(assignmentsResponse.data as Assignment[] || []);
        
        // Obtener resumen de asistencia
        const attendanceResponse = await ApiService.get('/students/me/attendance/summary');
        setAttendanceSummary(attendanceResponse.data as AttendanceSummary || null);
        
        // Obtener calificaciones
        const gradesResponse = await ApiService.get('/students/me/grades');
        setGrades(gradesResponse.data as Grade[] || []);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar algunos datos. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Calcular estadísticas
  const calculateStats = () => {
    // Promedio de calificaciones
    const gradeAverage = grades.length > 0 
      ? grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length 
      : 0;
    
    // Porcentaje de asistencia
    const attendancePercentage = attendanceSummary?.attendance_percentage || 0;
    
    // Total de tareas pendientes
    const pendingAssignmentsCount = assignments?.filter(a => !a.submitted).length || 0;
    
    // Cursos activos
    const activeCourses = courses?.length || 0;
    
    return {
      gradeAverage: gradeAverage.toFixed(1),
      attendancePercentage,
      pendingAssignmentsCount,
      activeCourses
    };
  };
  
  const stats = calculateStats();

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
          username={currentUser?.full_name || 'Estudiante'} 
          role={currentUser?.role}
          lastLogin={(currentUser as any)?.last_login as string | undefined}
          photo={(currentUser?.photo || undefined) as string | undefined}
        />
      )}
      
      {/* Tarjetas de estadísticas */}
      <Stack direction="row" spacing={3} sx={{ mb: 3 }} flexWrap="wrap">
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Promedio de calificaciones" 
              value={stats.gradeAverage}
              icon={<GradeIcon />} 
              color="primary"
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Asistencia" 
              value={`${stats.attendancePercentage}%`}
              icon={<EventNoteIcon />} 
              color={stats.attendancePercentage >= 80 ? 'success' : 'warning'}
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Tareas pendientes" 
              value={stats.pendingAssignmentsCount}
              icon={<AssignmentIcon />} 
              color={stats.pendingAssignmentsCount > 5 ? 'warning' : 'info'}
            />
          )}
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: 1.5 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title="Cursos activos" 
              value={stats.activeCourses}
              icon={<SchoolIcon />} 
              color="secondary"
            />
          )}
        </Box>
      </Stack>
      
      {/* Sección principal: Cursos y tareas */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Cursos actuales */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Mis cursos</Typography>
            
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" />
                  <Skeleton variant="text" height={20} width="80%" />
                </Box>
              ))
            ) : courses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">
                  No estás inscrito en ningún curso actualmente.
                </Typography>
              </Box>
            ) : (
              <Box>
                {courses.slice(0, 4).map((course) => (
                  <Box 
                    key={course.id} 
                    sx={{ 
                      mb: 2,
                      p: 2,
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        boxShadow: 1,
                        borderColor: 'transparent'
                      }
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ fontWeight: 500 }}
                    >
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.teacher_name}
                    </Typography>
                    {course.next_class && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          mt: 1,
                          bgcolor: 'primary.50',
                          color: 'primary.main',
                          p: 0.5,
                          pl: 1,
                          borderRadius: 1,
                          width: 'fit-content' 
                        }}
                      >
                        Próxima clase: {new Date(course.next_class).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
        
        {/* Tareas pendientes */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <AssignmentList 
            assignments={assignments}
            isLoading={isLoading}
            error={error}
            onViewAll={() => console.log('Ver todas las tareas')}
          />
        </Box>
      </Stack>

      {/* Tercera fila - Gráfico de rendimiento académico */}
      <Box sx={{ mt: 3 }}>
        <AcademicPerformanceChart 
          grades={grades} 
          isLoading={isLoading} 
          title="Mi rendimiento académico" 
        />
      </Box>
    </DashboardLayout>
  );
};

export default StudentDashboard;
