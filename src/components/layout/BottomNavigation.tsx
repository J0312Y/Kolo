import React from 'react';
import { Home, Users, PlusCircle, Wallet, CreditCard } from 'lucide-react';
import { Tab } from '../../types';

interface BottomNavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'home' as Tab, icon: Home, label: 'Home' },
    { id: 'circles' as Tab, icon: Users, label: 'Circles' },
    { id: 'join' as Tab, icon: PlusCircle, label: 'Join', isCenter: true },
    { id: 'wallet' as Tab, icon: Wallet, label: 'Wallet' },
    { id: 'card' as Tab, icon: CreditCard, label: 'Card' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center max-w-md mx-auto px-4 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center -mt-8"
              >
                <div className="bg-blue-600 p-4 rounded-full shadow-2xl mb-1">
                  <Icon className="text-white" size={28} />
                </div>
                <span className="text-xs font-semibold text-blue-600 mt-1">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center py-2"
            >
              <Icon className={isActive ? 'text-blue-600' : 'text-gray-400'} size={24} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
