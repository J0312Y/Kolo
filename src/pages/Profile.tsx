import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context';
import { Header } from '../components/layout';
import { Button } from '../components/ui';

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      bronze: 'from-orange-600 to-orange-700',
      silver: 'from-gray-400 to-gray-500',
      gold: 'from-yellow-500 to-yellow-600',
    };
    return colors[plan as keyof typeof colors] || colors.bronze;
  };

  const getPlanBadgeColor = (plan: string) => {
    const colors = {
      bronze: 'bg-orange-100 text-orange-700',
      silver: 'bg-gray-100 text-gray-700',
      gold: 'bg-yellow-100 text-yellow-700',
    };
    return colors[plan as keyof typeof colors] || colors.bronze;
  };

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={t('navigation.profile')} />

      <div className="p-4 space-y-4">
        {/* Profile Header Card */}
        <div className={`bg-gradient-to-br ${getPlanColor(user?.plan_tier || 'bronze')} rounded-xl p-6 text-white shadow-lg`}>
          <div className="flex items-center space-x-4 mb-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h2>
              <p className="text-sm opacity-90">{user?.email}</p>
              <p className="text-sm opacity-90">{user?.phone}</p>
            </div>
          </div>

          {/* Plan Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(user?.plan_tier || 'bronze')} bg-white`}>
              {user?.plan_tier?.toUpperCase()} PLAN
            </span>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-sm font-medium hover:underline"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Account Information</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="font-medium text-gray-900 capitalize">{user?.account_status?.replace('_', ' ')}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user?.account_status === 'active' ? 'bg-green-100 text-green-700' :
                user?.account_status === 'pending_verification' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {user?.account_status === 'active' ? 'Active' : 'Pending'}
              </span>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">KYC Status</p>
                <p className="font-medium text-gray-900 capitalize">{user?.kyc_status}</p>
              </div>
              {user?.kyc_status === 'verified' ? (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <button className="text-purple-600 text-sm font-medium hover:underline">
                  Verify Now
                </button>
              )}
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">Member Since</p>
              <p className="font-medium text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Referral Code</h3>
              <p className="text-sm text-gray-600">Invite friends and earn rewards</p>
            </div>
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-lg px-4 py-3 font-mono font-bold text-lg text-center text-purple-600 border-2 border-purple-200">
              {user?.referral_code}
            </div>
            <button
              onClick={copyReferralCode}
              className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setShowReferralModal(true)}
            className="w-full mt-3 text-sm text-purple-600 font-medium hover:underline"
          >
            View Referral Stats
          </button>
        </div>

        {/* Settings Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Settings</h3>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Security */}
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-medium text-gray-900">Security</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="font-medium text-gray-900">Notifications</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Language */}
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="font-medium text-gray-900">Language</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">English</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Subscription */}
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="font-medium text-gray-900">Upgrade Plan</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Support */}
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium text-gray-900">Help & Support</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">About</h3>
          </div>

          <div className="divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-900">Terms of Service</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-900">Privacy Policy</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="p-4">
              <p className="text-sm text-gray-500">App Version</p>
              <p className="font-medium text-gray-900">1.0.0</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <Button onClick={logout} variant="danger" fullWidth>
            {t('profile.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
};
