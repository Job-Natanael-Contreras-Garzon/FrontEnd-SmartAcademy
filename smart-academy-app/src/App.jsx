import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Common Pages
import UserProfilePage from './pages/common/UserProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import CourseManagementPage from './pages/admin/CourseManagementPage';
import EnrollmentManagementPage from './pages/admin/EnrollmentManagementPage';
import GeneralSettingsPage from './pages/admin/GeneralSettingsPage';
import GradeManagementPage from './pages/admin/GradeManagementPage';
import AttendanceManagementPage from './pages/admin/AttendanceManagementPage';
import TaskManagementPage from './pages/admin/TaskManagementPage';
import MLAnalyticsPage from './pages/admin/MLAnalyticsPage';

// Teacher Pages
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
import MyCoursesPage from './pages/teacher/MyCoursesPage';
import GradesPage from './pages/teacher/GradesPage';
import AttendancePage from './pages/teacher/AttendancePage';

// Authentication check
const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  console.log('[App.jsx] isAuthenticated check, token:', token); // <--- NUEVO LOG
  return !!token;
};

// ProtectedRoute component (remains mostly the same for now)
const ProtectedRoute = ({ children }) => {
  console.log('[App.jsx] ProtectedRoute rendering'); // <--- NUEVO LOG
  if (!isAuthenticated()) {
    console.log('[App.jsx] ProtectedRoute: Not authenticated, redirecting to /auth/login'); // <--- NUEVO LOG
    return <Navigate to="/auth/login" replace />;
  }
  // Further role-based access control can be added here if needed beyond sidebar link filtering
  console.log('[App.jsx] ProtectedRoute: Authenticated, rendering children'); // <--- NUEVO LOG
  return children;
};

// Component to redirect to the correct dashboard based on role
const RoleBasedDashboardRedirect = () => {
  const userRole = localStorage.getItem('user_role');
  console.log('[App.jsx] RoleBasedDashboardRedirect rendering. userRole from localStorage:', userRole); // <--- NUEVO LOG
  if (userRole === 'ADMINISTRATOR') {
    console.log('[App.jsx] RoleBasedDashboardRedirect: Role is ADMINISTRATOR, redirecting to /admin/dashboard'); // <--- NUEVO LOG
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRole === 'teacher') {
    console.log('[App.jsx] RoleBasedDashboardRedirect: Role is teacher, redirecting to /teacher/dashboard'); // <--- NUEVO LOG
    return <Navigate to="/teacher/dashboard" replace />;
  }
  // Fallback if role is not found or unexpected (should not happen if authenticated)
  // Or, navigate to a generic "select role" page if applicable in other scenarios
  console.log('[App.jsx] RoleBasedDashboardRedirect: Role not matched or not found, redirecting to /auth/login. Current role:', userRole); // <--- NUEVO LOG
  return <Navigate to="/auth/login" replace />; 
};

function App() {
  console.log('[App.jsx] App component rendering'); // <--- NUEVO LOG
  return (
    <Routes>
      {/* Rutas de Autenticación */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        {/* Future auth routes: /auth/register, /auth/forgot-password, etc. */}
      </Route>

      {/* Rutas Principales Protegidas con MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Index route redirects to role-specific dashboard */}
        <Route index element={<RoleBasedDashboardRedirect />} />
        
        {/* Role-Specific Dashboards & Common Pages */}
        {/* The dashboard routes are now primary, no longer duplicated under admin/teacher sections */}
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="teacher/dashboard" element={<TeacherDashboardPage />} />
        <Route path="profile" element={<UserProfilePage />} />

        {/* Admin Routes */}
        {/* admin/dashboard is already defined above */}
        <Route path="admin/users" element={<UserManagementPage />} />
        <Route path="admin/courses" element={<CourseManagementPage />} />
        <Route path="admin/enrollments" element={<EnrollmentManagementPage />} />
        <Route path="admin/grades" element={<GradeManagementPage />} />
        <Route path="admin/attendance" element={<AttendanceManagementPage />} />
        <Route path="admin/tasks" element={<TaskManagementPage />} />
        <Route path="admin/ml-analytics" element={<MLAnalyticsPage />} />
        <Route path="admin/settings" element={<GeneralSettingsPage />} />

        {/* Teacher Routes */}
        {/* teacher/dashboard is already defined above */}
        <Route path="teacher/my-courses" element={<MyCoursesPage />} />
        <Route path="teacher/grades" element={<GradesPage />} />
        <Route path="teacher/attendance" element={<AttendancePage />} />
        
        {/* Consider adding a dedicated /unauthorized page if needed */}
      </Route>

      {/* Fallback: Redirect to login if not authenticated, or to main app if authenticated */}
      <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/auth/login"} replace />} />
    </Routes>
  );
}

export default App;
