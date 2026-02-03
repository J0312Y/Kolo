import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import { Home, Circles, Wallet, Card, Profile, Login, Register, VerifyEmail } from '../pages';
import { Goals } from '../pages/Goals';
import { BottomNavigation } from '../components/layout';
import { Tab } from '../types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
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
