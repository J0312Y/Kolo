import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { authService } from '../services';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        navigate('/home');
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Une erreur est survenue';
      setError(errorMessage);

      // If email not verified, redirect to verification
      if (err?.data?.needs_verification) {
        navigate(`/verify-email?user_id=${err.data.user_id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 pt-12 pb-32 px-6 relative">
        <button
          onClick={() => navigate('/onboarding')}
          className="absolute top-6 left-6 text-white/80 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-lg mx-auto mb-4 flex items-center justify-center">
            <div className="text-4xl">🪙</div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bon retour !</h1>
          <p className="text-purple-200">Connectez-vous pour continuer</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white -mt-20 rounded-t-3xl px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Se souvenir de moi</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connexion...</span>
              </div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Pas encore de compte ?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-purple-600 hover:text-purple-700 font-bold"
            >
              Inscrivez-vous
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
