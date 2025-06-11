import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserDataProvider } from './contexts/UserDataContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Store } from './components/Store';
import "./index.css";
// import { DashboardSkeleton } from './components/LoaderSkeleton';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard' | 'store'>('landing');

  if (loading) {
    return ( 
        <div className="loading-screen">
      <div className="loading-spinner"></div>
    </div> 
    // <div>
    //   <DashboardSkeleton />
    // </div> 
    );
  }

  if (user && (currentPage === 'landing' || currentPage === 'auth')) {
    setCurrentPage('dashboard');
  }

  const handleNavigation = (page: string) => {
    setCurrentPage(page as any);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
      
      case 'auth':
        return <AuthPage onBack={() => setCurrentPage('landing')} />;
      
      case 'dashboard':
        return user ? (
          <UserDataProvider>
            <Dashboard onNavigate={handleNavigation} />
          </UserDataProvider>
        ) : (
          <LandingPage onGetStarted={() => setCurrentPage('auth')} />
        );
      
      case 'store':
        return user ? (
          <UserDataProvider>
            <Store onBack={() => setCurrentPage('dashboard')} />
          </UserDataProvider>
        ) : (
          <LandingPage onGetStarted={() => setCurrentPage('auth')} />
        );
      
      default:
        return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
    }
  };

  return renderCurrentPage();
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