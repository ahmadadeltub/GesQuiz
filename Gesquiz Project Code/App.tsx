import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './i18n'; // Import the new LanguageProvider
import { useAuth } from './hooks/useAuth';
import { UserRole } from './types';

import { Header } from './components/common/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { QuizTakerPage } from './pages/QuizTakerPage';
import { QuizReviewPage } from './pages/QuizReviewPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SuperAdminDashboardPage } from './pages/SuperAdminDashboardPage';

// Import new informational pages
import { WhyGestureQuizPage } from './pages/WhyGestureQuizPage';
import { SchoolsPage } from './pages/SchoolsPage';
import { ServiceStatusPage } from './pages/ServiceStatusPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';


// A layout that includes the header
const AppLayout: React.FC = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

// Protect routes that require authentication
const ProtectedRoute: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>; // Or a spinner
  return user ? <>{children || <Outlet />}</> : <Navigate to="/login" replace />;
};

// Protect routes based on user role
const RoleProtectedRoute: React.FC<{ allowedRoles: UserRole[], children?: ReactNode }> = ({ allowedRoles, children }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    if (!user || !allowedRoles.includes(user.role)) {
        // Find the user's default dashboard if they are logged in but have the wrong role
        if (user) {
            if (user.role === UserRole.TEACHER) return <Navigate to="/teacher" replace />;
            if (user.role === UserRole.STUDENT) return <Navigate to="/student" replace />;
            if (user.role === UserRole.ADMIN) return <Navigate to="/admin" replace />;
            if (user.role === UserRole.SUPER_ADMIN) return <Navigate to="/superadmin" replace />;
        }
        return <Navigate to="/" replace />;
    }
    return <>{children || <Outlet />}</>;
}


const AppRoutes: React.FC = () => (
  <Routes>
    <Route element={<AppLayout />}>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* New Informational Pages */}
      <Route path="/why-gesquiz" element={<WhyGestureQuizPage />} />
      <Route path="/schools" element={<SchoolsPage />} />
      <Route path="/service-status" element={<ServiceStatusPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />


      {/* Protected Routes (must be logged in) */}
      <Route element={<ProtectedRoute />}>
        {/* Single-role Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.TEACHER]} />}>
            <Route path="/teacher" element={<TeacherDashboardPage />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.STUDENT]} />}>
            <Route path="/student" element={<StudentDashboardPage />} />
            <Route path="/quiz/:quizId" element={<QuizTakerPage />} />
            <Route path="/review/:attemptId" element={<QuizReviewPage />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]} />}>
            <Route path="/superadmin" element={<SuperAdminDashboardPage />} />
        </Route>
        
        {/* Multi-role Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.TEACHER, UserRole.ADMIN]} />}>
            <Route path="/preview/:quizId" element={<QuizTakerPage />} />
        </Route>
      </Route>
      
      {/* Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
