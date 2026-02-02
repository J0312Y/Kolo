import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context';
import { Header } from '../components/layout';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        title={`${t('home.welcomeBack')}, ${user?.firstName || 'User'}`}
        showNotifications
        onNotificationsClick={() => {/* Navigate to notifications */}}
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{t('home.quickActions')}</h2>
        {/* Home content will be implemented */}
        <p className="text-gray-600">Home page content coming soon...</p>
      </div>
    </div>
  );
};
