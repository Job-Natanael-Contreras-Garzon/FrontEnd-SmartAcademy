import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { predictionService } from '../../api/predictionService';
import { userService } from '../../api/userService';
import { courseService } from '../../api/courseService';

const PredictionsPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [loadingAtRisk, setLoadingAtRisk] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [studentsResponse, coursesResponse] = await Promise.all([
        userService.getAllUsers(),
        courseService.getAllCourses()
      ]);
      
      setStudents(studentsResponse.data?.filter(user => user.role === 'STUDENT') || []);
      setCourses(coursesResponse.data || []);
      
      // Fetch at-risk students
      await fetchAtRiskStudents();
    } catch (err) {
      setError('Error loading data: ' + err.message);
    }
  };

  const fetchAtRiskStudents = async () => {
    try {
      setLoadingAtRisk(true);
      const response = await predictionService.getAtRiskStudents();
      setAtRiskStudents(response.data || []);
    } catch (err) {
      console.error('Error fetching at-risk students:', err);
    } finally {
      setLoadingAtRisk(false);
    }
  };

  const handlePredict = async () => {
    if (!selectedStudent || !selectedCourse) {
      setError('Por favor selecciona un estudiante y un curso');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await predictionService.predictStudentPerformance({
        student_id: selectedStudent,
        course_id: selectedCourse
      });
      setPrediction(response.data);
    } catch (err) {
      setError('Error making prediction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Estudiante Desconocido';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Curso Desconocido';
  };

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'alto':
        return 'error';
      case 'medium':
      case 'medio':
        return 'warning';
      case 'low':
      case 'bajo':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'alto':
        return <WarningIcon />;
      case 'medium':
      case 'medio':
        return <TrendingUpIcon />;
      case 'low':
      case 'bajo':
        return <CheckCircleIcon />;
      default:
        return <AnalyticsIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PsychologyIcon color="primary" />
        Predicciones de Rendimiento
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Predicción Individual */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              Predicción Individual
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estudiante</InputLabel>
                <Select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  label="Estudiante"
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Curso</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  label="Curso"
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handlePredict}
                disabled={loading || !selectedStudent || !selectedCourse}
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generar Predicción'}
              </Button>
            </Box>

            {prediction && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Resultado de la Predicción
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Calificación Predicha
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {prediction.predicted_grade?.toFixed(1) || 'N/A'}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={prediction.predicted_grade || 0} 
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {prediction.risk_level && (
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            Nivel de Riesgo
                          </Typography>
                          <Chip
                            icon={getRiskLevelIcon(prediction.risk_level)}
                            label={prediction.risk_level}
                            color={getRiskLevelColor(prediction.risk_level)}
                            size="large"
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  
                  {prediction.confidence && (
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            Confianza del Modelo
                          </Typography>
                          <Typography variant="h5">
                            {(prediction.confidence * 100).toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={prediction.confidence * 100} 
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Estudiantes en Riesgo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="warning" />
                Estudiantes en Riesgo
              </Typography>
              <Tooltip title="Actualizar">
                <IconButton onClick={fetchAtRiskStudents} disabled={loadingAtRisk}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            {loadingAtRisk ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Estudiante</TableCell>
                      <TableCell>Riesgo</TableCell>
                      <TableCell>Probabilidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {atRiskStudents.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="action" fontSize="small" />
                            {getStudentName(student.student_id)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getRiskLevelIcon(student.risk_level)}
                            label={student.risk_level}
                            color={getRiskLevelColor(student.risk_level)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {student.risk_probability ? 
                            `${(student.risk_probability * 100).toFixed(1)}%` : 
                            'N/A'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                    {atRiskStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No hay estudiantes en riesgo detectados
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Estadísticas Rápidas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              Resumen de Predicciones
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Estudiantes
                    </Typography>
                    <Typography variant="h4">
                      {students.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      En Riesgo Alto
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {atRiskStudents.filter(s => s.risk_level?.toLowerCase() === 'high' || s.risk_level?.toLowerCase() === 'alto').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      En Riesgo Medio
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {atRiskStudents.filter(s => s.risk_level?.toLowerCase() === 'medium' || s.risk_level?.toLowerCase() === 'medio').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Cursos Activos
                    </Typography>
                    <Typography variant="h4">
                      {courses.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PredictionsPage;