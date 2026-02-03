import React from 'react';
import { AuthProvider, AppProvider } from './context';
import { AppRoutes } from './routes';
import './i18n/config'; // Initialize i18n

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
