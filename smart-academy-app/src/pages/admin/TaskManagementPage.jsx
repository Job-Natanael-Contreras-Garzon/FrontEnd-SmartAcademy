import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Warning as OverdueIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format, isAfter, isBefore } from 'date-fns';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment, getAssignmentStats } from '../../api/assignmentService';
import { getCourses } from '../../api/courseService';
import { getUsers } from '../../api/userService';

const TaskManagementPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: new Date(),
    max_score: 100,
    instructions: '',
    type: 'HOMEWORK'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsData, coursesData, usersData, statsData] = await Promise.all([
        getAssignments(),
        getCourses(),
        getUsers(),
        getAssignmentStats()
      ]);
      
      setAssignments(assignmentsData.items || assignmentsData);
      setCourses(coursesData.items || coursesData);
      setStudents((usersData.items || usersData).filter(user => user.role === 'STUDENT'));
      setStats(statsData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        course_id: assignment.course_id || '',
        due_date: new Date(assignment.due_date),
        max_score: assignment.max_score || 100,
        instructions: assignment.instructions || '',
        type: assignment.type || 'HOMEWORK'
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        title: '',
        description: '',
        course_id: '',
        due_date: new Date(),
        max_score: 100,
        instructions: '',
        type: 'HOMEWORK'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      course_id: '',
      due_date: new Date(),
      max_score: 100,
      instructions: '',
      type: 'HOMEWORK'
    });
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        due_date: formData.due_date.toISOString()
      };
      
      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, submitData);
      } else {
        await createAssignment(submitData);
      }
      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError('Error al guardar la tarea');
      console.error('Error saving assignment:', err);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteAssignment(assignmentId);
        await fetchData();
      } catch (err) {
        setError('Error al eliminar la tarea');
        console.error('Error deleting assignment:', err);
      }
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.subject?.name || 'N/A'} - ${course.group?.name || 'N/A'}` : 'N/A';
  };

  const getAssignmentStatus = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    
    if (assignment.submissions && assignment.submissions.length > 0) {
      const completedSubmissions = assignment.submissions.filter(s => s.status === 'SUBMITTED').length;
      const totalStudents = students.length;
      const completionRate = (completedSubmissions / totalStudents) * 100;
      
      if (completionRate === 100) return 'COMPLETED';
      if (isAfter(now, dueDate)) return 'OVERDUE';
      return 'IN_PROGRESS';
    }
    
    if (isAfter(now, dueDate)) return 'OVERDUE';
    if (isBefore(now, dueDate)) return 'PENDING';
    return 'PENDING';
  };

  const getStatusChip = (assignment) => {
    const status = getAssignmentStatus(assignment);
    const statusConfig = {
      PENDING: { label: 'Pendiente', color: 'default', icon: <PendingIcon /> },
      IN_PROGRESS: { label: 'En Progreso', color: 'primary', icon: <ScheduleIcon /> },
      COMPLETED: { label: 'Completada', color: 'success', icon: <CompletedIcon /> },
      OVERDUE: { label: 'Vencida', color: 'error', icon: <OverdueIcon /> }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="outlined"
        icon={config.icon}
        size="small"
      />
    );
  };

  const getTypeChip = (type) => {
    const typeConfig = {
      HOMEWORK: { label: 'Tarea', color: 'primary' },
      EXAM: { label: 'Examen', color: 'error' },
      PROJECT: { label: 'Proyecto', color: 'success' },
      QUIZ: { label: 'Quiz', color: 'warning' },
      LAB: { label: 'Laboratorio', color: 'info' }
    };
    
    const config = typeConfig[type] || typeConfig.HOMEWORK;
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="filled"
        size="small"
      />
    );
  };

  const getCompletionRate = (assignment) => {
    if (!assignment.submissions || assignment.submissions.length === 0) return 0;
    const completedSubmissions = assignment.submissions.filter(s => s.status === 'SUBMITTED').length;
    const totalStudents = students.length;
    return totalStudents > 0 ? (completedSubmissions / totalStudents) * 100 : 0;
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = filterStatus ? getAssignmentStatus(assignment) === filterStatus : true;
    const matchesCourse = filterCourse ? assignment.course_id === parseInt(filterCourse) : true;
    return matchesStatus && matchesCourse;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssignmentIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{assignments.length}</Typography>
                    <Typography color="textSecondary">Tareas Totales</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PendingIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.pending || 0}</Typography>
                    <Typography color="textSecondary">Pendientes</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CompletedIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.completed || 0}</Typography>
                    <Typography color="textSecondary">Completadas</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <OverdueIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.overdue || 0}</Typography>
                    <Typography color="textSecondary">Vencidas</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" gutterBottom>
              Gestión de Tareas
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Nueva Tarea
            </Button>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="PENDING">Pendiente</MenuItem>
                  <MenuItem value="IN_PROGRESS">En Progreso</MenuItem>
                  <MenuItem value="COMPLETED">Completada</MenuItem>
                  <MenuItem value="OVERDUE">Vencida</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Curso</InputLabel>
                <Select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                >
                  <MenuItem value="">Todos los cursos</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {getCourseName(course.id)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Fecha Límite</TableCell>
                  <TableCell>Puntuación Máxima</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Progreso</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssignments.map((assignment) => {
                  const completionRate = getCompletionRate(assignment);
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{assignment.title}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {assignment.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getCourseName(assignment.course_id)}</TableCell>
                      <TableCell>{getTypeChip(assignment.type)}</TableCell>
                      <TableCell>
                        {format(new Date(assignment.due_date), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{assignment.max_score}</TableCell>
                      <TableCell>{getStatusChip(assignment)}</TableCell>
                      <TableCell>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={completionRate}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption">
                            {completionRate.toFixed(1)}% completado
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(assignment)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Assignment Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingAssignment ? 'Editar Tarea' : 'Nueva Tarea'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Curso</InputLabel>
                  <Select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {getCourseName(course.id)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <MenuItem value="HOMEWORK">Tarea</MenuItem>
                    <MenuItem value="EXAM">Examen</MenuItem>
                    <MenuItem value="PROJECT">Proyecto</MenuItem>
                    <MenuItem value="QUIZ">Quiz</MenuItem>
                    <MenuItem value="LAB">Laboratorio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Fecha Límite"
                  value={formData.due_date}
                  onChange={(newValue) => setFormData({ ...formData, due_date: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Puntuación Máxima"
                  type="number"
                  value={formData.max_score}
                  onChange={(e) => setFormData({ ...formData, max_score: parseInt(e.target.value) })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instrucciones"
                  multiline
                  rows={4}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingAssignment ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default TaskManagementPage;