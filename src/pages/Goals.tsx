// @ts-nocheck
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Bell, Zap, Copy, Check, Users, Gift, TrendingUp, PlusCircle, CreditCard, X, User, Search, Settings, FileText, Calendar, File, MessageCircle, MapPin, Shield, Lock, Globe, Folder, UserPlus, CheckCircle2, Scissors, Wallet as WalletIcon } from 'lucide-react';
import { useApp } from '../context';
import { goalsService } from '../services/goals.service';

export const Goals: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    userGoals, setUserGoals, selectedGoal, setSelectedGoal,
    activeLikeLemba, userPlan, setUserPlan, getPlanLimits, canCreateCustomGoal, calculateAdminFee
  } = useApp();
  const [subScreen, setSubScreen] = React.useState<string>(searchParams.get('screen') || 'my-goals');

  React.useEffect(() => {
    const s = searchParams.get('screen');
    if (s) setSubScreen(s);
    // If selectedGoal exists and no screen specified, show goal-detail
    if (!s && selectedGoal) setSubScreen('goal-detail');
  }, [searchParams, selectedGoal]);

  const GoalDetailScreen = () => {
    if (!selectedGoal || !selectedGoal.name) return null;

    const userGoal = userGoals.find(g => g.name === selectedGoal.name.replace('\n', ' '));
    const progress = userGoal ? Math.floor((userGoal.currentAmount / userGoal.targetAmount) * 100) : 0;

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => navigate('/')}>
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
                  navigate('/');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold shadow-lg"
              >
                🚀 Start This Goal
              </button>
            ) : (
              <button 
                onClick={() => navigate('/goals?screen=saving-programs')}
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


  const SavingProgramsScreen = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/goals')}>
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
            onClick={() => navigate('/goals')}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold"
          >
            Contribute Now
          </button>
        </div>
      </div>
    </div>
  );


  const MyGoalsScreen = () => {
    const activeGoals = userGoals.filter(g => g.active);
    const completedGoals = userGoals.filter(g => !g.active && g.currentAmount >= g.targetAmount);

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => navigate('/')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">My Goals</h1>
          <button onClick={() => setSubScreen('create-goal')}>
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
                          navigate('/goals');
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
                  onClick={() => setSubScreen('create-goal')}
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


  const CreateGoalScreen = () => {
    // Check if user can create custom goals
    if (!canCreateCustomGoal()) {
      return (
        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <button onClick={() => navigate('/goals')}>
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
                  onClick={() => navigate('/goals?screen=upgrade')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold"
                >
                  🚀 Upgrade Now
                </button>
                <button 
                  onClick={() => navigate('/goals?screen=feature-store')}
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

    const handleCreate = async () => {
      if (!goalName || !goalAmount || !goalDeadline || !goalCategory) {
        alert('Please fill in all fields');
        return;
      }

      try {
        // Call backend to create goal
        await goalsService.createGoal({
          title: goalName,
          target_amount: parseInt(goalAmount),
          deadline: goalDeadline,
          category: goalCategory,
          description: ''
        });

        // Refresh goals from backend
        const goalsRes = await goalsService.getGoals();
        if (goalsRes.success && goalsRes.data) {
          setUserGoals(goalsRes.data);
        }

        alert('Goal created successfully!');
        navigate('/goals');
      } catch (error: any) {
        console.error('Error creating goal:', error);
        alert(error.message || 'Failed to create goal. Please try again.');
      }
    };

    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => navigate('/goals')}>
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


  const UpgradeScreen = () => {
    const plans = ['bronze', 'silver', 'gold'].map(tier => ({
      tier,
      ...getPlanLimits(tier)
    }));

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => navigate('/profile')}>
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
                          navigate('/goals?screen=my-plan');
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
                onClick={() => navigate('/goals?screen=feature-store')}
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


  const MyPlanScreen = () => {
    const currentPlan = getPlanLimits(userPlan.tier);

    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => navigate('/profile')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">My Plan</h1>
          <button onClick={() => navigate('/goals?screen=upgrade')}>
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
                onClick={() => navigate('/goals?screen=upgrade')}
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
          <button onClick={() => navigate('/goals?screen=upgrade')}>
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
                          navigate('/goals?screen=my-plan');
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



  // Sub-screen router
  if (subScreen === 'goal-detail') return <GoalDetailScreen />;
  if (subScreen === 'saving-programs') return <SavingProgramsScreen />;
  if (subScreen === 'create-goal') return <CreateGoalScreen />;
  if (subScreen === 'upgrade') return <UpgradeScreen />;
  if (subScreen === 'my-plan') return <MyPlanScreen />;
  if (subScreen === 'feature-store') return <FeatureStoreScreen />;
  return <MyGoalsScreen />;
};
