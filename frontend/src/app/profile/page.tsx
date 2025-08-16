'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User as UserType } from '@/types';
import { useRouter } from 'next/navigation';
import { fetchLeetCodeUserStats, fetchLeetCodeContestData } from '@/lib/leetcodeService';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    leetcodeUsername: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserType;
          setUserData(data);
          setFormData({
            displayName: data.displayName || '',
            leetcodeUsername: data.leetcodeUsername || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  const handleSave = async () => {
    if (!user || !userData) return;

    try {
      setUserData({
        ...userData,
        displayName: formData.displayName,
        leetcodeUsername: formData.leetcodeUsername,
      });
      setEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleSyncLeetCode = async () => {
    if (!user || !userData || !formData.leetcodeUsername.trim()) return;

    setSyncing(true);
    try {
      const leetcodeData = await fetchLeetCodeUserStats(formData.leetcodeUsername.trim());
      const leetcodeContestData = await fetchLeetCodeContestData(formData.leetcodeUsername.trim());
      console.log('LeetCode Contest Data received in page.tsx:', leetcodeContestData);
      
      if (leetcodeData && leetcodeData.stats) {
        const newStats = {
          totalSolved: leetcodeData.stats.totalSolved,
          easySolved: leetcodeData.stats.easySolved,
          mediumSolved: leetcodeData.stats.mediumSolved,
          hardSolved: leetcodeData.stats.hardSolved,
          ranking: leetcodeData.stats.ranking,
        };

        await updateDoc(doc(db, 'users', user.uid), {
          leetcodeStats: newStats,
          leetcodeContestStats: leetcodeContestData || null,
          lastSyncedAt: new Date(),
        });

        setUserData({
          ...userData,
          leetcodeStats: newStats,
          leetcodeContestStats: leetcodeContestData || null,
          lastSyncedAt: new Date(),
        });

        alert(`Successfully synced LeetCode stats! Found ${newStats.totalSolved} solved problems.`);
      } else {
        alert('Could not fetch LeetCode data. Please check the username and try again.');
      }
    } catch (error) {
      console.error('Error syncing LeetCode data:', error);
      alert('Error syncing LeetCode data. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getProgressStats = () => {
    if (!userData || !userData.leetcodeStats) {
      return { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, ranking: 0, contestRating: 0 };
    }
    
    return {
      totalSolved: userData.leetcodeStats.totalSolved,
      easySolved: userData.leetcodeStats.easySolved,
      mediumSolved: userData.leetcodeStats.mediumSolved,
      hardSolved: userData.leetcodeStats.hardSolved,
      ranking: userData.leetcodeStats.ranking,
      contestRating: Math.floor(userData.leetcodeContestStats?.rating || 0),
    };
  };

  const stats = getProgressStats();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LeetCode Username
                </label>
                <input
                  type="text"
                  value={formData.leetcodeUsername}
                  onChange={(e) => setFormData({ ...formData, leetcodeUsername: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  placeholder="Enter your LeetCode username"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used to fetch your solved problems and track progress
                </p>
                {formData.leetcodeUsername && !editing && (
                  <button
                    onClick={handleSyncLeetCode}
                    disabled={syncing}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {syncing ? 'Syncing...' : 'Sync from LeetCode'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalSolved}</div>
                <div className="text-sm text-gray-600">Total Solved</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.easySolved}</div>
                <div className="text-sm text-gray-600">Easy</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.mediumSolved}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.hardSolved}</div>
                <div className="text-sm text-gray-600">Hard</div>
              </div>
              {stats.ranking > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.ranking}</div>
                  <div className="text-sm text-gray-600">Ranking</div>
                </div>
              )}
              {stats.contestRating > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.contestRating}</div>
                  <div className="text-sm text-gray-600">Contest Rating</div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Activity</h3>
              <div className="text-sm text-gray-600">
                Last active: {userData?.lastActive ? 
                  new Date(userData.lastActive).toLocaleDateString() : 'Never'}
              </div>
              <div className="text-sm text-gray-600">
                Member since: {userData?.createdAt ? 
                  new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
              {userData?.lastSyncedAt && (
                <div className="text-sm text-gray-600">
                  Last LeetCode sync: {new Date(userData.lastSyncedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}