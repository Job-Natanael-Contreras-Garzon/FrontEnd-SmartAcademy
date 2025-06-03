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
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Chip,
  Card
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';

// Componentes
import DashboardLayout from '../../layouts/DashboardLayout';
import WelcomeBar from '../../components/dashboard/WelcomeBar';
import StatCard from '../../components/dashboard/StatCard';

// Contextos y servicios
import { useAuth } from '../../contexts/AuthContext';
import { ApiService } from '../../services/api';

// Tipos
import type { Student, Grade, Assignment } from '../../types/academic';

interface StudentDashboardData {
  id: number;
  full_name: string;
  grade: string;
  section: string;
  photo?: string;
  grades?: {
    value: number;
    course_name: string;
  }[];
  attendance_summary?: {
    attendance_percentage: number;
  };
  assignments?: {
    id: number;
    title: string;
    course_name: string;
    due_date: string;
    submitted: boolean;
  }[];
}

interface ParentDashboardProps {
  children?: React.ReactNode;
}

/**
 * Dashboard principal para padres
 */
const ParentDashboard: React.FC<ParentDashboardProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  
  // Estados para datos
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // En una implementación real, estos serían endpoints diferentes
        // Aquí simulamos las llamadas a la API utilizando ApiService
        
        // Obtener hijos del padre
        const studentsResponse = await ApiService.get('/parents/me/students');
        setStudents(studentsResponse.data as Student[] || []);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar algunos datos. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Obtener estadísticas de un estudiante
  const getStudentStats = (student: Student) => {
    const grades = student.grades || [];
    const assignments = student.assignments || [];
    const attendanceSummary = student.attendance_summary || { attendance_percentage: 0 };
    
    return {
      averageGrade: grades.reduce((sum: number, grade: Grade) => sum + grade.value, 0) / grades.length || 0,
      attendancePercentage: attendanceSummary.attendance_percentage,
      pendingAssignments: assignments.filter((a: Assignment) => !a.submitted).length,
    };
  };

  // Obtener el estado de asistencia
  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
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
          username={currentUser?.full_name || 'Padre'} 
          role="Parent"
          lastLogin={currentUser?.last_login}
        />
      )}
      
      {/* Estadísticas generales */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' } }}>
          <StatCard 
            title="Hijos" 
            value={students.length}
            icon={<PersonIcon />} 
            color="primary"
          />
        </Box>
        
        {students.map((student) => (
          <Box key={student.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' } }}>
            <StatCard 
              title={student.full_name} 
              value={getStudentStats(student).averageGrade.toFixed(1)}
              icon={<GradeIcon />} 
              color={getStudentStats(student).averageGrade >= 7 ? 'success' : 'warning'}
              subtitle={`Asistencia: ${getStudentStats(student).attendancePercentage}%`}
            />
          </Box>
        ))}
      </Box>
      
      {/* Lista de hijos */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mis hijos
        </Typography>
        
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={120} />
            </Card>
          ))
        ) : students.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">
              No tienes hijos registrados en el sistema.
            </Typography>
          </Box>
        ) : (
          <List>
            {students.map((student) => (
              <React.Fragment key={student.id}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      size="small" 
                      sx={{ textTransform: 'none' }}
                      onClick={() => console.log('Ver detalles de', student.full_name)}
                    >
                      Ver detalles
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ bgcolor: theme.palette.primary.main }}
                      src={student.photo}
                    >
                      {student.full_name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.full_name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block' }}
                        >
                          {student.grade}° {student.section}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip 
                            size="small" 
                            label={`Calificación: ${getStudentStats(student).averageGrade.toFixed(1)}`} 
                            color={getStudentStats(student).averageGrade >= 7 ? 'success' : 'warning'}
                          />
                          <Chip 
                            size="small" 
                            label={`Asistencia: ${getStudentStats(student).attendancePercentage}%`} 
                            color={getAttendanceStatus(getStudentStats(student).attendancePercentage)}
                          />
                          <Chip 
                            size="small" 
                            label={`${getStudentStats(student).pendingAssignments} tareas pendientes`} 
                            color={getStudentStats(student).pendingAssignments > 5 ? 'warning' : 'default'}
                          />
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
      
      {/* Tareas pendientes */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Tareas pendientes
        </Typography>
        
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={100} />
            </Card>
          ))
        ) : (
          <List>
            {students.flatMap(student => 
              student.assignments?.filter(a => !a.submitted).map((assignment) => (
                <React.Fragment key={assignment.id}>
                  <ListItem 
                    secondaryAction={
                      <Button 
                        size="small" 
                        sx={{ textTransform: 'none' }}
                        onClick={() => console.log('Ver tarea', assignment.title)}
                      >
                        Ver tarea
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ bgcolor: theme.palette.primary.main }}
                      >
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={assignment.title}
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
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                          >
                            Entrega: {new Date(assignment.due_date).toLocaleDateString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              )) || [])
            }
          </List>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default ParentDashboard;
