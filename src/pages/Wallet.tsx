// @ts-nocheck
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Bell, Zap, Copy, Check, Users, Gift, TrendingUp, PlusCircle, CreditCard, X, User, Search, Settings, FileText, Calendar, File, MessageCircle, MapPin, Shield, Lock, Globe, Folder, UserPlus, CheckCircle2, Scissors, Wallet as WalletIcon } from 'lucide-react';
import { useApp } from '../context';
import { paymentsService } from '../services/payments.service';
import { circlesService } from '../services/circles.service';
import { walletService } from '../services/wallet.service';

export const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    activeLikeLemba, finishedLikeLemba, circles, transactions,
    selectedGoal, setSelectedGoal, selectedCircle, setSelectedCircle,
    selectedLikeLemba, setSelectedLikeLemba, userPlan
  } = useApp();
  const [subScreen, setSubScreen] = React.useState<string>(searchParams.get('screen') || 'payments');
  const [transactionFilter, setTransactionFilter] = React.useState('all');
  const [selectedTransaction, setSelectedTransaction] = React.useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState('all');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [cardBalance, setCardBalance] = React.useState(0);

  React.useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await walletService.getWalletBalance();
        if (response.success && response.data) {
          setWalletBalance(response.data.wallet_balance || 0);
          setCardBalance(response.data.card_balance || 0);
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    fetchWalletBalance();
  }, []);

  React.useEffect(() => {
    const s = searchParams.get('screen');
    if (s) setSubScreen(s);
  }, [searchParams]);

  const PaymentsScreen = () => {
    // Calculate payments from activeLikeLemba
    const calculatePayments = () => {
      const payments = [];
      const now = new Date(2026, 0, 20); // Jan 20, 2026
      
      activeLikeLemba.forEach(circle => {
        const monthlyAmount = circle.duration ? 
          Math.floor(parseInt(circle.amount) / circle.duration) : 
          parseInt(circle.amount);
        
        // Generate payment dates (25th of each month for regular, 1st for savings)
        const dueDay = circle.type === 'saving' ? 1 : 25;
        const dueDate = new Date(2026, 0, dueDay); // January 2026
        
        // Determine status
        let status = 'upcoming';
        let daysUntilDue = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue < 0) {
          status = 'overdue';
        } else if (daysUntilDue <= 7) {
          status = 'pending';
        }
        
        payments.push({
          id: circle.id,
          circleName: circle.name,
          amount: monthlyAmount,
          dueDate: dueDate,
          status: status,
          daysUntilDue: daysUntilDue,
          type: circle.type
        });
      });
      
      return payments;
    };

    const allPayments = calculatePayments();
    const overduePayments = allPayments.filter(p => p.status === 'overdue');
    const pendingPayments = allPayments.filter(p => p.status === 'pending');
    const upcomingPayments = allPayments.filter(p => p.status === 'upcoming');
    
    // Mock completed payments
    const completedPayments = [
      { circleName: 'Family Savings', amount: 8333, paidDate: new Date(2025, 11, 20), type: 'joined' },
      { circleName: 'Bronze Saver', amount: 500, paidDate: new Date(2025, 11, 15), type: 'saving' }
    ];

    const hasActivePayments = activeLikeLemba.length > 0;

    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
        <div className="bg-white px-6 pt-12 pb-6 border-b border-gray-200">
          <h1 className="text-gray-900 text-2xl font-bold">Payments</h1>
        </div>

        <div className="px-6 py-6">
          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 shadow-lg">
            <p className="text-purple-200 text-sm mb-2">Available Balance</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-white/80 text-xs mb-1">💳 Card Balance</p>
                <p className="text-3xl font-bold text-white">
                  {cardBalance.toLocaleString()}
                  <span className="text-lg ml-1">XAF</span>
                </p>
              </div>
              <div>
                <p className="text-white/80 text-xs mb-1">👛 Wallet Balance</p>
                <p className="text-3xl font-bold text-white">
                  {walletBalance.toLocaleString()}
                  <span className="text-lg ml-1">XAF</span>
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/20">
              <p className="text-white/80 text-xs mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-white">
                {(cardBalance + walletBalance).toLocaleString()} XAF
              </p>
            </div>
          </div>

          {!hasActivePayments ? (
            // Empty state
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="text-gray-400" size={40} />
              </div>
              <h3 className="text-gray-900 font-bold text-xl mb-2">You don't have any payments due yet</h3>
              <p className="text-gray-500 text-sm mb-6">Your due payments and your balance will appear here after you join a circle.</p>
              <button 
                onClick={() => navigate('/circles?screen=join')}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold inline-flex items-center space-x-2"
              >
                <span>Join a new circle</span>
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            // Payment lists
            <div className="space-y-6">
              {/* Overdue Payments */}
              {overduePayments.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">⚠️ Overdue ({overduePayments.length})</h3>
                    <span className="text-sm text-red-600 font-semibold">{Math.abs(overduePayments[0]?.daysUntilDue || 0)} days late</span>
                  </div>
                  <div className="space-y-3">
                    {overduePayments.map(payment => (
                      <div key={payment.id} className="bg-white rounded-2xl p-5 border-2 border-red-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{payment.type === 'saving' ? '🌱' : '👥'}</span>
                              <h4 className="font-bold text-gray-900">{payment.circleName}</h4>
                            </div>
                            <p className="text-sm text-gray-600">
                              Due: {payment.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">{payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">XAF</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex-1 bg-red-50 rounded-lg px-3 py-2">
                            <p className="text-xs text-red-600 font-semibold">OVERDUE - {Math.abs(payment.daysUntilDue)} days late</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentModal(true);
                          }}
                          className="w-full bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition"
                        >
                          Pay Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Payments (Due Soon) */}
              {pendingPayments.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">⏱️ Due This Month ({pendingPayments.length})</h3>
                    <span className="text-sm text-yellow-600 font-semibold">in {pendingPayments[0]?.daysUntilDue || 0} days</span>
                  </div>
                  <div className="space-y-3">
                    {pendingPayments.map(payment => (
                      <div key={payment.id} className="bg-white rounded-2xl p-5 border-2 border-yellow-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{payment.type === 'saving' ? '🌱' : '👥'}</span>
                              <h4 className="font-bold text-gray-900">{payment.circleName}</h4>
                            </div>
                            <p className="text-sm text-gray-600">
                              Due: {payment.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">{payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">XAF</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex-1 bg-yellow-50 rounded-lg px-3 py-2">
                            <p className="text-xs text-yellow-700 font-semibold">DUE IN {payment.daysUntilDue} DAYS</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentModal(true);
                          }}
                          className="w-full bg-yellow-500 text-white py-3 rounded-full font-bold hover:bg-yellow-600 transition"
                        >
                          Pay Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Payments */}
              {upcomingPayments.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">📅 Upcoming ({upcomingPayments.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {upcomingPayments.map(payment => (
                      <div key={payment.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{payment.type === 'saving' ? '🌱' : '👥'}</span>
                              <h4 className="font-bold text-gray-900">{payment.circleName}</h4>
                            </div>
                            <p className="text-sm text-gray-600">
                              Due: {payment.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-blue-600 font-semibold mt-1">In {payment.daysUntilDue} days</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">{payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">XAF</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Payments */}
              {completedPayments.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">✅ Completed ({completedPayments.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {completedPayments.map((payment, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-5 border border-green-200 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{payment.type === 'saving' ? '🌱' : '👥'}</span>
                              <h4 className="font-bold text-gray-900">{payment.circleName}</h4>
                            </div>
                            <p className="text-sm text-gray-600">
                              Paid: {payment.paidDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <div className="inline-block bg-green-100 px-2 py-1 rounded-full mt-2">
                              <p className="text-xs text-green-700 font-semibold">✓ PAID</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">{payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">XAF</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Due</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(overduePayments.reduce((sum, p) => sum + p.amount, 0) + 
                        pendingPayments.reduce((sum, p) => sum + p.amount, 0)).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">XAF</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Next Payment</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {[...overduePayments, ...pendingPayments, ...upcomingPayments]
                        .sort((a, b) => a.dueDate - b.dueDate)[0]?.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Others Section */}
          <div className="mt-8">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Others</h3>
            <div className="grid grid-cols-2 gap-3">
              <div onClick={() => setSubScreen('payout-eligibility')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <CheckCircle2 className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Payout Eligibility</p>
              </div>
              <div onClick={() => setSubScreen('payment-settings')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <Settings className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Payment settings</p>
              </div>
              <div onClick={() => navigate('/wallet?screen=transaction-history')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <FileText className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Transaction History</p>
              </div>
              <div onClick={() => setSubScreen('payment-calendar')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <Calendar className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Payment Calendar</p>
              </div>
              <div onClick={() => setSubScreen('payment-policy')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <File className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Payment policy</p>
              </div>
              <div onClick={() => navigate('/profile?screen=customer-support')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <MessageCircle className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const PaymentCalendarScreen = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // January 2026
    const [selectedDate, setSelectedDate] = useState(null);

    // Generate calendar days
    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      
      // Add empty cells for days before month starts
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // Add actual days
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }
      
      return days;
    };

    // Mock payment data - calculate from activeLikeLemba
    const getPaymentsForDate = (day) => {
      if (!day) return [];
      
      const payments = [];
      
      // Example payments based on circles
      activeLikeLemba.forEach(circle => {
        // Generate mock due dates (every 25th and 1st of month)
        if (day === 25 || day === 1) {
          const monthlyAmount = circle.duration ? 
            Math.floor(parseInt(circle.amount) / circle.duration) : 
            parseInt(circle.amount);
          
          payments.push({
            circleName: circle.name,
            amount: monthlyAmount,
            status: day === 25 && currentMonth.getMonth() === 0 ? 'due' : 
                    day === 1 && currentMonth.getMonth() === 0 ? 'pending' : 'upcoming'
          });
        }
      });
      
      return payments;
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];

    const previousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
      setSelectedDate(null);
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
      setSelectedDate(null);
    };

    const selectedPayments = selectedDate ? getPaymentsForDate(selectedDate) : [];
    const totalForSelected = selectedPayments.reduce((sum, p) => sum + p.amount, 0);

    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => navigate('/wallet')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Payment Calendar</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Month Navigation */}
          <div className="px-6 py-4 flex items-center justify-between">
            <button 
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="px-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-gray-500 text-sm font-semibold py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square"></div>;
                }

                const payments = getPaymentsForDate(day);
                const hasPayments = payments.length > 0;
                const isSelected = selectedDate === day;
                const isToday = day === 20 && currentMonth.getMonth() === 0; // Mock today as Jan 20

                let statusColor = '';
                if (hasPayments) {
                  const status = payments[0].status;
                  if (status === 'due') statusColor = 'bg-red-500';
                  else if (status === 'pending') statusColor = 'bg-yellow-500';
                  else statusColor = 'bg-blue-500';
                }

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition ${
                      isSelected ? 'bg-blue-600 text-white' : 
                      isToday ? 'bg-blue-50 text-blue-600 border-2 border-blue-600' :
                      'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isSelected ? 'text-white' : ''}`}>
                      {day}
                    </span>
                    {hasPayments && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected ? 'bg-white' : statusColor
                      }`}></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="px-6 py-6">
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700">Payment Overdue</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-700">Payment Due Soon</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">Upcoming Payment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Payment Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {monthNames[currentMonth.getMonth()]} {selectedDate}, {currentMonth.getFullYear()}
                  </h3>
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {selectedPayments.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-4">
                      {selectedPayments.map((payment, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{payment.circleName}</p>
                              <p className="text-sm text-gray-600">
                                {payment.status === 'due' ? '⚠️ Overdue' : 
                                 payment.status === 'pending' ? '⏱️ Due Soon' : 
                                 '📅 Upcoming'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{payment.amount.toLocaleString()} XAF</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total for this date:</span>
                        <span className="font-bold text-blue-600 text-lg">{totalForSelected.toLocaleString()} XAF</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white py-3 rounded-full font-bold">
                        Add to Phone Calendar
                      </button>
                      <button className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-full font-bold">
                        Set Reminder
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No payments scheduled for this date</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="px-6 pb-6">
            <h3 className="font-bold text-gray-900 mb-4">This Month Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200">
                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {activeLikeLemba.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200">
                <p className="text-sm text-gray-600 mb-1">Due This Month</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {activeLikeLemba.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeLikeLemba.filter(c => c.type === 'saving').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {finishedLikeLemba.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const TransactionHistoryScreen = () => {
    // Filter by type
    let filteredTransactions = transactionFilter === 'all'
      ? transactions
      : transactions.filter(t => t.type === transactionFilter);

    // Filter by date range
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      filteredTransactions = filteredTransactions.filter(t =>
        new Date(t.date).toDateString() === today
      );
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredTransactions = filteredTransactions.filter(t =>
        new Date(t.date) >= weekAgo
      );
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredTransactions = filteredTransactions.filter(t =>
        new Date(t.date) >= monthAgo
      );
    } else if (dateFilter === 'custom' && startDate && endDate) {
      filteredTransactions = filteredTransactions.filter(t => {
        const transDate = new Date(t.date);
        return transDate >= new Date(startDate) && transDate <= new Date(endDate);
      });
    }

    const totalIncome = transactions
      .filter(t => t.status === 'completed' && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = Math.abs(transactions
      .filter(t => t.status === 'completed' && t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));

    const getStatusColor = (status) => {
      switch(status) {
        case 'completed': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'failed': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const getTypeIcon = (type) => {
      switch(type) {
        case 'payment': return '💰';
        case 'payout': return '🎉';
        case 'fee': return '📋';
        case 'refund': return '↩️';
        default: return '💳';
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Group transactions by date
    const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
      const date = formatDate(transaction.date);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <button onClick={() => navigate('/wallet')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-green-700 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-700">
                +{totalIncome.toLocaleString()} <span className="text-sm">XAF</span>
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-xs text-red-700 mb-1">Total Expense</p>
              <p className="text-2xl font-bold text-red-700">
                -{totalExpense.toLocaleString()} <span className="text-sm">XAF</span>
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All', count: transactions.length },
              { id: 'payment', label: 'Payments', count: transactions.filter(t => t.type === 'payment').length },
              { id: 'payout', label: 'Payouts', count: transactions.filter(t => t.type === 'payout').length },
              { id: 'fee', label: 'Fees', count: transactions.filter(t => t.type === 'fee').length },
              { id: 'refund', label: 'Refunds', count: transactions.filter(t => t.type === 'refund').length }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setTransactionFilter(filter.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition ${
                  transactionFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {filter.label} {filter.count > 0 && `(${filter.count})`}
              </button>
            ))}
          </div>

          {/* Date Range Filters */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Date Range</p>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'custom', label: 'Custom Range' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setDateFilter(filter.id);
                    if (filter.id !== 'custom') {
                      setStartDate('');
                      setEndDate('');
                    }
                  }}
                  className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition ${
                    dateFilter === filter.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range Inputs */}
            {dateFilter === 'custom' && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 pb-24">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-gray-400" size={48} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                No transactions
              </h2>
              <p className="text-gray-500 text-center">
                {transactionFilter === 'all'
                  ? 'Your transaction history will appear here'
                  : `No ${transactionFilter} transactions found`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTransactions).map(([date, txns]) => (
                <div key={date}>
                  <h3 className="text-sm font-bold text-gray-500 mb-3">{date}</h3>
                  <div className="space-y-3">
                    {txns.map(transaction => (
                      <div
                        key={transaction.id}
                        onClick={() => {
                          setSelectedLikeLemba(transaction);
                          setSubScreen('transaction-details');
                        }}
                        className="bg-white rounded-2xl p-4 border-2 border-gray-100 cursor-pointer hover:border-blue-300 transition"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            transaction.amount > 0 ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <span className="text-2xl">{getTypeIcon(transaction.type)}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{transaction.title}</h3>
                                <p className="text-sm text-gray-600">{transaction.description}</p>
                              </div>
                              <div className="text-right ml-3">
                                <p className={`text-lg font-bold ${
                                  transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} XAF
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(transaction.status)}`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                              <p className="text-xs text-gray-500">{transaction.method}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Button */}
        {filteredTransactions.length > 0 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <button className="w-full bg-blue-600 text-white py-3 rounded-full font-bold flex items-center justify-center space-x-2">
              <FileText size={20} />
              <span>Export as PDF</span>
            </button>
          </div>
        )}
      </div>
    );
  };


  const TransactionDetailsScreen = () => {
    if (!selectedLikeLemba) return null;
    
    const transaction = selectedLikeLemba; // Using selectedLikeLemba to store transaction details

    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => navigate('/wallet?screen=transaction-history')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Transaction Details</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          {/* Status Banner */}
          <div className={`rounded-3xl p-8 mb-6 text-center ${
            transaction.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
            transaction.status === 'pending' ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
            'bg-gradient-to-br from-red-500 to-pink-600'
          }`}>
            <div className="text-6xl mb-4">
              {transaction.status === 'completed' ? '✅' :
               transaction.status === 'pending' ? '⏳' : '❌'}
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">
              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} XAF
            </h2>
            <p className="text-white text-opacity-90">
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </p>
          </div>

          {/* Transaction Info */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Transaction Information</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold text-gray-900 capitalize">{transaction.type}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Description</span>
                <span className="font-semibold text-gray-900 text-right">{transaction.description}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-semibold text-gray-900">
                  {new Date(transaction.date).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">{transaction.method}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Reference</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-gray-900">{transaction.reference}</span>
                  <button onClick={handleCopyCode} className="p-1">
                    {copied ? <Check className="text-green-600" size={16} /> : <Copy className="text-blue-600" size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Category</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  {transaction.category}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt Note */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📄</div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Receipt</p>
                <p className="text-sm text-gray-700">
                  Keep this reference number for your records. You can use it to track this transaction.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <button className="w-full bg-blue-600 text-white py-4 rounded-full font-bold flex items-center justify-center space-x-2 mb-3">
            <FileText size={20} />
            <span>Download Receipt</span>
          </button>
          {transaction.status === 'failed' && (
            <button className="w-full bg-gray-100 text-gray-900 py-4 rounded-full font-bold">
              Retry Payment
            </button>
          )}
        </div>
      </div>
    );
  };


  const FinancialDashboardScreen = () => {
    const totalBalance = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions.filter(t => t.status === 'completed' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = Math.abs(transactions.filter(t => t.status === 'completed' && t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    const pendingPayments = transactions.filter(t => t.status === 'pending' && t.amount < 0);
    const upcomingPayout = transactions.filter(t => t.status === 'pending' && t.amount > 0);

    // Calculate monthly spending
    const monthlyData = {};
    transactions.filter(t => t.status === 'completed').forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.amount > 0) monthlyData[month].income += t.amount;
      else monthlyData[month].expense += Math.abs(t.amount);
    });

    const months = Object.keys(monthlyData).slice(-6);
    const maxValue = Math.max(...months.map(m => Math.max(monthlyData[m].income, monthlyData[m].expense)));

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Financial Dashboard</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          {/* Main Balance Card */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 mb-6 text-white shadow-xl">
            <p className="text-blue-100 text-sm mb-1">Total Balance</p>
            <h2 className="text-5xl font-bold mb-6">
              {totalBalance.toLocaleString()} <span className="text-2xl">XAF</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">↓</span>
                  </div>
                  <p className="text-blue-100 text-xs">Income</p>
                </div>
                <p className="text-2xl font-bold">+{totalIncome.toLocaleString()}</p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">↑</span>
                  </div>
                  <p className="text-blue-100 text-xs">Expense</p>
                </div>
                <p className="text-2xl font-bold">-{totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +{activeLikeLemba.length}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{activeLikeLemba.length}</p>
              <p className="text-sm text-gray-600">Active Groups</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  {finishedLikeLemba.length}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{finishedLikeLemba.length}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  {pendingPayments.length}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {pendingPayments.length > 0 ? Math.abs(pendingPayments[0].amount).toLocaleString() : '0'}
              </p>
              <p className="text-sm text-gray-600">Next Payment</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {transactions.length}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{transactions.length}</p>
              <p className="text-sm text-gray-600">Transactions</p>
            </div>
          </div>

          {/* Monthly Chart */}
          {months.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Monthly Overview</h3>
              
              <div className="flex items-end justify-between h-48 space-x-2">
                {months.map(month => (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="w-full space-y-1 mb-2">
                      {/* Income Bar */}
                      <div 
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all"
                        style={{ 
                          height: `${(monthlyData[month].income / maxValue) * 160}px`,
                          minHeight: monthlyData[month].income > 0 ? '4px' : '0px'
                        }}
                      ></div>
                      {/* Expense Bar */}
                      <div 
                        className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all"
                        style={{ 
                          height: `${(monthlyData[month].expense / maxValue) * 160}px`,
                          minHeight: monthlyData[month].expense > 0 ? '4px' : '0px'
                        }}
                      ></div>
                    </div>
                    <p className="text-xs font-bold text-gray-600 mt-2">{month}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Expense</span>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Payments */}
          {pendingPayments.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Upcoming Payments</h3>
                <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-bold">
                  {pendingPayments.length} Due
                </span>
              </div>
              
              {pendingPayments.slice(0, 3).map(payment => (
                <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{payment.description}</p>
                      <p className="text-xs text-gray-500">
                        Due {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-orange-600">
                    {Math.abs(payment.amount).toLocaleString()} XAF
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  navigate('/wallet?screen=transaction-history');
                }}
                className="bg-blue-50 rounded-xl p-4 text-left hover:bg-blue-100 transition"
              >
                <FileText className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">View Transactions</p>
              </button>
              
              <button 
                onClick={() => {
                  navigate('/circles');
                  }}
                className="bg-purple-50 rounded-xl p-4 text-left hover:bg-purple-100 transition"
              >
                <Users className="text-purple-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">My Circles</p>
              </button>
              
              <button 
                onClick={() => navigate('/circles?screen=join')}
                className="bg-green-50 rounded-xl p-4 text-left hover:bg-green-100 transition"
              >
                <PlusCircle className="text-green-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Join Group</p>
              </button>
              
              <button 
                onClick={() => {
                  navigate('/wallet');
                  }}
                className="bg-orange-50 rounded-xl p-4 text-left hover:bg-orange-100 transition"
              >
                <Wallet className="text-orange-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Make Payment</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const PayoutEligibilityScreen = () => {
    const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(null);

    return (
      <div className="flex-1 overflow-y-auto pb-32 bg-white">
        <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
          <button onClick={() => navigate('/wallet')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Payout Eligibility</h1>
        </div>

        <div className="px-6 py-6">
          <h2 className="text-gray-700 text-xl font-semibold mb-6">
            Make sure to correct the following:
          </h2>

          <div className="space-y-4 mb-8">
            {/* National ID */}
            <button 
              onClick={() => navigate('/profile?screen=scan-national-id')}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="text-red-500 text-2xl">⚠️</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">National ID</h3>
                    <p className="text-gray-600 text-sm">You will need to upload a valid national ID</p>
                  </div>
                </div>
                <ChevronRight className="text-blue-600" size={24} />
              </div>
            </button>

            {/* Payout Method */}
            <button 
              onClick={() => setSubScreen('payout-method')}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="text-red-500 text-2xl">⚠️</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Payout Method Selected</h3>
                    <p className="text-gray-600 text-sm">You will need to select a payout method</p>
                  </div>
                </div>
                <ChevronRight className="text-blue-600" size={24} />
              </div>
            </button>

            {/* Contract */}
            <button 
              onClick={() => navigate('/profile?screen=signing-requests')}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="text-red-500 text-2xl">⚠️</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Contract</h3>
                    <p className="text-gray-600 text-sm">You will need to sign the contract first</p>
                  </div>
                </div>
                <ChevronRight className="text-blue-600" size={24} />
              </div>
            </button>
          </div>

          <div className="space-y-4">
            {/* Due Payments */}
            <div className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="text-blue-600" size={24} />
                  <h3 className="font-bold text-gray-900 text-lg">Due Payments</h3>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                  <Check className="text-white" size={16} />
                </div>
              </div>
            </div>

            {/* Insurance Note */}
            <div className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="text-blue-600" size={24} />
                  <h3 className="font-bold text-gray-900 text-lg">Insurance Note</h3>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                  <Check className="text-white" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const PayoutMethodScreen = () => {
    const [selectedMethod, setSelectedMethod] = useState(null);

    return (
      <div className="flex-1 overflow-y-auto pb-48 bg-white">
        <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
          <button onClick={() => setSubScreen('payment-settings')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Payout method</h1>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-600 mb-6">
            Choose your preferred payout method for the next circles
          </p>

          <div className="space-y-4 mb-8">
            {/* Digital Wallets */}
            <div 
              onClick={() => setSelectedMethod('digital')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="text-blue-600" size={28} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">Digital Wallets</h3>
                    <p className="text-gray-600 text-sm">Receive your payout on any digital wallet</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${selectedMethod === 'digital' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                  {selectedMethod === 'digital' && <div className="w-full h-full rounded-full bg-blue-600"></div>}
                </div>
              </div>
            </div>

            {/* Prepaid Card */}
            <div 
              onClick={() => setSelectedMethod('prepaid')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition"
            >
              <div className="mb-2">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                  No Charge
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="text-blue-600" size={28} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">Prepaid card</h3>
                    <p className="text-gray-600 text-sm">Receive your payout on any Prepaid Card.</p>
                    <p className="text-gray-600 text-sm">Card limit is 100,000 XAF</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${selectedMethod === 'prepaid' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                  {selectedMethod === 'prepaid' && <div className="w-full h-full rounded-full bg-blue-600"></div>}
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div 
              onClick={() => setSelectedMethod('bank')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition"
            >
              <div className="mb-2">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                  No Charge
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600 text-3xl">🏛️</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">Bank Transfer</h3>
                    <p className="text-gray-600 text-sm">Direct your payout to your bank account</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${selectedMethod === 'bank' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                  {selectedMethod === 'bank' && <div className="w-full h-full rounded-full bg-blue-600"></div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button 
            disabled={!selectedMethod}
            className={`w-full py-4 rounded-full font-bold text-lg ${
              selectedMethod 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };


  const PaymentHistoryScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => navigate('/wallet')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Payment history</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="text-blue-600" size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
          No payment history yet
        </h2>
        <p className="text-gray-500 text-center">
          Your payment transactions will appear here once you start making payments.
        </p>
      </div>
    </div>
  );


  const PaymentPolicyScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => navigate('/wallet')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Payment policy</h1>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Terms</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              All payments must be made according to the agreed schedule. Late payments may incur additional fees.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Refund Policy</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Refunds are processed within 7-10 business days after approval. Certain conditions may apply.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Methods</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We accept various payment methods including digital wallets, bank transfers, and prepaid cards.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Security</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              All transactions are encrypted and secured. We never store your complete payment information.
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-gray-700 text-sm">
              For more detailed information about our payment policies, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );


  const PaymentSettingsScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200 bg-white">
        <button onClick={() => navigate('/wallet')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Payment settings</h1>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-4">
          <button 
            onClick={() => setSubScreen('payout-method')}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Change Payout Method</h3>
                  <p className="text-gray-600 text-sm">You can change the payout method before your payout month.</p>
                </div>
              </div>
              <ChevronRight className="text-blue-600" size={24} />
            </div>
          </button>

          <button 
            onClick={() => setSubScreen('saved-cards')}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Saved Cards</h3>
                  <p className="text-gray-600 text-sm">Manage your pay-in cards</p>
                </div>
              </div>
              <ChevronRight className="text-blue-600" size={24} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );


  const SavedCardsScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => setSubScreen('payment-settings')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Saved Cards</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-8">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="20" y="40" width="70" height="50" rx="8" fill="#4F46E5" opacity="0.9"/>
            <rect x="25" y="55" width="20" height="3" rx="1.5" fill="white"/>
            <rect x="25" y="62" width="15" height="3" rx="1.5" fill="white"/>
            <circle cx="75" cy="70" r="8" fill="#FCD34D" opacity="0.9"/>
            <rect x="30" y="50" width="80" height="50" rx="8" fill="#3B82F6"/>
            <rect x="35" y="65" width="25" height="4" rx="2" fill="white"/>
            <rect x="35" y="73" width="18" height="4" rx="2" fill="white"/>
            <circle cx="90" cy="80" r="10" fill="#FCD34D"/>
            <text x="75" y="95" fill="white" fontSize="8" fontWeight="bold">100 LE</text>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          There are no saved cards
        </h2>
        <p className="text-gray-500 text-center px-8">
          You can add new cards now or save your card information for future payments.
        </p>
      </div>
    </div>
  );

  const handlePayment = async () => {
    if (!selectedPayment) return;

    setIsProcessingPayment(true);
    try {
      const circle = activeLikeLemba.find(c => c.name === selectedPayment.circleName);
      if (!circle) {
        alert('Circle not found');
        return;
      }

      await paymentsService.makeContribution({
        like_lemba_id: circle.id,
        amount: selectedPayment.amount,
        payment_method: 'wallet'
      });

      // Refresh circles data
      const circlesRes = await circlesService.getMyCircles();
      if (circlesRes.success && circlesRes.data) {
        // Update context with fresh data
        alert('Payment successful!');
      }

      setShowPaymentModal(false);
      setSelectedPayment(null);
    } catch (error: any) {
      alert(error.message || 'Failed to process payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Payment Modal
  const PaymentModal = () => {
    if (!showPaymentModal || !selectedPayment) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Confirm Payment</h2>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                }}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X className="text-gray-600" size={20} />
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{selectedPayment.type === 'saving' ? '🌱' : '👥'}</span>
                <div>
                  <p className="text-sm text-gray-600">Payment to</p>
                  <p className="text-xl font-bold text-gray-900">{selectedPayment.circleName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Amount</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedPayment.amount.toLocaleString()} XAF</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Due Date</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedPayment.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-bold">💳 Payment Method:</span> Wallet Balance
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-bold">⚠️ Note:</span> This payment will be deducted from your wallet balance.
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition"
            >
              {isProcessingPayment ? 'Processing...' : `Pay ${selectedPayment.amount.toLocaleString()} XAF`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Sub-screen router
  if (subScreen === 'payment-calendar') return <PaymentCalendarScreen />;
  if (subScreen === 'transaction-history') return <TransactionHistoryScreen />;
  if (subScreen === 'transaction-details') return <TransactionDetailsScreen />;
  if (subScreen === 'financial-dashboard') return <FinancialDashboardScreen />;
  if (subScreen === 'payout-eligibility') return <PayoutEligibilityScreen />;
  if (subScreen === 'payout-method') return <PayoutMethodScreen />;
  if (subScreen === 'payment-history') return <PaymentHistoryScreen />;
  if (subScreen === 'payment-policy') return <PaymentPolicyScreen />;
  if (subScreen === 'payment-settings') return <PaymentSettingsScreen />;
  if (subScreen === 'saved-cards') return <SavedCardsScreen />;

  return (
    <>
      <PaymentsScreen />
      <PaymentModal />
    </>
  );
};
