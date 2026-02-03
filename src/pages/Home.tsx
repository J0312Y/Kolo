// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Bell, Zap, Copy, Check, Users, Gift, TrendingUp, PlusCircle, CreditCard, X, User, Search, Settings, FileText, Calendar, File, MessageCircle, MapPin, Shield, Lock, Globe, Folder, UserPlus, CheckCircle2, Scissors, Wallet as WalletIcon } from 'lucide-react';
import { useApp } from '../context';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    firstName, notifications, setNotifications, activeLikeLemba,
    finishedLikeLemba, userGoals, setSelectedGoal, transactions
  } = useApp();
  const [subScreen, setSubScreen] = React.useState('home');

  const HomeScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/profile')}
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
          >
            <User className="text-gray-600" size={24} />
          </button>
          <div>
            <p className="text-gray-600 text-sm">{'Welcome back'} 👋</p>
            <h1 className="text-gray-900 text-lg font-bold">{firstName}</h1>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setSubScreen('whats-hot')} className="p-2">
            <Zap className="text-gray-700" size={24} />
          </button>
          <button onClick={() => setSubScreen('notifications')} className="relative p-2">
            <Bell className="text-gray-700" size={24} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Explore Goals Section */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Explore goals</h2>
            <p className="text-gray-500">Goals focused on you</p>
          </div>
          <button 
            onClick={() => navigate('/goals')}
            className="text-blue-600 font-semibold text-sm flex items-center"
          >
            My Goals
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[
            { id: 'smart-saving', icon: '🔒', name: 'Smart\nSaving', color: 'bg-blue-100', category: 'general' },
            { id: 'zero-fees', icon: '☀️', name: '0% Fees', color: 'bg-yellow-100', category: 'special' },
            { id: 'school', icon: '✏️', name: 'School\nTuition', color: 'bg-blue-100', category: 'education' },
            { id: 'eid', icon: '🐑', name: 'Eid Al\nAdha', color: 'bg-blue-100', category: 'religious' },
            { id: 'vacation', icon: '🌴', name: 'Summer\nHolidays', color: 'bg-green-100', category: 'travel' }
          ].map((goal, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                setSelectedGoal(goal);
                navigate('/goals');
              }}
              className="flex flex-col items-center min-w-[90px] cursor-pointer hover:scale-105 transition-transform"
            >
              <div className={`w-20 h-20 ${goal.color} rounded-full flex items-center justify-center mb-2 shadow-sm`}>
                <span className="text-3xl">{goal.icon}</span>
              </div>
              <p className="text-center text-xs font-semibold text-gray-700 whitespace-pre-line">{goal.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-4 gap-3">
          <button 
            onClick={() => navigate('/circles?screen=join')}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-2 shadow-md">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-xs font-semibold text-gray-900 text-center">Join</p>
          </button>

          <button 
            onClick={() => navigate('/circles?screen=create-likelemba-step1')}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-2 shadow-md">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-xs font-semibold text-gray-900 text-center">Create</p>
          </button>

          <button 
            onClick={() => {navigate('/wallet'); }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-2 shadow-md">
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-xs font-semibold text-gray-900 text-center">Pay</p>
          </button>

          <button 
            onClick={() => navigate('/circles?screen=referral')}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-2 shadow-md">
              <span className="text-2xl">🎁</span>
            </div>
            <p className="text-xs font-semibold text-gray-900 text-center">Refer</p>
          </button>
        </div>
      </div>

      {/* Continue Where You Left Off */}
      {(circleAmount || likeLembaName || joinCode || (selectedCircle && !selectedDuration)) && (
        <div className="px-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Continue where you left off</h2>
          <p className="text-gray-500 mb-4">Pick up where you stopped</p>
          
          <div className="space-y-4">
            {/* Join Likelemba - Original */}
            {circleAmount && !activeLikeLemba.find(l => l.amount === circleAmount && l.type === 'joined') && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">💰</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Join Likelemba</h3>
                    <p className="text-sm text-gray-500">Regular circle</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{parseInt(circleAmount).toLocaleString()} <span className="text-xl text-gray-500">XAF</span></p>
                    <p className="text-blue-600 font-bold">{circleDuration?.monthly.toLocaleString() || '1,500'} XAF <span className="text-gray-500 font-normal text-sm">Monthly</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-bold">XAF {selectedSlot ? '630' : '---'}</p>
                    <p className="text-gray-500 text-sm">Admin Fees</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-2 flex-1 bg-blue-600 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Step {!circleDuration ? '1' : !selectedSlot ? '2' : '3'} of 3</span>
                    <span className="font-bold">
                      {!circleDuration ? 'Select Duration' : !selectedSlot ? 'Choose Slot' : 'Payment Method'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!circleDuration) {
                      navigate('/circles?screen=circle-details-duration');
                    } else if (!selectedSlot) {
                      navigate('/circles?screen=circle-slot');
                    } else {
                      navigate('/circles?screen=payout-method-selection');
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-full font-bold"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Create Likelemba */}
            {likeLembaName && !activeLikeLemba.find(l => l.name === likeLembaName) && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Create Likelemba</h3>
                    <p className="text-sm text-gray-500">Your own group</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Group Name</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">{likeLembaName}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Members</p>
                      <p className="font-bold text-gray-900">{likeLembaMembers} people</p>
                    </div>
                    {likeLembaAmount && (
                      <div>
                        <p className="text-xs text-gray-600">Payout</p>
                        <p className="font-bold text-blue-600">{parseInt(likeLembaAmount).toLocaleString()} XAF</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-2 flex-1 bg-blue-600 rounded-full"></div>
                    <div className={`h-2 flex-1 ${likeLembaAmount ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
                    <div className={`h-2 flex-1 ${likeLembaDuration ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Step {!likeLembaAmount ? '1' : !likeLembaDuration ? '2' : '3'} of 3</span>
                    <span className="font-bold">
                      {!likeLembaAmount ? 'Set Amount' : !likeLembaDuration ? 'Choose Duration' : 'Review'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!likeLembaAmount) {
                      navigate('/circles?screen=create-likelemba-step2');
                    } else if (!likeLembaDuration) {
                      navigate('/circles?screen=create-likelemba-step2');
                    } else {
                      navigate('/circles?screen=create-likelemba-step3');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-bold"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Join with Code */}
            {joinCode && !activeLikeLemba.find(l => l.inviteCode === joinCode) && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🔑</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Join with Code</h3>
                    <p className="text-sm text-gray-500">Friend's group</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Invitation Code</p>
                  <p className="font-mono text-lg font-bold text-gray-900 mb-3">{joinCode}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Group Name</p>
                      <p className="font-bold text-gray-900 text-sm">{joinCode.replace(/_2026$/, '').replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Payout</p>
                      <p className="font-bold text-green-600">50,000 XAF</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-2 flex-1 bg-green-600 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Step 1 of 2</span>
                    <span className="font-bold">View Details</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/circles?screen=join-group-details')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-full font-bold"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Join Saving Program */}
            {selectedCircle && !activeLikeLemba.find(l => l.type === 'saving' && l.name?.includes(selectedCircle.name)) && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Saving Program</h3>
                    <p className="text-sm text-gray-500">Build savings</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Selected Circle</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">{selectedCircle.name}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Target Amount</p>
                      <p className="font-bold text-gray-900">{selectedCircle.amount.toLocaleString()} XAF</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Bonus</p>
                      <p className="font-bold text-green-600">{selectedCircle.bonus.toLocaleString()} XAF</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-2 flex-1 bg-blue-600 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Step 1 of 2</span>
                    <span className="font-bold">Choose Duration</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/circles?screen=choose-duration')}
                  className="w-full bg-blue-600 text-white py-3 rounded-full font-bold"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financial Dashboard */}
      {(activeLikeLemba.length > 0 || transactions.length > 0) && (
        <div className="px-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
              <p className="text-gray-500 text-sm">Your financial summary</p>
            </div>
            <button 
              onClick={() => navigate('/wallet?screen=financial-dashboard')}
              className="text-blue-600 font-semibold text-sm flex items-center"
            >
              View All
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 mb-4 text-white shadow-lg">
            <p className="text-blue-100 text-sm mb-1">Total Balance</p>
            <h3 className="text-4xl font-bold mb-4">
              {(transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()} <span className="text-xl">XAF</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <p className="text-blue-100 text-xs mb-1">Income</p>
                <p className="text-lg font-bold">
                  +{transactions.filter(t => t.status === 'completed' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <p className="text-blue-100 text-xs mb-1">Expense</p>
                <p className="text-lg font-bold">
                  -{Math.abs(transactions.filter(t => t.status === 'completed' && t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👥</span>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{activeLikeLemba.length}</p>
              <p className="text-xs text-gray-600">Active Groups</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">💰</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Next
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'pending' && t.amount < 0)[0]?.amount 
                  ? Math.abs(transactions.filter(t => t.status === 'pending' && t.amount < 0)[0].amount).toLocaleString() 
                  : '0'}
              </p>
              <p className="text-xs text-gray-600">Payment Due</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
              <button 
                onClick={() => navigate('/wallet?screen=transaction-history')}
                className="text-blue-600 text-xs font-semibold"
              >
                View All
              </button>
            </div>
            {transactions.slice(0, 3).map((transaction, index) => (
              <div key={transaction.id} className={`flex items-center justify-between py-3 ${index < 2 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.amount > 0 ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <span className="text-xl">
                      {transaction.type === 'payment' ? '💰' : 
                       transaction.type === 'payout' ? '🎉' : 
                       transaction.type === 'fee' ? '📋' : '↩️'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{transaction.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date) > new Date() ? 'Upcoming' : 
                       Math.floor((Date.now() - new Date(transaction.date)) / (1000 * 60 * 60 * 24)) === 0 ? 'Today' : 
                       Math.floor((Date.now() - new Date(transaction.date)) / (1000 * 60 * 60 * 24)) + 'd ago'}
                    </p>
                  </div>
                </div>
                <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kolo Virtual Card */}
      <div className="px-6 mt-6">
        <div 
          onClick={() => navigate('/card')}
          className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-6 shadow-2xl cursor-pointer transform transition hover:scale-105"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Your Kolo Card</p>
              <h3 className="text-2xl font-bold text-white mb-2">Virtual Card</h3>
              <p className="text-white/90 text-sm">Tap to manage your card</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <p className="text-white text-xs font-bold">ACTIVE</p>
            </div>
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <p className="text-white/70 text-xs mb-1">Card Number</p>
            <p className="text-white text-xl font-mono tracking-wider">•••• •••• •••• 4582</p>
          </div>

          {/* Card Details */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/70 text-xs mb-1">Card Holder</p>
              <p className="text-white font-semibold text-sm">{firstName.toUpperCase()} {lastName.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs mb-1">Balance</p>
              <p className="text-white font-bold text-lg">125,000 <span className="text-sm">XAF</span></p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/card');
              }}
              className="bg-white/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
            >
              <span>⬆️</span>
              <span>Top Up</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/card');
              }}
              className="bg-white/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
            >
              <span>💳</span>
              <span>Details</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/card');
              }}
              className="bg-white/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
            >
              <span>📊</span>
              <span>Activity</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-blue-900 font-bold text-lg mb-1">Refer friends, earn 300 XAF</h3>
              <p className="text-blue-700 text-sm mb-4">The more friends you invite, the more you save!</p>
              <button 
                onClick={() => navigate('/circles?screen=referral')}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2"
              >
                <span>Invite friends</span>
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="text-6xl">🎁</div>
          </div>
        </div>
      </div>
    </div>
  );


  const NotificationsScreen = () => {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    const filteredNotifications = notificationFilter === 'all' 
      ? notifications 
      : notifications.filter(n => n.type === notificationFilter);

    const markAsRead = (id) => {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    };

    const markAllAsRead = () => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getTimeAgo = (timestamp) => {
      const now = new Date();
      const time = new Date(timestamp);
      const diffInMs = now - time;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return time.toLocaleDateString();
    };

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')}>
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-blue-600 font-semibold text-sm"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
              { id: 'group', label: 'Groups', count: notifications.filter(n => n.type === 'group').length },
              { id: 'payout', label: 'Payouts', count: notifications.filter(n => n.type === 'payout').length },
              { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setNotificationFilter(filter.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition ${
                  notificationFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {filter.label} {filter.count > 0 && `(${filter.count})`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 pb-24">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6">
                <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                  <ellipse cx="45" cy="40" rx="35" ry="30" fill="#BFDBFE" opacity="0.6"/>
                  <ellipse cx="70" cy="35" rx="40" ry="35" fill="#3B82F6"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                No notifications
              </h2>
              <p className="text-gray-500 text-center">
                {notificationFilter === 'all' 
                  ? 'You\'re all caught up!'
                  : `No ${notificationFilter} notifications`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`bg-white rounded-2xl p-4 border-2 transition cursor-pointer ${
                    notification.read 
                      ? 'border-gray-100' 
                      : 'border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      notification.color === 'blue' ? 'bg-blue-100' :
                      notification.color === 'green' ? 'bg-green-100' :
                      notification.color === 'purple' ? 'bg-purple-100' :
                      notification.color === 'red' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      <span className="text-2xl">{notification.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-bold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-2"></div>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {getTimeAgo(notification.time)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };


  const WhatsHotScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">What's Hot</h1>
      </div>

      <div className="px-6 py-6">
        <p className="text-blue-600 font-bold mb-6">Join now!</p>

        <div className="space-y-6">
          {/* Win 300 EGP */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="relative h-48 bg-gradient-to-r from-gray-100 to-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-green-500 font-bold text-4xl">WIN</div>
                  <div className="text-green-500 font-bold text-5xl">300</div>
                  <div className="text-green-500 font-semibold text-xl">EGP</div>
                  <div className="text-green-500 font-semibold text-lg">WHEN YOU INVITE</div>
                  <div className="text-green-500 font-semibold text-lg">A FRIEND!</div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl text-gray-900 mb-2">Get 300 EGP off on every invite!</h3>
              <p className="text-gray-600 text-sm mb-3">
                Invite your friends now and you both enjoy a 300 EGP discount when they pay their first installment! The more invites you send, the bigger your discount.
              </p>
              <button 
                onClick={() => navigate('/circles?screen=referral')}
                className="text-blue-600 font-bold"
              >
                Invite now!
              </button>
            </div>
          </div>

          {/* iPhone 17 Contest */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="relative h-48 bg-gradient-to-br from-blue-200 to-blue-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-2">📱</div>
                  <div className="text-white font-bold text-xl">Third week</div>
                  <div className="text-white font-bold text-2xl">Third iPhone 17</div>
                  <div className="bg-white text-blue-600 px-4 py-1 rounded-full font-bold text-sm mt-2 inline-block">
                    SPEND TO WIN
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl text-gray-900 mb-2 flex items-center">
                Want to win an iPhone? 🥳
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                The week is fresh, and so are your chances! Spend with Kolo Tontine to enter this week's draw for a mega prize, including an iPhone 17!
              </p>
              <p className="text-gray-500 text-xs mb-3">*T&Cs Apply</p>
              <button className="text-blue-600 font-bold">Click here!</button>
            </div>
          </div>

          {/* Zero Fee */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="relative h-48 bg-blue-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-6">
                  <div className="text-2xl font-semibold mb-2">WHAT YOU 💰 PAY</div>
                  <div className="text-6xl font-bold mb-2">ZERO FEES</div>
                  <div className="text-2xl font-semibold">IS WHAT YOU 💚 GET</div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl text-gray-900 mb-2 flex items-center">
                Zero Fee Game'ya 🤑
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Zero fees on your Game'ya! Join one of our special slots and receive exactly what you pay with no admin fees!
              </p>
              <button 
                onClick={() => navigate('/circles?screen=join')}
                className="text-blue-600 font-bold"
              >
                Join now!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  // Sub-screen router
  if (subScreen === 'notifications') return <NotificationsScreen />;
  if (subScreen === 'whats-hot') return <WhatsHotScreen />;
  return <HomeScreen />;
};
