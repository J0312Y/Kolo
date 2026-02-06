// @ts-nocheck
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Bell, Zap, Copy, Check, Users, Gift, TrendingUp, PlusCircle, CreditCard, X, User, Search, Settings, FileText, Calendar, File, MessageCircle, MapPin, Shield, Lock, Globe, Folder, UserPlus, CheckCircle2, Scissors, Wallet as WalletIcon, MoreVertical, Smile, Send } from 'lucide-react';
import { useApp } from '../context';
import { circlesService } from '../services/circles.service';
import { notificationsService } from '../services/notifications.service';

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


export const Circles: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    activeLikeLemba, finishedLikeLemba, selectedLikeLemba, setSelectedLikeLemba,
    notifications, setNotifications, handleCopyCode, copied, setCopied,
    selectedCircle, setSelectedCircle, selectedDuration, setSelectedDuration,
    calculateTotalPayout, circleAmount, setCircleAmount, circleDuration, setCircleDuration,
    selectedPaymentMethod, setSelectedPaymentMethod, paymentDetails, setPaymentDetails,
    likeLembaName, setLikeLembaName, likeLembaAmount, setLikeLembaAmount,
    likeLembaDuration, setLikeLembaDuration, likeLembaMembers, setLikeLembaMembers,
    likeLembaDescription, setLikeLembaDescription, joinCode, setJoinCode,
    addLikeLemba, selectedSlot, setSelectedSlot, referralCode,
    groupChats, setGroupChats, chatMessage, setChatMessage, sendMessage,
    durations, circles, calculateAdminFee, userPlan, copyToClipboard
  } = useApp();
  const [subScreen, setSubScreen] = React.useState<string>(searchParams.get('screen') || 'circles');
  const [circlesTab, setCirclesTab] = React.useState<'active' | 'finished'>('active');
  const [selectedPayoutMethod, setSelectedPayoutMethod] = React.useState<string | null>(null);
  const [slotTab, setSlotTab] = React.useState('first');
  const [showCorporateModal, setShowCorporateModal] = React.useState(false);
  const [corporateStep, setCorporateStep] = React.useState(1);
  const [currentOfferIndex, setCurrentOfferIndex] = React.useState(0);
  const mobileNumberRef = React.useRef<HTMLInputElement>(null);
  const bankNameRef = React.useRef<HTMLInputElement>(null);
  const accountNumberRef = React.useRef<HTMLInputElement>(null);
  const accountNameRef = React.useRef<HTMLInputElement>(null);
  const cardNumberRef = React.useRef<HTMLInputElement>(null);
  const cardExpiryRef = React.useRef<HTMLInputElement>(null);
  const cardCVVRef = React.useRef<HTMLInputElement>(null);
  const chatInputRef = React.useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const circleAmountRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const s = searchParams.get('screen');
    if (s) setSubScreen(s);
  }, [searchParams]);

  const CirclesScreen = () => {
    const displayCircles = circlesTab === 'active' ? activeLikeLemba : finishedLikeLemba;
    
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
        <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between">
          <h1 className="text-gray-900 text-2xl font-bold">My circles</h1>
          <div className="flex space-x-3">
            <Zap className="text-gray-700" size={24} />
            <button onClick={() => setSubScreen('notifications')} className="relative">
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
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLikeLemba(circle);
                            setSubScreen('likelemba-details');
                          }}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await circlesService.getMembers(circle.id);
                              if (response.success && response.data) {
                                alert(`Members (${response.data.length}):\n${response.data.map(m => `${m.user?.first_name || 'User'} ${m.user?.last_name || ''} - Slot ${m.slot_number || 'TBD'}`).join('\n')}`);
                              }
                            } catch (error: any) {
                              alert(error.message || 'Failed to fetch members');
                            }
                          }}
                          className="px-4 bg-purple-100 text-purple-600 rounded-xl font-semibold"
                        >
                          <Users size={20} />
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
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            if (!confirm('Are you sure you want to leave this circle?')) return;
                            try {
                              await circlesService.leaveCircle(circle.id);
                              const circlesRes = await circlesService.getMyCircles();
                              if (circlesRes.success && circlesRes.data) {
                                const active = circlesRes.data.filter((c: any) => c.status === 'active' || c.status === 'pending');
                                setActiveLikeLemba(active);
                              }
                              alert('Successfully left the circle');
                            } catch (error: any) {
                              alert(error.message || 'Failed to leave circle');
                            }
                          }}
                          className="flex-1 bg-orange-100 text-orange-600 py-2 rounded-xl font-semibold text-sm"
                        >
                          Leave Circle
                        </button>
                        {circle.type === 'created' && (
                          <button
                            onClick={async () => {
                              if (!confirm('Are you sure you want to delete this circle? This action cannot be undone.')) return;
                              try {
                                await circlesService.deleteCircle(circle.id);
                                const circlesRes = await circlesService.getMyCircles();
                                if (circlesRes.success && circlesRes.data) {
                                  const active = circlesRes.data.filter((c: any) => c.status === 'active' || c.status === 'pending');
                                  setActiveLikeLemba(active);
                                }
                                alert('Circle deleted successfully');
                              } catch (error: any) {
                                alert(error.message || 'Failed to delete circle');
                              }
                            }}
                            className="flex-1 bg-red-100 text-red-600 py-2 rounded-xl font-semibold text-sm"
                          >
                            Delete Circle
                          </button>
                        )}
                      </div>
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
        <button onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-gray-900 text-2xl font-bold mb-2">Choose a service</h1>
      </div>

      <div className="px-6">
        <h2 className="text-gray-700 text-xl mb-6">What would you like to do?</h2>

                  <div className="space-y-4">
          <div 
            onClick={() => setSubScreen('circle-details-amount')}
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
            onClick={() => setSubScreen('join-with-code')}
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
            onClick={() => setSubScreen('create-likelemba-step1')}
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
            onClick={() => setSubScreen('choose-circle')}
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
        <button onClick={() => navigate('/')}>
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
          onClick={() => setSubScreen('referral-tracker')}
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
        <button onClick={() => setSubScreen('join')}>
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
              setSubScreen('choose-duration');
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
              setSubScreen('choose-duration');
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
          <button onClick={() => setSubScreen('referral')}>
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
              onClick={() => setSubScreen('referral')}
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
          <button onClick={() => setSubScreen('choose-circle')}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Choose Duration</h1>
          <button onClick={() => setSubScreen('choose-circle')}>
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
            onClick={() => setSubScreen('choose-payment-method')}
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
          <button onClick={() => setSubScreen('choose-duration')}>
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
                setSubScreen('payment-details');
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
          <button onClick={() => setSubScreen('choose-payment-method')}>
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
              setSubScreen('payment-confirmation');
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
          <button onClick={() => setSubScreen('payment-details')}>
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
              navigate('/circles');
              }}
            className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-lg"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    );
  };


  const NotificationsScreen = () => {
    const [notificationFilter, setNotificationFilter] = React.useState("all");
    const unreadCount = notifications.filter(n => !n.read).length;
    
    const filteredNotifications = notificationFilter === 'all' 
      ? notifications 
      : notifications.filter(n => n.type === notificationFilter);

    const markAsRead = async (id) => {
      try {
        await notificationsService.markAsRead(id);
        setNotifications(notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    };

    const markAllAsRead = async () => {
      try {
        await notificationsService.markAllAsRead();
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
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


  const GroupChatScreen = () => {
    if (!selectedLikeLemba) return null;

    const messages = groupChats[selectedLikeLemba.name] || [];

    // Fetch chat messages on mount
    React.useEffect(() => {
      const fetchChatMessages = async () => {
        if (!selectedLikeLemba?.id) return;
        try {
          const response = await circlesService.getChatMessages(selectedLikeLemba.id);
          if (response.success && response.data) {
            setGroupChats(prev => ({
              ...prev,
              [selectedLikeLemba.name]: response.data
            }));
          }
        } catch (error) {
          console.error('Error fetching chat messages:', error);
        }
      };
      fetchChatMessages();
    }, [selectedLikeLemba?.id]);
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
            <button onClick={() => setSubScreen('likelemba-details')}>
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
              onKeyPress={async (e) => {
                if (e.key === 'Enter') {
                  const message = e.target.value;
                  if (message.trim()) {
                    try {
                      await circlesService.sendChatMessage(selectedLikeLemba.id, message);
                      // Refresh messages
                      const response = await circlesService.getChatMessages(selectedLikeLemba.id);
                      if (response.success && response.data) {
                        setGroupChats(prev => ({
                          ...prev,
                          [selectedLikeLemba.name]: response.data
                        }));
                      }
                      e.target.value = '';
                    } catch (error) {
                      console.error('Error sending message:', error);
                      alert('Failed to send message. Please try again.');
                    }
                  }
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none text-gray-900 placeholder-gray-500"
            />

            <button
              onClick={async () => {
                const message = chatInputRef.current?.value;
                if (message && message.trim()) {
                  try {
                    await circlesService.sendChatMessage(selectedLikeLemba.id, message);
                    // Refresh messages
                    const response = await circlesService.getChatMessages(selectedLikeLemba.id);
                    if (response.success && response.data) {
                      setGroupChats(prev => ({
                        ...prev,
                        [selectedLikeLemba.name]: response.data
                      }));
                    }
                    chatInputRef.current.value = '';
                  } catch (error) {
                    console.error('Error sending message:', error);
                    alert('Failed to send message. Please try again.');
                  }
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
          <button onClick={() => setSubScreen('join')}>
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
            onClick={() => canProceed && setSubScreen('circle-details-duration')}
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
          <button onClick={() => setSubScreen('circle-details-amount')}>
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
            onClick={() => circleDuration && setSubScreen('circle-slot')}
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
          <button onClick={() => setSubScreen('circle-details-duration')}>
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
            onClick={() => selectedSlot && setSubScreen('payout-method-selection')}
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
          <button onClick={() => setSubScreen('circle-slot')}>
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
                setSubScreen('bank-transfer-form');
              } else if (selectedMethod === 'digital') {
                setSubScreen('digital-wallet-form');
              } else {
                setSubScreen('scan-national-id');
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
          <button onClick={() => setSubScreen('payout-method-selection')}>
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
            onClick={() => setSubScreen('scan-national-id')}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg mb-3"
          >
            Save
          </button>
          <button 
            onClick={() => setSubScreen('scan-national-id')}
            className="w-full bg-gray-100 text-gray-900 py-4 rounded-full font-bold text-lg"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  };


  const JoinWithCodeScreen = () => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => setSubScreen('join')}>
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
          onClick={() => setSubScreen('join-group-details')}
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
        <button onClick={() => setSubScreen('join-with-code')}>
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
          onClick={async () => {
            try {
              // Call backend to join with code
              await circlesService.joinWithCode(joinCode);

              // Refresh circles from backend
              const circlesRes = await circlesService.getMyCircles();
              if (circlesRes.success && circlesRes.data) {
                const active = circlesRes.data.filter((c: any) => c.status === 'active' || c.status === 'pending');
                setActiveLikeLemba(active);
              }

              // Reset join code
              setJoinCode('');

              alert('Successfully joined the circle!');
              navigate('/circles');
            } catch (error: any) {
              console.error('Error joining circle:', error);
              alert(error.message || 'Failed to join circle. Please try again.');
            }
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
        <button onClick={() => setSubScreen('join')}>
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
          onClick={() => setSubScreen('create-likelemba-step2')}
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
        <button onClick={() => setSubScreen('create-likelemba-step1')}>
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
          onClick={() => setSubScreen('create-likelemba-step3')}
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
        <button onClick={() => setSubScreen('create-likelemba-step2')}>
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
          onClick={() => setSubScreen('likelemba-created')}
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
          onClick={async () => {
            try {
              // Call backend to create circle
              await circlesService.createCircle({
                name: likeLembaName,
                description: likeLembaDescription,
                contribution_amount: parseInt(likeLembaAmount),
                frequency: 'monthly',
                total_slots: parseInt(likeLembaMembers),
                visibility: 'private',
                auto_start: true
              });

              // Refresh circles from backend
              const circlesRes = await circlesService.getMyCircles();
              if (circlesRes.success && circlesRes.data) {
                const active = circlesRes.data.filter((c: any) => c.status === 'active' || c.status === 'pending');
                setActiveLikeLemba(active);
              }

              // Reset form
              setLikeLembaName('');
              setLikeLembaAmount('');
              setLikeLembaDuration(null);
              setLikeLembaDescription('');

              alert('Circle created successfully!');
              navigate('/circles');
            } catch (error: any) {
              console.error('Error creating circle:', error);
              alert(error.message || 'Failed to create circle. Please try again.');
            }
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
          <button onClick={() => navigate('/circles')}>
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
            onClick={() => setSubScreen('group-chat')}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2"
          >
            <MessageCircle size={24} />
            <span>Group Chat</span>
          </button>
          <button 
            onClick={() => navigate('/circles')}
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
        <button onClick={() => setSubScreen('payout-method-selection')}>
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
          onClick={() => setSubScreen('scan-national-id')}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg mb-3"
        >
          Next
        </button>
        <button 
          onClick={() => setSubScreen('scan-national-id')}
          className="w-full bg-gray-100 text-gray-900 py-4 rounded-full font-bold text-lg"
        >
          Skip for now
        </button>
      </div>
    </div>
  );

  const BottomNav = () => {
    const tabs = [
      { id: 'home', icon: Home, label: 'Home' },
      { id: 'circles', icon: Users, label: 'Circles' },
      { id: 'join', icon: PlusCircle, label: 'Join', isCenter: true },
      { id: 'payment', icon: Wallet, label: 'Wallet' },
      { id: 'card', icon: CreditCard, label: 'Card' },
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
                    setSubScreen(tab.id);
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
                  setSubScreen(tab.id);
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


  // Sub-screen router
  if (subScreen === 'join') return <JoinScreen />;
  if (subScreen === 'referral') return <ReferralScreen />;
  if (subScreen === 'choose-circle') return <ChooseCircleScreen />;
  if (subScreen === 'referral-tracker') return <ReferralTrackerScreen />;
  if (subScreen === 'choose-duration') return <ChooseDurationScreen />;
  if (subScreen === 'choose-payment-method') return <ChoosePaymentMethodScreen />;
  if (subScreen === 'payment-details') return <PaymentDetailsScreen />;
  if (subScreen === 'payment-confirmation') return <PaymentConfirmationScreen />;
  if (subScreen === 'notifications') return <NotificationsScreen />;
  if (subScreen === 'group-chat') return <GroupChatScreen />;
  if (subScreen === 'circle-details-amount') return <CircleDetailsAmountScreen />;
  if (subScreen === 'circle-details-duration') return <CircleDetailsDurationScreen />;
  if (subScreen === 'circle-slot') return <CircleSlotScreen />;
  if (subScreen === 'payout-method-selection') return <PayoutMethodSelectionScreen />;
  if (subScreen === 'bank-transfer-form') return <BankTransferFormScreen />;
  if (subScreen === 'join-with-code') return <JoinWithCodeScreen />;
  if (subScreen === 'join-group-details') return <JoinGroupDetailsScreen />;
  if (subScreen === 'create-likelemba-step1') return <CreateLikeLembaStep1Screen />;
  if (subScreen === 'create-likelemba-step2') return <CreateLikeLembaStep2Screen />;
  if (subScreen === 'create-likelemba-step3') return <CreateLikeLembaStep3Screen />;
  if (subScreen === 'likelemba-created') return <LikeLembaCreatedScreen />;
  if (subScreen === 'likelemba-details') return <LikeLembaDetailsScreen />;
  if (subScreen === 'digital-wallet-form') return <DigitalWalletFormScreen />;
  return <CirclesScreen />;
};
