import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/layout';
import { circlesService, LikeLemba, CreateLikeLembaData } from '../services/circles.service';

type TabType = 'my-circles' | 'discover' | 'create';

export const Circles: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('my-circles');
  const [myCircles, setMyCircles] = useState<LikeLemba[]>([]);
  const [discoverCircles, setDiscoverCircles] = useState<LikeLemba[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating circle
  const [formData, setFormData] = useState<CreateLikeLembaData>({
    name: '',
    description: '',
    contribution_amount: 0,
    frequency: 'monthly',
    total_slots: 10,
    visibility: 'public',
    auto_start: true,
  });

  useEffect(() => {
    loadCircles();
  }, [activeTab]);

  const loadCircles = async () => {
    try {
      setLoading(true);
      if (activeTab === 'my-circles') {
        const response = await circlesService.getMyCircles();
        if (response.success && response.data) {
          setMyCircles(response.data);
        }
      } else if (activeTab === 'discover') {
        const response = await circlesService.discoverCircles();
        if (response.success && response.data) {
          setDiscoverCircles(response.data);
        }
      }
    } catch (err) {
      console.error('Error loading circles:', err);
      setError('Failed to load circles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await circlesService.createCircle(formData);
      if (response.success) {
        setShowCreateModal(false);
        setActiveTab('my-circles');
        loadCircles();
        // Reset form
        setFormData({
          name: '',
          description: '',
          contribution_amount: 0,
          frequency: 'monthly',
          total_slots: 10,
          visibility: 'public',
          auto_start: true,
        });
      }
    } catch (err) {
      console.error('Error creating circle:', err);
      setError('Failed to create circle');
    }
  };

  const handleJoinCircle = async (id: number) => {
    try {
      const response = await circlesService.joinCircle(id);
      if (response.success) {
        loadCircles();
      }
    } catch (err) {
      console.error('Error joining circle:', err);
      setError('Failed to join circle');
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const renderCircleCard = (circle: LikeLemba, isMember: boolean = false) => (
    <div key={circle.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{circle.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{circle.description}</p>
        </div>
        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(circle.status)}`}>
          {circle.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Contribution</p>
          <p className="font-semibold text-sm">{formatCurrency(circle.contribution_amount)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Frequency</p>
          <p className="font-semibold text-sm capitalize">{circle.frequency}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Members</p>
          <p className="font-semibold text-sm">{circle.current_members}/{circle.total_slots}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Next Payout</p>
          <p className="font-semibold text-sm">{formatDate(circle.next_payout_date)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Slots Filled</span>
          <span>{circle.current_members}/{circle.total_slots}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${(circle.current_members / circle.total_slots) * 100}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isMember ? (
          <>
            <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700">
              View Details
            </button>
            {circle.my_slot && (
              <div className="bg-gray-100 py-2 px-4 rounded-lg text-sm font-medium text-gray-700">
                Slot #{circle.my_slot}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => handleJoinCircle(circle.id)}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            Join Circle
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={t('circles.myCircles')} />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('my-circles')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'my-circles'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Circles
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'discover'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* My Circles Tab */}
            {activeTab === 'my-circles' && (
              <div>
                {myCircles.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No circles yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating or joining a circle</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-6 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700"
                    >
                      Create Circle
                    </button>
                  </div>
                ) : (
                  myCircles.map(circle => renderCircleCard(circle, true))
                )}
              </div>
            )}

            {/* Discover Tab */}
            {activeTab === 'discover' && (
              <div>
                {discoverCircles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No public circles available at the moment</p>
                  </div>
                ) : (
                  discoverCircles.map(circle => renderCircleCard(circle, false))
                )}
              </div>
            )}
          </>
        )}

        {/* Floating Create Button */}
        {activeTab === 'my-circles' && myCircles.length > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-24 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Circle</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateCircle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Circle Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Family Savings Circle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the purpose of this circle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Amount (FCFA)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={formData.contribution_amount}
                    onChange={(e) => setFormData({ ...formData, contribution_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots</label>
                  <input
                    type="number"
                    required
                    min="2"
                    max="100"
                    value={formData.total_slots}
                    onChange={(e) => setFormData({ ...formData, total_slots: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'public' | 'private' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="public">Public - Anyone can discover and join</option>
                    <option value="private">Private - Invitation code required</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto_start"
                    checked={formData.auto_start}
                    onChange={(e) => setFormData({ ...formData, auto_start: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto_start" className="ml-2 block text-sm text-gray-700">
                    Auto-start when all slots are filled
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    Create Circle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
