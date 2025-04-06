"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Award, Crown, Medal, ArrowLeft, Plus, Minus } from 'lucide-react';

interface LoyaltyMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: string;
  benefits: any[];
  history: any[];
  createdAt: string;
  updatedAt: string;
}

interface HistoryItem {
  type: 'earned' | 'redeemed';
  amount: number;
  date: string;
  bookingId?: string;
  reward?: string;
}

interface Props {
  id: string;
}

export default function LoyaltyMemberDetails({ id }: Props) {
  const router = useRouter();
  const [member, setMember] = useState<LoyaltyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddPoints, setShowAddPoints] = useState(false);
  const [showRedeemPoints, setShowRedeemPoints] = useState(false);
  const [pointsData, setPointsData] = useState({
    points: 0,
    bookingId: '',
    reward: '',
  });

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/loyalty?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty member');
      }
      const data = await response.json();
      setMember(data);
      setError(null);
    } catch (err) {
      setError('Failed to load loyalty member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/loyalty?action=points&id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points: pointsData.points,
          bookingId: pointsData.bookingId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add points');
      }

      await fetchMember();
      setShowAddPoints(false);
      setPointsData({ points: 0, bookingId: '', reward: '' });
    } catch (err) {
      setError('Failed to add points');
      console.error(err);
    }
  };

  const handleRedeemPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/loyalty?action=redeem&id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points: pointsData.points,
          reward: pointsData.reward,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to redeem points');
      }

      await fetchMember();
      setShowRedeemPoints(false);
      setPointsData({ points: 0, bookingId: '', reward: '' });
    } catch (err) {
      setError('Failed to redeem points');
      console.error(err);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return <Crown className="text-purple-500" size={24} />;
      case 'gold':
        return <Award className="text-yellow-500" size={24} />;
      case 'silver':
        return <Medal className="text-gray-400" size={24} />;
      default:
        return <Star className="text-amber-600" size={24} />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Member not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Loyalty Member Details</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-4">
            {getTierIcon(member.tier)}
            <div>
              <h2 className="font-semibold">{member.name}</h2>
              <p className="text-sm text-gray-500">{member.email}</p>
              <p className="text-sm text-gray-500">{member.phone}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium">Current Tier</span>
              <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getTierColor(member.tier)}`}>
                {member.tier.charAt(0).toUpperCase() + member.tier.slice(1)}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Points Balance</span>
              <p className="text-2xl font-bold">{member.points}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Member Since</span>
              <p className="text-sm text-gray-600">{formatDate(member.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Benefits</h3>
          <ul className="space-y-2">
            {member.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm">{benefit.description}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => setShowAddPoints(true)}
              className="w-full flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus size={16} />
              Add Points
            </button>
            <button
              onClick={() => setShowRedeemPoints(true)}
              className="w-full flex items-center justify-center gap-1 bg-amber-600 text-white px-3 py-1.5 rounded-md hover:bg-amber-700 transition-colors text-sm"
            >
              <Minus size={16} />
              Redeem Points
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Points History</h3>
          <div className="space-y-4">
            {member.history.map((item: HistoryItem, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  item.type === 'earned' ? 'bg-green-500' : 'bg-amber-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium">
                    {item.type === 'earned' ? 'Earned' : 'Redeemed'} {item.amount} points
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                  {item.bookingId && (
                    <p className="text-xs text-gray-500">Booking ID: {item.bookingId}</p>
                  )}
                  {item.reward && (
                    <p className="text-xs text-gray-500">Reward: {item.reward}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddPoints && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Points</h2>
            <form onSubmit={handleAddPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Points</label>
                <input
                  type="number"
                  value={pointsData.points}
                  onChange={(e) => setPointsData({ ...pointsData, points: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Booking ID (Optional)</label>
                <input
                  type="text"
                  value={pointsData.bookingId}
                  onChange={(e) => setPointsData({ ...pointsData, bookingId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPoints(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Add Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRedeemPoints && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Redeem Points</h2>
            <form onSubmit={handleRedeemPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Points</label>
                <input
                  type="number"
                  value={pointsData.points}
                  onChange={(e) => setPointsData({ ...pointsData, points: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                  min="1"
                  max={member.points}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reward</label>
                <input
                  type="text"
                  value={pointsData.reward}
                  onChange={(e) => setPointsData({ ...pointsData, reward: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRedeemPoints(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700"
                >
                  Redeem Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 