import React, { useState, useCallback, useRef } from 'react';
import { Home, Users, PlusCircle, CreditCard, Wallet, Bell, Zap, Search, ChevronRight, ArrowLeft, CheckCircle2, Settings, HelpCircle, FileText, Camera, User, Lock, Globe, LogOut, Folder, MapPin, UserPlus, File, Shield, Copy, Check, Gift, TrendingUp, X, MessageCircle, Send, Smile, MoreVertical, Calendar, ChevronLeft, Building, Phone } from 'lucide-react';

// Translations Object
const translations = {
  en: {
    // Bottom Navigation
    home: "Home",
    circles: "Circles",
    wallet: "Wallet",
    card: "Card",
    profile: "Profile",
    
    // Home Screen
    welcomeBack: "Welcome back",
    totalBalance: "Total Balance",
    activeCircles: "Active Circles",
    completedCircles: "Completed",
    nextPayout: "Next Payout",
    quickActions: "Quick Actions",
    joinCircle: "Join a Circle",
    createCircle: "Create Circle",
    inviteFriends: "Invite friends",
    exploreGoals: "Explore Goals",
    myGoals: "My Goals",
    smartSaving: "Smart saving with low fees",
    zeroFees: "Zero fees, maximum savings",
    
    // Circles
    myCircles: "My Circles",
    active: "Active",
    finished: "Finished",
    members: "Members",
    monthlyContribution: "Monthly Contribution",
    nextPayment: "Next Payment",
    viewDetails: "View Details",
    circleDetails: "Circle Details",
    payNow: "Pay Now",
    chatWithMembers: "Chat with Members",
    
    // Wallet
    balance: "Balance",
    transactions: "Transactions",
    deposit: "Deposit",
    withdraw: "Withdraw",
    sendMoney: "Send Money",
    
    // Profile
    personalInfo: "Personal Information",
    manageAddresses: "Manage Addresses",
    language: "Language",
    security: "Security",
    support: "Support",
    settings: "Settings",
    logout: "Logout",
    
    // Addresses
    savedAddresses: "Saved Addresses",
    addAddress: "Add Address",
    home_address: "Home",
    work_address: "Work",
    streetAddress: "Street Address",
    city: "City",
    postalCode: "Postal Code (BP)",
    country: "Country",
    setAsDefault: "Set as default",
    
    // Language
    chooseLanguage: "Choose your preferred language",
    languageChange: "Language Change",
    languageChangeDesc: "Changing your language will update all text in the app immediately.",
    
    // Buttons
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    continue: "Continue",
    done: "Done",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    comingSoon: "Coming Soon",
  },
  
  fr: {
    // Bottom Navigation
    home: "Accueil",
    circles: "Cercles",
    wallet: "Portefeuille",
    card: "Carte",
    profile: "Profil",
    
    // Home Screen
    welcomeBack: "Content de vous revoir",
    totalBalance: "Solde Total",
    activeCircles: "Cercles Actifs",
    completedCircles: "Terminés",
    nextPayout: "Prochain Paiement",
    quickActions: "Actions Rapides",
    joinCircle: "Rejoindre un Cercle",
    createCircle: "Créer un Cercle",
    inviteFriends: "Inviter des amis",
    exploreGoals: "Explorer les Objectifs",
    myGoals: "Mes Objectifs",
    smartSaving: "Épargne intelligente avec frais réduits",
    zeroFees: "Zéro frais, épargne maximale",
    
    // Circles
    myCircles: "Mes Cercles",
    active: "Actifs",
    finished: "Terminés",
    members: "Membres",
    monthlyContribution: "Contribution Mensuelle",
    nextPayment: "Prochain Paiement",
    viewDetails: "Voir Détails",
    circleDetails: "Détails du Cercle",
    payNow: "Payer Maintenant",
    chatWithMembers: "Discuter avec les Membres",
    
    // Wallet
    balance: "Solde",
    transactions: "Transactions",
    deposit: "Dépôt",
    withdraw: "Retrait",
    sendMoney: "Envoyer de l'Argent",
    
    // Profile
    personalInfo: "Informations Personnelles",
    manageAddresses: "Gérer les Adresses",
    language: "Langue",
    security: "Sécurité",
    support: "Assistance",
    settings: "Paramètres",
    logout: "Déconnexion",
    
    // Addresses
    savedAddresses: "Adresses Enregistrées",
    addAddress: "Ajouter une Adresse",
    home_address: "Domicile",
    work_address: "Travail",
    streetAddress: "Adresse",
    city: "Ville",
    postalCode: "Code Postal (BP)",
    country: "Pays",
    setAsDefault: "Définir par défaut",
    
    // Language
    chooseLanguage: "Choisissez votre langue préférée",
    languageChange: "Changement de Langue",
    languageChangeDesc: "Le changement de langue mettra à jour tout le texte de l'application immédiatement.",
    
    // Buttons
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    continue: "Continuer",
    done: "Terminé",
    
    // Common
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    comingSoon: "Bientôt Disponible",
  }
};

// Memoized input components - DEFINED OUTSIDE to prevent re-creation
const GroupNameInput = React.memo(({ defaultValue, onBlur }) => {
  const inputRef = React.useRef(null);
  return (
    <input 
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      onBlur={onBlur}
      placeholder="Ex: Family Savings, Friends Circle..."
      className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 focus:border-blue-500 focus:outline-none"
      autoComplete="off"
    />
  );
});

const GroupDescriptionInput = React.memo(({ defaultValue, onBlur }) => {
  const textareaRef = React.useRef(null);
  return (
    <textarea 
      ref={textareaRef}
      defaultValue={defaultValue}
      onBlur={onBlur}
      placeholder="Describe the purpose of this group..."
      rows={4}
      className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 focus:border-blue-500 focus:outline-none resize-none"
      autoComplete="off"
    />
  );
});

const AmountInput = React.memo(({ defaultValue, onBlur }) => {
  const inputRef = React.useRef(null);
  return (
    <div className="relative">
      <input 
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
        onInput={(e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, '');
        }}
        onBlur={onBlur}
        placeholder="50000"
        className="w-full border-2 border-gray-200 rounded-xl p-4 pr-16 text-gray-900 text-2xl font-bold focus:border-blue-500 focus:outline-none"
        autoComplete="off"
      />
      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">XAF</span>
    </div>
  );
});

const KoloTontine = () => {
  // ╔════════════════════════════════════════════════════════════════════╗
  // ║               ÉTATS D'AUTHENTIFICATION (AUTHENTICATION STATES)     ║
  // ╠════════════════════════════════════════════════════════════════════╣
  // ║  Gestion de l'authentification et de l'onboarding                  ║
  // ║                                                                    ║
  // ║  ÉTATS PRINCIPAUX:                                                 ║
  // ║  - isAuthenticated: true/false → Utilisateur connecté ou non       ║
  // ║  - currentAuthScreen: 'splash'|'language'|'phone'|'otp'...         ║
  // ║                                                                    ║
  // ║  DONNÉES COLLECTÉES:                                               ║
  // ║  - authPhoneNumber: Numéro +242 (9 chiffres)                       ║
  // ║  - otpCode: Array de 6 chiffres pour vérification                  ║
  // ║  - authFirstName, authLastName: Identité utilisateur               ║
  // ║  - authEmail: Email de contact                                     ║
  // ║  - authReferralCode: Code parrainage (optionnel)                   ║
  // ║                                                                    ║
  // ║  Note: Préfixe "auth" pour éviter conflits avec états de l'app     ║
  // ╚════════════════════════════════════════════════════════════════════╝
  
  // === AUTHENTICATION (ADDED) ===
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAuthScreen, setCurrentAuthScreen] = useState('splash');
  const [authPhoneNumber, setAuthPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authReferralCode, setAuthReferralCode] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const otpInputsRef = React.useRef([]);

  React.useEffect(() => {
    let interval;
    if (currentAuthScreen === 'otp' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [currentAuthScreen, otpTimer]);

  React.useEffect(() => {
    if (currentAuthScreen === 'splash') {
      const timer = setTimeout(() => setCurrentAuthScreen('language'), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentAuthScreen]);

  // Focus initial sur le premier input OTP
  React.useEffect(() => {
    if (currentAuthScreen === 'otp' && otpInputsRef.current[0]) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [currentAuthScreen]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    
    // Focus immédiat sur le champ suivant
    if (value && index < 5) {
      // Utiliser requestAnimationFrame pour s'assurer que le focus se fait après le render
      requestAnimationFrame(() => {
        otpInputsRef.current[index + 1]?.focus();
      });
    }
    
    // Vérification automatique quand tous les champs sont remplis
    if (newOtp.every(d => d !== '') && index === 5) {
      const code = newOtp.join('');
      if (code === '123456' || code.length === 6) {
        setTimeout(() => setCurrentAuthScreen('userInfo'), 500);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      requestAnimationFrame(() => {
        otpInputsRef.current[index - 1]?.focus();
      });
    }
  };

  // ==========================================
  // HANDLE LOGOUT - Fonction de déconnexion
  // ==========================================
  // Déconnecte l'utilisateur et réinitialise le flow
  // Actions effectuées:
  // - setIsAuthenticated(false) → Déconnexion
  // - setCurrentAuthScreen('splash') → Retour au début
  // - Reset de tous les champs du formulaire d'auth
  // - Reset du numéro de téléphone
  // - Reset du code OTP et du timer
  // - Reset des informations personnelles
  // Accessible via le bouton "Log out" dans Settings
  // ==========================================
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentAuthScreen('splash');
    setAuthPhoneNumber('');
    setOtpCode(['', '', '', '', '', '']);
    setOtpTimer(30);
    setAuthFirstName('');
    setAuthLastName('');
    setAuthReferralCode('');
    setAuthEmail('');
  };


  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentTab, setCurrentTab] = useState('home');
  const [circlesTab, setCirclesTab] = useState('active');
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [language, setLanguage] = useState('en'); // 'en' or 'fr'
  
  // Translation helper function
  const t = (key) => translations[language][key] || key;
  const [paymentDetails, setPaymentDetails] = useState({
    mobileNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [copied, setCopied] = useState(false);
  const [circleAmount, setCircleAmount] = useState('');
  const [circleDuration, setCircleDuration] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(null);
  const [slotTab, setSlotTab] = useState('first');
  const [currentOfferIndex, setCurrentOfferIndex] = React.useState(0);
  const [showCorporateModal, setShowCorporateModal] = useState(false);
  const [corporateStep, setCorporateStep] = useState(1);
  const [firstName, setFirstName] = useState('Joeldy');
  const [lastName, setLastName] = useState('Mukendi');
  const [phone, setPhone] = useState('064663469');
  const [email, setEmail] = useState('joeldy.mukendi@example.com');
  const [likeLembaName, setLikeLembaName] = useState('');
  const [likeLembaAmount, setLikeLembaAmount] = useState('');
  const [likeLembaDuration, setLikeLembaDuration] = useState(null);
  const [likeLembaMembers, setLikeLembaMembers] = useState(6);
  const [likeLembaDescription, setLikeLembaDescription] = useState('');
  
  // Memoized handlers to prevent re-creation
  const handleLikeLembaNameChange = useCallback((e) => {
    setLikeLembaName(e.target.value);
  }, []);
  
  const handleLikeLembaDescriptionChange = useCallback((e) => {
    setLikeLembaDescription(e.target.value);
  }, []);
  
  const handleLikeLembaAmountChange = useCallback((e) => {
    setLikeLembaAmount(e.target.value);
  }, []);
  const [joinCode, setJoinCode] = useState('');
  const [activeLikeLemba, setActiveLikeLemba] = useState([]);
  const [finishedLikeLemba, setFinishedLikeLemba] = useState([]);
  const [selectedLikeLemba, setSelectedLikeLemba] = useState(null);
  const [userGoals, setUserGoals] = useState([
    {
      id: 1,
      name: 'School Tuition',
      icon: '✏️',
      color: 'bg-blue-100',
      targetAmount: 500000,
      currentAmount: 200000,
      deadline: '2026-12-31',
      category: 'education',
      description: 'Save for your child\'s education and secure their future',
      active: true
    },
    {
      id: 2,
      name: 'Summer Holidays',
      icon: '🌴',
      color: 'bg-green-100',
      targetAmount: 300000,
      currentAmount: 0,
      deadline: '2026-06-30',
      category: 'travel',
      description: 'Plan your dream vacation and create unforgettable memories',
      active: true
    }
  ]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  // User Plan & Subscription System
  const [userPlan, setUserPlan] = useState({
    tier: 'bronze', // 'bronze' | 'silver' | 'gold'
    tierName: 'Bronze',
    badge: '🥉',
    color: 'from-amber-600 to-orange-700',
    subscriptionStart: '2026-01-01',
    subscriptionEnd: null,
    autoRenew: false,
    features: {
      maxCircles: 2,
      adminFeePercent: 5,
      customGoalsLimit: 0, // 0 = none, -1 = unlimited
      prioritySupport: false,
      zeroFees: false,
      cashbackPercent: 0,
      prioritySlots: false,
      advancedStats: false,
      referralMultiplier: 1,
      paymentReminders: false,
      createCircles: true
    },
    addOns: [] // Pay-per-feature purchases: { feature: 'zeroFees', expiryDate: '2026-02-01' }
  });

  // Plan verification & calculation functions
  const getPlanLimits = (tier) => {
    const plans = {
      bronze: {
        tierName: 'Bronze',
        badge: '🥉',
        color: 'from-amber-600 to-orange-700',
        price: 0,
        features: {
          maxCircles: 2,
          adminFeePercent: 5,
          customGoalsLimit: 0,
          prioritySupport: false,
          zeroFees: false,
          cashbackPercent: 0,
          prioritySlots: false,
          advancedStats: false,
          referralMultiplier: 1,
          paymentReminders: false,
          createCircles: true
        }
      },
      silver: {
        tierName: 'Silver',
        badge: '🥈',
        color: 'from-gray-400 to-gray-600',
        price: 2500,
        features: {
          maxCircles: 5,
          adminFeePercent: 3,
          customGoalsLimit: 10,
          prioritySupport: true,
          zeroFees: false,
          cashbackPercent: 0,
          prioritySlots: true,
          advancedStats: true,
          referralMultiplier: 2,
          paymentReminders: true,
          createCircles: true
        }
      },
      gold: {
        tierName: 'Gold',
        badge: '🥇',
        color: 'from-yellow-400 to-yellow-600',
        price: 5000,
        features: {
          maxCircles: -1, // unlimited
          adminFeePercent: 0,
          customGoalsLimit: -1, // unlimited
          prioritySupport: true,
          zeroFees: true,
          cashbackPercent: 2,
          prioritySlots: true,
          advancedStats: true,
          referralMultiplier: 3,
          paymentReminders: true,
          createCircles: true
        }
      }
    };
    return plans[tier] || plans.bronze;
  };

  const canJoinCircle = () => {
    const limit = userPlan.features.maxCircles;
    if (limit === -1) return true; // unlimited
    return activeLikeLemba.length < limit;
  };

  const canCreateCustomGoal = () => {
    const limit = userPlan.features.customGoalsLimit;
    if (limit === -1) return true; // unlimited
    if (limit === 0) return false; // not allowed
    return userGoals.filter(g => g.active).length < limit;
  };

  const calculateAdminFee = (amount) => {
    // Check for zero fees add-on first
    const zeroFeesAddon = userPlan.addOns.find(a => a.feature === 'zeroFees' && new Date(a.expiryDate) > new Date());
    if (zeroFeesAddon || userPlan.features.zeroFees) return 0;
    
    return Math.floor(amount * (userPlan.features.adminFeePercent / 100));
  };

  const calculateCashback = (amount) => {
    return Math.floor(amount * (userPlan.features.cashbackPercent / 100));
  };

  const getCirclesRemaining = () => {
    const limit = userPlan.features.maxCircles;
    if (limit === -1) return '∞';
    return Math.max(0, limit - activeLikeLemba.length);
  };
  const [notifications, setNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [groupChats, setGroupChats] = useState({});
  const [chatMessage, setChatMessage] = useState('');
  const chatInputRef = React.useRef(null);
  const liveChatInputRef = React.useRef(null);
  const supportTicketInputRef = React.useRef(null);
  const newTicketSubjectRef = React.useRef(null);
  const newTicketMessageRef = React.useRef(null);
  const joinCodeInputRef = React.useRef(null);
  const likeLembaNameRef = React.useRef(null);
  const likeLembaDescriptionRef = React.useRef(null);
  const likeLembaAmountRef = React.useRef(null);
  const firstNameRef = React.useRef(null);
  const lastNameRef = React.useRef(null);
  const phoneRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const circleAmountRef = React.useRef(null);
  const mobileNumberRef = React.useRef(null);
  const cardNumberRef = React.useRef(null);
  const cardExpiryRef = React.useRef(null);
  const cardCVVRef = React.useRef(null);
  const bankNameRef = React.useRef(null);
  const accountNumberRef = React.useRef(null);
  const accountNameRef = React.useRef(null);
  const [supportTickets, setSupportTickets] = useState([]);
  const [supportMessage, setSupportMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [liveChatMessages, setLiveChatMessages] = useState([]);
  const [liveChatMessage, setLiveChatMessage] = useState('');
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  const offers = [
    { id: 1, title: 'LATEST\nOFFERS', emoji: '📢', color: 'from-orange-100 to-orange-50' },
    { id: 2, title: 'SPECIAL\nDEALS', emoji: '🎁', color: 'from-purple-100 to-purple-50' },
    { id: 3, title: 'HOT\nSAVINGS', emoji: '🔥', color: 'from-red-100 to-red-50' },
    { id: 4, title: 'NEW\nBONUS', emoji: '⭐', color: 'from-yellow-100 to-yellow-50' },
    { id: 5, title: 'BEST\nRATES', emoji: '💎', color: 'from-blue-100 to-blue-50' }
  ];

  /* Carousel auto-rotation - Commented out with carousel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [offers.length]);
  */
  
  const user = {
    firstName: 'Joeldy',
    fullName: 'Joeldy Mukendi',
    phone: '064663469',
  };

  const referralCode = 'suhila_ash_2301504';

  const circles = [
    { name: 'LITE SAVER', amount: 3000, bonus: 600 },
    { name: 'BRONZE SAVER', amount: 6000, bonus: 1200 }
  ];

  const durations = [
    { months: 6, monthly: 500 },
    { months: 12, monthly: 250 },
    { months: 24, monthly: 125 }
  ];

  const handleCopyCode = () => {
    // Fallback copy method that works without Clipboard API
    const textToCopy = referralCode;
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
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
      console.error('Copy failed:', err);
      textArea.remove();
      alert('Failed to copy. Please copy manually: ' + textToCopy);
    }
  };

  const copyToClipboard = (text) => {
    // Fallback copy method that works without Clipboard API
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
      console.error('Copy failed:', err);
      textArea.remove();
      return false;
    }
  };

  const calculateTotalPayout = () => {
    if (!selectedCircle || selectedDuration === null) return 0;
    const duration = durations[selectedDuration];
    return duration.monthly * duration.months + (selectedCircle.bonus * (duration.months / 6));
  };

  const addLikeLemba = (likeLemba) => {
    setActiveLikeLemba(prev => [...prev, {
      ...likeLemba,
      id: Date.now(),
      joinedDate: new Date().toISOString(),
      status: 'active'
    }]);
  };

  const moveLikeLembaToFinished = (id) => {
    const circle = activeLikeLemba.find(c => c.id === id);
    if (circle) {
      setActiveLikeLemba(prev => prev.filter(c => c.id !== id));
      setFinishedLikeLemba(prev => [...prev, {
        ...circle,
        status: 'finished',
        completedDate: new Date().toISOString(),
        monthsCompleted: circle.duration
      }]);
    }
  };

  // Add demo data for testing
  React.useEffect(() => {
    if (activeLikeLemba.length === 0 && finishedLikeLemba.length === 0) {
      // Add one demo active circle
      setActiveLikeLemba([{
        id: 1,
        name: 'Demo Family Savings',
        amount: '75000',
        duration: 6,
        totalMembers: 6,
        currentMembers: 4,
        type: 'joined',
        inviteCode: 'DEMO_FAMILY_SAVINGS_2026',
        monthsCompleted: 2,
        joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }]);
      
      // Add one demo finished circle
      setFinishedLikeLemba([{
        id: 2,
        name: 'Friends Circle 2025',
        amount: '100000',
        duration: 12,
        totalMembers: 12,
        currentMembers: 12,
        type: 'created',
        inviteCode: 'FRIENDS_CIRCLE_2025',
        monthsCompleted: 12,
        joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'finished'
      }]);
    }

    // Add demo notifications
    if (notifications.length === 0) {
      setNotifications([
        {
          id: 1,
          type: 'payment',
          title: 'Payment Due Soon',
          message: 'Your monthly payment of 12,500 XAF for Demo Family Savings is due in 3 days.',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          icon: '💰',
          color: 'blue'
        },
        {
          id: 2,
          type: 'group',
          title: 'New Member Joined',
          message: 'Marie Nkulu joined your group "Demo Family Savings"',
          time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: false,
          icon: '👥',
          color: 'green'
        },
        {
          id: 3,
          type: 'payout',
          title: 'Payout Received',
          message: 'You received 75,000 XAF from Demo Family Savings',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          icon: '🎉',
          color: 'purple'
        },
        {
          id: 4,
          type: 'system',
          title: 'Security Alert',
          message: 'New login detected from Brazzaville. If this wasn\'t you, please secure your account.',
          time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          icon: '🔒',
          color: 'red'
        },
        {
          id: 5,
          type: 'group',
          title: 'Group Chat Message',
          message: 'Jean posted in Demo Family Savings: "Payment confirmed for this month"',
          time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          icon: '💬',
          color: 'blue'
        },
        {
          id: 6,
          type: 'payment',
          title: 'Payment Confirmed',
          message: 'Your payment of 12,500 XAF has been successfully processed.',
          time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          icon: '✅',
          color: 'green'
        }
      ]);
    }

    // Add demo transactions
    if (transactions.length === 0) {
      setTransactions([
        {
          id: 1,
          type: 'payment',
          status: 'completed',
          title: 'Monthly Payment',
          description: 'Demo Family Savings - Month 2',
          amount: -12500,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          method: 'Mobile Money',
          reference: 'TXN001234567',
          category: 'Likelemba'
        },
        {
          id: 2,
          type: 'payout',
          status: 'completed',
          title: 'Payout Received',
          description: 'Demo Family Savings - Your Turn',
          amount: 75000,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          method: 'Bank Transfer',
          reference: 'TXN001234566',
          category: 'Likelemba'
        },
        {
          id: 3,
          type: 'payment',
          status: 'pending',
          title: 'Monthly Payment',
          description: 'Demo Family Savings - Month 3',
          amount: -12500,
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          method: 'Mobile Money',
          reference: 'TXN001234568',
          category: 'Likelemba'
        },
        {
          id: 4,
          type: 'payment',
          status: 'completed',
          title: 'Monthly Payment',
          description: 'Demo Family Savings - Month 1',
          amount: -12500,
          date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
          method: 'Mobile Money',
          reference: 'TXN001234565',
          category: 'Likelemba'
        },
        {
          id: 5,
          type: 'fee',
          status: 'completed',
          title: 'Admin Fee',
          description: 'Demo Family Savings - Setup',
          amount: -630,
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          method: 'Mobile Money',
          reference: 'TXN001234564',
          category: 'Fees'
        },
        {
          id: 6,
          type: 'refund',
          status: 'completed',
          title: 'Refund',
          description: 'Duplicate payment refund',
          amount: 12500,
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          method: 'Mobile Money',
          reference: 'TXN001234563',
          category: 'Refund'
        },
        {
          id: 7,
          type: 'payment',
          status: 'failed',
          title: 'Monthly Payment',
          description: 'Friends Circle 2025 - Month 10',
          amount: -8333,
          date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          method: 'Bank Transfer',
          reference: 'TXN001234562',
          category: 'Likelemba'
        }
      ]);
    }

    // Add demo group chat messages
    if (Object.keys(groupChats).length === 0) {
      setGroupChats({
        'Demo Family Savings': [
          {
            id: 1,
            sender: 'Admin',
            message: 'Welcome everyone to Demo Family Savings! 👋',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            isMe: false,
            type: 'system'
          },
          {
            id: 2,
            sender: 'You',
            message: 'Thanks for creating this group! Excited to start saving together.',
            timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            isMe: true,
            type: 'message'
          },
          {
            id: 3,
            sender: 'Marie Nkulu',
            message: 'Happy to be part of this! When is the first payment due?',
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            isMe: false,
            type: 'message'
          },
          {
            id: 4,
            sender: 'Admin',
            message: 'First payment is due on February 25th. Everyone will receive a reminder 3 days before.',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            isMe: false,
            type: 'system'
          },
          {
            id: 5,
            sender: 'Jean Bokete',
            message: 'Perfect! Looking forward to this journey with you all 🚀',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            isMe: false,
            type: 'message'
          },
          {
            id: 6,
            sender: 'Admin',
            message: '💰 Payment received from Jean Bokete - 12,500 XAF',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isMe: false,
            type: 'notification'
          },
          {
            id: 7,
            sender: 'You',
            message: 'Great! Just made my payment too ✅',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isMe: true,
            type: 'message'
          },
          {
            id: 8,
            sender: 'Marie Nkulu',
            message: 'Payment confirmed on my side as well! 💰',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isMe: false,
            type: 'message'
          },
          {
            id: 9,
            sender: 'Admin',
            message: '🎉 All payments received for this month! Great work team!',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            isMe: false,
            type: 'notification'
          }
        ]
      });
    }

    // Add demo support tickets
    if (supportTickets.length === 0) {
      setSupportTickets([
        {
          id: 1,
          subject: 'Payment not reflecting',
          category: 'Payment Issue',
          status: 'open',
          priority: 'high',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: 1,
              sender: 'You',
              message: 'I made a payment 2 hours ago but it\'s not showing in my account. Transaction reference: TXN001234567',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              isMe: true
            },
            {
              id: 2,
              sender: 'Support Agent',
              message: 'Hello! Thank you for contacting us. I\'m looking into your payment right now. Could you please confirm the payment method you used?',
              timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
              isMe: false
            },
            {
              id: 3,
              sender: 'You',
              message: 'I used Mobile Money - Airtel Money',
              timestamp: new Date(Date.now() - 1.3 * 60 * 60 * 1000).toISOString(),
              isMe: true
            },
            {
              id: 4,
              sender: 'Support Agent',
              message: 'Thank you. I can see your transaction is being processed. It should reflect in your account within the next 30 minutes. I\'ll keep this ticket open until it\'s resolved.',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              isMe: false
            }
          ]
        },
        {
          id: 2,
          subject: 'How to invite more members?',
          category: 'General Question',
          status: 'resolved',
          priority: 'low',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: 1,
              sender: 'You',
              message: 'How can I invite more members to my Likelemba group?',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              isMe: true
            },
            {
              id: 2,
              sender: 'Support Agent',
              message: 'Hello! You can invite members by:\n1. Going to your group details\n2. Clicking "Share Invitation"\n3. Sharing the code or link with your friends\n\nYou can also share the invite code directly from the group chat!',
              timestamp: new Date(Date.now() - 4.8 * 24 * 60 * 60 * 1000).toISOString(),
              isMe: false
            },
            {
              id: 3,
              sender: 'You',
              message: 'Perfect! Thank you so much!',
              timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              isMe: true
            }
          ]
        },
        {
          id: 3,
          subject: 'Account verification pending',
          category: 'Account Issue',
          status: 'in-progress',
          priority: 'medium',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: 1,
              sender: 'You',
              message: 'I uploaded my ID 10 days ago but my account is still not verified.',
              timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              isMe: true
            },
            {
              id: 2,
              sender: 'Support Agent',
              message: 'Thank you for your patience. Our verification team is currently reviewing your documents. The process can take up to 14 business days. We\'ll notify you as soon as it\'s complete!',
              timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
              isMe: false
            }
          ]
        }
      ]);
    }

    // Add demo security logs
    if (securityLogs.length === 0) {
      setSecurityLogs([
        {
          id: 1,
          action: 'Login',
          device: 'iPhone 13',
          location: 'Brazzaville, CG',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          ip: '197.214.xxx.xxx'
        },
        {
          id: 2,
          action: 'Payment',
          device: 'iPhone 13',
          location: 'Brazzaville, CG',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          ip: '197.214.xxx.xxx'
        },
        {
          id: 3,
          action: 'Password Change',
          device: 'iPhone 13',
          location: 'Brazzaville, CG',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          ip: '197.214.xxx.xxx'
        },
        {
          id: 4,
          action: 'Failed Login',
          device: 'Unknown Device',
          location: 'Kinshasa, CD',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'failed',
          ip: '41.242.xxx.xxx'
        },
        {
          id: 5,
          action: 'Login',
          device: 'iPhone 13',
          location: 'Brazzaville, CG',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          ip: '197.214.xxx.xxx'
        }
      ]);
    }

    // Add demo live chat messages
    if (liveChatMessages.length === 0) {
      setLiveChatMessages([
        {
          id: 1,
          sender: 'Support Bot',
          message: 'Hello! 👋 Welcome to Kolo Tontine support. How can I help you today?',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          isMe: false,
          type: 'bot'
        }
      ]);
    }
  }, []);

  const sendLiveChatMessage = () => {
    if (!liveChatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      message: liveChatMessage,
      timestamp: new Date().toISOString(),
      isMe: true,
      type: 'message'
    };

    setLiveChatMessages(prev => [...prev, newMessage]);
    setLiveChatMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: Date.now() + 1,
        sender: 'Support Agent',
        message: 'Thank you for your message! A support agent will respond shortly.',
        timestamp: new Date().toISOString(),
        isMe: false,
        type: 'message'
      };
      setLiveChatMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const createNewTicket = () => {
    if (!newTicketSubject.trim() || !newTicketCategory || !newTicketMessage.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newTicket = {
      id: Date.now(),
      subject: newTicketSubject,
      category: newTicketCategory,
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 1,
          sender: 'You',
          message: newTicketMessage,
          timestamp: new Date().toISOString(),
          isMe: true
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    setNewTicketSubject('');
    setNewTicketCategory('');
    setNewTicketMessage('');
    setCurrentScreen('customer-support');
  };

  const sendSupportMessage = (ticketId) => {
    if (!supportMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      message: supportMessage,
      timestamp: new Date().toISOString(),
      isMe: true
    };

    setSupportTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage]
        };
      }
      return ticket;
    }));

    setSupportMessage('');
  };

  const sendMessage = (groupName) => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      message: chatMessage,
      timestamp: new Date().toISOString(),
      isMe: true,
      type: 'message'
    };

    setGroupChats(prev => ({
      ...prev,
      [groupName]: [...(prev[groupName] || []), newMessage]
    }));

    setChatMessage('');
  };

  const HomeScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setCurrentScreen('profile')}
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
          >
            <User className="text-gray-600" size={24} />
          </button>
          <div>
            <p className="text-gray-600 text-sm">{t('welcomeBack')} 👋</p>
            <h1 className="text-gray-900 text-lg font-bold">{firstName}</h1>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setCurrentScreen('whats-hot')} className="p-2">
            <Zap className="text-gray-700" size={24} />
          </button>
          <button onClick={() => setCurrentScreen('notifications')} className="relative p-2">
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
            onClick={() => setCurrentScreen('my-goals')}
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
                setCurrentScreen('goal-detail');
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
            onClick={() => setCurrentScreen('join')}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-2 shadow-md">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-xs font-semibold text-gray-900 text-center">Join</p>
          </button>

          <button 
            onClick={() => setCurrentScreen('create-likelemba-step1')}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-2 shadow-md">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-xs font-semibold text-gray-900 text-center">Create</p>
          </button>

          <button 
            onClick={() => {setCurrentScreen('payment'); setCurrentTab('payment');}}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-2 shadow-md">
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-xs font-semibold text-gray-900 text-center">Pay</p>
          </button>

          <button 
            onClick={() => setCurrentScreen('referral')}
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
                      setCurrentScreen('circle-details-duration');
                    } else if (!selectedSlot) {
                      setCurrentScreen('circle-slot');
                    } else {
                      setCurrentScreen('payout-method-selection');
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
                      setCurrentScreen('create-likelemba-step2');
                    } else if (!likeLembaDuration) {
                      setCurrentScreen('create-likelemba-step2');
                    } else {
                      setCurrentScreen('create-likelemba-step3');
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
                  onClick={() => setCurrentScreen('join-group-details')}
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
                  onClick={() => setCurrentScreen('choose-duration')}
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
              onClick={() => setCurrentScreen('financial-dashboard')}
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
                onClick={() => setCurrentScreen('transaction-history')}
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
          onClick={() => setCurrentScreen('card')}
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
                setCurrentScreen('card');
              }}
              className="bg-white/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
            >
              <span>⬆️</span>
              <span>Top Up</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentScreen('card');
              }}
              className="bg-white/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
            >
              <span>💳</span>
              <span>Details</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentScreen('card');
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
                onClick={() => setCurrentScreen('referral')}
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

  const CirclesScreen = () => {
    const displayCircles = circlesTab === 'active' ? activeLikeLemba : finishedLikeLemba;
    
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
        <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between">
          <h1 className="text-gray-900 text-2xl font-bold">My circles</h1>
          <div className="flex space-x-3">
            <Zap className="text-gray-700" size={24} />
            <button onClick={() => setCurrentScreen('notifications')} className="relative">
              <Bell className="text-gray-700" size={24} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="px-6 mt-4">
          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button 
              onClick={() => setCirclesTab('active')}
              className={`flex-1 py-3 rounded-full font-semibold transition ${circlesTab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Active ({activeLikeLemba.length})
            </button>
            <button 
              onClick={() => setCirclesTab('finished')}
              className={`flex-1 py-3 rounded-full font-semibold transition ${circlesTab === 'finished' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Finished ({finishedLikeLemba.length})
            </button>
          </div>

          {displayCircles.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
                  <div className="absolute top-4 left-8 w-24 h-24 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-gray-900 font-bold text-xl mb-2">
                {circlesTab === 'active' ? "You don't have any active circles" : "Looks like you haven't finished any money circles yet"}
              </h3>
              <p className="text-gray-500">
                {circlesTab === 'active' ? "Your active circles will appear here!" : "Your finished circles will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayCircles.map((circle) => (
                <div key={circle.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl">👥</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{circle.name}</h3>
                        <p className="text-sm text-gray-500">{circle.type === 'created' ? 'Admin' : 'Member'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      circlesTab === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {circlesTab === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-gray-600 mb-1">Payout</p>
                      <p className="font-bold text-gray-900">{parseInt(circle.amount).toLocaleString()} XAF</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs text-gray-600 mb-1">Duration</p>
                      <p className="font-bold text-gray-900">{circle.duration} months</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3">
                      <p className="text-xs text-gray-600 mb-1">Members</p>
                      <p className="font-bold text-gray-900">{circle.currentMembers}/{circle.totalMembers}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{circle.monthsCompleted || 0}/{circle.duration} months</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${((circle.monthsCompleted || 0) / circle.duration) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {circlesTab === 'active' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedLikeLemba(circle);
                          setCurrentScreen('likelemba-details');
                        }}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm"
                      >
                        View Details
                      </button>
                      {circle.type === 'created' && (
                        <button 
                          onClick={handleCopyCode}
                          className="px-4 bg-blue-100 text-blue-600 rounded-xl font-semibold"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      )}
                    </div>
                  )}

                  {circlesTab === 'finished' && (
                    <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                      <p className="text-sm text-green-700 font-semibold">
                        ✓ Completed on {new Date(circle.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const JoinScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="px-6 pt-12 pb-6">
        <button onClick={() => setCurrentScreen('home')} className="mb-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-gray-900 text-2xl font-bold mb-2">Choose a service</h1>
      </div>

      <div className="px-6">
        <h2 className="text-gray-700 text-xl mb-6">What would you like to do?</h2>

                  <div className="space-y-4">
          <div 
            onClick={() => setCurrentScreen('circle-details-amount')}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 flex items-center justify-between cursor-pointer hover:border-blue-500 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-5xl">💰</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Join a Likelemba</h3>
                <p className="text-gray-500 text-sm">Select your preferred slot and choose any payout amount up to 1200000 XAF per Likelemba.</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </div>

          <div 
            onClick={() => setCurrentScreen('join-with-code')}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 flex items-center justify-between cursor-pointer hover:border-green-400 transition shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-3xl">🔑</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Join with Code</h3>
                <p className="text-gray-600 text-sm">Enter invitation code to join a friend's Likelemba group.</p>
              </div>
            </div>
            <ChevronRight className="text-green-600" size={24} />
          </div>

          <div 
            onClick={() => setCurrentScreen('create-likelemba-step1')}
            className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-6 flex items-center justify-between cursor-pointer hover:border-blue-400 transition shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-3xl">👥</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Create Likelemba</h3>
                <p className="text-gray-600 text-sm">Create your own group and invite friends to join your Likelemba.</p>
              </div>
            </div>
            <ChevronRight className="text-blue-600" size={24} />
          </div>

          <div 
            onClick={() => setCurrentScreen('choose-circle')}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 flex items-center justify-between cursor-pointer hover:border-blue-500 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="text-3xl">🌱</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Join a Saving Program</h3>
                <p className="text-gray-500 text-sm">Save in installments up to 1,000,000 XAF, receive it at the end of the chosen duration with up to 20% cashback.</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </div>
        </div>
      </div>
    </div>
  );

  const ReferralScreen = () => (
    <div className="flex-1 overflow-y-auto pb-32 bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => setCurrentScreen('home')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Refer a friend</h1>
      </div>

      <div className="px-6 py-6">
        <h2 className="text-3xl font-bold leading-tight mb-2">
          Spread the word & Get 300<br/>XAF OFF!
        </h2>

        {/* Referral Link Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 my-6 border-2 border-blue-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">YOUR REFERRAL LINK</h3>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white rounded-xl px-4 py-3 border-2 border-blue-300 overflow-hidden">
              <p className="text-sm font-semibold text-blue-600 truncate">
                https://kolotontine.com/ref/{referralCode}
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://kolotontine.com/ref/${referralCode}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
            >
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </button>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button 
              onClick={() => {
                const shareText = `Join Kolo Tontine with my code ${referralCode} and get 300 XAF OFF! https://kolotontine.com/ref/${referralCode}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
              }}
              className="bg-green-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-1"
            >
              <span>📱</span>
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={() => {
                const shareText = `Join Kolo Tontine with my code ${referralCode} and get 300 XAF OFF! https://kolotontine.com/ref/${referralCode}`;
                window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_blank');
              }}
              className="bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-1"
            >
              <span>💬</span>
              <span>SMS</span>
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Join Kolo Tontine',
                    text: `Use my code ${referralCode} and get 300 XAF OFF!`,
                    url: `https://kolotontine.com/ref/${referralCode}`
                  });
                }
              }}
              className="bg-gray-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-1"
            >
              <span>📤</span>
              <span>Share</span>
            </button>
          </div>
        </div>

        <button 
          onClick={() => setCurrentScreen('referral-tracker')}
          className="text-blue-600 font-semibold my-4 flex items-center"
        >
          Track your invitations <ChevronRight className="w-4 h-4 ml-1" />
        </button>

        <div className="space-y-0">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="w-px h-20 bg-gray-300 my-1"></div>
            </div>
            <div className="pt-1 pb-8">
              <h3 className="text-xl font-bold mb-2">1. Invite your friends</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your referral link and code to your friends who still haven't downloaded the app.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div className="w-px h-20 bg-gray-300 my-1"></div>
            </div>
            <div className="pt-1 pb-8">
              <h3 className="text-xl font-bold mb-2">2. Gift them a discount</h3>
              <p className="text-gray-600 leading-relaxed">
                Once they sign up with the promocode and join their first Game'ya through the invitation link, they will enjoy 300 XAF OFF their first pay-in.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="pt-1">
              <h3 className="text-xl font-bold mb-2">3. Enjoy your own discount!</h3>
              <p className="text-gray-600 leading-relaxed">
                On settling their first pay-in, you'll get 300 XAF OFF your next pay-in.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 max-w-md mx-auto">
        <button
          onClick={handleCopyCode}
          className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-semibold mb-3 flex items-center justify-center"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 mr-2" />
              Copy code: {referralCode}
            </>
          )}
        </button>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg">
          Invite friends
        </button>
      </div>
    </div>
  );

  const ChooseCircleScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={() => setCurrentScreen('join')}>
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Choose a Saving Circle</h1>
      </div>

      <div className="px-6 py-6">
        <p className="text-gray-600 mb-6">Get cashback on monthly savings</p>

        <div className="space-y-4">
          <div 
            onClick={() => {
              setSelectedCircle(circles[0]);
              setCurrentScreen('choose-duration');
            }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-blue-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2">LITE SAVER</p>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  3,000 <span className="text-xl text-gray-600">XAF</span>
                </p>
                <p className="text-sm text-green-600 font-semibold">Up to 600 XAF extra</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-blue-400 mt-2"></div>
            </div>
          </div>

          <div 
            onClick={() => {
              setSelectedCircle(circles[1]);
              setCurrentScreen('choose-duration');
            }}
            className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-orange-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-2">BRONZE SAVER</p>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  6,000 <span className="text-xl text-gray-600">XAF</span>
                </p>
                <p className="text-sm text-green-600 font-semibold">Up to 1,200 XAF extra</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-orange-400 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Referral Tracker Screen
  const ReferralTrackerScreen = () => {
    const [referralFilter, setReferralFilter] = React.useState('all'); // 'all', 'joined', 'pending'
    
    const [referralStats] = React.useState({
      totalInvited: 12,
      joined: 8,
      pending: 4,
      totalEarnings: 2400,
      referrals: [
        { id: 1, name: 'Marie Nkounkou', status: 'joined', date: '2026-01-15', bonus: 300 },
        { id: 2, name: 'Pierre Makaya', status: 'joined', date: '2026-01-14', bonus: 300 },
        { id: 3, name: 'Grace Okemba', status: 'joined', date: '2026-01-12', bonus: 300 },
        { id: 4, name: 'Jean Loukounou', status: 'pending', date: '2026-01-18', bonus: 0 },
        { id: 5, name: 'Sarah Ngoma', status: 'joined', date: '2026-01-10', bonus: 300 },
        { id: 6, name: 'David Massamba', status: 'pending', date: '2026-01-17', bonus: 0 },
        { id: 7, name: 'Alice Mboungou', status: 'joined', date: '2026-01-09', bonus: 300 },
        { id: 8, name: 'Robert Kouka', status: 'joined', date: '2026-01-08', bonus: 300 },
        { id: 9, name: 'Patricia Ongali', status: 'pending', date: '2026-01-16', bonus: 0 },
        { id: 10, name: 'Thomas Ibara', status: 'joined', date: '2026-01-07', bonus: 300 },
        { id: 11, name: 'Christine Moukala', status: 'pending', date: '2026-01-19', bonus: 0 },
        { id: 12, name: 'Emmanuel Ntoumi', status: 'joined', date: '2026-01-06', bonus: 300 },
      ]
    });

    // Filter referrals based on selected filter
    const filteredReferrals = referralFilter === 'all' 
      ? referralStats.referrals 
      : referralStats.referrals.filter(r => r.status === referralFilter);

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('referral')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Referral Tracker</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Stats Summary */}
          <div className="px-6 py-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl mb-6">
              <h2 className="text-lg font-semibold mb-4 opacity-90">Your Referral Stats</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Total Invited</p>
                  <p className="text-4xl font-bold">{referralStats.totalInvited}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Joined</p>
                  <p className="text-4xl font-bold text-green-300">{referralStats.joined}</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-blue-100 text-sm mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">{referralStats.totalEarnings.toLocaleString()} XAF</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-6">
              <button 
                onClick={() => setReferralFilter('all')}
                className={`flex-1 py-2 rounded-full font-semibold text-sm transition ${
                  referralFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                All ({referralStats.totalInvited})
              </button>
              <button 
                onClick={() => setReferralFilter('joined')}
                className={`flex-1 py-2 rounded-full font-semibold text-sm transition ${
                  referralFilter === 'joined' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Joined ({referralStats.joined})
              </button>
              <button 
                onClick={() => setReferralFilter('pending')}
                className={`flex-1 py-2 rounded-full font-semibold text-sm transition ${
                  referralFilter === 'pending' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Pending ({referralStats.pending})
              </button>
            </div>

            {/* Referrals List */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-lg mb-4">
                {referralFilter === 'all' ? 'All Invitations' : 
                 referralFilter === 'joined' ? 'Joined Members' : 
                 'Pending Invitations'}
              </h3>
              
              {filteredReferrals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">
                    {referralFilter === 'joined' ? '✅' : '⏳'}
                  </div>
                  <p className="text-gray-500">
                    No {referralFilter} invitations yet
                  </p>
                </div>
              ) : (
                filteredReferrals.map(referral => (
                <div key={referral.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {referral.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{referral.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(referral.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {referral.status === 'joined' ? (
                        <>
                          <p className="text-green-600 font-bold text-lg">+{referral.bonus} XAF</p>
                          <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                            ✓ Joined
                          </span>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-400 font-bold text-lg">0 XAF</p>
                          <span className="inline-block bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold">
                            ⏳ Pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>

            {/* Invite More Button */}
            <button 
              onClick={() => setCurrentScreen('referral')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold mt-6 shadow-lg flex items-center justify-center space-x-2"
            >
              <Users size={20} />
              <span>Invite More Friends</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ChooseDurationScreen = () => {
    const totalPayout = calculateTotalPayout();
    const payoutDate = selectedDuration === 0 ? 'Jul 2026' : selectedDuration === 1 ? 'Jan 2027' : 'Jan 2028';

    return (
      <div className="flex-1 overflow-y-auto pb-48 bg-white">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('choose-circle')}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Choose Duration</h1>
          <button onClick={() => setCurrentScreen('choose-circle')}>
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {durations.map((duration, index) => (
              <div
                key={index}
                onClick={() => setSelectedDuration(index)}
                className={`rounded-2xl p-4 cursor-pointer transition-all border-2 ${
                  selectedDuration === index
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <p className={`text-5xl font-bold mb-1 ${
                    selectedDuration === index ? 'text-white' : 'text-gray-900'
                  }`}>
                    {duration.months}
                  </p>
                  <p className={`text-sm mb-4 ${
                    selectedDuration === index ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    Months
                  </p>
                  <div className={`border-t pt-3 ${
                    selectedDuration === index ? 'border-blue-400' : 'border-gray-200'
                  }`}>
                    <p className={`text-2xl font-bold ${
                      selectedDuration === index ? 'text-white' : 'text-gray-900'
                    }`}>
                      {duration.monthly.toLocaleString()}
                    </p>
                    <p className={`text-xs mt-1 ${
                      selectedDuration === index ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      XAF/Month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-200">
            <div className="grid grid-cols-3 divide-x divide-gray-300">
              <div className="text-center px-2">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-semibold">STARTS ON</p>
                <p className="text-gray-900 font-bold">Feb 2026</p>
              </div>
              <div className="text-center px-2">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-semibold">PAYOUT DATE</p>
                <p className="text-gray-900 font-bold">{payoutDate}</p>
              </div>
              <div className="text-center px-2">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-semibold">TOTAL PAYOUT</p>
                <p className="text-green-600 font-bold">{totalPayout.toLocaleString()} XAF</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button 
            onClick={() => setCurrentScreen('choose-payment-method')}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const ChoosePaymentMethodScreen = () => {
    const totalPayout = calculateTotalPayout();
    const selectedDurationData = durations[selectedDuration];

    return (
      <div className="flex-1 overflow-y-auto pb-32 bg-white">
        <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('choose-duration')}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Payment Method</h1>
        </div>

        <div className="px-6 py-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
            <p className="text-blue-100 text-sm mb-1">Total Savings</p>
            <h2 className="text-4xl font-bold mb-4">{totalPayout.toLocaleString()} XAF</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100 text-xs mb-1">Monthly Payment</p>
                <p className="font-bold text-lg">{selectedDurationData?.monthly.toLocaleString()} XAF</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Duration</p>
                <p className="font-bold text-lg">{selectedDurationData?.months} Months</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-lg mb-4">Choose Payment Method</h3>

          {/* Mobile Money */}
          <div 
            onClick={() => setSelectedPaymentMethod('mobile-money')}
            className={`border-2 rounded-2xl p-5 mb-4 cursor-pointer transition ${
              selectedPaymentMethod === 'mobile-money'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mobile Money</p>
                  <p className="text-sm text-gray-600">Airtel Money, MTN Money</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === 'mobile-money'
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'mobile-money' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div 
            onClick={() => setSelectedPaymentMethod('bank-transfer')}
            className={`border-2 rounded-2xl p-5 mb-4 cursor-pointer transition ${
              selectedPaymentMethod === 'bank-transfer'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏦</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Bank Transfer</p>
                  <p className="text-sm text-gray-600">Direct bank account transfer</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === 'bank-transfer'
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'bank-transfer' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          {/* Debit Card */}
          <div 
            onClick={() => setSelectedPaymentMethod('debit-card')}
            className={`border-2 rounded-2xl p-5 mb-4 cursor-pointer transition ${
              selectedPaymentMethod === 'debit-card'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Debit Card</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === 'debit-card'
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'debit-card' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold">💡 Note:</span> Your first payment will be processed immediately. Subsequent payments will be automatically deducted monthly.
            </p>
          </div>
        </div>

        <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button 
            onClick={() => {
              if (selectedPaymentMethod) {
                setCurrentScreen('payment-details');
              } else {
                alert('Please select a payment method');
              }
            }}
            disabled={!selectedPaymentMethod}
            className={`w-full py-4 rounded-full font-bold text-lg ${
              selectedPaymentMethod
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const PaymentDetailsScreen = () => {
    const totalPayout = calculateTotalPayout();
    const selectedDurationData = durations[selectedDuration];

    return (
      <div className="flex-1 overflow-y-auto pb-32 bg-white">
        <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('choose-payment-method')}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Payment Details</h1>
        </div>

        <div className="px-6 py-6">
          {/* Mobile Money Form */}
          {selectedPaymentMethod === 'mobile-money' && (
            <>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">📱</span>
                  <h3 className="font-bold text-gray-900 text-lg">Mobile Money</h3>
                </div>
                <p className="text-gray-600 text-sm">Enter your mobile money number</p>
              </div>

              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-2 block">Provider</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setPaymentDetails({...paymentDetails, provider: 'Airtel Money'})}
                    className={`p-4 rounded-xl border-2 font-semibold transition ${
                      paymentDetails.provider === 'Airtel Money'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Airtel Money
                  </button>
                  <button
                    onClick={() => setPaymentDetails({...paymentDetails, provider: 'MTN Money'})}
                    className={`p-4 rounded-xl border-2 font-semibold transition ${
                      paymentDetails.provider === 'MTN Money'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    MTN Money
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-2 block">Mobile Number *</label>
                <div className="flex space-x-2">
                  <div className="border-2 border-gray-200 rounded-xl p-4 flex items-center space-x-2">
                    <span className="text-2xl">🇨🇬</span>
                    <span className="font-semibold text-gray-700">+242</span>
                  </div>
                  <input
                    ref={mobileNumberRef}
                    type="tel"
                    defaultValue=""
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    placeholder="064 663 469"
                    maxLength="9"
                    className="flex-1 border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-gray-500 text-sm mt-2">Enter the number linked to your mobile money account</p>
              </div>
            </>
          )}

          {/* Bank Transfer Form */}
          {selectedPaymentMethod === 'bank-transfer' && (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">🏦</span>
                  <h3 className="font-bold text-gray-900 text-lg">Bank Transfer</h3>
                </div>
                <p className="text-gray-600 text-sm">Enter your bank account details</p>
              </div>

              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-2 block">Bank Name *</label>
                <input
                  ref={bankNameRef}
                  type="text"
                  defaultValue=""
                  placeholder="Ex: BGFI Bank, Ecobank..."
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-2 block">Account Number / IBAN *</label>
                <input
                  ref={accountNumberRef}
                  type="text"
                  defaultValue=""
                  placeholder="CG00 0000 0000 0000 0000 0000"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-2 block">Account Holder Name *</label>
                <input
                  ref={accountNameRef}
                  type="text"
                  defaultValue=""
                  placeholder="Full name as on bank account"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Debit Card Form */}
          {selectedPaymentMethod === 'debit-card' && (
            <>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">💳</span>
                  <h3 className="font-bold text-gray-900 text-lg">Debit Card</h3>
                </div>
                <p className="text-gray-600 text-sm">Enter your card details</p>
              </div>

              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-2 block">Card Number *</label>
                <input
                  ref={cardNumberRef}
                  type="text"
                  defaultValue=""
                  onInput={(e) => {
                    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
                    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                    e.target.value = formatted;
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-mono text-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-gray-700 font-semibold mb-2 block">Expiry Date *</label>
                  <input
                    ref={cardExpiryRef}
                    type="text"
                    defaultValue=""
                    onInput={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      e.target.value = value;
                    }}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-semibold mb-2 block">CVV *</label>
                  <input
                    ref={cardCVVRef}
                    type="password"
                    defaultValue=""
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    placeholder="123"
                    maxLength="3"
                    className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Security Info */}
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="font-bold text-gray-900 mb-1">Secure Payment</p>
                <p className="text-sm text-gray-700">Your payment information is encrypted and secure. We never store your full card details.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button 
            onClick={() => {
              // Validate and save payment details
              if (selectedPaymentMethod === 'mobile-money') {
                const mobile = mobileNumberRef.current?.value;
                if (!mobile || mobile.length < 9 || !paymentDetails.provider) {
                  alert('Please fill in all fields');
                  return;
                }
                setPaymentDetails({...paymentDetails, mobileNumber: mobile});
              } else if (selectedPaymentMethod === 'bank-transfer') {
                const bank = bankNameRef.current?.value;
                const account = accountNumberRef.current?.value;
                const name = accountNameRef.current?.value;
                if (!bank || !account || !name) {
                  alert('Please fill in all fields');
                  return;
                }
                setPaymentDetails({...paymentDetails, bankName: bank, accountNumber: account, accountName: name});
              } else if (selectedPaymentMethod === 'debit-card') {
                const cardNum = cardNumberRef.current?.value;
                const expiry = cardExpiryRef.current?.value;
                const cvv = cardCVVRef.current?.value;
                if (!cardNum || cardNum.replace(/\s/g, '').length < 16 || !expiry || expiry.length < 5 || !cvv || cvv.length < 3) {
                  alert('Please fill in all card details correctly');
                  return;
                }
                setPaymentDetails({...paymentDetails, cardNumber: cardNum, cardExpiry: expiry, cardCVV: cvv});
              }
              setCurrentScreen('payment-confirmation');
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg"
          >
            Continue to Review
          </button>
        </div>
      </div>
    );
  };

  const PaymentConfirmationScreen = () => {
    const totalPayout = calculateTotalPayout();
    const selectedDurationData = durations[selectedDuration];

    const getPaymentMethodName = () => {
      switch(selectedPaymentMethod) {
        case 'mobile-money': return 'Mobile Money';
        case 'bank-transfer': return 'Bank Transfer';
        case 'debit-card': return 'Debit Card';
        default: return '';
      }
    };

    const getPaymentDetailsDisplay = () => {
      if (selectedPaymentMethod === 'mobile-money') {
        return `${paymentDetails.provider} - +242 ${paymentDetails.mobileNumber}`;
      } else if (selectedPaymentMethod === 'bank-transfer') {
        return `${paymentDetails.bankName} - ${paymentDetails.accountNumber}`;
      } else if (selectedPaymentMethod === 'debit-card') {
        return `•••• •••• •••• ${paymentDetails.cardNumber?.slice(-4)}`;
      }
      return '';
    };

    return (
      <div className="flex-1 overflow-y-auto pb-32 bg-white">
        <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('payment-details')}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Review Your Circle</h1>
        </div>

        <div className="px-6 py-6">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Circle</h2>
            <p className="text-gray-600">Please review the details before confirming</p>
          </div>

          {/* Details Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Circle Name</span>
                <span className="font-bold text-gray-900">{selectedCircle?.name} SAVER</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Total Payout</span>
                <span className="font-bold text-blue-600">{totalPayout.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Duration</span>
                <span className="font-bold text-gray-900">{selectedDurationData?.months} Months</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Monthly Payment</span>
                <span className="font-bold text-gray-900">{selectedDurationData?.monthly.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-bold text-gray-900">{getPaymentMethodName()}</span>
              </div>
              
              {/* Payment Details Section */}
              {selectedPaymentMethod === 'mobile-money' && (
                <>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Provider</span>
                    <span className="font-bold text-gray-900">{paymentDetails.provider}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Mobile Number</span>
                    <span className="font-bold text-gray-900">+242 {paymentDetails.mobileNumber}</span>
                  </div>
                </>
              )}

              {selectedPaymentMethod === 'bank-transfer' && (
                <>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Bank Name</span>
                    <span className="font-bold text-gray-900">{paymentDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-bold text-gray-900 font-mono text-sm">{paymentDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Account Name</span>
                    <span className="font-bold text-gray-900">{paymentDetails.accountName}</span>
                  </div>
                </>
              )}

              {selectedPaymentMethod === 'debit-card' && (
                <>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Card Number</span>
                    <span className="font-bold text-gray-900 font-mono">•••• •••• •••• {paymentDetails.cardNumber?.replace(/\s/g, '').slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Expiry Date</span>
                    <span className="font-bold text-gray-900 font-mono">{paymentDetails.cardExpiry}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Start Date</span>
                <span className="font-bold text-gray-900">Feb 2026</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-bold">⚠️ Important:</span> By confirming, you agree to make monthly payments of {selectedDurationData?.monthly.toLocaleString()} XAF for {selectedDurationData?.months} months. Missing payments may affect your eligibility.
            </p>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button 
            onClick={() => {
              // Add the new circle to activeLikeLemba
              const newCircle = {
                id: Date.now(),
                name: selectedCircle?.name + ' Savings',
                amount: totalPayout.toString(),
                duration: selectedDurationData?.months,
                totalMembers: 1,
                currentMembers: 1,
                type: 'saving',
                monthsCompleted: 0,
                joinedDate: new Date().toISOString(),
                status: 'active',
                paymentMethod: selectedPaymentMethod
              };
              
              setActiveLikeLemba(prev => [...prev, newCircle]);
              
              // Reset saving program states
              setSelectedCircle(null);
              setSelectedDuration(0);
              setSelectedPaymentMethod('');
              setPaymentDetails({
                mobileNumber: '',
                cardNumber: '',
                cardExpiry: '',
                cardCVV: '',
                bankName: '',
                accountNumber: '',
                accountName: ''
              });
              
              alert('Circle joined successfully! Your first payment will be processed shortly.');
              setCurrentScreen('circles');
              setCurrentTab('circles');
            }}
            className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-lg"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    );
  };

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
          {!hasActivePayments ? (
            // Empty state
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="text-gray-400" size={40} />
              </div>
              <h3 className="text-gray-900 font-bold text-xl mb-2">You don't have any payments due yet</h3>
              <p className="text-gray-500 text-sm mb-6">Your due payments and your balance will appear here after you join a circle.</p>
              <button 
                onClick={() => {setCurrentScreen('join'); setCurrentTab('join');}}
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
                        <button className="w-full bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition">
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
                            setSelectedCircle(circles.find(c => c.name === payment.circleName));
                            setCurrentScreen('choose-payment-method');
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
              <div onClick={() => setCurrentScreen('payout-eligibility')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <CheckCircle2 className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Payout Eligibility</p>
              </div>
              <div onClick={() => setCurrentScreen('payment-settings')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <Settings className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Payment settings</p>
              </div>
              <div onClick={() => setCurrentScreen('transaction-history')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <FileText className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Transaction History</p>
              </div>
              <div onClick={() => setCurrentScreen('payment-calendar')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <Calendar className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Payment Calendar</p>
              </div>
              <div onClick={() => setCurrentScreen('payment-policy')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
                <File className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Payment policy</p>
              </div>
              <div onClick={() => setCurrentScreen('customer-support')} className="bg-white border-2 border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 transition">
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
          <button onClick={() => setCurrentScreen('payment')}>
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

  // Goal Detail Screen
  const GoalDetailScreen = () => {
    if (!selectedGoal) return null;

    const userGoal = userGoals.find(g => g.name === selectedGoal.name.replace('\n', ' '));
    const progress = userGoal ? Math.floor((userGoal.currentAmount / userGoal.targetAmount) * 100) : 0;

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('home')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{selectedGoal.name.replace('\n', ' ')}</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 py-12 text-center">
            <div className={`w-32 h-32 ${selectedGoal.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl`}>
              <span className="text-6xl">{selectedGoal.icon}</span>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">{selectedGoal.name.replace('\n', ' ')}</h2>
            <p className="text-blue-100">
              {selectedGoal.category === 'education' ? 'Save for your child\'s education and secure their future' :
               selectedGoal.category === 'travel' ? 'Plan your dream vacation and create unforgettable memories' :
               selectedGoal.category === 'religious' ? 'Prepare for religious celebrations and traditions' :
               selectedGoal.category === 'special' ? 'Enjoy special offers and zero admin fees' :
               'Smart saving strategies for your financial goals'}
            </p>
          </div>

          <div className="px-6 py-6">
            {/* Progress Card */}
            {userGoal && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Your Progress</h3>
                  <span className="text-blue-600 font-bold text-2xl">{progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-1">Current</p>
                    <p className="text-xl font-bold text-gray-900">{userGoal.currentAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">XAF</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-1">Target</p>
                    <p className="text-xl font-bold text-gray-900">{userGoal.targetAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">XAF</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Deadline</p>
                      <p className="font-bold text-gray-900">{new Date(userGoal.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">Remaining</p>
                      <p className="font-bold text-orange-600">{(userGoal.targetAmount - userGoal.currentAmount).toLocaleString()} XAF</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Amount */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Recommended Plan</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Target Amount</p>
                    <p className="text-sm text-gray-600">Recommended savings</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">500,000 XAF</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">Suggested timeframe</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">12 months</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Monthly Savings</p>
                    <p className="text-sm text-gray-600">Achieve your goal</p>
                  </div>
                  <p className="text-xl font-bold text-green-600">41,667 XAF</p>
                </div>
              </div>
            </div>

            {/* Related Circles */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Related Saving Programs</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Bronze Saver</p>
                      <p className="text-sm text-gray-600">6 months • 300,000 XAF</p>
                    </div>
                  </div>
                  <ChevronRight className="text-blue-600" size={20} />
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl cursor-pointer hover:bg-purple-100 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💎</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Gold Saver</p>
                      <p className="text-sm text-gray-600">12 months • 600,000 XAF</p>
                    </div>
                  </div>
                  <ChevronRight className="text-purple-600" size={20} />
                </div>
              </div>
            </div>

            {/* Action Button */}
            {!userGoal ? (
              <button 
                onClick={() => {
                  setUserGoals([...userGoals, {
                    id: userGoals.length + 1,
                    name: selectedGoal.name.replace('\n', ' '),
                    icon: selectedGoal.icon,
                    color: selectedGoal.color,
                    targetAmount: 500000,
                    currentAmount: 0,
                    deadline: '2026-12-31',
                    category: selectedGoal.category,
                    description: '',
                    active: true
                  }]);
                  setCurrentScreen('home');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold shadow-lg"
              >
                🚀 Start This Goal
              </button>
            ) : (
              <button 
                onClick={() => setCurrentScreen('saving-programs')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-full font-bold shadow-lg"
              >
                💰 Add More Savings
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Saving Programs Screen
  const SavingProgramsScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentScreen('goal-detail')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Saving Programs</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">💰 Boost Your Savings</h2>
          <p className="text-gray-600">Choose a saving program to accelerate your goal achievement</p>
        </div>

        {/* Saving Programs List */}
        <div className="space-y-4">
          {/* Auto-Save Program */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Auto-Save Weekly</h3>
                  <p className="text-sm text-gray-500">Automatic weekly deposits</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">RECOMMENDED</span>
            </div>
            <p className="text-gray-600 mb-4">Set up automatic weekly transfers from your linked account to your goal. Never miss a saving!</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">From 5,000 XAF/week</span>
              <button 
                onClick={() => alert('Auto-Save setup coming soon!')}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                Set Up
              </button>
            </div>
          </div>

          {/* Round-Up Program */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Round-Up Savings</h3>
                  <p className="text-sm text-gray-500">Save on every transaction</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Round up your purchases to the nearest 1,000 XAF and save the difference automatically.</p>
            <div className="bg-purple-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700"><strong>Example:</strong> Buy for 8,300 XAF → 700 XAF saved</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Save 100-1,000 XAF per transaction</span>
              <button 
                onClick={() => alert('Round-Up setup coming soon!')}
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                Activate
              </button>
            </div>
          </div>

          {/* Match Savings Program */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Match Savings</h3>
                  <p className="text-sm text-gray-500">We match your contributions</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">BONUS</span>
            </div>
            <p className="text-gray-600 mb-4">For every 10,000 XAF you save, we add 500 XAF bonus! Limited time offer.</p>
            <div className="bg-green-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700"><strong>Save 100,000 XAF</strong> → Get <strong>5,000 XAF bonus</strong> 🎉</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">5% bonus on savings</span>
              <button 
                onClick={() => alert('Match Savings enrollment coming soon!')}
                className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                Enroll
              </button>
            </div>
          </div>

          {/* Likelemba Integration */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Likelemba to Goal</h3>
                  <p className="text-sm text-gray-500">Convert payout to savings</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Automatically transfer your Likelemba payout to your goal instead of cashing out.</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Save entire payout</span>
              <button 
                onClick={() => alert('Likelemba integration coming soon!')}
                className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Manual Contribution */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-xl mb-2">💸 Make a One-Time Contribution</h3>
          <p className="text-white/90 mb-4">Add funds to your goal anytime</p>
          <button 
            onClick={() => setCurrentScreen('goal-detail')}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold"
          >
            Contribute Now
          </button>
        </div>
      </div>
    </div>
  );

  // My Goals Dashboard Screen
  const MyGoalsScreen = () => {
    const activeGoals = userGoals.filter(g => g.active);
    const completedGoals = userGoals.filter(g => !g.active && g.currentAmount >= g.targetAmount);

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('home')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">My Goals</h1>
          <button onClick={() => setCurrentScreen('create-goal')}>
            <PlusCircle className="text-blue-600" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Summary Card */}
          <div className="px-6 py-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg mb-6">
              <h2 className="text-lg font-semibold mb-4">Goals Summary</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-blue-200 text-xs mb-1">Active</p>
                  <p className="text-3xl font-bold">{activeGoals.length}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs mb-1">Completed</p>
                  <p className="text-3xl font-bold">{completedGoals.length}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs mb-1">Total Saved</p>
                  <p className="text-2xl font-bold">{activeGoals.reduce((sum, g) => sum + g.currentAmount, 0).toLocaleString()}</p>
                  <p className="text-xs text-blue-200">XAF</p>
                </div>
              </div>
            </div>

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Active Goals ({activeGoals.length})</h3>
                <div className="space-y-4">
                  {activeGoals.map(goal => {
                    const progress = Math.floor((goal.currentAmount / goal.targetAmount) * 100);
                    return (
                      <div 
                        key={goal.id} 
                        onClick={() => {
                          setSelectedGoal({ name: goal.name, icon: goal.icon, color: goal.color, category: goal.category });
                          setCurrentScreen('goal-detail');
                        }}
                        className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 cursor-pointer hover:border-blue-400 transition"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-16 h-16 ${goal.color} rounded-2xl flex items-center justify-center`}>
                            <span className="text-3xl">{goal.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">{goal.name}</h4>
                            <p className="text-sm text-gray-600">{goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} XAF</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{progress}%</p>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="text-orange-600 font-semibold">{(goal.targetAmount - goal.currentAmount).toLocaleString()} XAF left</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {activeGoals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-gray-900 font-bold text-xl mb-2">No Active Goals</h3>
                <p className="text-gray-500 mb-6">Start your first savings goal and track your progress!</p>
                <button 
                  onClick={() => setCurrentScreen('create-goal')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold inline-flex items-center space-x-2"
                >
                  <PlusCircle size={20} />
                  <span>Create Your First Goal</span>
                </button>
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-4">Completed Goals ({completedGoals.length}) 🎉</h3>
                <div className="space-y-3">
                  {completedGoals.map(goal => (
                    <div key={goal.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{goal.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{goal.name}</h4>
                          <p className="text-sm text-green-600">✓ {goal.targetAmount.toLocaleString()} XAF achieved</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Create Custom Goal Screen
  const CreateGoalScreen = () => {
    // Check if user can create custom goals
    if (!canCreateCustomGoal()) {
      return (
        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <button onClick={() => setCurrentScreen('my-goals')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Create Goal</h1>
            <div className="w-6"></div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Locked</h2>
              <p className="text-gray-600 mb-6">
                {userPlan.tier === 'bronze' ? 
                  'Custom goals are not available on the Bronze plan. Upgrade to Silver or Gold to create unlimited custom goals!' :
                  `You've reached your limit of ${userPlan.features.customGoalsLimit} custom goals. Upgrade to Gold for unlimited goals!`}
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => setCurrentScreen('upgrade')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold"
                >
                  🚀 Upgrade Now
                </button>
                <button 
                  onClick={() => setCurrentScreen('feature-store')}
                  className="w-full bg-gray-200 text-gray-700 py-4 rounded-full font-bold"
                >
                  🛒 Buy Custom Goals Pack
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [goalDeadline, setGoalDeadline] = useState('');
    const [goalCategory, setGoalCategory] = useState('');

    const categories = [
      { id: 'education', name: 'Education', icon: '✏️', color: 'bg-blue-100' },
      { id: 'travel', name: 'Travel', icon: '🌴', color: 'bg-green-100' },
      { id: 'religious', name: 'Religious', icon: '🐑', color: 'bg-purple-100' },
      { id: 'health', name: 'Health', icon: '❤️', color: 'bg-red-100' },
      { id: 'home', name: 'Home', icon: '🏠', color: 'bg-yellow-100' },
      { id: 'general', name: 'General', icon: '💰', color: 'bg-gray-100' }
    ];

    const handleCreate = () => {
      if (!goalName || !goalAmount || !goalDeadline || !goalCategory) {
        alert('Please fill in all fields');
        return;
      }

      const selectedCat = categories.find(c => c.id === goalCategory);
      const newGoal = {
        id: userGoals.length + 1,
        name: goalName,
        icon: selectedCat.icon,
        color: selectedCat.color,
        targetAmount: parseInt(goalAmount),
        currentAmount: 0,
        deadline: goalDeadline,
        category: goalCategory,
        description: '',
        active: true
      };

      setUserGoals([...userGoals, newGoal]);
      setCurrentScreen('my-goals');
    };

    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('my-goals')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Create Goal</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
          <p className="text-gray-600 mb-6">Set up a new savings goal and track your progress towards achieving it.</p>

          {/* Goal Name */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">Goal Name</label>
            <input 
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g., New Car, Wedding, Emergency Fund"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-3">Category</label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setGoalCategory(cat.id)}
                  className={`${cat.color} rounded-2xl p-4 flex flex-col items-center border-2 transition ${
                    goalCategory === cat.id ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className="text-xs font-semibold text-gray-900">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Amount */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">Target Amount (XAF)</label>
            <input 
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder="500000"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Deadline */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">Target Date</label>
            <input 
              type="date"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Preview */}
          {goalName && goalAmount && goalCategory && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 mb-6 border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-3">Preview:</p>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${categories.find(c => c.id === goalCategory)?.color} rounded-2xl flex items-center justify-center`}>
                  <span className="text-3xl">{categories.find(c => c.id === goalCategory)?.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{goalName}</h3>
                  <p className="text-blue-600 font-semibold">{parseInt(goalAmount || 0).toLocaleString()} XAF</p>
                </div>
              </div>
            </div>
          )}

          {/* Create Button */}
          <button 
            onClick={handleCreate}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold shadow-lg disabled:opacity-50"
            disabled={!goalName || !goalAmount || !goalDeadline || !goalCategory}
          >
            Create Goal 🎯
          </button>
        </div>
      </div>
    );
  };

  // Upgrade Screen - Plan Comparison
  const UpgradeScreen = () => {
    const plans = ['bronze', 'silver', 'gold'].map(tier => ({
      tier,
      ...getPlanLimits(tier)
    }));

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('profile')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Choose Your Plan</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 py-6">
            <p className="text-gray-600 text-center mb-8">Unlock more features and save on fees with our premium plans</p>

            {/* Plan Cards */}
            <div className="space-y-4 mb-8">
              {plans.map((plan, idx) => (
                <div 
                  key={plan.tier}
                  className={`bg-white rounded-3xl p-6 border-2 ${
                    userPlan.tier === plan.tier ? 'border-blue-600 shadow-lg' : 'border-gray-200'
                  } ${idx === 2 ? 'bg-gradient-to-br from-yellow-50 to-amber-50' : ''}`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center shadow-md`}>
                        <span className="text-3xl">{plan.badge}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{plan.tierName}</h3>
                        {plan.price === 0 ? (
                          <p className="text-green-600 font-bold">Free Forever</p>
                        ) : (
                          <p className="text-gray-600">{plan.price.toLocaleString()} XAF/month</p>
                        )}
                      </div>
                    </div>
                    {userPlan.tier === plan.tier && (
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Active Circles</span>
                      <span className="font-bold text-gray-900">
                        {plan.features.maxCircles === -1 ? 'Unlimited' : plan.features.maxCircles}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Admin Fees</span>
                      <span className={`font-bold ${plan.features.adminFeePercent === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {plan.features.adminFeePercent}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Custom Goals</span>
                      <span className="font-bold text-gray-900">
                        {plan.features.customGoalsLimit === -1 ? 'Unlimited' : 
                         plan.features.customGoalsLimit === 0 ? 'None' : 
                         plan.features.customGoalsLimit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cashback</span>
                      <span className={`font-bold ${plan.features.cashbackPercent > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {plan.features.cashbackPercent}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Priority Support</span>
                      <span>{plan.features.prioritySupport ? '✅' : '❌'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Priority Slots</span>
                      <span>{plan.features.prioritySlots ? '✅' : '❌'}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {userPlan.tier !== plan.tier && (
                    <button 
                      onClick={() => {
                        if (confirm(`Upgrade to ${plan.tierName} for ${plan.price.toLocaleString()} XAF/month?`)) {
                          setUserPlan({
                            ...userPlan,
                            tier: plan.tier,
                            tierName: plan.tierName,
                            badge: plan.badge,
                            color: plan.color,
                            features: plan.features,
                            subscriptionStart: new Date().toISOString().split('T')[0],
                            subscriptionEnd: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
                          });
                          setCurrentScreen('my-plan');
                        }
                      }}
                      className={`w-full py-3 rounded-full font-bold ${
                        idx === 2 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' :
                        idx === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {plan.tier === 'bronze' ? 'Current Plan' : 
                       userPlan.tier === 'bronze' ? `Upgrade to ${plan.tierName}` :
                       `Switch to ${plan.tierName}`}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Feature Store Link */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border-2 border-indigo-200">
              <h3 className="font-bold text-gray-900 text-lg mb-2">Need just one feature?</h3>
              <p className="text-gray-600 text-sm mb-4">Buy individual features without upgrading your plan</p>
              <button 
                onClick={() => setCurrentScreen('feature-store')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold inline-flex items-center space-x-2"
              >
                <span>🛒 Visit Feature Store</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // My Plan Screen
  const MyPlanScreen = () => {
    const currentPlan = getPlanLimits(userPlan.tier);

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('profile')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">My Plan</h1>
          <button onClick={() => setCurrentScreen('upgrade')}>
            <TrendingUp className="text-blue-600" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 py-6">
            {/* Current Plan Card */}
            <div className={`bg-gradient-to-br ${userPlan.color} rounded-3xl p-8 text-white shadow-xl mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Current Plan</p>
                  <h2 className="text-4xl font-bold">{userPlan.tierName}</h2>
                </div>
                <div className="text-6xl">{userPlan.badge}</div>
              </div>
              {userPlan.tier !== 'bronze' && (
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Valid Until</p>
                  <p className="text-xl font-bold">
                    {userPlan.subscriptionEnd ? 
                      new Date(userPlan.subscriptionEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) :
                      'Lifetime'}
                  </p>
                </div>
              )}
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Usage This Month</h3>
              <div className="space-y-4">
                {/* Circles */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Active Circles</span>
                    <span className="font-bold text-gray-900">
                      {activeLikeLemba.length} / {userPlan.features.maxCircles === -1 ? '∞' : userPlan.features.maxCircles}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: userPlan.features.maxCircles === -1 ? '50%' : 
                               `${Math.min(100, (activeLikeLemba.length / userPlan.features.maxCircles) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Custom Goals</span>
                    <span className="font-bold text-gray-900">
                      {userGoals.filter(g => g.active).length} / {
                        userPlan.features.customGoalsLimit === -1 ? '∞' : 
                        userPlan.features.customGoalsLimit === 0 ? '0' : 
                        userPlan.features.customGoalsLimit
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ 
                        width: userPlan.features.customGoalsLimit <= 0 ? '0%' :
                               userPlan.features.customGoalsLimit === -1 ? '50%' : 
                               `${Math.min(100, (userGoals.filter(g => g.active).length / userPlan.features.customGoalsLimit) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Fees Saved */}
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Admin Fees This Month</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userPlan.features.adminFeePercent}%
                      </p>
                    </div>
                    {userPlan.tier === 'gold' && (
                      <div className="text-right">
                        <p className="text-xs text-green-600 mb-1">You Saved</p>
                        <p className="text-xl font-bold text-green-600">5,000 XAF</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Plan Features</h3>
              <div className="space-y-3">
                {[
                  { name: 'Admin Fees', value: `${userPlan.features.adminFeePercent}%`, active: true },
                  { name: 'Priority Support', value: userPlan.features.prioritySupport ? '✅ Included' : '❌ Not included', active: userPlan.features.prioritySupport },
                  { name: 'Priority Slots', value: userPlan.features.prioritySlots ? '✅ Included' : '❌ Not included', active: userPlan.features.prioritySlots },
                  { name: 'Cashback', value: `${userPlan.features.cashbackPercent}%`, active: userPlan.features.cashbackPercent > 0 },
                  { name: 'Payment Reminders', value: userPlan.features.paymentReminders ? '✅ Included' : '❌ Not included', active: userPlan.features.paymentReminders },
                  { name: 'Advanced Statistics', value: userPlan.features.advancedStats ? '✅ Included' : '❌ Not included', active: userPlan.features.advancedStats }
                ].map((feature, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${feature.active ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <span className="text-gray-700 font-medium">{feature.name}</span>
                    <span className={`font-bold ${feature.active ? 'text-blue-600' : 'text-gray-400'}`}>{feature.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-Ons */}
            {userPlan.addOns.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Active Add-Ons</h3>
                <div className="space-y-3">
                  {userPlan.addOns.map((addon, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                      <div>
                        <p className="font-bold text-gray-900">{addon.featureName}</p>
                        <p className="text-sm text-gray-600">Expires: {new Date(addon.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <span className="text-2xl">✨</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upgrade CTA */}
            {userPlan.tier !== 'gold' && (
              <button 
                onClick={() => setCurrentScreen('upgrade')}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white py-4 rounded-full font-bold shadow-lg flex items-center justify-center space-x-2"
              >
                <TrendingUp size={20} />
                <span>Upgrade to {userPlan.tier === 'bronze' ? 'Silver or Gold' : 'Gold'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Feature Store Screen - Pay per feature
  const FeatureStoreScreen = () => {
    const features = [
      {
        id: 'zeroFees',
        name: 'Zero Fees Pass',
        icon: '☀️',
        description: '0% admin fees on all transactions',
        price: 1000,
        duration: '1 month',
        color: 'from-yellow-400 to-orange-500'
      },
      {
        id: 'extraCircle',
        name: 'Extra Circle Slot',
        icon: '➕',
        description: 'Join one additional circle',
        price: 500,
        duration: 'Permanent',
        color: 'from-blue-400 to-indigo-500'
      },
      {
        id: 'customGoals',
        name: 'Custom Goals Pack',
        icon: '🎯',
        description: 'Create up to 5 custom goals',
        price: 200,
        duration: 'Permanent',
        color: 'from-purple-400 to-pink-500'
      },
      {
        id: 'prioritySupport',
        name: 'Priority Support',
        icon: '⚡',
        description: 'Get help within 2-4 hours',
        price: 300,
        duration: '1 month',
        color: 'from-green-400 to-emerald-500'
      }
    ];

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('upgrade')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Feature Store</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 py-6">
            <p className="text-gray-600 text-center mb-8">Buy individual features without upgrading your plan</p>

            {/* Feature Cards */}
            <div className="space-y-4">
              {features.map(feature => (
                <div key={feature.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-md`}>
                      <span className="text-3xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{feature.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{feature.description}</p>
                      <p className="text-blue-600 font-semibold text-sm">{feature.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{feature.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">XAF</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (confirm(`Purchase ${feature.name} for ${feature.price.toLocaleString()} XAF?`)) {
                          // Add to addOns
                          const newAddon = {
                            feature: feature.id,
                            featureName: feature.name,
                            expiryDate: feature.duration === 'Permanent' ? '2099-12-31' : 
                                       new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
                          };
                          setUserPlan({
                            ...userPlan,
                            addOns: [...userPlan.addOns, newAddon]
                          });
                          alert(`${feature.name} purchased successfully! 🎉`);
                          setCurrentScreen('my-plan');
                        }
                      }}
                      className={`bg-gradient-to-r ${feature.color} text-white px-6 py-3 rounded-full font-bold`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CardScreen = () => {
    const [cardBalance, setCardBalance] = React.useState(125000);
    const [isCardFrozen, setIsCardFrozen] = React.useState(false);
    const [showCardDetails, setShowCardDetails] = React.useState(false);
    const [showAddPaymentModal, setShowAddPaymentModal] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [showTopUpModal, setShowTopUpModal] = React.useState(false);
    const [topUpAmount, setTopUpAmount] = React.useState('');
    const [topUpSource, setTopUpSource] = React.useState(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [showTopUpSuccess, setShowTopUpSuccess] = React.useState(false);
    const [paymentToDelete, setPaymentToDelete] = React.useState(null);
    const [newPaymentType, setNewPaymentType] = React.useState('card'); // 'card' or 'mobile'
    const [newPaymentData, setNewPaymentData] = React.useState({
      cardName: '',
      last4: '',
      provider: '',
      phoneNumber: ''
    });
    const [paymentMethods, setPaymentMethods] = React.useState([
      { id: 1, type: 'card', name: 'Visa', last4: '4582', isDefault: true, brand: 'visa' },
      { id: 2, type: 'mobile', name: 'MTN Mobile Money', number: '+242 06 466 3469', isDefault: false, brand: 'mtn' },
      { id: 3, type: 'card', name: 'Mastercard', last4: '8921', isDefault: false, brand: 'mastercard' },
      { id: 4, type: 'mobile', name: 'Airtel Money', number: '+242 05 555 1234', isDefault: false, brand: 'airtel' }
    ]);

    const handleSetDefault = (id) => {
      console.log('Setting default for payment method ID:', id);
      const updated = paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === id
      }));
      console.log('Updated payment methods:', updated);
      setPaymentMethods(updated);
    };

    const handleDeletePaymentMethod = (id) => {
      console.log('Attempting to delete payment method ID:', id);
      const methodToDelete = paymentMethods.find(pm => pm.id === id);
      setPaymentToDelete(methodToDelete);
      setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
      if (paymentToDelete) {
        console.log('Deleting payment method:', paymentToDelete);
        const filtered = paymentMethods.filter(pm => pm.id !== paymentToDelete.id);
        console.log('Remaining payment methods:', filtered);
        setPaymentMethods(filtered);
        setShowDeleteConfirm(false);
        setPaymentToDelete(null);
      }
    };

    const cancelDelete = () => {
      console.log('Delete cancelled by user');
      setShowDeleteConfirm(false);
      setPaymentToDelete(null);
    };

    const handleAddPayment = () => {
      setShowAddPaymentModal(true);
      setNewPaymentData({ cardName: '', last4: '', provider: '', phoneNumber: '' });
    };

    const handleSavePayment = () => {
      if (newPaymentType === 'card') {
        if (newPaymentData.cardName && newPaymentData.last4) {
          const newCard = {
            id: Date.now(),
            type: 'card',
            name: newPaymentData.cardName,
            last4: newPaymentData.last4,
            isDefault: false,
            brand: newPaymentData.cardName.toLowerCase()
          };
          setPaymentMethods([...paymentMethods, newCard]);
          setShowAddPaymentModal(false);
        } else {
          alert('Please fill all card fields');
        }
      } else {
        if (newPaymentData.provider && newPaymentData.phoneNumber) {
          const newMobile = {
            id: Date.now(),
            type: 'mobile',
            name: `${newPaymentData.provider} Mobile Money`,
            number: newPaymentData.phoneNumber,
            isDefault: false,
            brand: newPaymentData.provider.toLowerCase()
          };
          setPaymentMethods([...paymentMethods, newMobile]);
          setShowAddPaymentModal(false);
        } else {
          alert('Please fill all mobile money fields');
        }
      }
    };

    const handleOpenTopUp = () => {
      setShowTopUpModal(true);
      setTopUpAmount('');
      setTopUpSource(null);
    };

    const handleTopUpConfirm = () => {
      if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      if (!topUpSource) {
        alert('Please select a payment source');
        return;
      }

      setIsProcessing(true);

      // Simulate processing (2 seconds)
      setTimeout(() => {
        const amount = parseFloat(topUpAmount);
        setCardBalance(cardBalance + amount);
        setIsProcessing(false);
        setShowTopUpModal(false);
        setShowTopUpSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowTopUpSuccess(false);
        }, 3000);
      }, 2000);
    };

    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-xl font-bold">My Card</h1>
          <button onClick={() => setCurrentScreen('profile')}>
            <User className="text-gray-700" size={24} />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Virtual Kolo Card */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Kolo Virtual Card</h2>
            
            <div className="relative">
              {/* Card Design */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-6 shadow-2xl transform transition hover:scale-105">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Kolo Card</p>
                    <p className="text-white font-bold text-xl">Virtual</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <p className="text-white text-xs font-bold">PREPAID</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-white/80 text-xs mb-2">Card Number</p>
                  <p className="text-white text-2xl font-mono tracking-wider">
                    {showCardDetails ? '5399 2847 3621 4582' : '**** **** **** 4582'}
                  </p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/80 text-xs mb-1">Card Holder</p>
                    <p className="text-white font-bold">{firstName.toUpperCase()} {lastName.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs mb-1">Valid Thru</p>
                    <p className="text-white font-bold">12/28</p>
                  </div>
                </div>

                {showCardDetails && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-white/80 text-xs mb-1">CVV</p>
                        <p className="text-white font-bold font-mono">847</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/80 text-xs mb-1">Status</p>
                        <p className={`font-bold ${isCardFrozen ? 'text-yellow-300' : 'text-green-300'}`}>
                          {isCardFrozen ? 'FROZEN' : 'ACTIVE'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Balance */}
              <div className="bg-white rounded-2xl p-4 shadow-lg mt-4 mx-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-gray-900">{cardBalance.toLocaleString()} <span className="text-lg text-gray-600">XAF</span></p>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button 
                onClick={handleOpenTopUp}
                className="bg-blue-600 text-white py-3 rounded-xl font-semibold flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-1">⬆️</span>
                <span className="text-sm">Top Up</span>
              </button>
              <button 
                onClick={() => setIsCardFrozen(!isCardFrozen)}
                className={`${isCardFrozen ? 'bg-green-600' : 'bg-yellow-600'} text-white py-3 rounded-xl font-semibold flex flex-col items-center justify-center`}
              >
                <span className="text-2xl mb-1">{isCardFrozen ? '🔓' : '❄️'}</span>
                <span className="text-sm">{isCardFrozen ? 'Unfreeze' : 'Freeze'}</span>
              </button>
              <button 
                onClick={() => setShowCardDetails(!showCardDetails)}
                className="bg-gray-700 text-white py-3 rounded-xl font-semibold flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-1">{showCardDetails ? '🙈' : '👁️'}</span>
                <span className="text-sm">Details</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Payment Methods Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
              <button 
                onClick={handleAddPayment}
                className="text-blue-600 font-semibold text-sm flex items-center space-x-1"
              >
                <PlusCircle size={18} />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        method.type === 'card' ? 'bg-blue-100' : 'bg-yellow-100'
                      }`}>
                        {method.type === 'card' ? (
                          <CreditCard className="text-blue-600" size={24} />
                        ) : (
                          <span className="text-2xl">📱</span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-bold text-gray-900">
                            {method.type === 'card' ? `${method.name} ••••${method.last4}` : method.name}
                          </p>
                          {method.isDefault && (
                            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {method.type === 'card' ? 'Credit/Debit Card' : method.number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!method.isDefault && (
                    <div className="flex space-x-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold text-sm"
                      >
                        Set as Default
                      </button>
                      <button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Card Activity</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">⬇️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Family Savings Circle</p>
                      <p className="text-xs text-gray-500">Today, 2:34 PM</p>
                    </div>
                  </div>
                  <p className="font-bold text-red-600">-50,000 XAF</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">⬆️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Top up from MTN</p>
                      <p className="text-xs text-gray-500">Yesterday, 10:15 AM</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">+100,000 XAF</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Payment Method Modal */}
        {showAddPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Payment Method</h2>

              {/* Type Selection */}
              <div className="mb-6">
                <p className="text-gray-700 font-semibold mb-3">Select Type</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewPaymentType('card')}
                    className={`py-3 px-4 rounded-xl font-semibold border-2 transition ${
                      newPaymentType === 'card'
                        ? 'bg-blue-50 border-blue-600 text-blue-600'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    💳 Card
                  </button>
                  <button
                    onClick={() => setNewPaymentType('mobile')}
                    className={`py-3 px-4 rounded-xl font-semibold border-2 transition ${
                      newPaymentType === 'mobile'
                        ? 'bg-blue-50 border-blue-600 text-blue-600'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    📱 Mobile Money
                  </button>
                </div>
              </div>

              {/* Card Form */}
              {newPaymentType === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-700 font-semibold mb-2 block">Card Brand</label>
                    <input
                      type="text"
                      value={newPaymentData.cardName}
                      onChange={(e) => setNewPaymentData({...newPaymentData, cardName: e.target.value})}
                      placeholder="e.g., Visa, Mastercard"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 font-semibold mb-2 block">Last 4 Digits</label>
                    <input
                      type="text"
                      maxLength="4"
                      value={newPaymentData.last4}
                      onChange={(e) => setNewPaymentData({...newPaymentData, last4: e.target.value.replace(/[^0-9]/g, '')})}
                      placeholder="1234"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Money Form */}
              {newPaymentType === 'mobile' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-700 font-semibold mb-2 block">Provider</label>
                    <select
                      value={newPaymentData.provider}
                      onChange={(e) => setNewPaymentData({...newPaymentData, provider: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select provider</option>
                      <option value="MTN">MTN</option>
                      <option value="Airtel">Airtel</option>
                      <option value="Orange">Orange</option>
                      <option value="Moov">Moov</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-700 font-semibold mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      value={newPaymentData.phoneNumber}
                      onChange={(e) => setNewPaymentData({...newPaymentData, phoneNumber: e.target.value})}
                      placeholder="+242 06 123 4567"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePayment}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
                >
                  Add Method
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && paymentToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🗑️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Remove Payment Method?</h2>
                <p className="text-gray-600">
                  Are you sure you want to remove{' '}
                  <span className="font-bold">
                    {paymentToDelete.type === 'card' 
                      ? `${paymentToDelete.name} ••••${paymentToDelete.last4}` 
                      : paymentToDelete.name}
                  </span>
                  ?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Up Card</h2>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-2 block">Amount (XAF)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full border-2 border-gray-200 rounded-xl p-4 pr-16 text-2xl font-bold text-gray-900 focus:border-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">XAF</span>
                </div>
                <div className="flex space-x-2 mt-3">
                  {[10000, 25000, 50000, 100000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold text-sm"
                    >
                      {(amount/1000)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Source Selection */}
              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-3 block">Select Source</label>
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setTopUpSource(method)}
                      className={`w-full p-4 rounded-xl border-2 transition flex items-center space-x-3 ${
                        topUpSource?.id === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        method.type === 'card' ? 'bg-blue-100' : 'bg-yellow-100'
                      }`}>
                        {method.type === 'card' ? (
                          <CreditCard className="text-blue-600" size={24} />
                        ) : (
                          <span className="text-2xl">📱</span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-900">
                          {method.type === 'card' ? `${method.name} ••••${method.last4}` : method.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {method.type === 'card' ? 'Credit/Debit Card' : method.number}
                        </p>
                      </div>
                      {topUpSource?.id === method.id && (
                        <CheckCircle2 className="text-blue-600" size={24} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUpConfirm}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    'Confirm Top Up'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Up Success Toast */}
        {showTopUpSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
              <CheckCircle2 size={24} />
              <div>
                <p className="font-bold">Top Up Successful!</p>
                <p className="text-sm">+{parseFloat(topUpAmount).toLocaleString()} XAF added to your card</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ProfileScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentScreen('home')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <div className="flex space-x-3">
          <Zap className="text-gray-700" size={24} />
          <Bell className="text-gray-700" size={24} />
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="text-gray-400" size={40} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{firstName} {lastName}</h2>
              <span className={`bg-gradient-to-r ${userPlan.color} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                {userPlan.badge} {userPlan.tierName.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600">{phone}</p>
          </div>
        </div>

        {/* Plan Info Card */}
        <div 
          onClick={() => setCurrentScreen('my-plan')}
          className={`bg-gradient-to-r ${userPlan.color} rounded-3xl p-5 mb-6 cursor-pointer hover:shadow-lg transition`}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex-1">
              <p className="text-white/80 text-sm mb-1">Your Plan</p>
              <h3 className="text-2xl font-bold mb-2">{userPlan.tierName}</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span>{getCirclesRemaining()} circles left</span>
                <span>•</span>
                <span>{userPlan.features.adminFeePercent}% fees</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl mb-2">{userPlan.badge}</div>
              {userPlan.tier !== 'gold' && (
                <button className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-gray-900 font-bold text-lg mb-4">Account</h3>
        <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm">
          <button 
            onClick={() => setCurrentScreen('personal-info')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <User className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">{t('personalInfo')}</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setCurrentScreen('my-documents')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <Folder className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">My Documents</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setCurrentScreen('manage-addresses')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <MapPin className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">{t('manageAddresses')}</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setCurrentScreen('signing-requests')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">Signing Requests</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setCurrentScreen('referral')}
            className="flex items-center justify-between w-full py-4"
          >
            <div className="flex items-center space-x-3">
              <UserPlus className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">{t('inviteFriends')}</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>
        </div>

        <h3 className="text-gray-900 font-bold text-lg mb-4">{t('security')}</h3>
        <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm">
          <button 
            onClick={() => setCurrentScreen('security-settings')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <Shield className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">{t('security')}</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setCurrentScreen('change-passcode')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <Lock className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">Change Passcode</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setCurrentScreen('security-logs')}
            className="flex items-center justify-between w-full py-4"
          >
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">Activity Log</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <p className="text-gray-700 text-sm">
            Upload your ID and wait for approval to enable Face ID or Fingerprint
          </p>
        </div>

        <h3 className="text-gray-900 font-bold text-lg mb-4">Settings</h3>
        <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm">
          <button 
            onClick={() => setCurrentScreen('language')}
            className="flex items-center justify-between w-full py-4"
          >
            <div className="flex items-center space-x-3">
              <Globe className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">Language</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">
                {language === 'en' ? 'English' : 'Français'}
              </span>
              <ChevronRight className="text-gray-400" size={24} />
            </div>
          </button>
        </div>

        <h3 className="text-gray-900 font-bold text-lg mb-4">Support</h3>
        <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm">
          <button 
            onClick={() => setCurrentScreen('customer-support')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <MessageCircle className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">Customer Support</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-full font-bold mb-4 flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>

        <p className="text-center text-gray-400 text-sm">App version: 8.7.15 (809881)</p>
      </div>
    </div>
  );

  const MyDocumentsScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => setCurrentScreen('profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">My Documents</h1>
      </div>

      <div className="px-6 py-6">
        <p className="text-gray-500 mb-8">
          Upload your documents to complete your account information
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => setCurrentScreen('scan-national-id')}
            className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">National ID</h3>
                  <p className="text-sm text-gray-600">Upload a photo of your National ID</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={24} />
            </div>
            <p className="text-blue-600 text-sm font-semibold ml-15">Required To Verify Your Identity</p>
          </button>

          <button 
            onClick={() => setCurrentScreen('proof-income')}
            className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Proof Of Income</h3>
                  <p className="text-sm text-gray-600">Upload an HR letter or a business bank statement</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={24} />
            </div>
            <p className="text-blue-600 text-sm font-semibold ml-15">Required To Increase Limit</p>
          </button>

          <button 
            onClick={() => setCurrentScreen('scan-utility-bill')}
            className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <File className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900">Utility Bill</h3>
                    <span className="bg-green-400 text-white text-xs px-2 py-1 rounded-full font-bold">New</span>
                  </div>
                  <p className="text-sm text-gray-600">Upload a copy of a utility bill under your name</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={24} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const ScanNationalIdScreen = () => (
    <div className="flex-1 overflow-y-auto pb-40 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => setCurrentScreen('my-documents')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Scan National Id</h1>
      </div>

      <div className="px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="text-6xl">🆔</div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          When scanning your ID, make sure that both sides of your National ID:
        </h2>

        <ul className="space-y-2 mb-8">
          <li className="flex items-start space-x-2">
            <span className="text-gray-700">•</span>
            <span className="text-gray-700">Well-lit and clear to read</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-gray-700">•</span>
            <span className="text-gray-700">Inside the frame (not clipped)</span>
          </li>
        </ul>

        <div className="bg-blue-50 rounded-2xl p-4 mb-8 flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="text-white" size={20} />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            As required by the Central Bank of Congo, users must upload their (valid) National ID before joining a Game'ya to guarantee everyone's rights.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
        <button className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2">
          <Camera size={24} />
          <span>Scan National ID</span>
        </button>
      </div>
    </div>
  );

  const ProofIncomeScreen = () => (
    <div className="flex-1 overflow-y-auto pb-48 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => setCurrentScreen('my-documents')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Proof of Income</h1>
      </div>

      <div className="px-6 py-6">
        <p className="text-gray-700 mb-6">
          Choose the document you can upload to prove your monthly income.
        </p>

        <div className="space-y-4 mb-8">
          <div className="border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <User className="text-blue-600" size={24} />
                <h3 className="font-bold text-gray-900">HR Letter</h3>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-blue-600"></div>
            </div>
            <p className="text-sm text-gray-600">
              Upload a recently signed & stamped HR letter.
            </p>
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <FileText className="text-blue-600" size={24} />
                <h3 className="font-bold text-gray-900">Bank Statement</h3>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
            </div>
            <p className="text-sm text-gray-600">
              Upload a recent Bank Statement from your bank reflecting the last 3 months transactions.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="text-white" size={20} />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Upload more Proof of income documents and increase your credit limit. More documents, Bigger payouts!
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
        <button className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg">
          Next
        </button>
      </div>
    </div>
  );

  const ScanUtilityBillScreen = () => (
    <div className="flex-1 overflow-y-auto pb-48 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => setCurrentScreen('my-documents')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Scan Utility Bill</h1>
      </div>

      <div className="px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="text-6xl">📄</div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          When scanning your utility bill, make sure that:
        </h2>

        <ul className="space-y-2 mb-8">
          <li className="flex items-start space-x-2">
            <span className="text-gray-700">•</span>
            <span className="text-gray-700">Well-lit and clear to read</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-gray-700">•</span>
            <span className="text-gray-700">Inside the frame (not clipped)</span>
          </li>
        </ul>

        <div className="bg-blue-50 rounded-2xl p-4 mb-8 flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Zap className="text-white" size={20} />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Upload a utility bill under your or your fathers name to complete your account information.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
        <button className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2">
          <Camera size={24} />
          <span>Scan Utility Bill</span>
        </button>
      </div>
    </div>
  );

  // Language Selection Screen
  const LanguageScreen = () => (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => setCurrentScreen('profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('language')}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 py-6">
          <p className="text-gray-600 mb-6">{t('chooseLanguage')}</p>

          <div className="space-y-3">
            {/* English */}
            <button
              onClick={() => {
                setLanguage('en');
                setCurrentScreen('profile');
              }}
              className={`w-full bg-white rounded-3xl p-5 shadow-sm border-2 transition ${
                language === 'en' ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🇬🇧</div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg">English</h3>
                    <p className="text-gray-500 text-sm">English (United States)</p>
                  </div>
                </div>
                {language === 'en' && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={16} />
                  </div>
                )}
              </div>
            </button>

            {/* French */}
            <button
              onClick={() => {
                setLanguage('fr');
                setCurrentScreen('profile');
              }}
              className={`w-full bg-white rounded-3xl p-5 shadow-sm border-2 transition ${
                language === 'fr' ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🇫🇷</div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg">Français</h3>
                    <p className="text-gray-500 text-sm">French (France)</p>
                  </div>
                </div>
                {language === 'fr' && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={16} />
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 rounded-3xl p-5 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Globe className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{t('languageChange')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('languageChangeDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Manage Addresses Screen
  const ManageAddressesScreen = () => {
    const [addresses, setAddresses] = React.useState([
      {
        id: 1,
        type: 'home',
        label: 'Home',
        address: '123 Avenue de la Paix',
        city: 'Brazzaville',
        country: 'Congo-Brazzaville',
        postalCode: 'BP 2025',
        isDefault: true
      },
      {
        id: 2,
        type: 'work',
        label: 'Work',
        address: '45 Boulevard du 28 Novembre',
        city: 'Brazzaville',
        country: 'Congo-Brazzaville',
        postalCode: 'BP 3041',
        isDefault: false
      }
    ]);
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [editingAddress, setEditingAddress] = React.useState(null);
    const [addressType, setAddressType] = React.useState('home');

    const handleDeleteAddress = (id) => {
      if (confirm('Delete this address?')) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    };

    const handleSetDefault = (id) => {
      setAddresses(addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      })));
    };

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('profile')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Manage Addresses</h1>
          <button onClick={() => {
            setEditingAddress(null);
            setAddressType('home');
            setShowAddForm(true);
          }}>
            <PlusCircle className="text-blue-600" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {!showAddForm ? (
            <div className="px-6 py-6">
              {/* Saved Addresses */}
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">Saved Addresses ({addresses.length})</h3>
                  {addresses.map(address => (
                    <div key={address.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            address.type === 'home' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {address.type === 'home' ? (
                              <Home className="text-blue-600" size={24} />
                            ) : (
                              <Building className="text-purple-600" size={24} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900">{address.label}</h4>
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-bold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{address.type === 'home' ? 'Home Address' : 'Work Address'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mb-3">
                        <p className="text-gray-900 font-medium mb-1">{address.address}</p>
                        <p className="text-gray-600 text-sm">{address.city}, {address.postalCode}</p>
                        <p className="text-gray-600 text-sm">{address.country}</p>
                      </div>

                      <div className="flex space-x-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl font-semibold text-sm"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingAddress(address);
                            setAddressType(address.type);
                            setShowAddForm(true);
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-900 font-bold text-xl mb-2">No Saved Addresses</h3>
                  <p className="text-gray-500 mb-6">Add your first address for faster checkout</p>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressType('home');
                      setShowAddForm(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold inline-flex items-center space-x-2"
                  >
                    <PlusCircle size={20} />
                    <span>Add Address</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Add/Edit Address Form */
            <div className="px-6 py-6">
              <h3 className="font-bold text-gray-900 text-lg mb-6">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>

              <div className="space-y-4">
                {/* Address Type */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Address Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setAddressType('home')}
                      className={`py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 border-2 transition ${
                        addressType === 'home' 
                          ? 'bg-blue-100 border-blue-600 text-blue-600' 
                          : 'bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      <Home size={20} />
                      <span>Home</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAddressType('work')}
                      className={`py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 border-2 transition ${
                        addressType === 'work' 
                          ? 'bg-purple-100 border-purple-600 text-purple-600' 
                          : 'bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      <Building size={20} />
                      <span>Work</span>
                    </button>
                  </div>
                </div>

                {/* Label */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Label</label>
                  <input
                    type="text"
                    placeholder="e.g., Home, Office, Parents' House"
                    value={editingAddress?.label || (addressType === 'home' ? 'Home' : 'Work')}
                    onChange={(e) => {
                      if (editingAddress) {
                        setEditingAddress({...editingAddress, label: e.target.value});
                      }
                    }}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* HOME ADDRESS FORM */}
                {addressType === 'home' && (
                  <>
                    {/* Street Address */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Avenue de la Paix"
                        defaultValue={editingAddress?.address}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Neighborhood */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Neighborhood (Quartier)</label>
                      <input
                        type="text"
                        placeholder="e.g., Poto-Poto, Bacongo, Moungali"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">City</label>
                      <select
                        defaultValue={editingAddress?.city || 'Brazzaville'}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Brazzaville">Brazzaville</option>
                        <option value="Pointe-Noire">Pointe-Noire</option>
                        <option value="Dolisie">Dolisie</option>
                        <option value="Nkayi">Nkayi</option>
                        <option value="Ouesso">Ouesso</option>
                      </select>
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Postal Code (BP)</label>
                      <input
                        type="text"
                        placeholder="BP 2025"
                        defaultValue={editingAddress?.postalCode}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Additional Details */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Additional Details (Optional)</label>
                      <textarea
                        placeholder="e.g., Near the market, blue gate, 2nd floor"
                        rows={2}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* WORK ADDRESS FORM */}
                {addressType === 'work' && (
                  <>
                    {/* Company Name */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Total Energies, Airtel Congo"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Department (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., Finance, HR, IT"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Office Address */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Office Address</label>
                      <input
                        type="text"
                        placeholder="45 Boulevard du 28 Novembre"
                        defaultValue={editingAddress?.address}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Building/Floor */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Building / Floor (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., Building A, 3rd Floor, Suite 205"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">City</label>
                      <select
                        defaultValue={editingAddress?.city || 'Brazzaville'}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Brazzaville">Brazzaville</option>
                        <option value="Pointe-Noire">Pointe-Noire</option>
                        <option value="Dolisie">Dolisie</option>
                        <option value="Nkayi">Nkayi</option>
                        <option value="Ouesso">Ouesso</option>
                      </select>
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Postal Code (BP)</label>
                      <input
                        type="text"
                        placeholder="BP 3041"
                        defaultValue={editingAddress?.postalCode}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Country (Common for both) */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Country</label>
                  <input
                    type="text"
                    value="Congo-Brazzaville"
                    disabled
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Set as Default */}
                <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="default-address"
                    defaultChecked={editingAddress?.isDefault}
                    className="w-5 h-5 text-blue-600"
                  />
                  <label htmlFor="default-address" className="text-gray-900 font-semibold">
                    Set as default address
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    setAddressType('home');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-full font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    setAddressType('home');
                    // TODO: Save address logic
                  }}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-full font-bold"
                >
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SigningRequestsScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => setCurrentScreen('profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Signing requests</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Search className="text-blue-600" size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
          You have no signing requests yet
        </h2>
        <p className="text-gray-500 text-center">
          Once you receive a request to sign a contract or an insurance note, details will appear here.
        </p>
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
              <button onClick={() => setCurrentScreen('home')}>
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

  const TransactionHistoryScreen = () => {
    const filteredTransactions = transactionFilter === 'all'
      ? transactions
      : transactions.filter(t => t.type === transactionFilter);

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
            <button onClick={() => setCurrentScreen('payment')}>
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
                          setCurrentScreen('transaction-details');
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
          <button onClick={() => setCurrentScreen('transaction-history')}>
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
            <button onClick={() => setCurrentScreen('home')}>
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
                  setCurrentScreen('transaction-history');
                }}
                className="bg-blue-50 rounded-xl p-4 text-left hover:bg-blue-100 transition"
              >
                <FileText className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">View Transactions</p>
              </button>
              
              <button 
                onClick={() => {
                  setCurrentScreen('circles');
                  setCurrentTab('circles');
                }}
                className="bg-purple-50 rounded-xl p-4 text-left hover:bg-purple-100 transition"
              >
                <Users className="text-purple-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">My Circles</p>
              </button>
              
              <button 
                onClick={() => {
                  setCurrentScreen('join');
                  setCurrentTab('join');
                }}
                className="bg-green-50 rounded-xl p-4 text-left hover:bg-green-100 transition"
              >
                <PlusCircle className="text-green-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Join Group</p>
              </button>
              
              <button 
                onClick={() => {
                  setCurrentScreen('payment');
                  setCurrentTab('payment');
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

  const GroupChatScreen = () => {
    if (!selectedLikeLemba) return null;

    const messages = groupChats[selectedLikeLemba.name] || [];
    const memberCount = selectedLikeLemba.currentMembers || selectedLikeLemba.totalMembers || 0;

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
               date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
    };

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentScreen('likelemba-details')}>
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{selectedLikeLemba.name}</h1>
              <p className="text-sm text-gray-500">
                {selectedLikeLemba.currentMembers || 1} / {selectedLikeLemba.totalMembers || memberCount} members
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-64 space-y-4">
          {messages.map((msg, index) => {
            // Check if we need to show date separator
            const showDateSeparator = index === 0 || 
              new Date(messages[index - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

            return (
              <div key={msg.id}>
                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {new Date(msg.timestamp).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                )}

                {/* System Message */}
                {msg.type === 'system' && (
                  <div className="flex justify-center">
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl text-sm max-w-xs text-center">
                      {msg.message}
                    </div>
                  </div>
                )}

                {/* Notification Message */}
                {msg.type === 'notification' && (
                  <div className="flex justify-center">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-2xl text-sm max-w-xs text-center">
                      {msg.message}
                    </div>
                  </div>
                )}

                {/* Regular Message */}
                {msg.type === 'message' && (
                  <div className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${msg.isMe ? '' : 'flex items-end space-x-2'}`}>
                      {/* Avatar for other users */}
                      {!msg.isMe && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                          <span className="text-sm">👤</span>
                        </div>
                      )}

                      <div>
                        {/* Sender name for other users */}
                        {!msg.isMe && (
                          <p className="text-xs text-gray-600 ml-2 mb-1">{msg.sender}</p>
                        )}

                        {/* Message bubble */}
                        <div className={`rounded-2xl px-4 py-2 ${
                          msg.isMe 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>

                        {/* Timestamp */}
                        <p className={`text-xs text-gray-500 mt-1 ${msg.isMe ? 'text-right' : 'ml-2'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-20 left-0 right-0 bg-white px-4 py-3 border-t border-gray-200 max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Smile size={24} />
            </button>
            
            <input
              ref={chatInputRef}
              type="text"
              defaultValue=""
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const message = e.target.value;
                  if (message.trim()) {
                    const newMessage = {
                      id: Date.now(),
                      sender: 'You',
                      message: message,
                      timestamp: new Date().toISOString(),
                      isMe: true,
                      type: 'message'
                    };
                    setGroupChats(prev => ({
                      ...prev,
                      [selectedLikeLemba.name]: [...(prev[selectedLikeLemba.name] || []), newMessage]
                    }));
                    e.target.value = '';
                  }
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none text-gray-900 placeholder-gray-500"
            />

            <button 
              onClick={() => {
                const message = chatInputRef.current?.value;
                if (message && message.trim()) {
                  const newMessage = {
                    id: Date.now(),
                    sender: 'You',
                    message: message,
                    timestamp: new Date().toISOString(),
                    isMe: true,
                    type: 'message'
                  };
                  setGroupChats(prev => ({
                    ...prev,
                    [selectedLikeLemba.name]: [...(prev[selectedLikeLemba.name] || []), newMessage]
                  }));
                  chatInputRef.current.value = '';
                }
              }}
              className="p-3 rounded-full bg-blue-600 text-white"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CustomerSupportScreen = () => {
    const openTickets = supportTickets.filter(t => t.status === 'open' || t.status === 'in-progress');
    const resolvedTickets = supportTickets.filter(t => t.status === 'resolved');

    const getStatusColor = (status) => {
      switch(status) {
        case 'open': return 'bg-blue-100 text-blue-700';
        case 'in-progress': return 'bg-orange-100 text-orange-700';
        case 'resolved': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const getPriorityColor = (priority) => {
      switch(priority) {
        case 'high': return 'bg-red-100 text-red-700';
        case 'medium': return 'bg-yellow-100 text-yellow-700';
        case 'low': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentScreen('profile')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Customer Support</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Need Help?</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => setCurrentScreen('live-chat')}
                className="bg-blue-50 rounded-xl p-4 text-left hover:bg-blue-100 transition"
              >
                <MessageCircle className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">Live Chat</p>
                <p className="text-xs text-gray-600 mt-1">Chat with us now</p>
              </button>
              
              <button className="bg-green-50 rounded-xl p-4 text-left hover:bg-green-100 transition">
                <span className="text-2xl mb-2 block">📞</span>
                <p className="font-semibold text-gray-900 text-sm">Call Us</p>
                <p className="text-xs text-gray-600 mt-1">+242 064 663 469</p>
              </button>
              
              <button 
                onClick={() => setCurrentScreen('faq')}
                className="bg-purple-50 rounded-xl p-4 text-left hover:bg-purple-100 transition"
              >
                <HelpCircle className="text-purple-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">FAQ</p>
                <p className="text-xs text-gray-600 mt-1">Browse help topics</p>
              </button>
              
              <button 
                onClick={() => setCurrentScreen('new-ticket')}
                className="bg-orange-50 rounded-xl p-4 text-left hover:bg-orange-100 transition"
              >
                <FileText className="text-orange-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">New Ticket</p>
                <p className="text-xs text-gray-600 mt-1">Submit a request</p>
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Support Hours:</span> Monday - Friday, 8:00 AM - 6:00 PM WAT
              </p>
            </div>
          </div>

          {/* Open Tickets */}
          {openTickets.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 text-lg mb-3">Active Tickets</h3>
              <div className="space-y-3">
                {openTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setCurrentScreen('support-ticket');
                    }}
                    className="bg-white rounded-2xl p-4 border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600">{ticket.category}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTime(ticket.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolved Tickets */}
          {resolvedTickets.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Resolved Tickets</h3>
              <div className="space-y-3">
                {resolvedTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setCurrentScreen('support-ticket');
                    }}
                    className="bg-white rounded-2xl p-4 border-2 border-gray-200 cursor-pointer hover:border-green-300 transition opacity-75"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600">{ticket.category}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(ticket.status)}`}>
                        Resolved
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Resolved {formatTime(ticket.resolvedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {supportTickets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="text-gray-400" size={48} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No support tickets yet</h2>
              <p className="text-gray-500 text-center mb-6">
                Need help? Create a new ticket or chat with us!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SupportTicketScreen = () => {
    if (!selectedTicket) return null;

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-3">
            <button onClick={() => setCurrentScreen('customer-support')}>
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
              selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-700' :
              selectedTicket.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
              'bg-green-100 text-green-700'
            }`}>
              {selectedTicket.status === 'in-progress' ? 'In Progress' : 
               selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-600">{selectedTicket.category}</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 space-y-4">
          {selectedTicket.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs ${msg.isMe ? '' : 'flex items-start space-x-2'}`}>
                {/* Avatar for support agent */}
                {!msg.isMe && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">S</span>
                  </div>
                )}

                <div>
                  {/* Sender name */}
                  {!msg.isMe && (
                    <p className="text-xs text-gray-600 ml-2 mb-1 font-semibold">{msg.sender}</p>
                  )}

                  {/* Message bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.isMe 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-white text-gray-900 rounded-bl-sm border-2 border-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                  </div>

                  {/* Timestamp */}
                  <p className={`text-xs text-gray-500 mt-1 ${msg.isMe ? 'text-right' : 'ml-2'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        {selectedTicket.status !== 'resolved' && (
          <div className="fixed bottom-20 left-0 right-0 bg-white px-4 py-3 border-t border-gray-200 max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <input
                ref={supportTicketInputRef}
                type="text"
                defaultValue=""
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const message = e.target.value;
                    if (message.trim()) {
                      const newMessage = {
                        id: Date.now(),
                        sender: 'You',
                        message: message,
                        timestamp: new Date().toISOString(),
                        isMe: true
                      };
                      setSupportTickets(prev => prev.map(ticket => {
                        if (ticket.id === selectedTicket.id) {
                          return {
                            ...ticket,
                            messages: [...ticket.messages, newMessage]
                          };
                        }
                        return ticket;
                      }));
                      e.target.value = '';
                    }
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none text-gray-900 placeholder-gray-500"
              />

              <button 
                onClick={() => {
                  const message = supportTicketInputRef.current?.value;
                  if (message && message.trim()) {
                    const newMessage = {
                      id: Date.now(),
                      sender: 'You',
                      message: message,
                      timestamp: new Date().toISOString(),
                      isMe: true
                    };
                    setSupportTickets(prev => prev.map(ticket => {
                      if (ticket.id === selectedTicket.id) {
                        return {
                          ...ticket,
                          messages: [...ticket.messages, newMessage]
                        };
                      }
                      return ticket;
                    }));
                    supportTicketInputRef.current.value = '';
                  }
                }}
                className="p-3 rounded-full bg-blue-600 text-white"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}

        {selectedTicket.status === 'resolved' && (
          <div className="fixed bottom-20 left-0 right-0 bg-green-50 px-6 py-4 border-t border-green-200 max-w-md mx-auto">
            <p className="text-center text-green-700 font-semibold">
              ✅ This ticket has been resolved
            </p>
          </div>
        )}
      </div>
    );
  };

  const SecuritySettingsScreen = () => {
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentScreen('profile')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Security Settings</h1>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Biometrics */}
          <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Biometric Login</h3>
                  <p className="text-sm text-gray-600">Use Face ID or Fingerprint</p>
                </div>
              </div>
              <button 
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`w-14 h-8 rounded-full transition ${
                  biometricsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transition transform ${
                  biometricsEnabled ? 'translate-x-7' : 'translate-x-1'
                } mt-1`}></div>
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {biometricsEnabled 
                ? '✅ Biometric authentication is enabled for faster and more secure login.' 
                : '⚠️ Enable biometric authentication for enhanced security. Requires ID verification.'}
            </p>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Lock className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Two-Factor Auth</h3>
                  <p className="text-sm text-gray-600">Extra layer of security</p>
                </div>
              </div>
              <button 
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-14 h-8 rounded-full transition ${
                  twoFactorEnabled ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transition transform ${
                  twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                } mt-1`}></div>
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {twoFactorEnabled 
                ? '✅ SMS verification code required for login and transactions.' 
                : 'Get a verification code via SMS for added security.'}
            </p>
          </div>

          {/* Login Alerts */}
          <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Bell className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Login Alerts</h3>
                  <p className="text-sm text-gray-600">Get notified of new logins</p>
                </div>
              </div>
              <button 
                onClick={() => setLoginAlerts(!loginAlerts)}
                className={`w-14 h-8 rounded-full transition ${
                  loginAlerts ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transition transform ${
                  loginAlerts ? 'translate-x-7' : 'translate-x-1'
                } mt-1`}></div>
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {loginAlerts 
                ? '✅ You\'ll receive notifications when your account is accessed from a new device.' 
                : 'Stay informed about account access from new devices.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setCurrentScreen('change-passcode')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-500 transition"
            >
              <Lock className="text-blue-600 mb-2" size={24} />
              <p className="font-semibold text-gray-900 text-sm">Change Passcode</p>
            </button>
            
            <button 
              onClick={() => setCurrentScreen('security-logs')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-500 transition"
            >
              <FileText className="text-blue-600 mb-2" size={24} />
              <p className="font-semibold text-gray-900 text-sm">Activity Log</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ChangePasscodeScreen = () => {
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-white">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentScreen('security-settings')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Change Passcode</h1>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-600 mb-8">
            Create a new 4-digit passcode to secure your account
          </p>

          {/* Current Passcode */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Passcode</label>
            <input 
              type="password"
              maxLength="4"
              placeholder="••••"
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-2xl tracking-widest"
            />
          </div>

          {/* New Passcode */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">New Passcode</label>
            <input 
              type="password"
              maxLength="4"
              placeholder="••••"
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-2xl tracking-widest"
            />
          </div>

          {/* Confirm Passcode */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Confirm New Passcode</label>
            <input 
              type="password"
              maxLength="4"
              placeholder="••••"
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-2xl tracking-widest"
            />
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">Security Tips</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Don't use obvious patterns (1234, 0000)</li>
              <li>• Avoid using birthdays or phone numbers</li>
              <li>• Change your passcode regularly</li>
              <li>• Never share your passcode with anyone</li>
            </ul>
          </div>

          <button className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg">
            Update Passcode
          </button>
        </div>
      </div>
    );
  };

  const SecurityLogsScreen = () => {
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentScreen('security-settings')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Activity Log</h1>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-600 mb-6">
            Review recent activity on your account
          </p>

          <div className="space-y-3">
            {securityLogs.map((log) => (
              <div 
                key={log.id}
                className={`bg-white rounded-2xl p-4 border-2 ${
                  log.status === 'failed' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      log.status === 'success' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {log.action === 'Login' && <span className="text-xl">🔓</span>}
                      {log.action === 'Failed Login' && <span className="text-xl">🔒</span>}
                      {log.action === 'Payment' && <span className="text-xl">💰</span>}
                      {log.action === 'Password Change' && <span className="text-xl">🔑</span>}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{log.action}</h3>
                      <p className="text-xs text-gray-600">{formatTime(log.timestamp)}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    log.status === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {log.status === 'success' ? 'Success' : 'Failed'}
                  </span>
                </div>

                <div className="ml-13 space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="text-gray-400">📱</span>
                    <span>{log.device}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="text-gray-400">📍</span>
                    <span>{log.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="text-gray-400">🌐</span>
                    <span>{log.ip}</span>
                  </div>
                </div>

                {log.status === 'failed' && (
                  <div className="mt-3 p-3 bg-red-100 rounded-xl">
                    <p className="text-sm text-red-700 font-semibold">
                      ⚠️ Suspicious activity detected. If this wasn't you, please change your password immediately.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-2xl p-4 mt-6 border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Security Tip:</span> Regularly review your activity log. If you notice any suspicious activity, change your password immediately and contact support.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const LiveChatScreen = () => {
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentScreen('customer-support')}>
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Live Chat</h1>
              <p className="text-sm text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                Online - We'll respond shortly
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-40 space-y-4">
          {liveChatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs ${msg.isMe ? '' : 'flex items-start space-x-2'}`}>
                {/* Avatar for support */}
                {!msg.isMe && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.type === 'bot' ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    <span className="text-white text-sm font-bold">
                      {msg.type === 'bot' ? '🤖' : 'S'}
                    </span>
                  </div>
                )}

                <div>
                  {/* Sender name */}
                  {!msg.isMe && (
                    <p className="text-xs text-gray-600 ml-2 mb-1 font-semibold">{msg.sender}</p>
                  )}

                  {/* Message bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.isMe 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : msg.type === 'bot'
                      ? 'bg-purple-100 text-purple-900 rounded-bl-sm border-2 border-purple-200'
                      : 'bg-white text-gray-900 rounded-bl-sm border-2 border-gray-200'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>

                  {/* Timestamp */}
                  <p className={`text-xs text-gray-500 mt-1 ${msg.isMe ? 'text-right' : 'ml-2'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-20 left-0 right-0 bg-white px-4 py-3 border-t border-gray-200 max-w-md mx-auto">
          <p className="text-xs text-gray-500 italic mb-2">Support team is available 24/7</p>
          <div className="flex items-center space-x-2">
            <input
              ref={liveChatInputRef}
              type="text"
              defaultValue=""
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const message = e.target.value;
                  if (message.trim()) {
                    const newMessage = {
                      id: Date.now(),
                      sender: 'You',
                      message: message,
                      timestamp: new Date().toISOString(),
                      isMe: true,
                      type: 'message'
                    };
                    setLiveChatMessages(prev => [...prev, newMessage]);
                    e.target.value = '';
                    
                    // Simulate agent response
                    setTimeout(() => {
                      const agentResponse = {
                        id: Date.now() + 1,
                        sender: 'Support Agent',
                        message: 'Thank you for your message! A support agent will respond shortly.',
                        timestamp: new Date().toISOString(),
                        isMe: false,
                        type: 'message'
                      };
                      setLiveChatMessages(prev => [...prev, agentResponse]);
                    }, 1500);
                  }
                }
              }}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none text-gray-900 placeholder-gray-500"
            />

            <button 
              onClick={() => {
                const message = liveChatInputRef.current?.value;
                if (message && message.trim()) {
                  const newMessage = {
                    id: Date.now(),
                    sender: 'You',
                    message: message,
                    timestamp: new Date().toISOString(),
                    isMe: true,
                    type: 'message'
                  };
                  setLiveChatMessages(prev => [...prev, newMessage]);
                  liveChatInputRef.current.value = '';
                  
                  // Simulate agent response
                  setTimeout(() => {
                    const agentResponse = {
                      id: Date.now() + 1,
                      sender: 'Support Agent',
                      message: 'Thank you for your message! A support agent will respond shortly.',
                      timestamp: new Date().toISOString(),
                      isMe: false,
                      type: 'message'
                    };
                    setLiveChatMessages(prev => [...prev, agentResponse]);
                  }, 1500);
                }
              }}
              className="p-3 rounded-full bg-blue-600 text-white"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FAQScreen = () => {
    const faqs = [
      {
        category: 'Getting Started',
        icon: '🚀',
        questions: [
          {
            q: 'How do I create a Likelemba group?',
            a: 'Go to the Join tab, tap "Create Likelemba", enter group details (name, amount, duration, members), and share the invite code with your friends.'
          },
          {
            q: 'How do I join an existing group?',
            a: 'You can join a group by entering the invite code in the "Join with Code" section, or by selecting from available public circles.'
          }
        ]
      },
      {
        category: 'Payments',
        icon: '💰',
        questions: [
          {
            q: 'When are payments due?',
            a: 'Monthly payments are due on the same day each month. You\'ll receive a notification 3 days before the due date.'
          },
          {
            q: 'What payment methods are accepted?',
            a: 'We accept Mobile Money (Airtel Money, MTN Money), bank transfers, and debit cards.'
          },
          {
            q: 'What happens if I miss a payment?',
            a: 'You have a 3-day grace period. After that, a late fee of 5% may be applied. Contact support if you\'re having difficulties.'
          }
        ]
      },
      {
        category: 'Payouts',
        icon: '🎉',
        questions: [
          {
            q: 'How do payouts work?',
            a: 'Payouts are distributed monthly in rotation. Each member receives the full pot when it\'s their turn, based on the payout schedule.'
          },
          {
            q: 'Can I choose my payout month?',
            a: 'When creating a group, you can select your preferred slot. In existing groups, slots are assigned on a first-come, first-served basis.'
          }
        ]
      },
      {
        category: 'Security',
        icon: '🔒',
        questions: [
          {
            q: 'Is my money safe?',
            a: 'Yes! All funds are held in secure escrow accounts. We use bank-level encryption and are fully licensed by Congo financial authorities.'
          },
          {
            q: 'How do I enable two-factor authentication?',
            a: 'Go to Profile > Security > Security Settings and enable Two-Factor Auth. You\'ll receive SMS codes for login and transactions.'
          }
        ]
      },
      {
        category: 'Account',
        icon: '👤',
        questions: [
          {
            q: 'How do I verify my account?',
            a: 'Upload your National ID in Profile > My Documents. Verification takes up to 14 business days.'
          },
          {
            q: 'Can I have multiple accounts?',
            a: 'Each person can have one account. However, you can join multiple Likelemba groups with a single account.'
          }
        ]
      }
    ];

    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <button onClick={() => setCurrentScreen('customer-support')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">FAQ</h1>
          </div>

          {/* Search */}
          <div className="bg-gray-100 rounded-xl p-3 flex items-center space-x-3">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="font-bold text-gray-900 text-lg">{category.category}</h3>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => (
                  <details key={qIndex} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                    <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 flex items-center justify-between">
                      <span>{faq.q}</span>
                      <ChevronRight className="text-gray-400 transform transition-transform" size={20} />
                    </summary>
                    <div className="px-4 pb-4 pt-2 text-gray-700 text-sm border-t border-gray-100">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Still need help? */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Still need help?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <button 
              onClick={() => setCurrentScreen('live-chat')}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold inline-flex items-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>Chat with Support</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NewTicketScreen = () => {
    const categories = [
      'Payment Issue',
      'Account Issue',
      'Technical Problem',
      'General Question',
      'Feature Request',
      'Other'
    ];

    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-white">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentScreen('customer-support')}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">New Support Ticket</h1>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-600 mb-6">
            Submit a support ticket and our team will get back to you within 24 hours.
          </p>

          {/* Subject */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Subject *</label>
            <input 
              ref={newTicketSubjectRef}
              type="text"
              defaultValue=""
              placeholder="Brief description of your issue"
              className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Category *</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewTicketCategory(cat)}
                  className={`p-4 rounded-xl border-2 font-semibold text-sm transition ${
                    newTicketCategory === cat
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Description *</label>
            <textarea
              ref={newTicketMessageRef}
              defaultValue=""
              placeholder="Please describe your issue in detail..."
              rows="6"
              className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">💡 Tips for faster resolution</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Be as specific as possible about the issue</li>
              <li>• Include any error messages you see</li>
              <li>• Mention steps you've already tried</li>
              <li>• Attach screenshots if relevant (coming soon)</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button 
            onClick={() => {
              const subject = newTicketSubjectRef.current?.value;
              const message = newTicketMessageRef.current?.value;
              
              if (!subject || !subject.trim() || !newTicketCategory || !message || !message.trim()) {
                alert('Please fill in all fields');
                return;
              }

              const newTicket = {
                id: Date.now(),
                subject: subject,
                category: newTicketCategory,
                status: 'open',
                priority: 'medium',
                createdAt: new Date().toISOString(),
                messages: [
                  {
                    id: 1,
                    sender: 'You',
                    message: message,
                    timestamp: new Date().toISOString(),
                    isMe: true
                  }
                ]
              };

              setSupportTickets(prev => [newTicket, ...prev]);
              newTicketSubjectRef.current.value = '';
              newTicketMessageRef.current.value = '';
              setNewTicketCategory('');
              setCurrentScreen('customer-support');
            }}
            className="w-full py-4 rounded-full font-bold text-lg bg-blue-600 text-white"
          >
            Submit Ticket
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Our team typically responds within 24 hours
          </p>
        </div>
      </div>
    );
  };

  const WhatsHotScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => setCurrentScreen('home')}>
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
                onClick={() => setCurrentScreen('referral')}
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
                onClick={() => setCurrentScreen('join')}
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

  const PayoutEligibilityScreen = () => {
    const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(null);

    return (
      <div className="flex-1 overflow-y-auto pb-32 bg-white">
        <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('payment')}>
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
              onClick={() => setCurrentScreen('scan-national-id')}
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
              onClick={() => setCurrentScreen('payout-method')}
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
              onClick={() => setCurrentScreen('signing-requests')}
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
          <button onClick={() => setCurrentScreen('payment-settings')}>
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
        <button onClick={() => setCurrentScreen('payment')}>
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
        <button onClick={() => setCurrentScreen('payment')}>
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
        <button onClick={() => setCurrentScreen('payment')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Payment settings</h1>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-4">
          <button 
            onClick={() => setCurrentScreen('payout-method')}
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
            onClick={() => setCurrentScreen('saved-cards')}
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
        <button onClick={() => setCurrentScreen('payment-settings')}>
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

  const CircleDetailsAmountScreen = () => {
    const handleAmountChange = (value) => {
      const numValue = value.replace(/,/g, '');
      if (numValue === '' || (!isNaN(numValue) && parseInt(numValue) <= 1200000)) {
        setCircleAmount(numValue);
      }
    };

    const formatAmount = (value) => {
      if (!value) return '0';
      return parseInt(value).toLocaleString();
    };

    const canProceed = circleAmount && parseInt(circleAmount) >= 9000;

    return (
      <div className="flex-1 overflow-y-auto pb-48 bg-white">
        <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('join')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Circle details</h1>
        </div>

        <div className="px-6 py-4">
          <div className="flex space-x-2 mb-6">
            <div className="h-2 flex-1 bg-green-500 rounded-full"></div>
            <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
            <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">How much do you want?</h2>
          <p className="text-gray-600 mb-6">
            Enter amount from <span className="font-bold">9,000 XAF</span> to <span className="font-bold">1,200,000 XAF</span>
          </p>

          <div className="bg-gray-50 rounded-2xl p-8 mb-6">
            <input
              ref={circleAmountRef}
              type="text"
              defaultValue=""
              onBlur={(e) => {
                const value = e.target.value.replace(/,/g, '');
                handleAmountChange(value);
              }}
              placeholder="0"
              className="w-full text-center text-5xl font-bold text-gray-900 bg-transparent outline-none"
            />
            <p className="text-center text-3xl text-gray-500 mt-2">XAF</p>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button
            disabled={!canProceed}
            onClick={() => canProceed && setCurrentScreen('circle-details-duration')}
            className={`w-full py-4 rounded-full font-bold text-lg ${
              canProceed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const CircleDetailsDurationScreen = () => {
    const durations = [
      { months: 6, monthly: Math.ceil(parseInt(circleAmount || 9000) / 6) },
      { months: 10, monthly: Math.ceil(parseInt(circleAmount || 9000) / 10) },
      { months: 12, monthly: Math.ceil(parseInt(circleAmount || 9000) / 12) }
    ];

    return (
      <div className="flex-1 overflow-y-auto pb-48 bg-white">
        <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('circle-details-amount')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Circle details</h1>
        </div>

        <div className="px-6 py-6">
          <div className="flex space-x-2 mb-6">
            <div className="h-2 flex-1 bg-green-500 rounded-full"></div>
            <div className="h-2 flex-1 bg-green-500 rounded-full"></div>
            <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">How much do you want?</h2>
          <p className="text-gray-600 mb-6">
            Enter amount from <span className="font-bold">9,000 XAF</span> to <span className="font-bold">1,200,000 XAF</span>
          </p>

          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <p className="text-center text-5xl font-bold text-gray-900">
              {parseInt(circleAmount || 0).toLocaleString()}
            </p>
            <p className="text-center text-3xl text-gray-500 mt-2">XAF</p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Duration</h3>

          <div className="grid grid-cols-3 gap-3">
            {durations.map((duration, index) => (
              <div
                key={index}
                onClick={() => setCircleDuration(duration)}
                className={`rounded-2xl p-4 cursor-pointer transition-all border-2 ${
                  circleDuration?.months === duration.months
                    ? 'bg-blue-50 border-blue-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="text-center">
                  <p className={`text-5xl font-bold mb-2 ${
                    circleDuration?.months === duration.months ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {duration.months}
                  </p>
                  <p className={`text-sm mb-4 ${
                    circleDuration?.months === duration.months ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Months
                  </p>
                  <div className={`border-t pt-3 ${
                    circleDuration?.months === duration.months ? 'border-blue-300' : 'border-gray-200'
                  }`}>
                    <p className={`text-2xl font-bold ${
                      circleDuration?.months === duration.months ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {duration.monthly.toLocaleString()}
                    </p>
                    <p className={`text-xs mt-1 ${
                      circleDuration?.months === duration.months ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      EGP/Month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button
            disabled={!circleDuration}
            onClick={() => circleDuration && setCurrentScreen('circle-slot')}
            className={`w-full py-4 rounded-full font-bold text-lg ${
              circleDuration ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  const CircleSlotScreen = () => {
          const slots = {
      first: [
        { position: '1st', month: 'Feb 2026', fees: 'XAF 720 (8%)', status: 'locked', badge: null },
        { position: '2nd', month: 'Mar 2026', fees: 'XAF 630 (7%)', status: 'available', badge: 'High Demand' }
      ],
      middle: [
        { position: '3rd', month: 'Apr 2026', fees: 'XAF 360 (4%)', status: 'available', badge: null },
        { position: '4th', month: 'May 2026', fees: null, status: 'booked', badge: 'Zero Fees' }
      ],
      last: [
        { position: '5th', month: 'Jun 2026', fees: null, status: 'available', badge: 'XAF 225 Discount' },
        { position: '6th', month: 'Jul 2026', fees: null, status: 'booked', badge: 'XAF 360 Discount' }
      ]
    };

    const currentSlots = slots[slotTab];

    return (
      <div className="flex-1 overflow-y-auto pb-32 bg-white">
        <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('circle-details-duration')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Circle slot</h1>
        </div>

        <div className="px-6 py-6">
          <div className="flex space-x-2 mb-6">
            <div className="h-2 flex-1 bg-green-500 rounded-full"></div>
            <div className="h-2 flex-1 bg-green-500 rounded-full"></div>
            <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your payout month:</h2>
          <p className="text-gray-600 mb-6">
            Payouts are received <span className="font-bold">between 15th and 30th</span> of the payout month
          </p>

          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button
              onClick={() => setSlotTab('first')}
              className={`flex-1 py-3 rounded-full font-semibold transition text-sm ${
                slotTab === 'first' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              First Slots
            </button>
            <button
              onClick={() => setSlotTab('middle')}
              className={`flex-1 py-3 rounded-full font-semibold transition text-sm ${
                slotTab === 'middle' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Middle Slots
            </button>
            <button
              onClick={() => setSlotTab('last')}
              className={`flex-1 py-3 rounded-full font-semibold transition text-sm ${
                slotTab === 'last' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Last Slots
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {currentSlots.map((slot, index) => (
              <div
                key={index}
                onClick={() => slot.status === 'available' && setSelectedSlot(slot)}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  slot.status === 'locked'
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : slot.status === 'booked'
                    ? 'bg-gray-50 border-gray-200'
                    : selectedSlot?.position === slot.position
                    ? 'bg-blue-50 border-blue-600'
                    : 'bg-white border-gray-200 cursor-pointer hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  {slot.badge && (
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      slot.badge === 'High Demand'
                        ? 'bg-green-100 text-green-700'
                        : slot.badge === 'Zero Fees'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {slot.badge}
                    </span>
                  )}
                  {slot.status === 'locked' && (
                    <Lock className="text-gray-400" size={20} />
                  )}
                  {slot.status === 'available' && (
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedSlot?.position === slot.position
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedSlot?.position === slot.position && (
                        <Check className="text-white" size={20} />
                      )}
                    </div>
                  )}
                  {slot.status === 'booked' && (
                    <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{slot.position}</h3>
                <p className="text-xl font-bold text-gray-900 mb-2">{slot.month}</p>
                {slot.fees && (
                  <p className="text-blue-600 text-sm font-semibold">{slot.fees} Fees</p>
                )}
                {slot.status === 'locked' && (
                  <button className="text-blue-600 text-sm font-semibold underline mt-2">
                    Why is this locked?
                  </button>
                )}
                {slot.status === 'booked' && (
                  <p className="text-gray-500 text-sm mt-2 flex items-center">
                    <Check size={16} className="mr-1" /> Fully booked
                  </p>
                )}
              </div>
            ))}
          </div>

          <button className="text-blue-600 font-bold mb-6 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            Learn more about circle fees and discounts
          </button>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Payout</p>
              <p className="text-xl font-bold text-gray-900">
                {parseInt(circleAmount || 9000).toLocaleString()} XAF
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Installment</p>
              <p className="text-xl font-bold text-gray-900">
                {circleDuration?.monthly.toLocaleString()} XAF
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Duration</p>
              <p className="text-xl font-bold text-gray-900">
                {circleDuration?.months} Months
              </p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button
            disabled={!selectedSlot}
            onClick={() => selectedSlot && setCurrentScreen('payout-method-selection')}
            className={`w-full py-4 rounded-full font-bold text-lg ${
              selectedSlot ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const PayoutMethodSelectionScreen = () => {
    const [selectedMethod, setSelectedMethod] = useState(null);

    return (
      <div className="flex-1 overflow-y-auto pb-32 bg-white">
        <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('circle-slot')}>
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
              onClick={() => {
                setSelectedMethod('digital');
                setSelectedPayoutMethod('digital');
              }}
              className={`bg-white border-2 rounded-2xl p-5 cursor-pointer transition ${
                selectedMethod === 'digital' ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="text-blue-600" size={28} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">Digital Wallets</h3>
                    <p className="text-gray-600 text-sm">Receive your payout on any digital wallet</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'digital' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {selectedMethod === 'digital' && <Check className="text-white" size={16} />}
                </div>
              </div>
            </div>

            {/* Prepaid Card */}
            <div 
              onClick={() => {
                setSelectedMethod('prepaid');
                setSelectedPayoutMethod('prepaid');
              }}
              className={`bg-white border-2 rounded-2xl p-5 cursor-pointer transition ${
                selectedMethod === 'prepaid' ? 'border-blue-600' : 'border-gray-200'
              }`}
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
                    <p className="text-gray-600 text-sm">Card limit is 100,000 EGP</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'prepaid' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {selectedMethod === 'prepaid' && <Check className="text-white" size={16} />}
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div 
              onClick={() => {
                setSelectedMethod('bank');
                setSelectedPayoutMethod('bank');
              }}
              className={`bg-white border-2 rounded-2xl p-5 cursor-pointer transition ${
                selectedMethod === 'bank' ? 'border-blue-600' : 'border-gray-200'
              }`}
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
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'bank' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {selectedMethod === 'bank' && <Check className="text-white" size={16} />}
                </div>
              </div>
            </div>

            {/* Fawry - Disabled */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 opacity-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400 text-3xl">💳</div>
                  <div>
                    <h3 className="font-bold text-gray-400 text-xl">Fawry</h3>
                    <p className="text-gray-400 text-sm">Receive your payout from any of Fawry Plus stores without bank account</p>
                    <p className="text-gray-900 text-sm font-semibold mt-2 flex items-center">
                      Not available <span className="ml-2 text-blue-600">ℹ️</span>
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button 
            disabled={!selectedMethod}
            onClick={() => {
              if (selectedMethod === 'bank') {
                setCurrentScreen('bank-transfer-form');
              } else if (selectedMethod === 'digital') {
                setCurrentScreen('digital-wallet-form');
              } else {
                setCurrentScreen('scan-national-id');
              }
            }}
            className={`w-full py-4 rounded-full font-bold text-lg ${
              selectedMethod ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const BankTransferFormScreen = () => {
    const [transferTab, setTransferTab] = useState('iban');

    return (
      <div className="flex-1 overflow-y-auto pb-48 bg-white">
        <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
          <button onClick={() => setCurrentScreen('payout-method-selection')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Bank transfer</h1>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-600 mb-6">
            Receive your payout via bank transfer directly to your account. Please make sure the beneficiary account is under your name.
          </p>

          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button 
              onClick={() => setTransferTab('iban')}
              className={`flex-1 py-3 rounded-full font-semibold transition ${
                transferTab === 'iban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              IBAN
            </button>
            <button 
              onClick={() => setTransferTab('account')}
              className={`flex-1 py-3 rounded-full font-semibold transition ${
                transferTab === 'account' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Account Number
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Add your bank info</h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Bank Name</label>
              <select className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-500">
                <option>Select your bank</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Account holder name in English</label>
              <input 
                type="text"
                placeholder="Type your full name in English"
                className="w-full border-2 border-gray-200 rounded-xl p-4"
              />
            </div>

            {transferTab === 'iban' ? (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">IBAN</label>
                  <input 
                    type="text"
                    placeholder="EGXXXXXXXXXXXXXXXXXXXXXXX"
                    className="w-full border-2 border-gray-200 rounded-xl p-4"
                  />
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">ℹ</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    IBAN no. is in your bank statement or in the internet banking app
                  </p>
                </div>
              </>
            ) : (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Account number</label>
                <input 
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl p-4"
                />
              </div>
            )}
          </div>

          <div className="bg-red-50 rounded-2xl p-4 flex items-start space-x-3">
            <div className="text-red-500 text-2xl flex-shrink-0">⚠️</div>
            <div>
              <p className="text-red-900 font-bold mb-1">IMPORTANT!</p>
              <p className="text-gray-700 text-sm">
                You are responsible for the information you enter. Kolo Tontine is not accountable for any incorrect data you enter.
              </p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
          <button 
            onClick={() => setCurrentScreen('scan-national-id')}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg mb-3"
          >
            Save
          </button>
          <button 
            onClick={() => setCurrentScreen('scan-national-id')}
            className="w-full bg-gray-100 text-gray-900 py-4 rounded-full font-bold text-lg"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  };

  const PersonalInfoScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => setCurrentScreen('profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Personal info</h1>
        <div className="w-6"></div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6">
          <label className="text-gray-600 text-sm mb-2 block">First Name</label>
          <input 
            ref={firstNameRef}
            type="text"
            defaultValue={firstName}
            onBlur={(e) => setFirstName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-600 text-sm mb-2 block">Last Name</label>
          <input 
            ref={lastNameRef}
            type="text"
            defaultValue={lastName}
            onBlur={(e) => setLastName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-600 text-sm mb-2 block">Phone Number</label>
          <div className="flex space-x-2">
            <div className="border-2 border-gray-200 rounded-xl p-4 flex items-center space-x-2">
              <span className="text-2xl">🇨🇬</span>
              <span className="font-semibold">+242</span>
            </div>
            <input 
              ref={phoneRef}
              type="text"
              defaultValue={phone}
              onBlur={(e) => setPhone(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-600 text-sm mb-2 block">Email</label>
          <div className="relative">
            <input 
              ref={emailRef}
              type="email"
              defaultValue={email}
              onBlur={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-blue-500 rounded-xl p-4 pr-12 text-gray-900 font-medium focus:outline-none"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="text-white" size={16} />
            </div>
          </div>
          <button 
            onClick={() => setShowCorporateModal(true)}
            className="text-blue-600 font-semibold text-sm mt-2 flex items-center"
          >
            Edit your email <span className="ml-1">✏️</span>
          </button>
        </div>

        <button 
          onClick={() => setShowCorporateModal(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-full font-bold mb-3"
        >
          Upgrade to Corporate Account
        </button>

        <button 
          onClick={() => setCurrentScreen('profile')}
          className="w-full bg-gray-100 text-gray-900 py-4 rounded-full font-bold"
        >
          Save
        </button>
      </div>
    </div>
  );

  const CorporateAccountModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Update to corporate account</h2>
            <button onClick={() => {
              setShowCorporateModal(false);
              setCorporateStep(1);
            }}>
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {corporateStep === 1 && (
            <>
              <div className="bg-gray-100 rounded-full w-64 h-64 mx-auto mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-blue-600 rounded-3xl transform rotate-6"></div>
                  <div className="absolute top-4 left-4 bg-green-400 rounded-2xl px-4 py-2 transform -rotate-6">
                    <span className="text-2xl">%</span>
                  </div>
                  <div className="absolute top-8 right-8 bg-white rounded-xl p-3 shadow-lg">
                    <span className="text-2xl">🎺</span>
                    <p className="text-xs font-semibold mt-1">We have sent<br/>your payout</p>
                  </div>
                  <div className="absolute bottom-8 left-8 bg-white rounded-xl p-3 shadow-lg">
                    <p className="text-xs font-bold">March 2024</p>
                    <p className="text-xs text-gray-600">1,800 EGP Fees</p>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="text-5xl">⚡</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-lg">Money<br/>Fellows</div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">Corporate benefits</h3>
              <p className="text-gray-600 mb-6">
                Enjoy corporate benefits with Kolo Tontine, discount on circle fees, first slots and early payout.
              </p>

              <div className="flex justify-center space-x-2 mb-6">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>

              <button 
                onClick={() => setCorporateStep(2)}
                className="w-full bg-blue-600 text-white py-4 rounded-full font-bold flex items-center justify-center"
              >
                <span className="mr-2">→</span>
              </button>
            </>
          )}

          {corporateStep === 2 && (
            <>
              <div className="bg-yellow-100 rounded-full w-64 h-64 mx-auto mb-6 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-6 shadow-lg w-48">
                  <p className="text-xs text-gray-600 mb-2">Work Email</p>
                  <p className="font-semibold mb-4">Ahmed@vodafone.com</p>
                  <p className="text-xs text-gray-500">
                    We will send an OTP to verify your account to enjoy your corporate benefits
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">Use corporate Email</h3>
              <p className="text-gray-600 mb-6">
                Make sure your company <span className="font-bold">is in partnership with Kolo Tontine</span> to unlock your corporate benefits.
              </p>

              <div className="flex justify-center space-x-2 mb-6">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setCorporateStep(1)}
                  className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-full font-bold flex items-center justify-center"
                >
                  ←
                </button>
                <button 
                  onClick={() => setCorporateStep(3)}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-full font-bold flex items-center justify-center"
                >
                  →
                </button>
              </div>
            </>
          )}

          {corporateStep === 3 && (
            <>
              <div className="bg-green-100 rounded-full w-64 h-64 mx-auto mb-6 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-6 shadow-lg w-48">
                  <p className="text-sm font-bold mb-4">Enter the 6-digit code</p>
                  <p className="text-xs text-gray-600 mb-2">
                    We've sent a code to your email address Ahmed@vodafone.com
                  </p>
                  <div className="flex space-x-1">
                    {['5', '2', '3', '2', '5', '1'].map((digit, idx) => (
                      <div key={idx} className="w-8 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">
                        {digit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">Verify your account</h3>
              <p className="text-gray-600 mb-6">
                You will need to verify your account through the code sent to your corporate mail.
              </p>

              <div className="flex justify-center space-x-2 mb-6">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setCorporateStep(2)}
                  className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-full font-bold flex items-center justify-center"
                >
                  ←
                </button>
                <button 
                  onClick={() => {
                    setShowCorporateModal(false);
                    setCorporateStep(1);
                  }}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-full font-bold"
                >
                  Update account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const JoinWithCodeScreen = () => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => setCurrentScreen('join')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Join with Code</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 mb-6 text-center">
          <div className="text-6xl mb-3">🔑</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join a Group</h2>
          <p className="text-gray-600">
            Enter the invitation code shared by your friend to join their Likelemba group
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4">How it works</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Get the code</p>
                <p className="text-sm text-gray-600">Friend shares invitation code via WhatsApp, SMS, or link</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Enter the code</p>
                <p className="text-sm text-gray-600">Paste or type the invitation code below</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Join the group</p>
                <p className="text-sm text-gray-600">View group details and select your preferred payout slot</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-3 block">Enter Invitation Code</label>
          <input 
            ref={joinCodeInputRef}
            type="text"
            defaultValue=""
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            onBlur={(e) => setJoinCode(e.target.value)}
            placeholder="FAMILY_SAVINGS_2026"
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-mono text-lg focus:border-green-500 focus:outline-none text-center"
          />
          <p className="text-gray-500 text-sm mt-2 text-center">Code format: GROUPNAME_2026</p>
        </div>

        {joinCode && (
          <div className="bg-green-50 rounded-2xl p-4 mb-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Code Valid ✓</span>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">
                Active Group
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">This code matches an active Likelemba group</p>
            
            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Group Name</span>
                <span className="font-semibold text-gray-900">{joinCode.replace(/_2026$/, '').replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Payout Amount</span>
                <span className="font-semibold text-green-600">50,000 XAF</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Duration</span>
                <span className="font-semibold text-gray-900">6 Months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Available Slots</span>
                <span className="font-semibold text-blue-600">5 / 6</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Benefits of Joining</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Join trusted groups created by friends</li>
                <li>• Choose your preferred payout slot</li>
                <li>• Transparent payment schedule</li>
                <li>• Secure monthly contributions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 max-w-md mx-auto">
        <button 
          onClick={() => setCurrentScreen('join-group-details')}
          disabled={!joinCode}
          className={`w-full py-4 rounded-full font-bold text-lg ${
            joinCode
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          View Group Details
        </button>
      </div>
    </div>
  );

  const JoinGroupDetailsScreen = () => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => setCurrentScreen('join-with-code')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Group Details</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-64">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm mb-1">You're joining</p>
              <h2 className="text-2xl font-bold">{joinCode.replace(/_2026$/, '').replace(/_/g, ' ')}</h2>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <div className="text-4xl">👥</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
              <p className="text-green-100 text-xs mb-1">Members</p>
              <p className="text-xl font-bold">6</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
              <p className="text-green-100 text-xs mb-1">Payout</p>
              <p className="text-xl font-bold">50K</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
              <p className="text-green-100 text-xs mb-1">Duration</p>
              <p className="text-xl font-bold">6m</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Payment Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Payout</span>
              <span className="font-bold text-green-600">50,000 XAF</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Monthly Payment</span>
              <span className="font-semibold text-gray-900">8,333 XAF</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold text-gray-900">6 Months</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Admin Fees</span>
              <span className="font-semibold text-gray-900">500 XAF</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Available Slots</span>
              <span className="font-bold text-blue-600">5 remaining</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Current Members</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Group creator</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                Slot 1
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              5 slots available for you and other members
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Before Joining</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Make sure you can commit to monthly payments</li>
                <li>• Choose your payout slot carefully</li>
                <li>• Read the group terms and conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 max-w-md mx-auto">
        <button 
          onClick={() => {
            // Add the joined Likelemba to active circles
            addLikeLemba({
              name: joinCode.replace(/_2026$/, '').replace(/_/g, ' '),
              amount: '50000',
              duration: 6,
              totalMembers: 6,
              currentMembers: 2,
              type: 'joined',
              inviteCode: joinCode,
              monthsCompleted: 0
            });
            
            // Reset join code
            setJoinCode('');
            
            // Navigate to Circles screen
            setCurrentScreen('circles');
            setCurrentTab('circles');
          }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-full font-bold text-lg shadow-lg"
        >
          Join Group
        </button>
      </div>
    </div>
  );

  const CreateLikeLembaStep1Screen = React.memo(() => {
    return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => setCurrentScreen('join')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Create Likelemba</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-64">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <span className="font-semibold text-gray-900">Group Details</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">2</div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">3</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-4xl">👥</div>
            <h2 className="text-xl font-bold text-gray-900">Create Your Group</h2>
          </div>
          <p className="text-gray-600">
            Set up your own Likelemba group and invite friends or family members to join. You'll be the group admin.
          </p>
        </div>

        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 block">Group Name *</label>
          <GroupNameInput 
            defaultValue={likeLembaName}
            onBlur={handleLikeLembaNameChange}
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 block">Number of Members *</label>
          <div className="grid grid-cols-3 gap-3">
            {[6, 9, 12].map((num) => (
              <button
                key={num}
                onClick={() => setLikeLembaMembers(num)}
                className={`py-4 rounded-xl font-bold text-lg border-2 transition ${
                  likeLembaMembers === num
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-2">Choose how many people will join this group</p>
        </div>

        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 block">Group Description (Optional)</label>
          <GroupDescriptionInput 
            value={likeLembaDescription}
            onChange={handleLikeLembaDescriptionChange}
          />
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Admin Benefits</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Priority slot selection</li>
                <li>• Manage member invitations</li>
                <li>• Set payment schedules</li>
                <li>• Track group progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 max-w-md mx-auto">
        <button 
          onClick={() => setCurrentScreen('create-likelemba-step2')}
          disabled={!likeLembaName}
          className={`w-full py-4 rounded-full font-bold text-lg ${
            likeLembaName
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          Next: Set Amount
        </button>
      </div>
    </div>
    );
  });

  const CreateLikeLembaStep2Screen = React.memo(() => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => setCurrentScreen('create-likelemba-step1')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Set Amount & Duration</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-64">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Check size={16} />
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <span className="font-semibold text-gray-900">Amount</span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">3</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 mb-6 text-white">
          <p className="text-blue-100 mb-2">Group: {likeLembaName}</p>
          <h2 className="text-3xl font-bold mb-1">
            {likeLembaAmount ? parseInt(likeLembaAmount).toLocaleString() : '0'} XAF
          </h2>
          <p className="text-blue-100">per member payout</p>
        </div>

        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 block">Total Payout per Member *</label>
          <AmountInput 
            defaultValue={likeLembaAmount}
            onBlur={handleLikeLembaAmountChange}
          />
          <p className="text-gray-500 text-sm mt-2">Amount each member will receive at their turn</p>
        </div>

        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-3 block">Duration *</label>
          <div className="space-y-3">
            {[
              { months: 6, label: '6 Months', installment: likeLembaAmount ? Math.round(parseInt(likeLembaAmount) / 6) : 0 },
              { months: 9, label: '9 Months', installment: likeLembaAmount ? Math.round(parseInt(likeLembaAmount) / 9) : 0 },
              { months: 12, label: '12 Months', installment: likeLembaAmount ? Math.round(parseInt(likeLembaAmount) / 12) : 0 }
            ].map((option) => (
              <button
                key={option.months}
                onClick={() => setLikeLembaDuration(option)}
                className={`w-full p-4 rounded-xl border-2 transition ${
                  likeLembaDuration?.months === option.months
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-lg">{option.label}</p>
                    <p className="text-gray-600 text-sm">Monthly: {option.installment.toLocaleString()} XAF</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    likeLembaDuration?.months === option.months
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {likeLembaDuration?.months === option.months && (
                      <Check className="text-white" size={20} />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">⚡</div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Group Calculation</p>
              <p className="text-sm text-gray-600">
                {likeLembaMembers} members × {likeLembaAmount ? parseInt(likeLembaAmount).toLocaleString() : '0'} XAF = 
                <span className="font-bold text-blue-600"> {likeLembaAmount ? (parseInt(likeLembaAmount) * likeLembaMembers).toLocaleString() : '0'} XAF total pool</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 max-w-md mx-auto">
        <button 
          onClick={() => setCurrentScreen('create-likelemba-step3')}
          disabled={!likeLembaAmount || !likeLembaDuration}
          className={`w-full py-4 rounded-full font-bold text-lg ${
            likeLembaAmount && likeLembaDuration
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          Next: Review & Create
        </button>
      </div>
    </div>
  ));

  const CreateLikeLembaStep3Screen = () => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => setCurrentScreen('create-likelemba-step2')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Review & Create</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Check size={16} />
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Check size={16} />
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <span className="font-semibold text-gray-900">Review</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 mb-6 text-center">
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
          <p className="text-gray-600">Review your Likelemba details before creating</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              👥
            </div>
            Group Details
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Group Name</span>
              <span className="font-semibold text-gray-900">{likeLembaName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Members</span>
              <span className="font-semibold text-gray-900">{likeLembaMembers} people</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Payout per Member</span>
              <span className="font-semibold text-blue-600">{parseInt(likeLembaAmount).toLocaleString()} XAF</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold text-gray-900">{likeLembaDuration?.months} Months</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Monthly Payment</span>
              <span className="font-semibold text-gray-900">{likeLembaDuration?.installment.toLocaleString()} XAF</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Total Pool</span>
              <span className="font-bold text-green-600">{(parseInt(likeLembaAmount) * likeLembaMembers).toLocaleString()} XAF</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              👤
            </div>
            Your Role
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 py-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="text-white" size={14} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Group Admin</p>
                <p className="text-sm text-gray-600">Manage invitations and payment schedules</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 py-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="text-white" size={14} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">First Slot Priority</p>
                <p className="text-sm text-gray-600">Choose your payout position first</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 py-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="text-white" size={14} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Invite Members</p>
                <p className="text-sm text-gray-600">Share invitation link with {likeLembaMembers - 1} people</p>
              </div>
            </div>
          </div>
        </div>

        {likeLembaDescription && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
            <p className="text-gray-600">{likeLembaDescription}</p>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">📋</div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Next Steps</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>1. Create your Likelemba group</li>
                <li>2. Share invitation link with friends</li>
                <li>3. Wait for members to join</li>
                <li>4. Start receiving payouts!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 max-w-md mx-auto">
        <button 
          onClick={() => setCurrentScreen('likelemba-created')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full font-bold text-lg shadow-lg"
        >
          Create Likelemba
        </button>
      </div>
    </div>
  );

  const LikeLembaCreatedScreen = () => (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex-1 overflow-y-auto px-6 py-12 pb-24">
        <div className="text-center mb-8">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Congratulations!</h1>
          <p className="text-gray-600 text-lg">Your Likelemba has been created</p>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <div className="text-4xl">👥</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{likeLembaName}</h2>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>👤 {likeLembaMembers} members</span>
              <span>•</span>
              <span>💰 {parseInt(likeLembaAmount).toLocaleString()} XAF</span>
              <span>•</span>
              <span>📅 {likeLembaDuration?.months}m</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Group Status</span>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600">Waiting for members to join</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>1 / {likeLembaMembers} members</span>
                <span>{Math.round((1/likeLembaMembers) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${(1/likeLembaMembers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Share Your Invitation</h3>
          
          <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Invitation Code</p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-bold text-blue-600 text-lg">{likeLembaName.toUpperCase().replace(/\s/g, '_')}_2026</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleCopyCode(e);
                }}
                className="p-2 bg-blue-600 rounded-lg"
              >
                {copied ? <Check className="text-white" size={20} /> : <Copy className="text-white" size={20} />}
              </button>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              
              console.log('Share button clicked');
              console.log('likeLembaName:', likeLembaName);
              console.log('likeLembaAmount:', likeLembaAmount);
              console.log('likeLembaDuration:', likeLembaDuration);
              
              if (!likeLembaName) {
                alert('Group name is missing!');
                return;
              }
              
              const inviteLink = `https://kolotontine.com/join/${likeLembaName.toUpperCase().replace(/\s/g, '_')}_2026`;
              console.log('Invite link:', inviteLink);
              
              if (navigator.share) {
                console.log('Using navigator.share');
                navigator.share({
                  title: `Join my Likelemba: ${likeLembaName}`,
                  text: `I've created a Likelemba called "${likeLembaName}"! Join using code: ${likeLembaName.toUpperCase().replace(/\s/g, '_')}_2026`,
                  url: inviteLink
                }).then(() => {
                  console.log('Share successful');
                }).catch((error) => {
                  console.error('Share failed:', error);
                  // Fallback to copy using execCommand
                  const success = copyToClipboard(inviteLink);
                  if (success) {
                    alert('Link copied to clipboard!');
                  } else {
                    alert('Failed to copy. Link: ' + inviteLink);
                  }
                });
              } else {
                console.log('Using clipboard copy fallback');
                const success = copyToClipboard(inviteLink);
                if (success) {
                  console.log('Copied to clipboard');
                  alert('Link copied to clipboard!');
                } else {
                  console.error('Copy failed');
                  alert('Failed to copy. Link: ' + inviteLink);
                }
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold mb-3"
          >
            Share Invitation Link
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              
              console.log('WhatsApp button clicked');
              console.log('likeLembaName:', likeLembaName);
              console.log('likeLembaAmount:', likeLembaAmount);
              console.log('likeLembaDuration:', likeLembaDuration);
              console.log('likeLembaMembers:', likeLembaMembers);
              
              if (!likeLembaName || !likeLembaAmount || !likeLembaDuration) {
                alert('Missing information! Please check your group details.');
                return;
              }
              
              const inviteCode = likeLembaName.toUpperCase().replace(/\s/g, '_') + '_2026';
              const durationMonths = likeLembaDuration.months || likeLembaDuration;
              const message = `🎉 Join my Likelemba: ${likeLembaName}!\n\n💰 Amount: ${parseInt(likeLembaAmount).toLocaleString()} XAF\n📅 Duration: ${durationMonths} months\n👥 Members: ${likeLembaMembers}\n\n🔑 Use code: ${inviteCode}\n🔗 Join here: https://kolotontine.com/join/${inviteCode}`;
              
              console.log('WhatsApp message:', message);
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
              console.log('Opening WhatsApp URL:', whatsappUrl);
              
              window.open(whatsappUrl, '_blank');
            }}
            className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-bold"
          >
            Invite via WhatsApp
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 text-lg mb-4">What's Next?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Invite {likeLembaMembers - 1} members</p>
                <p className="text-sm text-gray-600">Share your invitation code with friends and family</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Members choose slots</p>
                <p className="text-sm text-gray-600">Each member selects their preferred payout position</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Start contributing</p>
                <p className="text-sm text-gray-600">Monthly payments begin once all slots are filled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 max-w-md mx-auto">
        <button 
          onClick={() => {
            // Add the created Likelemba to active circles
            addLikeLemba({
              name: likeLembaName,
              amount: likeLembaAmount,
              duration: likeLembaDuration.months,
              totalMembers: likeLembaMembers,
              currentMembers: 1,
              type: 'created',
              description: likeLembaDescription,
              inviteCode: `${likeLembaName.toUpperCase().replace(/\s/g, '_')}_2026`,
              monthsCompleted: 0
            });
            
            // Reset form
            setLikeLembaName('');
            setLikeLembaAmount('');
            setLikeLembaDuration(null);
            setLikeLembaDescription('');
            
            // Navigate to Circles screen
            setCurrentScreen('circles');
            setCurrentTab('circles');
          }}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg"
        >
          View My Circles
        </button>
      </div>
    </div>
  );

  const LikeLembaDetailsScreen = () => {
    if (!selectedLikeLemba) return null;

    const monthlyPayment = Math.round(parseInt(selectedLikeLemba.amount) / selectedLikeLemba.duration);
    const remainingMonths = selectedLikeLemba.duration - selectedLikeLemba.monthsCompleted;
    const progressPercent = (selectedLikeLemba.monthsCompleted / selectedLikeLemba.duration) * 100;

    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => setCurrentScreen('circles')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Likelemba Details</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-64">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">👥</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedLikeLemba.name}</h2>
                  <p className="text-blue-100">
                    {selectedLikeLemba.type === 'created' ? 'You are Admin' : 'You are Member'}
                  </p>
                </div>
              </div>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-bold">
                Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
                <p className="text-blue-100 text-xs mb-1">Total Payout</p>
                <p className="text-lg font-bold">{parseInt(selectedLikeLemba.amount).toLocaleString()}</p>
                <p className="text-xs text-blue-100">XAF</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
                <p className="text-blue-100 text-xs mb-1">Monthly</p>
                <p className="text-lg font-bold">{monthlyPayment.toLocaleString()}</p>
                <p className="text-xs text-blue-100">XAF</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
                <p className="text-blue-100 text-xs mb-1">Duration</p>
                <p className="text-lg font-bold">{selectedLikeLemba.duration}</p>
                <p className="text-xs text-blue-100">Months</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Progress</h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Months Completed</span>
                <span className="font-bold text-gray-900">
                  {selectedLikeLemba.monthsCompleted} / {selectedLikeLemba.duration}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {remainingMonths} months remaining
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">Total Paid</p>
                <p className="text-xl font-bold text-blue-600">
                  {(monthlyPayment * selectedLikeLemba.monthsCompleted).toLocaleString()} XAF
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">Remaining</p>
                <p className="text-xl font-bold text-purple-600">
                  {(monthlyPayment * remainingMonths).toLocaleString()} XAF
                </p>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Members</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                {selectedLikeLemba.currentMembers}/{selectedLikeLemba.totalMembers}
              </span>
            </div>

            <div className="space-y-3">
              {/* Show current members */}
              {Array.from({ length: selectedLikeLemba.currentMembers }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {idx === 0 && selectedLikeLemba.type === 'created' ? '👤' : '👥'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {idx === 0 && selectedLikeLemba.type === 'created' ? 'You (Admin)' : 
                         idx === 0 ? 'Admin' : `Member ${idx + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        Slot {idx + 1}
                      </p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    Active
                  </span>
                </div>
              ))}

              {/* Show empty slots */}
              {Array.from({ length: selectedLikeLemba.totalMembers - selectedLikeLemba.currentMembers }).map((_, idx) => (
                <div key={`empty-${idx}`} className="flex items-center justify-between py-2 border-b border-gray-100 opacity-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 text-lg">?</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500">Empty Slot</p>
                      <p className="text-xs text-gray-400">
                        Slot {selectedLikeLemba.currentMembers + idx + 1}
                      </p>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
                    Available
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Payment Schedule</h3>
            
            <div className="space-y-2">
              {Array.from({ length: selectedLikeLemba.duration }).map((_, idx) => {
                const isPaid = idx < selectedLikeLemba.monthsCompleted;
                const isCurrent = idx === selectedLikeLemba.monthsCompleted;
                
                return (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      isPaid ? 'bg-green-50 border border-green-200' :
                      isCurrent ? 'bg-blue-50 border border-blue-200' :
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isPaid ? 'bg-green-500' :
                        isCurrent ? 'bg-blue-500' :
                        'bg-gray-300'
                      }`}>
                        {isPaid ? (
                          <Check className="text-white" size={16} />
                        ) : (
                          <span className="text-white font-bold text-xs">{idx + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold ${
                          isPaid ? 'text-green-700' :
                          isCurrent ? 'text-blue-700' :
                          'text-gray-700'
                        }`}>
                          Month {idx + 1}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(Date.now() + (idx - selectedLikeLemba.monthsCompleted) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        isPaid ? 'text-green-700' :
                        isCurrent ? 'text-blue-700' :
                        'text-gray-700'
                      }`}>
                        {monthlyPayment.toLocaleString()} XAF
                      </p>
                      <p className="text-xs text-gray-500">
                        {isPaid ? 'Paid ✓' : isCurrent ? 'Due now' : 'Upcoming'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Info */}
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 mb-6 shadow-lg">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
              <span className="text-2xl mr-2">ℹ️</span>
              Group Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Group Code</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                    {selectedLikeLemba.inviteCode || 'N/A'}
                  </span>
                  <button 
                    onClick={handleCopyCode}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Joined Date</span>
                <span className="font-semibold text-gray-900">
                  {selectedLikeLemba.joinedDate 
                    ? new Date(selectedLikeLemba.joinedDate).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Your Role</span>
                <span className="font-semibold text-gray-900 bg-blue-50 px-3 py-1 rounded">
                  {selectedLikeLemba.type === 'created' ? '👑 Admin' : '👤 Member'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3">
                <span className="text-gray-600 font-medium">Total Pool</span>
                <span className="font-bold text-green-600 text-lg">
                  {selectedLikeLemba.amount && selectedLikeLemba.totalMembers
                    ? (parseInt(selectedLikeLemba.amount) * selectedLikeLemba.totalMembers).toLocaleString()
                    : '0'} XAF
                </span>
              </div>
            </div>
          </div>

          {selectedLikeLemba.description && (
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{selectedLikeLemba.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedLikeLemba.type === 'created' && selectedLikeLemba.currentMembers < selectedLikeLemba.totalMembers && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-start space-x-3 mb-3">
                <div className="text-2xl">📢</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Invite More Members</h3>
                  <p className="text-sm text-gray-600">
                    You still have {selectedLikeLemba.totalMembers - selectedLikeLemba.currentMembers} empty slots. 
                    Share your invite code to fill the group.
                  </p>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold">
                Share Invitation
              </button>
            </div>
          )}
        </div>

        <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 max-w-md mx-auto space-y-3">
          <button 
            onClick={() => setCurrentScreen('group-chat')}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2"
          >
            <MessageCircle size={24} />
            <span>Group Chat</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('circles')}
            className="w-full bg-gray-100 text-gray-900 py-4 rounded-full font-bold text-lg"
          >
            Back to Circles
          </button>
        </div>
      </div>
    );
  };

  const DigitalWalletFormScreen = () => (
    <div className="flex-1 overflow-y-auto pb-48 bg-white">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-gray-200">
        <button onClick={() => setCurrentScreen('payout-method-selection')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Digital wallets</h1>
      </div>

      <div className="px-6 py-6">
        <p className="text-gray-600 mb-6">
          You can receive your payout using any digital wallet in Congo
        </p>

        <div className="bg-blue-50 rounded-2xl p-4 flex items-start space-x-3 mb-6">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <p className="text-gray-700 text-sm">
            Make sure your payout amount doesn't exceed your wallet's balance limit
          </p>
        </div>

        <label className="text-sm font-semibold text-gray-700 mb-2 block">Enter your wallet number</label>
        <div className="flex space-x-2 mb-8">
          <div className="border-2 border-gray-200 rounded-xl p-4 flex items-center space-x-2">
            <span className="text-2xl">🇨🇬</span>
            <span className="font-semibold">+242</span>
          </div>
          <input 
            type="text"
            placeholder="064663469"
            className="flex-1 border-2 border-gray-200 rounded-xl p-4"
          />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">How to use?</h3>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">An SMS will be sent to you</h4>
              <p className="text-gray-600 text-sm">
                An SMS will be sent to you from the wallet provider in the payout month
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Limits</h4>
              <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                <li>Daily transaction limit is 30,000 XAF</li>
                <li>Monthly transaction limit is 100,000 XAF</li>
                <li>The maximum credit amount your wallet holds, depends on your provider</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Make Sure</h4>
              <p className="text-gray-600 text-sm">
                Your wallet number is registered under your name
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-200 max-w-md mx-auto">
        <button 
          onClick={() => setCurrentScreen('scan-national-id')}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg mb-3"
        >
          Next
        </button>
        <button 
          onClick={() => setCurrentScreen('scan-national-id')}
          className="w-full bg-gray-100 text-gray-900 py-4 rounded-full font-bold text-lg"
        >
          Skip for now
        </button>
      </div>
    </div>
  );

  const BottomNav = () => {
    const tabs = [
      { id: 'home', icon: Home, label: t('home') },
      { id: 'circles', icon: Users, label: t('circles') },
      { id: 'join', icon: PlusCircle, label: 'Join', isCenter: true },
      { id: 'payment', icon: Wallet, label: t('wallet') },
      { id: 'card', icon: CreditCard, label: t('card') },
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center max-w-md mx-auto px-4 py-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            if (tab.isCenter) {
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    setCurrentScreen(tab.id);
                  }}
                  className="flex flex-col items-center -mt-8"
                >
                  <div className="bg-blue-600 p-4 rounded-full shadow-2xl mb-1">
                    <Icon className="text-white" size={28} />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 mt-1">
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setCurrentScreen(tab.id);
                }}
                className="flex flex-col items-center py-2"
              >
                <Icon 
                  className={isActive ? 'text-blue-600' : 'text-gray-400'} 
                  size={24} 
                />
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };



  // ╔════════════════════════════════════════════════════════════════════╗
  // ║                  FLOW D'AUTHENTIFICATION COMPLET                   ║
  // ╠════════════════════════════════════════════════════════════════════╣
  // ║  9 écrans pour authentifier et onboarder les nouveaux utilisateurs ║
  // ║                                                                    ║
  // ║  FLOW:                                                             ║
  // ║  1. Splash Screen (2.5s auto)           → Écran de chargement     ║
  // ║  2. Language Selection                  → FR/EN                    ║
  // ║  3. Phone Number (+242)                 → 9 chiffres               ║
  // ║  4. OTP Verification                    → Code à 6 chiffres        ║
  // ║  5. User Info                           → Nom, prénom, email       ║
  // ║  6. Onboarding 1 (Bleu)                 → Financez vos objectifs   ║
  // ║  7. Onboarding 2 (Vert)                 → Épargnez intelligemment  ║
  // ║  8. Onboarding 3 (Violet)               → Rejoignez une communauté ║
  // ║  9. Welcome (Bleu)                      → Bienvenue !              ║
  // ║                                                                    ║
  // ║  Design inspiré de Money Fellows avec adaptation Congo-Brazza     ║
  // ║  Tous les écrans ont la même taille que l'app: 844px height       ║
  // ╚════════════════════════════════════════════════════════════════════╝

  // === AUTHENTICATION SCREENS (ADDED) ===
  
  // ==========================================
  // 1. SPLASH SCREEN - Écran de chargement
  // ==========================================
  // Premier écran affiché au démarrage de l'app
  // - Affiche le logo Kolo Tontine
  // - Mention "Banque Centrale du Congo"
  // - Barre de progression animée
  // - Navigation auto vers l'écran de langue après 2.5s
  // ==========================================
  const SplashScreen = () => (
    <div className="h-full bg-white flex flex-col items-center justify-center p-8">
      <div className="mb-8">
        <div className="text-8xl mb-4 text-center">💰</div>
        <h1 className="text-4xl font-bold text-blue-600 text-center">Kolo Tontine</h1>
      </div>
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-600 mb-2">Sous la supervision de</p>
        <span className="text-lg font-semibold text-gray-800">Banque Centrale du Congo</span>
      </div>
      <div className="mt-8 w-48 h-1 bg-gray-300 rounded-full">
        <div className="h-full bg-blue-600" style={{width: '60%'}}></div>
      </div>
    </div>
  );

  // ==========================================
  // 2. LANGUAGE SELECTION - Choix de langue
  // ==========================================
  // Permet à l'utilisateur de choisir sa langue préférée
  // - Options: Français / English
  // - Icône Globe au centre
  // - Boutons grands et clairs
  // - Détermine la langue de toute l'application
  // ==========================================
  const LanguageSelectionScreen = () => (
    <div className="h-full bg-white flex flex-col items-center justify-center p-8">
      <div className="mb-12">
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Globe className="w-16 h-16 text-blue-600" />
        </div>
      </div>
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => { setLanguage('fr'); setCurrentAuthScreen('phone'); }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-2xl font-semibold text-lg"
        >
          Français
        </button>
        <button
          onClick={() => { setLanguage('en'); setCurrentAuthScreen('phone'); }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-2xl font-semibold text-lg"
        >
          English
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 3. PHONE NUMBER - Saisie du numéro
  // ==========================================
  // Collecte le numéro de téléphone de l'utilisateur
  // - Indicatif pays: +242 (Congo-Brazzaville) 🇨🇬
  // - Format: 9 chiffres (ex: 064663469)
  // - Auto-focus sur l'input pour commencer directement
  // - Validation: minimum 9 chiffres pour activer "Suivant"
  // - Bouton retour vers sélection de langue
  // ==========================================
  const PhoneNumberScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-8">
          <button onClick={() => setCurrentAuthScreen('language')} className="text-blue-600 font-medium">
            {language}
          </button>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {language === 'fr' ? "Quel est votre numéro ?" : "What's your phone number?"}
          </h1>
          <p className="text-gray-600">
            {language === 'fr' ? "Numéro principal pour vous contacter." : "Primary number to contact you."}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'fr' ? "Numéro de téléphone" : "Phone Number"}
          </label>
          <div className="flex gap-3">
            <div className="flex items-center bg-gray-100 px-4 py-3 rounded-xl">
              <span className="text-2xl mr-2">🇨🇬</span>
              <span className="text-gray-800 font-medium">+242</span>
            </div>
            <input
              key="phone-input"
              type="tel"
              autoFocus
              value={authPhoneNumber}
              onChange={(e) => setAuthPhoneNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))}
              placeholder="100 000 000"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              maxLength={9}
            />
          </div>
        </div>
      </div>
      <div className="p-6">
        <button
          onClick={() => { if (authPhoneNumber.length >= 9) { setOtpTimer(30); setCurrentAuthScreen('otp'); }}}
          disabled={authPhoneNumber.length < 9}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            authPhoneNumber.length >= 9 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'
          }`}
        >
          {language === 'fr' ? 'Suivant' : 'Next'}
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 4. OTP VERIFICATION - Code de vérification
  // ==========================================
  // Vérification du numéro via code OTP
  // - Input unique invisible qui gère les 6 chiffres
  // - Affichage visuel de 6 cases
  // - Auto-focus maintenu sur l'input invisible
  // - Timer de 30 secondes pour renvoyer le code
  // - Code de test: 123456 (pour développement)
  // - Validation auto quand les 6 chiffres sont saisis
  // ==========================================
  const OTPVerificationScreen = () => {
    const hiddenInputRef = React.useRef(null);
    
    // Focus automatique sur l'input caché
    React.useEffect(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }, []);
    
    const handleOtpInputChange = (e) => {
      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
      const newOtp = value.split('');
      while (newOtp.length < 6) {
        newOtp.push('');
      }
      setOtpCode(newOtp);
      
      // Vérification auto si 6 chiffres
      if (value.length === 6) {
        if (value === '123456' || value.length === 6) {
          setTimeout(() => setCurrentAuthScreen('userInfo'), 500);
        }
      }
    };
    
    return (
      <div className="h-full bg-white flex flex-col" onClick={() => hiddenInputRef.current?.focus()}>
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => { setCurrentAuthScreen('phone'); setOtpCode(['','','','','','']); }} className="p-2">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {language === 'fr' ? "Code de vérification" : "Verification code"}
            </h1>
            <p className="text-gray-600 mb-1">{language === 'fr' ? "Entrez le code à 6 chiffres" : "Enter 6-digit code"}</p>
            <p className="text-blue-600 font-semibold">+242{authPhoneNumber}</p>
            <button onClick={() => setCurrentAuthScreen('phone')} className="text-blue-600 font-medium mt-2">
              {language === 'fr' ? 'Changer' : 'Change'}
            </button>
          </div>
          
          {/* Input invisible qui capture les frappes */}
          <input
            ref={hiddenInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={otpCode.join('')}
            onChange={handleOtpInputChange}
            maxLength={6}
            autoFocus
            className="absolute opacity-0 pointer-events-none"
            style={{ left: '-9999px' }}
          />
          
          {/* Affichage visuel des 6 cases */}
          <div className="flex justify-center gap-3 mb-8" onClick={() => hiddenInputRef.current?.focus()}>
            {otpCode.map((digit, i) => (
              <div
                key={`otp-display-${i}`}
                className={`w-14 h-16 flex items-center justify-center text-2xl font-bold border-2 rounded-xl cursor-text ${
                  digit ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } ${otpCode.join('').length === i ? 'ring-2 ring-blue-500' : ''}`}
              >
                {digit || ''}
              </div>
            ))}
          </div>
          
          <div className="text-center mb-4">
            {otpTimer > 0 ? (
              <p className="text-gray-600">
                {language === 'fr' ? 'Renvoyer dans' : 'Resend in'} <span className="font-bold text-blue-600">00:{otpTimer.toString().padStart(2,'0')}</span>
              </p>
            ) : (
              <button 
                onClick={() => {
                  setOtpTimer(30);
                  setOtpCode(['','','','','','']);
                  hiddenInputRef.current?.focus();
                }} 
                className="text-blue-600 font-semibold"
              >
                {language === 'fr' ? 'Renvoyer le code' : 'Resend code'}
              </button>
            )}
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800 text-center"><strong>Code test:</strong> 123456</p>
          </div>
        </div>
        <div className="p-6">
          <button
            onClick={() => { if (otpCode.every(d => d !== '')) setCurrentAuthScreen('userInfo'); }}
            disabled={otpCode.some(d => d === '')}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              otpCode.every(d => d !== '') ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'
            }`}
          >
            {language === 'fr' ? 'Vérifier' : 'Verify'}
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // 5. USER INFO - Informations personnelles
  // ==========================================
  // Collecte des informations de base de l'utilisateur
  // - Prénom (requis)
  // - Nom (requis)
  // - Code de parrainage (optionnel)
  // - Email (requis)
  // - Auto-focus sur le champ Prénom
  // - Validation: tous les champs requis doivent être remplis
  // - Option utilisateur corporatif disponible (non implémentée)
  // ==========================================
  const UserInfoInputScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? "Commençons" : "Let's start"}
          </h1>
          <p className="text-gray-600">{language === 'fr' ? "Vos informations" : "Your details"}</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              autoFocus
              value={authFirstName}
              onChange={(e) => setAuthFirstName(e.target.value)}
              placeholder={language === 'fr' ? 'Prénom' : 'First name'}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="text"
              value={authLastName}
              onChange={(e) => setAuthLastName(e.target.value)}
              placeholder={language === 'fr' ? 'Nom' : 'Last name'}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <input
            type="text"
            value={authReferralCode}
            onChange={(e) => setAuthReferralCode(e.target.value)}
            placeholder={language === 'fr' ? 'Code parrainage (optionnel)' : 'Referral code (optional)'}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <input
            type="email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
      <div className="p-6">
        <button
          onClick={() => setCurrentAuthScreen('onboarding1')}
          disabled={!authFirstName || !authLastName || !authEmail}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            authFirstName && authLastName && authEmail ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'
          }`}
        >
          {language === 'fr' ? 'Suivant' : 'Next'}
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 6. ONBOARDING 1 - Financez vos objectifs
  // ==========================================
  // Premier écran d'introduction aux fonctionnalités
  // - Thème: Financement et objectifs (Fond BLEU)
  // - Emoji: 💰 (argent)
  // - Explication: Likelemba personnalisée
  // - Indicateur de progression: 1/3
  // - Option "Passer" pour aller directement à l'app
  // ==========================================
  const OnboardingScreen1 = () => (
    <div className="h-full bg-gradient-to-b from-blue-500 to-blue-700 text-white flex flex-col justify-between p-8">
      <button onClick={() => setCurrentAuthScreen('welcome')} className="text-white self-end">
        {language === 'fr' ? 'Passer' : 'Skip'}
      </button>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-6xl mb-8">💰</div>
        <h1 className="text-3xl font-bold mb-4">{language === 'fr' ? 'Financez vos objectifs' : 'Fund Goals'}</h1>
        <p className="text-blue-100 text-center">{language === 'fr' ? 'Avec Likelemba personnalisée' : 'With personalized Likelemba'}</p>
      </div>
      <div>
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-blue-300 rounded"></div>
          <div className="w-8 h-1 bg-blue-300 rounded"></div>
        </div>
        <button onClick={() => setCurrentAuthScreen('onboarding2')} className="w-full bg-white text-blue-600 py-4 rounded-2xl font-semibold">
          {language === 'fr' ? 'Suivant' : 'Next'}
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 7. ONBOARDING 2 - Épargnez intelligemment
  // ==========================================
  // Deuxième écran d'introduction
  // - Thème: Épargne et planification (Fond VERT)
  // - Emoji: 📊 (graphique)
  // - Explication: Programme d'épargne enrichissant
  // - Indicateur de progression: 2/3
  // - Option "Passer" toujours disponible
  // ==========================================
  const OnboardingScreen2 = () => (
    <div className="h-full bg-gradient-to-b from-green-500 to-green-700 text-white flex flex-col justify-between p-8">
      <button onClick={() => setCurrentAuthScreen('welcome')} className="text-white self-end">
        {language === 'fr' ? 'Passer' : 'Skip'}
      </button>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-6xl mb-8">📊</div>
        <h1 className="text-3xl font-bold mb-4">{language === 'fr' ? 'Épargnez intelligemment' : 'Save Smart'}</h1>
        <p className="text-green-100 text-center">{language === 'fr' ? 'Programme d\'épargne enrichissant' : 'Rewarding savings'}</p>
      </div>
      <div>
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-8 h-1 bg-green-300 rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-green-300 rounded"></div>
        </div>
        <button onClick={() => setCurrentAuthScreen('onboarding3')} className="w-full bg-white text-green-600 py-4 rounded-2xl font-semibold">
          {language === 'fr' ? 'Suivant' : 'Next'}
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 8. ONBOARDING 3 - Rejoignez une communauté
  // ==========================================
  // Troisième et dernier écran d'introduction
  // - Thème: Communauté et solidarité (Fond VIOLET)
  // - Emoji: 👥 (personnes)
  // - Explication: Objectifs communs et entraide
  // - Indicateur de progression: 3/3
  // - Dernier point avant l'écran de bienvenue
  // ==========================================
  const OnboardingScreen3 = () => (
    <div className="h-full bg-gradient-to-b from-purple-500 to-purple-700 text-white flex flex-col justify-between p-8">
      <button onClick={() => setCurrentAuthScreen('welcome')} className="text-white self-end">
        {language === 'fr' ? 'Passer' : 'Skip'}
      </button>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-6xl mb-8">👥</div>
        <h1 className="text-3xl font-bold mb-4">{language === 'fr' ? 'Rejoignez' : 'Join Community'}</h1>
        <p className="text-purple-100 text-center">{language === 'fr' ? 'Atteignez vos objectifs ensemble' : 'Reach goals together'}</p>
      </div>
      <div>
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-8 h-1 bg-purple-300 rounded"></div>
          <div className="w-8 h-1 bg-purple-300 rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
        </div>
        <button onClick={() => setCurrentAuthScreen('welcome')} className="w-full bg-white text-purple-600 py-4 rounded-2xl font-semibold">
          {language === 'fr' ? 'Suivant' : 'Next'}
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 9. WELCOME - Écran de bienvenue final
  // ==========================================
  // Dernier écran avant l'entrée dans l'application
  // - Message de bienvenue chaleureux (Fond BLEU)
  // - Emoji: 😊 (sourire) + 👥 (communauté)
  // - Bouton "Trouver un cercle" pour commencer
  // - Action: setIsAuthenticated(true) + navigation vers Home
  // - Marque la fin du flow d'authentification
  // ==========================================
  const WelcomeCompletionScreen = () => (
    <div className="h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col justify-between p-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-7xl mb-6">😊</div>
        <h1 className="text-4xl font-bold mb-4">{language === 'fr' ? 'Bienvenue !' : 'Welcome!'}</h1>
        <p className="text-blue-100 text-center text-lg mb-8">
          {language === 'fr' ? 'Trouvons-vous un cercle !' : "Let's find you a circle!"}
        </p>
        <div className="text-8xl">👥</div>
      </div>
      <button
        onClick={() => { setIsAuthenticated(true); setCurrentScreen('home'); }}
        className="w-full bg-white text-blue-600 py-4 rounded-2xl font-semibold text-lg"
      >
        {language === 'fr' ? 'Trouver un cercle' : 'Find A Circle'}
      </button>
    </div>
  );


  // === CHECK AUTH (ADDED) ===
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-2xl flex flex-col" style={{height: '844px'}}>
        {currentAuthScreen === "splash" && <SplashScreen />}
        {currentAuthScreen === "language" && <LanguageSelectionScreen />}
        {currentAuthScreen === "phone" && <PhoneNumberScreen />}
        {currentAuthScreen === "otp" && <OTPVerificationScreen />}
        {currentAuthScreen === "userInfo" && <UserInfoInputScreen />}
        {currentAuthScreen === "onboarding1" && <OnboardingScreen1 />}
        {currentAuthScreen === "onboarding2" && <OnboardingScreen2 />}
        {currentAuthScreen === "onboarding3" && <OnboardingScreen3 />}
        {currentAuthScreen === "welcome" && <WelcomeCompletionScreen />}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl flex flex-col" style={{height: '844px'}}>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'circles' && <CirclesScreen />}
      {currentScreen === 'join' && <JoinScreen />}
      {currentScreen === 'payment' && <PaymentsScreen />}
      {currentScreen === 'payment-calendar' && <PaymentCalendarScreen />}
      {currentScreen === 'card' && <CardScreen />}
      {currentScreen === 'goal-detail' && <GoalDetailScreen />}
      {currentScreen === 'my-goals' && <MyGoalsScreen />}
      {currentScreen === 'create-goal' && <CreateGoalScreen />}
      {currentScreen === 'saving-programs' && <SavingProgramsScreen />}
      {currentScreen === 'upgrade' && <UpgradeScreen />}
      {currentScreen === 'my-plan' && <MyPlanScreen />}
      {currentScreen === 'feature-store' && <FeatureStoreScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      {currentScreen === 'personal-info' && <PersonalInfoScreen />}
      {currentScreen === 'my-documents' && <MyDocumentsScreen />}
      {currentScreen === 'scan-national-id' && <ScanNationalIdScreen />}
      {currentScreen === 'proof-income' && <ProofIncomeScreen />}
      {currentScreen === 'scan-utility-bill' && <ScanUtilityBillScreen />}
      {currentScreen === 'signing-requests' && <SigningRequestsScreen />}
      {currentScreen === 'manage-addresses' && <ManageAddressesScreen />}
      {currentScreen === 'language' && <LanguageScreen />}
      {currentScreen === 'notifications' && <NotificationsScreen />}
      {currentScreen === 'transaction-history' && <TransactionHistoryScreen />}
      {currentScreen === 'transaction-details' && <TransactionDetailsScreen />}
      {currentScreen === 'financial-dashboard' && <FinancialDashboardScreen />}
      {currentScreen === 'group-chat' && <GroupChatScreen />}
      {currentScreen === 'customer-support' && <CustomerSupportScreen />}
      {currentScreen === 'support-ticket' && <SupportTicketScreen />}
      {currentScreen === 'security-settings' && <SecuritySettingsScreen />}
      {currentScreen === 'change-passcode' && <ChangePasscodeScreen />}
      {currentScreen === 'security-logs' && <SecurityLogsScreen />}
      {currentScreen === 'live-chat' && <LiveChatScreen />}
      {currentScreen === 'faq' && <FAQScreen />}
      {currentScreen === 'new-ticket' && <NewTicketScreen />}
      {currentScreen === 'whats-hot' && <WhatsHotScreen />}
      {currentScreen === 'payout-eligibility' && <PayoutEligibilityScreen />}
      {currentScreen === 'payout-method' && <PayoutMethodScreen />}
      {currentScreen === 'payment-history' && <PaymentHistoryScreen />}
      {currentScreen === 'payment-policy' && <PaymentPolicyScreen />}
      {currentScreen === 'payment-settings' && <PaymentSettingsScreen />}
      {currentScreen === 'saved-cards' && <SavedCardsScreen />}
      {currentScreen === 'circle-details-amount' && <CircleDetailsAmountScreen />}
      {currentScreen === 'circle-details-duration' && <CircleDetailsDurationScreen />}
      {currentScreen === 'circle-slot' && <CircleSlotScreen />}
      {currentScreen === 'payout-method-selection' && <PayoutMethodSelectionScreen />}
      {currentScreen === 'bank-transfer-form' && <BankTransferFormScreen />}
      {currentScreen === 'digital-wallet-form' && <DigitalWalletFormScreen />}
      {currentScreen === 'referral' && <ReferralScreen />}
      {currentScreen === 'referral-tracker' && <ReferralTrackerScreen />}
      {currentScreen === 'choose-circle' && <ChooseCircleScreen />}
      {currentScreen === 'choose-duration' && <ChooseDurationScreen />}
      {currentScreen === 'choose-payment-method' && <ChoosePaymentMethodScreen />}
      {currentScreen === 'payment-details' && <PaymentDetailsScreen />}
      {currentScreen === 'payment-confirmation' && <PaymentConfirmationScreen />}
      {currentScreen === 'join-with-code' && <JoinWithCodeScreen />}
      {currentScreen === 'join-group-details' && <JoinGroupDetailsScreen />}
      {currentScreen === 'likelemba-details' && <LikeLembaDetailsScreen />}
      {currentScreen === 'create-likelemba-step1' && <CreateLikeLembaStep1Screen />}
      {currentScreen === 'create-likelemba-step2' && <CreateLikeLembaStep2Screen />}
      {currentScreen === 'create-likelemba-step3' && <CreateLikeLembaStep3Screen />}
      {currentScreen === 'likelemba-created' && <LikeLembaCreatedScreen />}
      <BottomNav />
      {showCorporateModal && <CorporateAccountModal />}
    </div>
  );
};

export default KoloTontine;