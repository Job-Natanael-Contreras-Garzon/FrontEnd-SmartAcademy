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
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Schedule as LateIcon,
  EventNote as EventIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { getAttendance, createAttendance, updateAttendance, deleteAttendance, getAttendanceStats } from '../../api/attendanceService';
import { getCourses } from '../../api/courseService';
import { getUsers } from '../../api/userService';

const AttendanceManagementPage = () => {
  const [attendance, setAttendance] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkAttendance, setBulkAttendance] = useState({});
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    date: new Date(),
    status: 'PRESENT',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceData, coursesData, usersData, statsData] = await Promise.all([
        getAttendance(),
        getCourses(),
        getUsers(),
        getAttendanceStats()
      ]);
      
      setAttendance(attendanceData.items || attendanceData);
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

  const handleOpenDialog = (attendanceRecord = null) => {
    if (attendanceRecord) {
      setEditingAttendance(attendanceRecord);
      setFormData({
        student_id: attendanceRecord.student_id || '',
        course_id: attendanceRecord.course_id || '',
        date: new Date(attendanceRecord.date),
        status: attendanceRecord.status || 'PRESENT',
        notes: attendanceRecord.notes || ''
      });
    } else {
      setEditingAttendance(null);
      setFormData({
        student_id: '',
        course_id: '',
        date: new Date(),
        status: 'PRESENT',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAttendance(null);
    setFormData({
      student_id: '',
      course_id: '',
      date: new Date(),
      status: 'PRESENT',
      notes: ''
    });
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        date: format(formData.date, 'yyyy-MM-dd')
      };
      
      if (editingAttendance) {
        await updateAttendance(editingAttendance.id, submitData);
      } else {
        await createAttendance(submitData);
      }
      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError('Error al guardar la asistencia');
      console.error('Error saving attendance:', err);
    }
  };

  const handleDelete = async (attendanceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro de asistencia?')) {
      try {
        await deleteAttendance(attendanceId);
        await fetchData();
      } catch (err) {
        setError('Error al eliminar el registro de asistencia');
        console.error('Error deleting attendance:', err);
      }
    }
  };

  const handleBulkSubmit = async () => {
    try {
      const promises = Object.entries(bulkAttendance).map(([studentId, status]) => {
        return createAttendance({
          student_id: parseInt(studentId),
          course_id: selectedCourse,
          date: format(selectedDate, 'yyyy-MM-dd'),
          status: status,
          notes: ''
        });
      });
      
      await Promise.all(promises);
      await fetchData();
      setBulkAttendance({});
      setBulkMode(false);
    } catch (err) {
      setError('Error al guardar la asistencia masiva');
      console.error('Error saving bulk attendance:', err);
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

  const getStatusChip = (status) => {
    const statusConfig = {
      PRESENT: { label: 'Presente', color: 'success', icon: <PresentIcon /> },
      ABSENT: { label: 'Ausente', color: 'error', icon: <AbsentIcon /> },
      LATE: { label: 'Tardanza', color: 'warning', icon: <LateIcon /> },
      EXCUSED: { label: 'Justificado', color: 'info', icon: <EventIcon /> }
    };
    
    const config = statusConfig[status] || statusConfig.PRESENT;
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

  const filteredAttendance = attendance.filter(record => {
    const matchesDate = selectedDate ? 
      format(new Date(record.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') : true;
    const matchesCourse = selectedCourse ? record.course_id === parseInt(selectedCourse) : true;
    return matchesDate && matchesCourse;
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
                  <PresentIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.total_present || 0}</Typography>
                    <Typography color="textSecondary">Presentes Hoy</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AbsentIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.total_absent || 0}</Typography>
                    <Typography color="textSecondary">Ausentes Hoy</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <LateIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.total_late || 0}</Typography>
                    <Typography color="textSecondary">Tardanzas Hoy</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.attendance_rate || '0%'}</Typography>
                    <Typography color="textSecondary">Tasa de Asistencia</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" gutterBottom>
              Gestión de Asistencia
            </Typography>
            <Box>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => setBulkMode(!bulkMode)}
              >
                {bulkMode ? 'Modo Individual' : 'Registro Masivo'}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Nueva Asistencia
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Fecha"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Curso</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
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

          {/* Bulk Mode */}
          {bulkMode && selectedCourse && (
            <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Registro Masivo - {getCourseName(parseInt(selectedCourse))}
              </Typography>
              <Grid container spacing={2}>
                {students.map((student) => (
                  <Grid item xs={12} sm={6} md={4} key={student.id}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography>{student.full_name}</Typography>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={bulkAttendance[student.id] || 'PRESENT'}
                          onChange={(e) => setBulkAttendance({
                            ...bulkAttendance,
                            [student.id]: e.target.value
                          })}
                        >
                          <MenuItem value="PRESENT">Presente</MenuItem>
                          <MenuItem value="ABSENT">Ausente</MenuItem>
                          <MenuItem value="LATE">Tardanza</MenuItem>
                          <MenuItem value="EXCUSED">Justificado</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box mt={2}>
                <Button variant="contained" onClick={handleBulkSubmit}>
                  Guardar Asistencia Masiva
                </Button>
              </Box>
            </Paper>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Notas</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{getStudentName(record.student_id)}</TableCell>
                    <TableCell>{getCourseName(record.course_id)}</TableCell>
                    <TableCell>{getStatusChip(record.status)}</TableCell>
                    <TableCell>{record.notes || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(record)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(record.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Attendance Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingAttendance ? 'Editar Asistencia' : 'Nueva Asistencia'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estudiante</InputLabel>
                  <Select
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
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
                <DatePicker
                  label="Fecha"
                  value={formData.date}
                  onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="PRESENT">Presente</MenuItem>
                    <MenuItem value="ABSENT">Ausente</MenuItem>
                    <MenuItem value="LATE">Tardanza</MenuItem>
                    <MenuItem value="EXCUSED">Justificado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingAttendance ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceManagementPage;