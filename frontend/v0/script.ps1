# Create directory structure
New-Item -ItemType Directory -Force -Path public/images
New-Item -ItemType Directory -Force -Path src/components/ui
New-Item -ItemType Directory -Force -Path src/components/layout
New-Item -ItemType Directory -Force -Path src/components/auth
New-Item -ItemType Directory -Force -Path src/components/common
New-Item -ItemType Directory -Force -Path src/pages/dashboard
New-Item -ItemType Directory -Force -Path src/contexts
New-Item -ItemType Directory -Force -Path src/hooks
New-Item -ItemType Directory -Force -Path src/services
New-Item -ItemType Directory -Force -Path src/utils
New-Item -ItemType Directory -Force -Path src/routes
New-Item -ItemType Directory -Force -Path src/assets/styles
New-Item -ItemType Directory -Force -Path src/assets/icons

# Create placeholder files
New-Item -ItemType File -Force -Path public/images/placeholder.svg

# Create main files
@"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@ | Out-File -FilePath src/index.js -Force

@"
import { BrowserRouter as Router } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
"@ | Out-File -FilePath src/App.js -Force

# Create component files
@"
function Button({ children, variant = "default", className = "", ...props }) {
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-500",
  };
  
  const variantStyle = variants[variant] || variants.default;
  
  return (
    <button 
      className={`${baseStyles} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
"@ | Out-File -FilePath src/components/ui/Button.jsx -Force

@"
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header className="h-16 border-b bg-white flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-lg">FCT School</span>
          </Link>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </div>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
"@ | Out-File -FilePath src/components/layout/Header.jsx -Force

@"
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

function Sidebar() {
  const { user } = useAuth();
  
  return (
    <aside className="hidden md:flex w-64 border-r flex-col">
      <nav className="flex flex-col gap-1 p-2 flex-1">
        <NavItem href="/dashboard" label="Calendar" />
        <NavItem href="/dashboard/classes" label="My Classes" />
        
        {user?.role === 'student' && (
          <NavItem href="/dashboard/wallet" label="Wallet" />
        )}
        
        <NavItem href="/dashboard/profile" label="Profile" />
        <NavItem href="/dashboard/settings" label="Settings" />
        
        {user?.role === 'admin' && (
          <>
            <div className="mt-2 pt-2 border-t">
              <div className="px-3 py-1.5 text-xs font-medium text-gray-500">Admin</div>
              <NavItem href="/dashboard/users" label="User Management" />
              <NavItem href="/dashboard/admin/settings" label="Platform Settings" />
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}

function NavItem({ href, label }) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100"
    >
      <span>{label}</span>
    </Link>
  );
}

export default Sidebar;
"@ | Out-File -FilePath src/components/layout/Sidebar.jsx -Force

@"
import Header from './Header';
import Sidebar from './Sidebar';

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
"@ | Out-File -FilePath src/components/layout/DashboardLayout.jsx -Force

# Create context files
@"
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  const login = (credentials) => {
    // Mock login - in a real app, this would call an API
    const mockUsers = {
      'admin@example.com': { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      'teacher@example.com': { id: 2, name: 'Teacher User', email: 'teacher@example.com', role: 'teacher' },
      'student@example.com': { id: 3, name: 'Student User', email: 'student@example.com', role: 'student' },
    };
    
    const user = mockUsers[credentials.email];
    if (user && credentials.password === 'password') {
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return Promise.resolve(user);
    }
    
    return Promise.reject(new Error('Invalid credentials'));
  };
  
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}
"@ | Out-File -FilePath src/contexts/AuthContext.jsx -Force

# Create hooks
@"
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
"@ | Out-File -FilePath src/hooks/useAuth.js -Force

# Create routes
@"
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
"@ | Out-File -FilePath src/routes/AppRoutes.jsx -Force

# Create basic page files
@"
import { Link } from 'react-router';
import Button from '../components/ui/Button';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Streamline Your Educational Experience
              </h1>
              <p className="text-xl text-white/90 max-w-xl">
                A comprehensive platform for schools and academies to manage classes, 
                attendance, payments, and communication in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/login">
                  <Button className="bg-white text-blue-600 hover:bg-white/90">
                    Get Started
                  </Button>
                </Link>
                <Link to="#features">
                  <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl bg-gray-200">
                {/* Placeholder for image */}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">FCT School</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} FCT School. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
"@ | Out-File -FilePath src/pages/LandingPage.jsx -Force

@"
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <span className="font-bold text-xl">FCT School</span>
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-gray-500 mt-1">
              Enter your email and password to access your account
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <Button className="w-full">Sign In</Button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            <p>Demo Accounts (password: "password" for all)</p>
            <ul className="mt-2">
              <li>Admin: admin@example.com</li>
              <li>Teacher: teacher@example.com</li>
              <li>Student: student@example.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
"@ | Out-File -FilePath src/pages/LoginPage.jsx -Force

@"
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

function DashboardPage() {
  const [viewMode, setViewMode] = useState('month');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-gray-500">
              View and manage your classes and schedule
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Month
            </button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 min-h-[500px] bg-white">
          {viewMode === 'list' ? (
            <div className="space-y-4">
              <p className="text-center text-gray-500">List view placeholder</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center p-2 font-medium bg-gray-50">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square border p-1 min-h-[80px]">
                  <div className="text-sm">{i + 1}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
"@ | Out-File -FilePath src/pages/dashboard/DashboardPage.jsx -Force

# Create placeholder files for remaining pages
New-Item -ItemType File -Force -Path src/pages/RegisterPage.jsx
New-Item -ItemType File -Force -Path src/pages/NotFoundPage.jsx
New-Item -ItemType File -Force -Path src/pages/dashboard/ProfilePage.jsx
New-Item -ItemType File -Force -Path src/pages/dashboard/SettingsPage.jsx
New-Item -ItemType File -Force -Path src/pages/dashboard/WalletPage.jsx
New-Item -ItemType File -Force -Path src/pages/dashboard/UserManagementPage.jsx
New-Item -ItemType File -Force -Path src/pages/dashboard/AdminSettingsPage.jsx

# Create placeholder files for services
New-Item -ItemType File -Force -Path src/services/api.js
New-Item -ItemType File -Force -Path src/services/authService.js
New-Item -ItemType File -Force -Path src/services/classService.js
New-Item -ItemType File -Force -Path src/services/userService.js

# Create placeholder files for utils
New-Item -ItemType File -Force -Path src/utils/dateUtils.js
New-Item -ItemType File -Force -Path src/utils/validationUtils.js

Write-Output "FCT School React project structure created successfully!"