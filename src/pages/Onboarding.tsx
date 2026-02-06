import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users, Target, Wallet, Shield } from 'lucide-react';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Bienvenue sur Kolo',
    description: 'La tontine digitale qui simplifie l\'épargne collective et vous aide à atteindre vos objectifs financiers.',
    icon: <div className="text-7xl">🪙</div>,
    color: 'from-purple-600 to-indigo-700'
  },
  {
    id: 2,
    title: 'Créez des Cercles',
    description: 'Rejoignez ou créez des cercles d\'épargne avec vos amis, famille ou collègues. Épargnez ensemble en toute confiance.',
    icon: <Users size={80} className="text-white" />,
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 3,
    title: 'Atteignez vos Objectifs',
    description: 'Définissez vos objectifs financiers personnels et suivez votre progression en temps réel.',
    icon: <Target size={80} className="text-white" />,
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 4,
    title: 'Gérez votre Wallet',
    description: 'Suivez vos transactions, gérez votre carte virtuelle et profitez d\'une expérience financière complète.',
    icon: <Wallet size={80} className="text-white" />,
    color: 'from-orange-600 to-red-600'
  },
  {
    id: 5,
    title: 'Sécurisé et Fiable',
    description: 'Vos données sont protégées avec les meilleures technologies de sécurité. Épargnez en toute tranquillité.',
    icon: <Shield size={80} className="text-white" />,
    color: 'from-indigo-600 to-purple-700'
  }
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Mark onboarding as completed
      localStorage.setItem('hasSeenOnboarding', 'true');
      navigate('/login');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate('/login');
  };

  const slide = slides[currentSlide];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.color} flex flex-col`}>
      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSkip}
          className="text-white/80 hover:text-white font-semibold text-sm px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
        >
          Passer
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Icon */}
        <div className="mb-12 transform transition-all duration-500">
          {slide.icon}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-6 max-w-md">
          {slide.title}
        </h1>

        {/* Description */}
        <p className="text-white/90 text-lg leading-relaxed max-w-md">
          {slide.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="pb-12 px-8">
        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full bg-white text-gray-900 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">
            {currentSlide < slides.length - 1 ? 'Suivant' : 'Commencer'}
          </span>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
