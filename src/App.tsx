import React from 'react';
import { AuthProvider } from './context';
import { AppRoutes } from './routes';
import './i18n/config'; // Initialize i18n

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
