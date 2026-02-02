import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { Button, Input, Card } from '../components/ui';
import { User, Mail, Phone, Lock, Gift, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    referral_code: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);

      if (response.data.user && response.data.otp_sent) {
        // Redirect to email verification
        navigate(`/verify-email?user_id=${response.data.user.id}&email=${response.data.user.email}`);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Une erreur est survenue';
      const errors = err?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError[0]);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
          <p className="text-gray-600">Rejoignez Kolo Tontine aujourd'hui</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="first_name"
              label="Prénom"
              placeholder="Jean"
              value={formData.first_name}
              onChange={handleChange}
              icon={<User size={20} />}
              required
            />

            <Input
              type="text"
              name="last_name"
              label="Nom"
              placeholder="Mukendi"
              value={formData.last_name}
              onChange={handleChange}
              icon={<User size={20} />}
              required
            />
          </div>

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="jean@example.com"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail size={20} />}
            required
          />

          <Input
            type="tel"
            name="phone"
            label="Téléphone"
            placeholder="+242065123456"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone size={20} />}
            required
          />

          <Input
            type="password"
            name="password"
            label="Mot de passe"
            placeholder="Minimum 8 caractères"
            value={formData.password}
            onChange={handleChange}
            icon={<Lock size={20} />}
            required
          />

          <Input
            type="password"
            name="password_confirmation"
            label="Confirmer le mot de passe"
            placeholder="Répétez le mot de passe"
            value={formData.password_confirmation}
            onChange={handleChange}
            icon={<Lock size={20} />}
            required
          />

          <Input
            type="text"
            name="referral_code"
            label="Code de parrainage (optionnel)"
            placeholder="Entrez un code si vous en avez un"
            value={formData.referral_code}
            onChange={handleChange}
            icon={<Gift size={20} />}
          />

          <Button type="submit" fullWidth loading={loading}>
            S'inscrire
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Déjà un compte ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Connectez-vous
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};
