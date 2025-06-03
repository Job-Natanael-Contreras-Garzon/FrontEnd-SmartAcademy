import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes de autenticación
import LoginPage from '../modules/auth/LoginPage';
import RegisterPage from '../modules/auth/RegisterPage';
import ForgotPasswordPage from '../modules/auth/ForgotPasswordPage';
import ResetPasswordPage from '../modules/auth/ResetPasswordPage';

// Página de notificaciones
import NotificationsPage from '../modules/notifications/NotificationsPage';

// Componente de protección de rutas
import ProtectedRoute from '../components/routing/ProtectedRoute';

// Páginas de error
// Las importaremos cuando estén implementadas
// import AccessDeniedPage from '../modules/auth/AccessDeniedPage';
// import NotFoundPage from '../modules/auth/NotFoundPage';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Contexto de autenticación
import { useAuth } from '../contexts/AuthContext';

// Dashboard para cada rol
import StudentDashboard from '../modules/dashboard/StudentDashboard';
import TeacherDashboard from '../modules/dashboard/TeacherDashboard';
import AdminDashboard from '../modules/dashboard/AdminDashboard';
import ParentDashboard from '../modules/dashboard/ParentDashboard';

const ProfilePage = () => <div>Profile Page</div>;
const SettingsPage = () => <div>Settings Page</div>;

const AdminUsersPage = () => <div>Admin Users Page</div>;
const AdminAcademicPage = () => <div>Admin Academic Management Page</div>;
const AdminSettingsPage = () => <div>Admin Settings Page</div>;

const TeacherClassesPage = () => <div>Teacher Classes Page</div>;
const TeacherGradesPage = () => <div>Teacher Grades Page</div>;
const TeacherAttendancePage = () => <div>Teacher Attendance Page</div>;

const StudentGradesPage = () => <div>Student Grades Page</div>;
const StudentAttendancePage = () => <div>Student Attendance Page</div>;
const StudentAssignmentsPage = () => <div>Student Assignments Page</div>;

const ParentStudentsPage = () => <div>Parent Students Page</div>;
const ParentAcademicProgressPage = () => <div>Parent Academic Progress Page</div>;

const CoursesPage = () => <div>Courses Page</div>;

// Páginas de error temporales hasta que implementemos las definitivas
const AccessDeniedPage = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>Acceso Denegado</h2>
    <p>No tienes permisos para acceder a esta página.</p>
  </div>
);

const NotFoundPage = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>Página no encontrada</h2>
    <p>La página que estás buscando no existe o ha sido movida.</p>
  </div>
);

/**
 * Componente para redirigir al dashboard específico según el rol del usuario
 */
const DashboardRedirect: React.FC = () => {
  const { currentUser } = useAuth();
  
  switch (currentUser?.role) {
    case 'administrator':
      return <Navigate to="/dashboard/admin" replace />;
    case 'teacher':
      return <Navigate to="/dashboard/teacher" replace />;
    case 'student':
      return <Navigate to="/dashboard/student" replace />;
    case 'parent':
      return <Navigate to="/dashboard/parent" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

/**
 * Componente principal de rutas de la aplicación
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      
      {/* Redirigir la ruta raíz a la ruta principal correspondiente */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Rutas protegidas para todos los usuarios autenticados */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/notifications" element={<DashboardLayout><NotificationsPage /></DashboardLayout>} />
        
        {/* Ruta de dashboard: redirige según el rol */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
      </Route>
      
      {/* Rutas específicas para administradores */}
      <Route element={<ProtectedRoute allowedRoles={['administrator']} />}>
        <Route path="/dashboard/admin" element={
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        } />
        <Route path="/admin/users" element={
          <DashboardLayout>
            <AdminUsersPage />
          </DashboardLayout>
        } />
        <Route path="/admin/academic" element={
          <DashboardLayout>
            <AdminAcademicPage />
          </DashboardLayout>
        } />
        <Route path="/admin/settings" element={
          <DashboardLayout>
            <AdminSettingsPage />
          </DashboardLayout>
        } />
      </Route>
      
      {/* Rutas específicas para profesores */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/dashboard/teacher" element={
          <DashboardLayout>
            <TeacherDashboard />
          </DashboardLayout>
        } />
        <Route path="/teacher/classes" element={
          <DashboardLayout>
            <TeacherClassesPage />
          </DashboardLayout>
        } />
        <Route path="/teacher/grades" element={
          <DashboardLayout>
            <TeacherGradesPage />
          </DashboardLayout>
        } />
        <Route path="/teacher/attendance" element={
          <DashboardLayout>
            <TeacherAttendancePage />
          </DashboardLayout>
        } />
      </Route>
      
      {/* Rutas específicas para estudiantes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/dashboard/student" element={
          <DashboardLayout>
            <StudentDashboard />
          </DashboardLayout>
        } />
        <Route path="/student/grades" element={
          <DashboardLayout>
            <StudentGradesPage />
          </DashboardLayout>
        } />
        <Route path="/student/attendance" element={
          <DashboardLayout>
            <StudentAttendancePage />
          </DashboardLayout>
        } />
        <Route path="/student/assignments" element={
          <DashboardLayout>
            <StudentAssignmentsPage />
          </DashboardLayout>
        } />
      </Route>
      
      {/* Rutas específicas para padres/tutores */}
      <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
        <Route path="/dashboard/parent" element={
          <DashboardLayout>
            <ParentDashboard />
          </DashboardLayout>
        } />
        <Route path="/parent/students" element={
          <DashboardLayout>
            <ParentStudentsPage />
          </DashboardLayout>
        } />
        <Route path="/parent/academic-progress" element={
          <DashboardLayout>
            <ParentAcademicProgressPage />
          </DashboardLayout>
        } />
      </Route>
      
      {/* Páginas de error */}
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
