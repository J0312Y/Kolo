// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Bell, Zap, Copy, Check, Users, Gift, TrendingUp, PlusCircle, CreditCard, X, User, Search, Settings, FileText, Calendar, File, MessageCircle, MapPin, Shield, Lock, Globe, Folder, UserPlus, CheckCircle2, Scissors, Wallet as WalletIcon, MoreVertical, Send, Smile } from 'lucide-react';
import { useAuth } from '../context';
import { useApp } from '../context';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    firstName, lastName, phone, email, language, setLanguage, userPlan,
    supportTickets, setSupportTickets, selectedTicket, setSelectedTicket,
    supportMessage, setSupportMessage, sendSupportMessage,
    liveChatMessages, setLiveChatMessages, liveChatMessage, setLiveChatMessage,
    sendLiveChatMessage, securityLogs,
    biometricsEnabled, setBiometricsEnabled, twoFactorEnabled, setTwoFactorEnabled,
    loginAlerts, setLoginAlerts, createNewTicket: createNewTicketCtx
  } = useApp();
  const [subScreen, setSubScreen] = React.useState('profile');
  const [newTicketSubject, setNewTicketSubject] = React.useState('');
  const [newTicketCategory, setNewTicketCategory] = React.useState('');
  const liveChatInputRef = React.useRef(null);
  const [newTicketMessage, setNewTicketMessage] = React.useState('');

  const createNewTicket = () => {
    if (!newTicketSubject.trim() || !newTicketCategory || !newTicketMessage.trim()) {
      alert("Please fill in all fields");
      return;
    }
    createNewTicketCtx(newTicketSubject, newTicketCategory, newTicketMessage);
    setNewTicketSubject("");
    setNewTicketCategory("");
    setNewTicketMessage("");
    setSubScreen("customer-support");
  };

  const ProfileScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/')}>
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
          onClick={() => navigate('/goals?screen=my-plan')}
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
            onClick={() => setSubScreen('personal-info')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <User className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">{t('personalInfo')}</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setSubScreen('my-documents')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <Folder className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">My Documents</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setSubScreen('manage-addresses')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <MapPin className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">{t('manageAddresses')}</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setSubScreen('signing-requests')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">Signing Requests</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setSubScreen('referral')}
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
            onClick={() => setSubScreen('security-settings')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <Shield className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">{t('security')}</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setSubScreen('change-passcode')}
            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <Lock className="text-blue-600" size={24} />
              <span className="font-semibold text-gray-900">Change Passcode</span>
            </div>
            <ChevronRight className="text-gray-400" size={24} />
          </button>

          <button 
            onClick={() => setSubScreen('security-logs')}
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
            onClick={() => setSubScreen('language')}
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
            onClick={() => setSubScreen('customer-support')}
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
        <button onClick={() => navigate('/profile')}>
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
            onClick={() => setSubScreen('scan-national-id')}
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
            onClick={() => setSubScreen('proof-income')}
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
            onClick={() => setSubScreen('scan-utility-bill')}
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
        <button onClick={() => setSubScreen('my-documents')}>
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
        <button onClick={() => setSubScreen('my-documents')}>
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
        <button onClick={() => setSubScreen('my-documents')}>
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


  const LanguageScreen = () => (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate('/profile')}>
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
                navigate('/profile');
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
                navigate('/profile');
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
          <button onClick={() => navigate('/profile')}>
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
        <button onClick={() => navigate('/profile')}>
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
            <button onClick={() => navigate('/profile')}>
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
                onClick={() => setSubScreen('live-chat')}
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
                onClick={() => setSubScreen('faq')}
                className="bg-purple-50 rounded-xl p-4 text-left hover:bg-purple-100 transition"
              >
                <HelpCircle className="text-purple-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900 text-sm">FAQ</p>
                <p className="text-xs text-gray-600 mt-1">Browse help topics</p>
              </button>
              
              <button 
                onClick={() => setSubScreen('new-ticket')}
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
                      setSubScreen('support-ticket');
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
                      setSubScreen('support-ticket');
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
            <button onClick={() => setSubScreen('customer-support')}>
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
            <button onClick={() => navigate('/profile')}>
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
              onClick={() => setSubScreen('change-passcode')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-500 transition"
            >
              <Lock className="text-blue-600 mb-2" size={24} />
              <p className="font-semibold text-gray-900 text-sm">Change Passcode</p>
            </button>
            
            <button 
              onClick={() => setSubScreen('security-logs')}
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
            <button onClick={() => setSubScreen('security-settings')}>
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
            <button onClick={() => setSubScreen('security-settings')}>
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
            <button onClick={() => setSubScreen('customer-support')}>
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
            <button onClick={() => setSubScreen('customer-support')}>
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
              onClick={() => setSubScreen('live-chat')}
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
            <button onClick={() => setSubScreen('customer-support')}>
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
              setSubScreen('customer-support');
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


  const PersonalInfoScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate('/profile')}>
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
          onClick={() => navigate('/profile')}
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



  // Sub-screen router
  if (subScreen === 'personal-info') return <PersonalInfoScreen />;
  if (subScreen === 'my-documents') return <MyDocumentsScreen />;
  if (subScreen === 'scan-national-id') return <ScanNationalIdScreen />;
  if (subScreen === 'proof-income') return <ProofIncomeScreen />;
  if (subScreen === 'scan-utility-bill') return <ScanUtilityBillScreen />;
  if (subScreen === 'language') return <LanguageScreen />;
  if (subScreen === 'manage-addresses') return <ManageAddressesScreen />;
  if (subScreen === 'signing-requests') return <SigningRequestsScreen />;
  if (subScreen === 'customer-support') return <CustomerSupportScreen />;
  if (subScreen === 'support-ticket') return <SupportTicketScreen />;
  if (subScreen === 'security-settings') return <SecuritySettingsScreen />;
  if (subScreen === 'change-passcode') return <ChangePasscodeScreen />;
  if (subScreen === 'security-logs') return <SecurityLogsScreen />;
  if (subScreen === 'live-chat') return <LiveChatScreen />;
  if (subScreen === 'faq') return <FAQScreen />;
  if (subScreen === 'new-ticket') return <NewTicketScreen />;
  return <ProfileScreen />;
};
