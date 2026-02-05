// @ts-nocheck
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { circlesService } from '../services/circles.service';
import { goalsService } from '../services/goals.service';
import { walletService } from '../services/wallet.service';
import { dashboardService } from '../services/dashboard.service';
import { transactionsService } from '../services/transactions.service';

interface AppContextType {
  // User info
  firstName: string;
  setFirstName: (s: string) => void;
  lastName: string;
  setLastName: (s: string) => void;
  phone: string;
  setPhone: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
  language: string;
  setLanguage: (s: string) => void;
  referralCode: string;

  // Circles
  activeLikeLemba: any[];
  setActiveLikeLemba: (v: any) => void;
  finishedLikeLemba: any[];
  setFinishedLikeLemba: (v: any) => void;
  selectedLikeLemba: any;
  setSelectedLikeLemba: (v: any) => void;
  addLikeLemba: (circle: any) => void;
  moveLikeLembaToFinished: (id: any) => void;
  circles: any[];
  durations: any[];

  // Join flow
  circleAmount: string;
  setCircleAmount: (s: string) => void;
  circleDuration: any;
  setCircleDuration: (v: any) => void;
  selectedCircle: any;
  setSelectedCircle: (v: any) => void;
  selectedDuration: number;
  setSelectedDuration: (n: number) => void;
  selectedSlot: any;
  setSelectedSlot: (v: any) => void;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (s: string) => void;
  paymentDetails: any;
  setPaymentDetails: (v: any) => void;
  calculateTotalPayout: () => number;

  // Create LikeLemba
  likeLembaName: string;
  setLikeLembaName: (s: string) => void;
  likeLembaAmount: string;
  setLikeLembaAmount: (s: string) => void;
  likeLembaDuration: any;
  setLikeLembaDuration: (v: any) => void;
  likeLembaMembers: number;
  setLikeLembaMembers: (n: number) => void;
  likeLembaDescription: string;
  setLikeLembaDescription: (s: string) => void;
  joinCode: string;
  setJoinCode: (s: string) => void;

  // Goals
  userGoals: any[];
  setUserGoals: (v: any) => void;
  selectedGoal: any;
  setSelectedGoal: (v: any) => void;
  canCreateCustomGoal: () => boolean;

  // Plan
  userPlan: any;
  setUserPlan: (v: any) => void;
  getPlanLimits: (tier: string) => any;
  getCirclesRemaining: () => string;
  calculateAdminFee: (amount: number) => number;

  // Notifications & Transactions
  notifications: any[];
  setNotifications: (v: any) => void;
  transactions: any[];
  setTransactions: (v: any) => void;

  // Chat & Support
  groupChats: any;
  setGroupChats: (v: any) => void;
  supportTickets: any[];
  setSupportTickets: (v: any) => void;
  liveChatMessages: any[];
  setLiveChatMessages: (v: any) => void;
  liveChatMessage: string;
  setLiveChatMessage: (s: string) => void;
  supportMessage: string;
  setSupportMessage: (s: string) => void;
  selectedTicket: any;
  setSelectedTicket: (v: any) => void;
  sendLiveChatMessage: () => void;
  createNewTicket: (subject: string, category: string, message: string) => void;
  sendSupportMessage: (ticketId: any) => void;
  sendMessage: (groupName: string) => void;
  chatMessage: string;
  setChatMessage: (s: string) => void;

  // Security
  securityLogs: any[];
  biometricsEnabled: boolean;
  setBiometricsEnabled: (b: boolean) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (b: boolean) => void;
  loginAlerts: boolean;
  setLoginAlerts: (b: boolean) => void;

  // Utility
  copied: boolean;
  setCopied: (b: boolean) => void;
  handleCopyCode: () => void;
  copyToClipboard: (text: string) => boolean;

  // Loading & Error
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firstName, setFirstName] = useState('Joeldy');
  const [lastName, setLastName] = useState('Mukendi');
  const [phone, setPhone] = useState('064663469');
  const [email, setEmail] = useState('joeldy.mukendi@example.com');
  const [language, setLanguage] = useState('en');
  const referralCode = 'suhila_ash_2301504';

  // Circles state
  const [activeLikeLemba, setActiveLikeLemba] = useState<any[]>([]);
  const [finishedLikeLemba, setFinishedLikeLemba] = useState<any[]>([]);
  const [selectedLikeLemba, setSelectedLikeLemba] = useState<any>(null);

  // Join flow
  const [circleAmount, setCircleAmount] = useState('');
  const [circleDuration, setCircleDuration] = useState<any>(null);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    mobileNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    provider: ''
  });
  const [joinCode, setJoinCode] = useState('');

  // Create LikeLemba
  const [likeLembaName, setLikeLembaName] = useState('');
  const [likeLembaAmount, setLikeLembaAmount] = useState('');
  const [likeLembaDuration, setLikeLembaDuration] = useState<any>(null);
  const [likeLembaMembers, setLikeLembaMembers] = useState(6);
  const [likeLembaDescription, setLikeLembaDescription] = useState('');

  // Goals
  const [userGoals, setUserGoals] = useState([
    {
      id: 1, name: 'School Tuition', icon: '✏️', color: 'bg-blue-100',
      targetAmount: 500000, currentAmount: 200000, deadline: '2026-12-31',
      category: 'education', description: 'Save for your child\'s education and secure their future', active: true
    },
    {
      id: 2, name: 'Summer Holidays', icon: '🌴', color: 'bg-green-100',
      targetAmount: 300000, currentAmount: 0, deadline: '2026-06-30',
      category: 'travel', description: 'Plan your dream vacation and create unforgettable memories', active: true
    }
  ]);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  // Plan
  const [userPlan, setUserPlan] = useState({
    tier: 'bronze', tierName: 'Bronze', badge: '🥉',
    color: 'from-amber-600 to-orange-700',
    subscriptionStart: '2026-01-01', subscriptionEnd: null, autoRenew: false,
    features: {
      maxCircles: 2, adminFeePercent: 5, customGoalsLimit: 0,
      prioritySupport: false, zeroFees: false, cashbackPercent: 0,
      prioritySlots: false, advancedStats: false, referralMultiplier: 1,
      paymentReminders: false, createCircles: true
    },
    addOns: [] as any[]
  });

  // Notifications & Transactions
  const [notifications, setNotifications] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Chat & Support
  const [groupChats, setGroupChats] = useState<any>({});
  const [chatMessage, setChatMessage] = useState('');
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [supportMessage, setSupportMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [liveChatMessages, setLiveChatMessages] = useState<any[]>([]);
  const [liveChatMessage, setLiveChatMessage] = useState('');

  // Security
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Utility
  const [copied, setCopied] = useState(false);

  // Loading & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth context
  const { user } = useAuth();

  // Static data
  const circles = [
    { name: 'LITE SAVER', amount: 3000, bonus: 600 },
    { name: 'BRONZE SAVER', amount: 6000, bonus: 1200 }
  ];
  const durations = [
    { months: 6, monthly: 500 },
    { months: 12, monthly: 250 },
    { months: 24, monthly: 125 }
  ];

  // Fetch real data from backend
  const fetchUserData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [circlesRes, goalsRes, transactionsRes] = await Promise.all([
        circlesService.getMyCircles().catch(() => ({ success: false, data: [] })),
        goalsService.getGoals().catch(() => ({ success: false, data: [] })),
        transactionsService.getAll().catch(() => ({ success: false, data: [] }))
      ]);

      // Process circles
      if (circlesRes.success && circlesRes.data) {
        const active = circlesRes.data.filter((c: any) => c.status === 'active' || c.status === 'pending');
        const finished = circlesRes.data.filter((c: any) => c.status === 'completed');
        setActiveLikeLemba(active);
        setFinishedLikeLemba(finished);
      }

      // Process goals
      if (goalsRes.success && goalsRes.data) {
        setUserGoals(goalsRes.data);
      }

      // Process transactions
      if (transactionsRes.success && transactionsRes.data) {
        setTransactions(transactionsRes.data);
      }

      // Update user info from context
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);

    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch data when user logs in
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  // Helper functions
  const getPlanLimits = useCallback((tier: string) => {
    const plans: any = {
      bronze: { tierName: 'Bronze', badge: '🥉', color: 'from-amber-600 to-orange-700', price: 0, features: { maxCircles: 2, adminFeePercent: 5, customGoalsLimit: 0, prioritySupport: false, zeroFees: false, cashbackPercent: 0, prioritySlots: false, advancedStats: false, referralMultiplier: 1, paymentReminders: false, createCircles: true } },
      silver: { tierName: 'Silver', badge: '🥈', color: 'from-gray-400 to-gray-600', price: 2500, features: { maxCircles: 5, adminFeePercent: 3, customGoalsLimit: 10, prioritySupport: true, zeroFees: false, cashbackPercent: 0, prioritySlots: true, advancedStats: true, referralMultiplier: 2, paymentReminders: true, createCircles: true } },
      gold: { tierName: 'Gold', badge: '🥇', color: 'from-yellow-400 to-yellow-600', price: 5000, features: { maxCircles: -1, adminFeePercent: 0, customGoalsLimit: -1, prioritySupport: true, zeroFees: true, cashbackPercent: 2, prioritySlots: true, advancedStats: true, referralMultiplier: 3, paymentReminders: true, createCircles: true } }
    };
    return plans[tier] || plans.bronze;
  }, []);

  const canCreateCustomGoal = useCallback(() => {
    const limit = userPlan.features.customGoalsLimit;
    if (limit === -1) return true;
    if (limit === 0) return false;
    return userGoals.filter((g: any) => g.active).length < limit;
  }, [userPlan, userGoals]);

  const calculateAdminFee = useCallback((amount: number) => {
    const zeroFeesAddon = userPlan.addOns.find((a: any) => a.feature === 'zeroFees' && new Date(a.expiryDate) > new Date());
    if (zeroFeesAddon || userPlan.features.zeroFees) return 0;
    return Math.floor(amount * (userPlan.features.adminFeePercent / 100));
  }, [userPlan]);

  const getCirclesRemaining = useCallback(() => {
    const limit = userPlan.features.maxCircles;
    if (limit === -1) return '∞';
    return String(Math.max(0, limit - activeLikeLemba.length));
  }, [userPlan, activeLikeLemba]);

  const addLikeLemba = useCallback((likeLemba: any) => {
    setActiveLikeLemba(prev => [...prev, { ...likeLemba, id: Date.now(), joinedDate: new Date().toISOString(), status: 'active' }]);
  }, []);

  const moveLikeLembaToFinished = useCallback((id: any) => {
    setActiveLikeLemba(prev => {
      const circle = prev.find(c => c.id === id);
      if (circle) {
        setFinishedLikeLemba(fin => [...fin, { ...circle, status: 'finished', completedDate: new Date().toISOString(), monthsCompleted: circle.duration }]);
        return prev.filter(c => c.id !== id);
      }
      return prev;
    });
  }, []);

  const calculateTotalPayout = useCallback(() => {
    if (!selectedCircle || selectedDuration === null) return 0;
    const duration = durations[selectedDuration];
    return duration.monthly * duration.months + (selectedCircle.bonus * (duration.months / 6));
  }, [selectedCircle, selectedDuration]);

  const copyToClipboard = useCallback((text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (err) {
      textArea.remove();
      return false;
    }
  }, []);

  const handleCopyCode = useCallback(() => {
    const textArea = document.createElement('textarea');
    textArea.value = referralCode;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      textArea.remove();
      alert('Failed to copy. Please copy manually: ' + referralCode);
    }
  }, []);

  const sendLiveChatMessage = useCallback(() => {
    if (!liveChatMessage.trim()) return;
    const newMessage = { id: Date.now(), sender: 'You', message: liveChatMessage, timestamp: new Date().toISOString(), isMe: true, type: 'message' };
    setLiveChatMessages(prev => [...prev, newMessage]);
    setLiveChatMessage('');
    setTimeout(() => {
      setLiveChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'Support Agent', message: 'Thank you for your message! A support agent will respond shortly.', timestamp: new Date().toISOString(), isMe: false, type: 'message' }]);
    }, 1500);
  }, [liveChatMessage]);

  const createNewTicket = useCallback((subject: string, category: string, message: string) => {
    if (!subject.trim() || !category || !message.trim()) { alert('Please fill in all fields'); return; }
    const newTicket = { id: Date.now(), subject, category, status: 'open', priority: 'medium', createdAt: new Date().toISOString(), messages: [{ id: 1, sender: 'You', message, timestamp: new Date().toISOString(), isMe: true }] };
    setSupportTickets(prev => [newTicket, ...prev]);
  }, []);

  const sendSupportMessage = useCallback((ticketId: any) => {
    if (!supportMessage.trim()) return;
    const newMessage = { id: Date.now(), sender: 'You', message: supportMessage, timestamp: new Date().toISOString(), isMe: true };
    setSupportTickets(prev => prev.map(ticket => ticket.id === ticketId ? { ...ticket, messages: [...ticket.messages, newMessage] } : ticket));
    setSupportMessage('');
  }, [supportMessage]);

  const sendMessage = useCallback((groupName: string) => {
    if (!chatMessage.trim()) return;
    const newMessage = { id: Date.now(), sender: 'You', message: chatMessage, timestamp: new Date().toISOString(), isMe: true, type: 'message' };
    setGroupChats(prev => ({ ...prev, [groupName]: [...(prev[groupName] || []), newMessage] }));
    setChatMessage('');
  }, [chatMessage]);

  const value: AppContextType = {
    firstName, setFirstName, lastName, setLastName, phone, setPhone, email, setEmail, language, setLanguage, referralCode,
    activeLikeLemba, setActiveLikeLemba, finishedLikeLemba, setFinishedLikeLemba, selectedLikeLemba, setSelectedLikeLemba,
    addLikeLemba, moveLikeLembaToFinished, circles, durations,
    circleAmount, setCircleAmount, circleDuration, setCircleDuration, selectedCircle, setSelectedCircle,
    selectedDuration, setSelectedDuration, selectedSlot, setSelectedSlot,
    selectedPaymentMethod, setSelectedPaymentMethod, paymentDetails, setPaymentDetails, calculateTotalPayout,
    likeLembaName, setLikeLembaName, likeLembaAmount, setLikeLembaAmount, likeLembaDuration, setLikeLembaDuration,
    likeLembaMembers, setLikeLembaMembers, likeLembaDescription, setLikeLembaDescription, joinCode, setJoinCode,
    userGoals, setUserGoals, selectedGoal, setSelectedGoal, canCreateCustomGoal,
    userPlan, setUserPlan, getPlanLimits, getCirclesRemaining, calculateAdminFee,
    notifications, setNotifications, transactions, setTransactions,
    groupChats, setGroupChats, supportTickets, setSupportTickets,
    liveChatMessages, setLiveChatMessages, liveChatMessage, setLiveChatMessage,
    supportMessage, setSupportMessage, selectedTicket, setSelectedTicket,
    sendLiveChatMessage, createNewTicket, sendSupportMessage, sendMessage,
    chatMessage, setChatMessage,
    securityLogs, biometricsEnabled, setBiometricsEnabled, twoFactorEnabled, setTwoFactorEnabled, loginAlerts, setLoginAlerts,
    copied, setCopied, handleCopyCode, copyToClipboard,
    loading, error, refreshData: fetchUserData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
