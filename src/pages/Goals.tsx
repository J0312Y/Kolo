import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/layout';
import { goalsService, Goal, CreateGoalData } from '../services/goals.service';

export const Goals: React.FC = () => {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState<CreateGoalData>({
    title: '',
    description: '',
    target_amount: 0,
    deadline: '',
    category: 'other',
  });

  const [contributeAmount, setContributeAmount] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsService.getGoals();
      if (response.success && response.data) {
        setGoals(response.data);
      }
    } catch (err) {
      console.error('Error loading goals:', err);
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await goalsService.createGoal(formData);
      if (response.success) {
        setShowCreateModal(false);
        loadGoals();
        setFormData({
          title: '',
          description: '',
          target_amount: 0,
          deadline: '',
          category: 'other',
        });
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      setError('Failed to create goal');
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      const response = await goalsService.contribute(selectedGoal.id, {
        amount: Number(contributeAmount),
        payment_method: 'wallet'
      });
      if (response.success) {
        setShowContributeModal(false);
        setSelectedGoal(null);
        setContributeAmount('');
        loadGoals();
      }
    } catch (err) {
      console.error('Error contributing to goal:', err);
      setError('Failed to contribute to goal');
    }
  };

  const formatCurrency = (amount: number) => {
    const formatted = amount.toLocaleString();
    return formatted + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="My Goals" />
      <div className="p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No goals yet. Create your first goal!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_amount, goal.target_amount);
              return (
                <div key={goal.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-2">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{formatCurrency(goal.current_amount)}</span>
                      <span>of {formatCurrency(goal.target_amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full"
                        style={{ width: progress + '%' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{progress}% completed</p>
                  </div>
                  {goal.status === 'active' && (
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowContributeModal(true);
                      }}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700"
                    >
                      Contribute
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {goals.length > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-24 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
