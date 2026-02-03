import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context';
import { Header } from '../components/layout';
import { cardService, CardTransaction } from '../services/card.service';

export const Card: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<CardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardStatus, setCardStatus] = useState<'active' | 'frozen'>('active');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    loadCardData();
  }, []);

  const loadCardData = async () => {
    try {
      setLoading(true);
      const [balanceResponse, transactionsResponse] = await Promise.all([
        cardService.getCardBalance(),
        cardService.getCardTransactions()
      ]);

      if (balanceResponse.success && balanceResponse.data) {
        setCardStatus(balanceResponse.data.card_status as 'active' | 'frozen');
      }

      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      }
    } catch (err) {
      console.error('Error loading card data:', err);
      setError('Failed to load card data');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await cardService.topUpCard(Number(topUpAmount));
      if (response.success) {
        setShowTopUpModal(false);
        setTopUpAmount('');
        loadCardData();
      }
    } catch (err) {
      console.error('Error topping up card:', err);
      setError('Failed to top up card');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await cardService.withdrawFromCard(Number(withdrawAmount));
      if (response.success) {
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        loadCardData();
      }
    } catch (err) {
      console.error('Error withdrawing from card:', err);
      setError('Failed to withdraw from card');
    }
  };

  const handleToggleFreeze = async () => {
    try {
      if (cardStatus === 'active') {
        await cardService.freezeCard();
        setCardStatus('frozen');
      } else {
        await cardService.unfreezeCard();
        setCardStatus('active');
      }
    } catch (err) {
      console.error('Error toggling card freeze:', err);
      setError('Failed to update card status');
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCardNumber = () => {
    // Generate a masked card number
    return '**** **** **** 1234';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={t('navigation.card')} />

      <div className="p-4 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Virtual Card */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 text-white shadow-2xl">
            {/* Card Status Badge */}
            {cardStatus === 'frozen' && (
              <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Frozen
                </span>
              </div>
            )}

            {/* Card Logo */}
            <div className="flex justify-between items-start mb-8">
              <div className="text-2xl font-bold">KOLO</div>
              <svg className="w-12 h-12 opacity-50" viewBox="0 0 48 48" fill="none">
                <circle cx="18" cy="24" r="12" fill="currentColor" opacity="0.7"/>
                <circle cx="30" cy="24" r="12" fill="currentColor" opacity="0.7"/>
              </svg>
            </div>

            {/* Card Number */}
            <div className="mb-6">
              <p className="text-lg tracking-wider font-mono">{formatCardNumber()}</p>
            </div>

            {/* Card Details */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-70 mb-1">Card Holder</p>
                <p className="font-semibold">{user?.first_name} {user?.last_name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-70 mb-1">Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(user?.card_balance || 0)}</p>
              </div>
            </div>
          </div>

          {/* Card Shadow Effect */}
          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-b from-blue-900/20 to-transparent rounded-b-2xl blur-md"></div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setShowTopUpModal(true)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Top Up</span>
          </button>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-8 h-8 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Withdraw</span>
          </button>

          <button
            onClick={handleToggleFreeze}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className={`w-8 h-8 mb-2 ${cardStatus === 'frozen' ? 'text-blue-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {cardStatus === 'frozen' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              )}
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {cardStatus === 'frozen' ? 'Unfreeze' : 'Freeze'}
            </span>
          </button>
        </div>

        {/* Card Benefits */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-3">Card Benefits</h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free virtual card for all transactions
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Instant top-up from wallet
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Freeze/unfreeze anytime
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Recent Transactions</h3>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-500">No card transactions yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'top_up' ? 'bg-green-100' :
                      transaction.type === 'withdrawal' ? 'bg-orange-100' :
                      'bg-blue-100'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        transaction.type === 'top_up' ? 'text-green-600' :
                        transaction.type === 'withdrawal' ? 'text-orange-600' :
                        'text-blue-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      transaction.type === 'top_up' ? 'text-green-600' :
                      transaction.type === 'withdrawal' ? 'text-red-600' :
                      'text-gray-900'
                    }`}>
                      {transaction.type === 'top_up' ? '+' : '-'}
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
          )}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Top Up Card</h2>
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleTopUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (FCFA)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    max={user?.wallet_balance || 0}
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Wallet Balance: {formatCurrency(user?.wallet_balance || 0)}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Funds will be transferred from your wallet to your card instantly
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTopUpModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    Top Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Withdraw to Wallet</h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (FCFA)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    max={user?.card_balance || 0}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Card Balance: {formatCurrency(user?.card_balance || 0)}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    Withdraw
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
