import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/layout';

export const Card: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={t('navigation.card')} />
      <div className="p-4">
        <p className="text-gray-600">Card page content coming soon...</p>
      </div>
    </div>
  );
};
