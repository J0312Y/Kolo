import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

    // Navigate after 2 seconds
    const timer = setTimeout(() => {
      if (hasSeenOnboarding) {
        navigate('/login');
      } else {
        navigate('/onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl mx-auto flex items-center justify-center">
            <div className="text-6xl">🪙</div>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-5xl font-bold text-white mb-4">Kolo</h1>
        <p className="text-purple-200 text-lg mb-8">Tontine Digitale</p>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
