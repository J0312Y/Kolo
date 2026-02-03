import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context';
import { Header } from '../components/layout';
import { dashboardService, DashboardStats } from '../services/dashboard.service';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('An error occurred while loading statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title={`${t('home.welcomeBack')}, ${user?.firstName || 'User'}`}
          showNotifications
          onNotificationsClick={() => {/* Navigate to notifications */}}
        />
        <div className="p-4 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        title={`${t('home.welcomeBack')}, ${user?.firstName || 'User'}`}
        showNotifications
        onNotificationsClick={() => {/* Navigate to notifications */}}
      />

      <div className="p-4 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Wallet Balance */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm opacity-90">Wallet</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats?.wallet_balance || 0)}</p>
          </div>

          {/* Card Balance */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm opacity-90">Card</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats?.card_balance || 0)}</p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Circles */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Circles</span>
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.active_circles || 0}</p>
            <p className="text-xs text-gray-500 mt-1">{stats?.total_circles || 0} total</p>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Goals</span>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.active_goals || 0}</p>
            <p className="text-xs text-gray-500 mt-1">{stats?.total_goals || 0} total</p>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Transactions</span>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_transactions || 0}</p>
          </div>
        </div>

        {/* Active Like Lembas */}
        {stats?.active_like_lembas && stats.active_like_lembas.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Active Circles</h3>
            <div className="space-y-3">
              {stats.active_like_lembas.map((lemba) => (
                <div key={lemba.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{lemba.name}</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Contribution</p>
                      <p className="font-semibold text-sm">{formatCurrency(lemba.contribution_amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">My Slot</p>
                      <p className="font-semibold text-sm">#{lemba.my_slot || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Members</p>
                      <p className="font-semibold text-sm">{lemba.current_members}/{lemba.total_slots}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Payout</p>
                      <p className="font-semibold text-sm">{formatDate(lemba.next_payout_date)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Payments Progress</span>
                      <span>{lemba.payments_made}/{lemba.payments_made + lemba.payments_remaining}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(lemba.payments_made / (lemba.payments_made + lemba.payments_remaining)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {stats?.recent_transactions && stats.recent_transactions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
              <button className="text-sm text-purple-600 font-medium">View All</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {stats.recent_transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-green-100' :
                      transaction.type === 'withdrawal' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        transaction.type === 'deposit' ? 'text-green-600' :
                        transaction.type === 'withdrawal' ? 'text-red-600' :
                        'text-blue-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{transaction.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      transaction.type === 'deposit' ? 'text-green-600' :
                      transaction.type === 'withdrawal' ? 'text-red-600' :
                      'text-gray-900'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-purple-600 text-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-purple-700 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">Join Circle</span>
            </button>
            <button className="bg-blue-600 text-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-blue-700 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Add Funds</span>
            </button>
            <button className="bg-green-600 text-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-green-700 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-sm font-medium">Create Goal</span>
            </button>
            <button className="bg-orange-600 text-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-orange-700 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">Invite Friends</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
