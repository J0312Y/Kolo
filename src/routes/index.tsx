import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import { Home, Circles, Wallet, Card, Profile, Login, Register, VerifyEmail, Splash, Onboarding } from '../pages';
import { Goals } from '../pages/Goals';
import { BottomNavigation } from '../components/layout';
import { Tab } from '../types';

// Component to handle initial redirect
const InitialRedirect: React.FC = () => {
  const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

  if (!hasSeenSplash) {
    sessionStorage.setItem('hasSeenSplash', 'true');
    return <Navigate to="/splash" replace />;
  }

  return <Navigate to="/login" replace />;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (pathname: string): Tab => {
    if (pathname === '/' || pathname.startsWith('/home')) return 'home';
    if (pathname.startsWith('/circles')) return 'circles';
    if (pathname.startsWith('/wallet')) return 'wallet';
    if (pathname.startsWith('/card')) return 'card';
    return 'home';
  };

  const currentTab = getTabFromPath(location.pathname);

  const handleTabChange = (tab: Tab) => {
    switch (tab) {
      case 'home': navigate('/'); break;
      case 'circles': navigate('/circles'); break;
      case 'join': navigate('/circles?screen=join'); break;
      case 'wallet': navigate('/wallet'); break;
      case 'card': navigate('/card'); break;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/circles" element={<Circles />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/card" element={<Card />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
      <BottomNavigation currentTab={currentTab} onTabChange={handleTabChange} />
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialRedirect />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
