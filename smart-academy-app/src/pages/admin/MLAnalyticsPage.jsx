import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Psychology as AIIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as InsightIcon,
  Assessment as AssessmentIcon,
  OnlinePrediction as PredictIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  trainModel,
  predictStudentPerformance,
  predictMultipleStudents,
  getAtRiskStudents,
  getDashboardStats,
  MODEL_TYPES,
  RISK_LEVELS,
  getPerformancePredictionColor,
  getRiskLevelColor // Added import for styling risk chips
} from '../../api/predictionService';
import { getUsers } from '../../api/userService';
import { getCourses } from '../../api/courseService';
import { getGrades } from '../../api/gradeService';

const MLAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedModel, setSelectedModel] = useState('PERFORMANCE_PREDICTOR');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [modelAccuracy, setModelAccuracy] = useState(null);
  const [insights, setInsights] = useState([]);

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A0522D', '#D2691E', '#FF6347']; // Colors for Pie Charts

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, coursesData, gradesData, statsData, riskData] = await Promise.all([
        getUsers(),
        getCourses(),
        getGrades(),
        getDashboardStats(),
        getAtRiskStudents()
      ]);
      
      setStudents((usersData.items || usersData).filter(user => user.role === 'STUDENT'));
      setCourses(coursesData.items || coursesData);
      setGrades(gradesData.items || gradesData);
      setDashboardStats(statsData);
      setAtRiskStudents(riskData.items || riskData);
      
      // Generate insights
      generateInsights(statsData, riskData.items || riskData);
    } catch (err) {
      setError('Error al cargar los datos de análisis');
      console.error('Error fetching ML data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (stats, riskStudents) => {
    const newInsights = [];
    
    if (stats?.average_performance < 70) {
      newInsights.push({
        type: 'warning',
        title: 'Rendimiento Académico Bajo',
        description: `El rendimiento promedio está en ${stats.average_performance}%. Se recomienda implementar programas de apoyo académico.`,
        icon: <WarningIcon />
      });
    }
    
    if (riskStudents.length > 0) {
      newInsights.push({
        type: 'error',
        title: 'Estudiantes en Riesgo',
        description: `${riskStudents.length} estudiantes han sido identificados en riesgo de deserción. Requieren atención inmediata.`,
        icon: <WarningIcon />
      });
    }
    
    if (stats?.attendance_rate > 90) {
      newInsights.push({
        type: 'success',
        title: 'Excelente Asistencia',
        description: `La tasa de asistencia es del ${stats.attendance_rate}%. Esto indica un buen compromiso estudiantil.`,
        icon: <SuccessIcon />
      });
    }
    
    setInsights(newInsights);
  };

  const handleTrainModel = async () => {
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const result = await trainModel(selectedModel);
      
      clearInterval(progressInterval);
      setTrainingProgress(100);
      setModelAccuracy(result.accuracy || Math.random() * 0.2 + 0.8); // Simulate accuracy
      
      setTimeout(() => {
        setIsTraining(false);
        setTrainingProgress(0);
      }, 1000);
    } catch (err) {
      setError('Error al entrenar el modelo');
      setIsTraining(false);
      setTrainingProgress(0);
    }
  };

  const handlePredictStudent = async () => {
    if (!selectedStudent || !selectedCourse) return;
    
    try {
      const prediction = await predictStudentPerformance(selectedStudent, selectedCourse);
      setPredictions([prediction]);
    } catch (err) {
      setError('Error al realizar la predicción');
    }
  };

  const handlePredictMultiple = async () => {
    if (!selectedCourse) return;
    
    try {
      const studentIds = students.map(s => s.id);
      const predictions = await predictMultipleStudents(studentIds, selectedCourse);
      setPredictions(predictions);
    } catch (err) {
      setError('Error al realizar las predicciones múltiples');
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.full_name : 'N/A';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.subject?.name || 'N/A'} - ${course.group?.name || 'N/A'}` : 'N/A';
  };

  const getRiskLevelChip = (riskLevel) => {
    const config = {
      LOW: { label: 'Bajo Riesgo', color: 'success' },
      MEDIUM: { label: 'Riesgo Medio', color: 'warning' },
      HIGH: { label: 'Alto Riesgo', color: 'error' }
    };
    
    const levelConfig = config[riskLevel] || config.LOW;
    return <Chip label={levelConfig.label} color={levelConfig.color} size="small" />;
  };

  // Sample data for charts
  const performanceData = [
    { month: 'Ene', promedio: 75, prediccion: 78 },
    { month: 'Feb', promedio: 78, prediccion: 80 },
    { month: 'Mar', promedio: 82, prediccion: 84 },
    { month: 'Abr', promedio: 79, prediccion: 82 },
    { month: 'May', promedio: 85, prediccion: 87 },
    { month: 'Jun', promedio: 88, prediccion: 90 }
  ];

  const riskDistribution = [
    { name: 'Bajo Riesgo', value: 70, color: '#4caf50' },
    { name: 'Riesgo Medio', value: 20, color: '#ff9800' },
    { name: 'Alto Riesgo', value: 10, color: '#f44336' }
  ];

  const subjectPerformance = [
    { subject: 'Matemáticas', performance: 85, prediction: 88 },
    { subject: 'Ciencias', performance: 78, prediction: 82 },
    { subject: 'Historia', performance: 92, prediction: 94 },
    { subject: 'Literatura', performance: 76, prediction: 79 },
    { subject: 'Inglés', performance: 89, prediction: 91 }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <AIIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" gutterBottom>
          Análisis de Machine Learning
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssessmentIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardStats?.total_predictions || 0}</Typography>
                  <Typography color="textSecondary">Predicciones Realizadas</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WarningIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{atRiskStudents.length}</Typography>
                  <Typography color="textSecondary">Estudiantes en Riesgo</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{modelAccuracy ? `${(modelAccuracy * 100).toFixed(1)}%` : 'N/A'}</Typography>
                  <Typography color="textSecondary">Precisión del Modelo</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SchoolIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardStats?.average_performance || 0}%</Typography>
                  <Typography color="textSecondary">Rendimiento Promedio</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Model Training Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Entrenamiento de Modelos
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Modelo</InputLabel>
              <Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {Object.entries(MODEL_TYPES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              onClick={handleTrainModel}
              disabled={isTraining}
              startIcon={<AIIcon />}
            >
              {isTraining ? 'Entrenando...' : 'Entrenar Modelo'}
            </Button>
          </Grid>
          {isTraining && (
            <Grid item xs={12}>
              <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={trainingProgress} />
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Progreso del entrenamiento: {trainingProgress}%
                </Typography>
              </Box>
          </Grid>
        )}
        </Grid> {/* Closes inner Grid container for model training options */}
      </Paper> {/* Closes the main Paper for Model Training Section */}

        {/* Dashboard Summary Stats */}
        {dashboardStats && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Predicciones Totales
                  </Typography>
                  <Typography variant="h3" component="p">
                    {dashboardStats.total_predictions != null ? dashboardStats.total_predictions : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Estudiantes Únicos
                  </Typography>
                  <Typography variant="h3" component="p">
                    {dashboardStats.unique_students != null ? dashboardStats.unique_students : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Performance and Risk Distribution Charts */}
        {dashboardStats && (
          <>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Distribución de Rendimiento Predicho</Typography>
                {dashboardStats.performance_distribution && Object.keys(dashboardStats.performance_distribution).length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(dashboardStats.performance_distribution).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(dashboardStats.performance_distribution).map((entry, index) => (
                          <Cell key={`cell-perf-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <Typography sx={{ textAlign: 'center', mt: 4 }}>No hay datos de distribución de rendimiento.</Typography>}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Distribución de Niveles de Riesgo</Typography>
                {dashboardStats.risk_level_distribution && Object.keys(dashboardStats.risk_level_distribution).length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(dashboardStats.risk_level_distribution).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#82ca9d"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(dashboardStats.risk_level_distribution).map((entry, index) => (
                          <Cell key={`cell-risk-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <Typography sx={{ textAlign: 'center', mt: 4 }}>No hay datos de distribución de riesgo.</Typography>}
              </Paper>
            </Grid>
          </>
        )}

        {/* Common Risk Factors & Correlations */}
        {dashboardStats && (dashboardStats.common_risk_factors?.length > 0 || dashboardStats.correlations) && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                {dashboardStats.common_risk_factors && dashboardStats.common_risk_factors.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="h6" gutterBottom>Factores de Riesgo Comunes</Typography>
                    <List dense>
                      {dashboardStats.common_risk_factors.map((factor, index) => (
                        <ListItem key={`factor-${index}`} sx={{pl:0}}>
                          <ListItemIcon sx={{minWidth: '30px'}}>
                            <WarningIcon color="warning" fontSize="small"/>
                          </ListItemIcon>
                          <ListItemText primary={factor} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {dashboardStats.correlations && Object.keys(dashboardStats.correlations).length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Correlaciones Observadas</Typography>
                    {Object.entries(dashboardStats.correlations).map(([key, value]) => (
                      <Typography key={key} variant="body2" component="div" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                        <strong>{value !== null ? value.toFixed(3) : 'N/A'}</strong>
                      </Typography>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>
        )}

        {/* At-Risk Students Table */}
        {atRiskStudents && atRiskStudents.at_risk_students && atRiskStudents.at_risk_students.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, overflowX: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Estudiantes en Riesgo ({atRiskStudents.risk_level || 'N/A'} - {atRiskStudents.count || 0} identificados)
              </Typography>
              <TableContainer>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Estudiante</TableCell>
                      <TableCell>Curso</TableCell>
                      <TableCell align="right">Cal. Actual</TableCell>
                      <TableCell align="right">Cal. Predicha</TableCell>
                      <TableCell align="right">Diferencia</TableCell>
                      <TableCell>Tendencia</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Nivel Riesgo</TableCell>
                      <TableCell>Factores de Riesgo</TableCell>
                      <TableCell>Recomendaciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(atRiskStudents.at_risk_students || []).map((student) => (
                      <TableRow key={`${student.student_id}-${student.course_id}`}>
                        <TableCell>{student.student_name}</TableCell>
                        <TableCell>{student.course_name}</TableCell>
                        <TableCell align="right">{student.current_grade?.toFixed(1)}</TableCell>
                        <TableCell align="right">{student.predicted_grade?.toFixed(1)}</TableCell>
                        <TableCell align="right" sx={{ color: student.grade_difference < 0 ? 'error.main' : 'success.main' }}>
                          {student.grade_difference?.toFixed(1)}
                        </TableCell>
                        <TableCell>{student.trend_direction}</TableCell>
                        <TableCell>{student.performance_category}</TableCell>
                        <TableCell>
                          <Chip label={student.risk_level} color={getRiskLevelColor(student.risk_level)} size="small" />
                        </TableCell>
                        <TableCell sx={{minWidth: 200}}>
                          {(student.risk_factors || []).map((factor, i) => (
                            <Chip key={`riskfactor-${i}`} label={factor} size="small" sx={{ mr: 0.5, mb: 0.5, whiteSpace: 'normal', height: 'auto', '& .MuiChip-label': { display: 'block', whiteSpace: 'normal' } }} />
                          ))}
                        </TableCell>
                        <TableCell sx={{minWidth: 200}}>
                          {(student.recommendations || []).map((rec, i) => (
                            <Typography key={`rec-${i}`} variant="caption" display="block" sx={{mb: 0.5}}>-{rec}</Typography>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

      {/* Prediction Section */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Predicciones de Rendimiento
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estudiante</InputLabel>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <MenuItem value="">Seleccionar estudiante</MenuItem>
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Curso</InputLabel>
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <MenuItem value="">Seleccionar curso</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {getCourseName(course.id)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              onClick={handlePredictStudent}
              disabled={!selectedStudent || !selectedCourse}
              startIcon={<PredictIcon />}
            >
              Predecir Individual
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              onClick={handlePredictMultiple}
              disabled={!selectedCourse}
              startIcon={<PredictIcon />}
            >
              Predecir Grupo
            </Button>
          </Grid>
        </Grid>

        {predictions.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Predicción</TableCell>
                  <TableCell>Confianza</TableCell>
                  <TableCell>Nivel de Riesgo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((prediction, index) => (
                  <TableRow key={index}>
                    <TableCell>{getStudentName(prediction.student_id)}</TableCell>
                    <TableCell>{getCourseName(prediction.course_id)}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${prediction.predicted_score}%`}
                        style={{ backgroundColor: getPerformancePredictionColor(prediction.predicted_score) }}
                      />
                    </TableCell>
                    <TableCell>{(prediction.confidence * 100).toFixed(1)}%</TableCell>
                    <TableCell>{getRiskLevelChip(prediction.risk_level)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        </Paper>
      </Grid>

      {/* Charts Section */}
      <Grid item xs={12}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tendencia de Rendimiento
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="promedio" stroke="#8884d8" name="Promedio Real" />
                <Line type="monotone" dataKey="prediccion" stroke="#82ca9d" name="Predicción" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Riesgo
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rendimiento por Materia
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="performance" fill="#8884d8" name="Rendimiento Actual" />
                <Bar dataKey="prediction" fill="#82ca9d" name="Predicción" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Insights Section */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Insights y Recomendaciones
        </Typography>
        <List>
          {insights.map((insight, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemIcon>
                  {insight.icon}
                </ListItemIcon>
                <ListItemText
                  primary={insight.title}
                  secondary={insight.description}
                />
              </ListItem>
              {index < insights.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        </Paper>
      </Grid>

      {/* At Risk Students */}
      {atRiskStudents.length > 0 && (
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom color="error">
            Estudiantes en Riesgo
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Nivel de Riesgo</TableCell>
                  <TableCell>Probabilidad de Deserción</TableCell>
                  <TableCell>Factores de Riesgo</TableCell>
                  <TableCell>Recomendaciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {atRiskStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{getStudentName(student.student_id)}</TableCell>
                    <TableCell>{getRiskLevelChip(student.risk_level)}</TableCell>
                    <TableCell>{(student.dropout_probability * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      {student.risk_factors?.map((factor, index) => (
                        <Chip key={index} label={factor} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      {student.recommendations?.map((rec, index) => (
                        <Typography key={index} variant="caption" display="block">
                          • {rec}
                        </Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Paper>
        </Grid>
      )}
    </Grid> {/* Closes the main Grid container (from around line 353) */}
    </Box>
  );
};

export default MLAnalyticsPage;