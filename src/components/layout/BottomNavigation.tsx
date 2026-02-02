import React from 'react';
import { Home, Users, Wallet, CreditCard, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tab } from '../../types';

interface BottomNavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  const { t } = useTranslation();

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home size={24} />, label: t('navigation.home') },
    { id: 'circles', icon: <Users size={24} />, label: t('navigation.circles') },
    { id: 'wallet', icon: <Wallet size={24} />, label: t('navigation.wallet') },
    { id: 'card', icon: <CreditCard size={24} />, label: t('navigation.card') },
    { id: 'profile', icon: <User size={24} />, label: t('navigation.profile') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-20 px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
