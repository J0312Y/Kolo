import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotifications?: boolean;
  onNotificationsClick?: () => void;
  notificationCount?: number;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showNotifications = false,
  onNotificationsClick,
  notificationCount = 0,
  rightAction,
}) => {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          {title && (
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {showNotifications && onNotificationsClick && (
            <button
              onClick={onNotificationsClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell size={24} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          )}
          {rightAction}
        </div>
      </div>
    </div>
  );
};
