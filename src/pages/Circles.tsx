import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/layout';

export const Circles: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={t('circles.myCircles')} />
      <div className="p-4">
        <p className="text-gray-600">Circles page content coming soon...</p>
      </div>
    </div>
  );
};
