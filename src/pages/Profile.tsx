import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context';
import { Header } from '../components/layout';
import { Button } from '../components/ui';

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={t('navigation.profile')} />
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{user?.fullName}</h3>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-600">{user?.phone}</p>
        </div>
        <Button onClick={logout} variant="danger" fullWidth>
          {t('profile.logout')}
        </Button>
      </div>
    </div>
  );
};
