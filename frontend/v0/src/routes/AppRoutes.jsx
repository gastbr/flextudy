import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import WalletPage from '../pages/dashboard/WalletPage';
import UserManagementPage from '../pages/dashboard/UserManagementPage';
import AdminSettingsPage from '../pages/dashboard/AdminSettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      
      <Route path="/dashboard/profile" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />
      
      <Route path="/dashboard/settings" element={
        <PrivateRoute>
          <SettingsPage />
        </PrivateRoute>
      } />
      
      {/* Student-only routes */}
      <Route path="/dashboard/wallet" element={
        <RoleBasedRoute roles={['student']}>
          <WalletPage />
        </RoleBasedRoute>
      } />
      
      {/* Admin-only routes */}
      <Route path="/dashboard/users" element={
        <RoleBasedRoute roles={['admin']}>
          <UserManagementPage />
        </RoleBasedRoute>
      } />
      
      <Route path="/dashboard/admin/settings" element={
        <RoleBasedRoute roles={['admin']}>
          <AdminSettingsPage />
        </RoleBasedRoute>
      } />
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function RoleBasedRoute({ children, roles }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

export default AppRoutes;
