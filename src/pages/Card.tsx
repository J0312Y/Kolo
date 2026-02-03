// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context';

export const Card: React.FC = () => {
  const navigate = useNavigate();
  const { firstName, lastName } = useApp();
  const [cardBalance, setCardBalance] = React.useState(125000);
  const [isCardFrozen, setIsCardFrozen] = React.useState(false);
  const [showCardDetails, setShowCardDetails] = React.useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showTopUpModal, setShowTopUpModal] = React.useState(false);
  const [topUpAmount, setTopUpAmount] = React.useState('');
  const [topUpSource, setTopUpSource] = React.useState<any>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showTopUpSuccess, setShowTopUpSuccess] = React.useState(false);
  const [paymentToDelete, setPaymentToDelete] = React.useState<any>(null);
  const [newPaymentType, setNewPaymentType] = React.useState('card');
  const [newPaymentData, setNewPaymentData] = React.useState({ cardName: '', last4: '', provider: '', phoneNumber: '' });
  const [paymentMethods, setPaymentMethods] = React.useState([
    { id: 1, type: 'card', name: 'Visa', last4: '4582', isDefault: true, brand: 'visa', number: '' },
    { id: 2, type: 'mobile', name: 'MTN Mobile Money', last4: '', number: '+242 06 466 3469', isDefault: false, brand: 'mtn' },
    { id: 3, type: 'card', name: 'Mastercard', last4: '8921', isDefault: false, brand: 'mastercard', number: '' },
    { id: 4, type: 'mobile', name: 'Airtel Money', last4: '', number: '+242 05 555 1234', isDefault: false, brand: 'airtel' }
  ]);

  const handleSetDefault = (id: number) => {
    setPaymentMethods(paymentMethods.map(pm => ({ ...pm, isDefault: pm.id === id })));
  };
  const handleDeletePaymentMethod = (id: number) => {
    setPaymentToDelete(paymentMethods.find(pm => pm.id === id));
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (paymentToDelete) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== paymentToDelete.id));
      setShowDeleteConfirm(false);
      setPaymentToDelete(null);
    }
  };
  const handleAddPayment = () => {
    setShowAddPaymentModal(true);
    setNewPaymentData({ cardName: '', last4: '', provider: '', phoneNumber: '' });
  };
  const handleSavePayment = () => {
    if (newPaymentType === 'card') {
      if (newPaymentData.cardName && newPaymentData.last4) {
        setPaymentMethods([...paymentMethods, { id: Date.now(), type: 'card', name: newPaymentData.cardName, last4: newPaymentData.last4, isDefault: false, brand: newPaymentData.cardName.toLowerCase(), number: '' }]);
        setShowAddPaymentModal(false);
      } else alert('Please fill all card fields');
    } else {
      if (newPaymentData.provider && newPaymentData.phoneNumber) {
        setPaymentMethods([...paymentMethods, { id: Date.now(), type: 'mobile', name: `${newPaymentData.provider} Mobile Money`, last4: '', number: newPaymentData.phoneNumber, isDefault: false, brand: newPaymentData.provider.toLowerCase() }]);
        setShowAddPaymentModal(false);
      } else alert('Please fill all mobile money fields');
    }
  };
  const handleOpenTopUp = () => { setShowTopUpModal(true); setTopUpAmount(''); setTopUpSource(null); };
  const handleTopUpConfirm = () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) { alert('Please enter a valid amount'); return; }
    if (!topUpSource) { alert('Please select a payment source'); return; }
    setIsProcessing(true);
    setTimeout(() => {
      setCardBalance(cardBalance + parseFloat(topUpAmount));
      setIsProcessing(false);
      setShowTopUpModal(false);
      setShowTopUpSuccess(true);
      setTimeout(() => setShowTopUpSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-xl font-bold">My Card</h1>
        <button onClick={() => navigate('/profile')}><User className="text-gray-700" size={24} /></button>
      </div>
      <div className="px-6 py-6">
        {/* Virtual Kolo Card */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Kolo Virtual Card</h2>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-6 shadow-2xl transform transition hover:scale-105">
              <div className="flex justify-between items-start mb-8">
                <div><p className="text-white/80 text-sm mb-1">Kolo Card</p><p className="text-white font-bold text-xl">Virtual</p></div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"><p className="text-white text-xs font-bold">PREPAID</p></div>
              </div>
              <div className="mb-6">
                <p className="text-white/80 text-xs mb-2">Card Number</p>
                <p className="text-white text-2xl font-mono tracking-wider">{showCardDetails ? '5399 2847 3621 4582' : '**** **** **** 4582'}</p>
              </div>
              <div className="flex justify-between items-end">
                <div><p className="text-white/80 text-xs mb-1">Card Holder</p><p className="text-white font-bold">{firstName.toUpperCase()} {lastName.toUpperCase()}</p></div>
                <div className="text-right"><p className="text-white/80 text-xs mb-1">Valid Thru</p><p className="text-white font-bold">12/28</p></div>
              </div>
              {showCardDetails && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between">
                    <div><p className="text-white/80 text-xs mb-1">CVV</p><p className="text-white font-bold font-mono">847</p></div>
                    <div className="text-right"><p className="text-white/80 text-xs mb-1">Status</p><p className={`font-bold ${isCardFrozen ? 'text-yellow-300' : 'text-green-300'}`}>{isCardFrozen ? 'FROZEN' : 'ACTIVE'}</p></div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg mt-4 mx-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-gray-900">{cardBalance.toLocaleString()} <span className="text-lg text-gray-600">XAF</span></p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button onClick={handleOpenTopUp} className="bg-blue-600 text-white py-3 rounded-xl font-semibold flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">⬆️</span><span className="text-sm">Top Up</span>
            </button>
            <button onClick={() => setIsCardFrozen(!isCardFrozen)} className={`${isCardFrozen ? 'bg-green-600' : 'bg-yellow-600'} text-white py-3 rounded-xl font-semibold flex flex-col items-center justify-center`}>
              <span className="text-2xl mb-1">{isCardFrozen ? '🔓' : '❄️'}</span><span className="text-sm">{isCardFrozen ? 'Unfreeze' : 'Freeze'}</span>
            </button>
            <button onClick={() => setShowCardDetails(!showCardDetails)} className="bg-gray-700 text-white py-3 rounded-xl font-semibold flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">{showCardDetails ? '🙈' : '👁️'}</span><span className="text-sm">Details</span>
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 my-8"></div>
        {/* Payment Methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
            <button onClick={handleAddPayment} className="text-blue-600 font-semibold text-sm flex items-center space-x-1"><PlusCircle size={18} /><span>Add</span></button>
          </div>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div key={method.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.type === 'card' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                    {method.type === 'card' ? <CreditCard className="text-blue-600" size={24} /> : <span className="text-2xl">📱</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-bold text-gray-900">{method.type === 'card' ? `${method.name} ••••${method.last4}` : method.name}</p>
                      {method.isDefault && <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">Default</span>}
                    </div>
                    <p className="text-sm text-gray-500">{method.type === 'card' ? 'Credit/Debit Card' : method.number}</p>
                  </div>
                </div>
                {!method.isDefault && (
                  <div className="flex space-x-2 pt-3 border-t border-gray-100">
                    <button onClick={() => handleSetDefault(method.id)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold text-sm">Set as Default</button>
                    <button onClick={() => handleDeletePaymentMethod(method.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold text-sm">Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Recent Card Activity */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Card Activity</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><span className="text-red-600 font-bold">⬇️</span></div>
                  <div><p className="font-semibold text-gray-900">Family Savings Circle</p><p className="text-xs text-gray-500">Today, 2:34 PM</p></div>
                </div>
                <p className="font-bold text-red-600">-50,000 XAF</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><span className="text-green-600 font-bold">⬆️</span></div>
                  <div><p className="font-semibold text-gray-900">Top up from MTN</p><p className="text-xs text-gray-500">Yesterday, 10:15 AM</p></div>
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
            <div className="mb-6">
              <p className="text-gray-700 font-semibold mb-3">Select Type</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setNewPaymentType('card')} className={`py-3 px-4 rounded-xl font-semibold border-2 transition ${newPaymentType === 'card' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-200 text-gray-700'}`}>💳 Card</button>
                <button onClick={() => setNewPaymentType('mobile')} className={`py-3 px-4 rounded-xl font-semibold border-2 transition ${newPaymentType === 'mobile' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-200 text-gray-700'}`}>📱 Mobile Money</button>
              </div>
            </div>
            {newPaymentType === 'card' && (
              <div className="space-y-4">
                <div><label className="text-gray-700 font-semibold mb-2 block">Card Brand</label><input type="text" value={newPaymentData.cardName} onChange={(e) => setNewPaymentData({...newPaymentData, cardName: e.target.value})} placeholder="e.g., Visa, Mastercard" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none" /></div>
                <div><label className="text-gray-700 font-semibold mb-2 block">Last 4 Digits</label><input type="text" maxLength={4} value={newPaymentData.last4} onChange={(e) => setNewPaymentData({...newPaymentData, last4: e.target.value.replace(/[^0-9]/g, '')})} placeholder="1234" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none" /></div>
              </div>
            )}
            {newPaymentType === 'mobile' && (
              <div className="space-y-4">
                <div><label className="text-gray-700 font-semibold mb-2 block">Provider</label>
                  <select value={newPaymentData.provider} onChange={(e) => setNewPaymentData({...newPaymentData, provider: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none">
                    <option value="">Select provider</option><option value="MTN">MTN</option><option value="Airtel">Airtel</option><option value="Orange">Orange</option><option value="Moov">Moov</option>
                  </select>
                </div>
                <div><label className="text-gray-700 font-semibold mb-2 block">Phone Number</label><input type="tel" value={newPaymentData.phoneNumber} onChange={(e) => setNewPaymentData({...newPaymentData, phoneNumber: e.target.value})} placeholder="+242 06 123 4567" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none" /></div>
              </div>
            )}
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowAddPaymentModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSavePayment} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Add Method</button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && paymentToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🗑️</span></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Remove Payment Method?</h2>
              <p className="text-gray-600">Are you sure you want to remove <span className="font-bold">{paymentToDelete.type === 'card' ? `${paymentToDelete.name} ••••${paymentToDelete.last4}` : paymentToDelete.name}</span>?</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => { setShowDeleteConfirm(false); setPaymentToDelete(null); }} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">Remove</button>
            </div>
          </div>
        </div>
      )}
      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Up Card</h2>
            <div className="mb-6">
              <label className="text-gray-700 font-semibold mb-2 block">Amount (XAF)</label>
              <div className="relative">
                <input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} placeholder="50000" className="w-full border-2 border-gray-200 rounded-xl p-4 pr-16 text-2xl font-bold text-gray-900 focus:border-blue-500 focus:outline-none" />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">XAF</span>
              </div>
              <div className="flex space-x-2 mt-3">
                {[10000, 25000, 50000, 100000].map(amount => (
                  <button key={amount} onClick={() => setTopUpAmount(amount.toString())} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold text-sm">{(amount/1000)}k</button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="text-gray-700 font-semibold mb-3 block">Select Source</label>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <button key={method.id} onClick={() => setTopUpSource(method)} className={`w-full p-4 rounded-xl border-2 transition flex items-center space-x-3 ${topUpSource?.id === method.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.type === 'card' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                      {method.type === 'card' ? <CreditCard className="text-blue-600" size={24} /> : <span className="text-2xl">📱</span>}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-900">{method.type === 'card' ? `${method.name} ••••${method.last4}` : method.name}</p>
                      <p className="text-sm text-gray-500">{method.type === 'card' ? 'Credit/Debit Card' : method.number}</p>
                    </div>
                    {topUpSource?.id === method.id && <CheckCircle2 className="text-blue-600" size={24} />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowTopUpModal(false)} disabled={isProcessing} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold disabled:opacity-50">Cancel</button>
              <button onClick={handleTopUpConfirm} disabled={isProcessing} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center">
                {isProcessing ? <><span className="animate-spin mr-2">⏳</span>Processing...</> : 'Confirm Top Up'}
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
            <div><p className="font-bold">Top Up Successful!</p><p className="text-sm">+{parseFloat(topUpAmount).toLocaleString()} XAF added to your card</p></div>
          </div>
        </div>
      )}
    </div>
  );
};
