import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import AtmosphericBackground from './components/AtmosphericBackground';

import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PredictionPage from './pages/PredictionPage';
import VisionPage from './pages/VisionPage';
import RecoveryPage from './pages/RecoveryPage';
import RescuePage from './pages/RescuePage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/prediction" element={<ProtectedRoute><PredictionPage /></ProtectedRoute>} />
        <Route path="/vision" element={<ProtectedRoute><VisionPage /></ProtectedRoute>} />
        <Route path="/recovery" element={<ProtectedRoute><RecoveryPage /></ProtectedRoute>} />
        <Route path="/rescue" element={<ProtectedRoute><RescuePage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute allowedRoles={['Administrator', 'Mess Manager']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={['Administrator']}><UsersPage /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else if (!storedTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AtmosphericBackground />
        <Toaster 
          position="bottom-right" 
          toastOptions={{ 
            duration: 4000,
            className: 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl',
            style: { borderRadius: '12px' }
          }} 
        />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
