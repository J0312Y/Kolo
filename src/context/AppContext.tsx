// @ts-nocheck
import React, { createContext, useContext, useState, useCallback } from 'react';

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

  // Demo data seeding
  React.useEffect(() => {
    if (activeLikeLemba.length === 0 && finishedLikeLemba.length === 0) {
      setActiveLikeLemba([{
        id: 1, name: 'Demo Family Savings', amount: '75000', duration: 6,
        totalMembers: 6, currentMembers: 4, type: 'joined',
        inviteCode: 'DEMO_FAMILY_SAVINGS_2026', monthsCompleted: 2,
        joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), status: 'active'
      }]);
      setFinishedLikeLemba([{
        id: 2, name: 'Friends Circle 2025', amount: '100000', duration: 12,
        totalMembers: 12, currentMembers: 12, type: 'created',
        inviteCode: 'FRIENDS_CIRCLE_2025', monthsCompleted: 12,
        joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), status: 'finished'
      }]);
    }

    if (notifications.length === 0) {
      setNotifications([
        { id: 1, type: 'payment', title: 'Payment Due Soon', message: 'Your monthly payment of 12,500 XAF for Demo Family Savings is due in 3 days.', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false, icon: '💰', color: 'blue' },
        { id: 2, type: 'group', title: 'New Member Joined', message: 'Marie Nkulu joined your group "Demo Family Savings"', time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), read: false, icon: '👥', color: 'green' },
        { id: 3, type: 'payout', title: 'Payout Received', message: 'You received 75,000 XAF from Demo Family Savings', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: true, icon: '🎉', color: 'purple' },
        { id: 4, type: 'system', title: 'Security Alert', message: 'New login detected from Brazzaville. If this wasn\'t you, please secure your account.', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: true, icon: '🔒', color: 'red' },
        { id: 5, type: 'group', title: 'Group Chat Message', message: 'Jean posted in Demo Family Savings: "Payment confirmed for this month"', time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true, icon: '💬', color: 'blue' },
        { id: 6, type: 'payment', title: 'Payment Confirmed', message: 'Your payment of 12,500 XAF has been successfully processed.', time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), read: true, icon: '✅', color: 'green' }
      ]);
    }

    if (transactions.length === 0) {
      setTransactions([
        { id: 1, type: 'payment', status: 'completed', title: 'Monthly Payment', description: 'Demo Family Savings - Month 2', amount: -12500, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), method: 'Mobile Money', reference: 'TXN001234567', category: 'Likelemba' },
        { id: 2, type: 'payout', status: 'completed', title: 'Payout Received', description: 'Demo Family Savings - Your Turn', amount: 75000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), method: 'Bank Transfer', reference: 'TXN001234566', category: 'Likelemba' },
        { id: 3, type: 'payment', status: 'pending', title: 'Monthly Payment', description: 'Demo Family Savings - Month 3', amount: -12500, date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), method: 'Mobile Money', reference: 'TXN001234568', category: 'Likelemba' },
        { id: 4, type: 'payment', status: 'completed', title: 'Monthly Payment', description: 'Demo Family Savings - Month 1', amount: -12500, date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), method: 'Mobile Money', reference: 'TXN001234565', category: 'Likelemba' },
        { id: 5, type: 'fee', status: 'completed', title: 'Admin Fee', description: 'Demo Family Savings - Setup', amount: -630, date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), method: 'Mobile Money', reference: 'TXN001234564', category: 'Fees' },
        { id: 6, type: 'refund', status: 'completed', title: 'Refund', description: 'Duplicate payment refund', amount: 12500, date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), method: 'Mobile Money', reference: 'TXN001234563', category: 'Refund' },
        { id: 7, type: 'payment', status: 'failed', title: 'Monthly Payment', description: 'Friends Circle 2025 - Month 10', amount: -8333, date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), method: 'Bank Transfer', reference: 'TXN001234562', category: 'Likelemba' }
      ]);
    }

    if (Object.keys(groupChats).length === 0) {
      setGroupChats({
        'Demo Family Savings': [
          { id: 1, sender: 'Admin', message: 'Welcome everyone to Demo Family Savings! 👋', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), isMe: false, type: 'system' },
          { id: 2, sender: 'You', message: 'Thanks for creating this group! Excited to start saving together.', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), isMe: true, type: 'message' },
          { id: 3, sender: 'Marie Nkulu', message: 'Happy to be part of this! When is the first payment due?', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), isMe: false, type: 'message' },
          { id: 4, sender: 'Admin', message: 'First payment is due on February 25th.', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), isMe: false, type: 'system' },
          { id: 5, sender: 'Jean Bokete', message: 'Perfect! Looking forward to this journey with you all 🚀', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), isMe: false, type: 'message' },
          { id: 6, sender: 'Admin', message: '💰 Payment received from Jean Bokete - 12,500 XAF', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), isMe: false, type: 'notification' },
          { id: 7, sender: 'You', message: 'Great! Just made my payment too ✅', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isMe: true, type: 'message' },
          { id: 8, sender: 'Marie Nkulu', message: 'Payment confirmed on my side as well! 💰', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isMe: false, type: 'message' },
          { id: 9, sender: 'Admin', message: '🎉 All payments received for this month!', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), isMe: false, type: 'notification' }
        ]
      });
    }

    if (supportTickets.length === 0) {
      setSupportTickets([
        { id: 1, subject: 'Payment not reflecting', category: 'Payment Issue', status: 'open', priority: 'high', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), messages: [
          { id: 1, sender: 'You', message: 'I made a payment 2 hours ago but it\'s not showing.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isMe: true },
          { id: 2, sender: 'Support Agent', message: 'Hello! I\'m looking into your payment right now.', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), isMe: false },
          { id: 3, sender: 'You', message: 'I used Mobile Money - Airtel Money', timestamp: new Date(Date.now() - 1.3 * 60 * 60 * 1000).toISOString(), isMe: true },
          { id: 4, sender: 'Support Agent', message: 'It should reflect within the next 30 minutes.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), isMe: false }
        ]},
        { id: 2, subject: 'How to invite more members?', category: 'General Question', status: 'resolved', priority: 'low', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), messages: [
          { id: 1, sender: 'You', message: 'How can I invite more members to my group?', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), isMe: true },
          { id: 2, sender: 'Support Agent', message: 'Go to your group details > Share Invitation > Share the code!', timestamp: new Date(Date.now() - 4.8 * 24 * 60 * 60 * 1000).toISOString(), isMe: false },
          { id: 3, sender: 'You', message: 'Perfect! Thank you!', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), isMe: true }
        ]}
      ]);
    }

    if (securityLogs.length === 0) {
      setSecurityLogs([
        { id: 1, action: 'Login', device: 'iPhone 13', location: 'Brazzaville, CG', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), status: 'success', ip: '197.214.xxx.xxx' },
        { id: 2, action: 'Payment', device: 'iPhone 13', location: 'Brazzaville, CG', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), status: 'success', ip: '197.214.xxx.xxx' },
        { id: 3, action: 'Password Change', device: 'iPhone 13', location: 'Brazzaville, CG', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'success', ip: '197.214.xxx.xxx' },
        { id: 4, action: 'Failed Login', device: 'Unknown Device', location: 'Kinshasa, CD', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'failed', ip: '41.242.xxx.xxx' }
      ]);
    }

    if (liveChatMessages.length === 0) {
      setLiveChatMessages([
        { id: 1, sender: 'Support Bot', message: 'Hello! 👋 Welcome to Kolo Tontine support. How can I help you today?', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), isMe: false, type: 'bot' }
      ]);
    }
  }, []);

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
    copied, setCopied, handleCopyCode, copyToClipboard
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
