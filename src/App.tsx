import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserDataProvider } from './contexts/UserDataContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Store } from './components/Store';
import { ProblemPage } from './components/ProblemPage';
import "./index.css";

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard' | 'store'>('landing');

  if (loading) {
    return ( 
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div> 
    );
  }

  if (user && (currentPage === 'landing' || currentPage === 'auth')) {
    setCurrentPage('dashboard');
  }

  const handleNavigation = (page: string) => {
    setCurrentPage(page as any);
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage onGetStarted={() => setCurrentPage('auth')} />
          )
        } 
      />
      
      <Route 
        path="/auth" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage onBack={() => setCurrentPage('landing')} />
          )
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            <UserDataProvider>
              <Dashboard onNavigate={handleNavigation} />
            </UserDataProvider>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      <Route 
        path="/store" 
        element={
          user ? (
            <UserDataProvider>
              <Store onBack={() => setCurrentPage('dashboard')} />
            </UserDataProvider>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      <Route 
        path="/problem/:problemId" 
        element={
          user ? (
            <UserDataProvider>
              <ProblemPage />
            </UserDataProvider>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;