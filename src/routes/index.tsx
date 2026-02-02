import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context';
import { Home, Circles, Wallet, Card, Profile } from '../pages';
import { BottomNavigation } from '../components/layout';

// Protected Route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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

// Main App Layout with Bottom Navigation
const AppLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState<'home' | 'circles' | 'wallet' | 'card' | 'profile'>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/circles" element={<Circles />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/card" element={<Card />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

// Router Configuration
export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes will be added here */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Protected routes */}
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
