import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Grade as GradeIcon,
  School as SchoolIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import * as gradeService from '../../api/gradeService';
import * as userService from '../../api/userService';
import * as courseService from '../../api/courseService';

const GradeManagementPage = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    grade: '',
    comments: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gradesResponse, studentsResponse, coursesResponse] = await Promise.all([
        gradeService.getAllGrades(),
        userService.getAllUsers(),
        courseService.getAllCourses()
      ]);
      
      setGrades(gradesResponse.data || []);
      setStudents(studentsResponse.data?.filter(user => user.role === 'STUDENT') || []);
      setCourses(coursesResponse.data || []);
    } catch (err) {
      setError('Error loading data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (grade = null) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({
        student_id: grade.student_id,
        course_id: grade.course_id,
        grade: grade.grade,
        comments: grade.comments || ''
      });
    } else {
      setEditingGrade(null);
      setFormData({
        student_id: '',
        course_id: '',
        grade: '',
        comments: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGrade(null);
    setFormData({
      student_id: '',
      course_id: '',
      grade: '',
      comments: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingGrade) {
        await gradeService.updateGrade(editingGrade.id, formData);
      } else {
        await gradeService.createGrade(formData);
      }
      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError('Error saving grade: ' + err.message);
    }
  };

  const handleDelete = async (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await gradeService.deleteGrade(gradeId);
        await fetchData();
      } catch (err) {
        setError('Error deleting grade: ' + err.message);
      }
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown Student';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const getGradeColor = (grade) => {
    const numGrade = parseFloat(grade);
    if (numGrade >= 90) return 'success';
    if (numGrade >= 80) return 'info';
    if (numGrade >= 70) return 'warning';
    return 'error';
  };

  const calculateStats = () => {
    if (grades.length === 0) return { total: 0, average: 0, passing: 0 };
    
    const total = grades.length;
    const sum = grades.reduce((acc, grade) => acc + parseFloat(grade.grade || 0), 0);
    const average = sum / total;
    const passing = grades.filter(grade => parseFloat(grade.grade || 0) >= 70).length;
    
    return { total, average: average.toFixed(2), passing };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GradeIcon color="primary" />
        Grade Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Grades
              </Typography>
              <Typography variant="h4">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Grade
              </Typography>
              <Typography variant="h4">
                {stats.average}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Passing Grades
              </Typography>
              <Typography variant="h4">
                {stats.passing}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pass Rate
              </Typography>
              <Typography variant="h4">
                {stats.total > 0 ? ((stats.passing / stats.total) * 100).toFixed(1) : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grades Table */}
      <Paper sx={{ mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="action" />
                      {getStudentName(grade.student_id)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon color="action" />
                      {getCourseName(grade.course_id)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={grade.grade}
                      color={getGradeColor(grade.grade)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{grade.comments || '-'}</TableCell>
                  <TableCell>
                    {grade.created_at ? new Date(grade.created_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Grade">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(grade)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Grade">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(grade.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {grades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No grades found. Click the + button to add a new grade.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Grade FAB */}
      <Fab
        color="primary"
        aria-label="add grade"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Grade Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGrade ? 'Edit Grade' : 'Add New Grade'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Student</InputLabel>
              <Select
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                label="Student"
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Course</InputLabel>
              <Select
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                label="Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Grade"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Comments"
              multiline
              rows={3}
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.student_id || !formData.course_id || !formData.grade}
          >
            {editingGrade ? 'Update' : 'Add'} Grade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GradeManagementPage;