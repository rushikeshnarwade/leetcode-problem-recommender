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
      // Update the document in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        leetcodeUsername: formData.leetcodeUsername,
        lastUpdated: new Date(),
      });

      // Update local state
      setUserData({
        ...userData,
        displayName: formData.displayName,
        leetcodeUsername: formData.leetcodeUsername,
      });
      setEditing(false);

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleSyncLeetCode = async () => {
    if (!user || !userData || !formData.leetcodeUsername.trim()) {
      alert('Please enter a LeetCode username first.');
      return;
    }

    setSyncing(true);
    try {
      console.log('Syncing LeetCode data for username:', formData.leetcodeUsername.trim());
      const leetcodeData = await fetchLeetCodeUserStats(formData.leetcodeUsername.trim());
      const leetcodeContestData = await fetchLeetCodeContestData(formData.leetcodeUsername.trim());
      console.log('LeetCode Data received:', leetcodeData);
      console.log('LeetCode Contest Data received:', leetcodeContestData);

      if (leetcodeData && leetcodeData.stats) {
        console.log('LeetCode stats object:', leetcodeData.stats);

        const newStats = {
          totalSolved: leetcodeData.stats.totalSolved || 0,
          easySolved: leetcodeData.stats.easySolved || 0,
          mediumSolved: leetcodeData.stats.mediumSolved || 0,
          hardSolved: leetcodeData.stats.hardSolved || 0,
          ranking: leetcodeData.stats.ranking || 0,
        };

        console.log('Processed stats:', newStats);

        // Use actual contest rating if available, otherwise calculate based on problems solved
        const newRating = leetcodeContestData?.rating || Math.max(800, Math.floor(leetcodeData.stats.totalSolved * 2.5));

        const updateData: any = {
          leetcodeStats: newStats,
          rating: newRating,
          lastSyncedAt: new Date(),
        };

        // Only include leetcodeContestStats if it's not null
        if (leetcodeContestData) {
          updateData.leetcodeContestStats = leetcodeContestData;
        }

        console.log('Update data to be sent to Firestore:', updateData);

        await updateDoc(doc(db, 'users', user.uid), updateData);

        console.log('Firestore update successful');

        const newUserData: any = {
          ...userData,
          leetcodeStats: newStats,
          rating: newRating,
          lastSyncedAt: new Date(),
        };

        // Only include leetcodeContestStats if it's not null
        if (leetcodeContestData) {
          newUserData.leetcodeContestStats = leetcodeContestData;
        }

        setUserData(newUserData);

        const ratingSource = leetcodeContestData?.rating ? 'contest rating' : 'estimated rating';
        alert(`Successfully synced LeetCode stats! Found ${newStats.totalSolved} solved problems. ${ratingSource}: ${newRating}.`);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
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

  // Helper function to format Firestore timestamps
  const formatDate = (date: any): string => {
    if (!date) return 'Unknown';
    try {
      // Handle Firestore Timestamp objects
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate().toLocaleDateString();
      }
      // Handle seconds-based timestamp objects
      if (date.seconds) {
        return new Date(date.seconds * 1000).toLocaleDateString();
      }
      // Handle regular Date objects or ISO strings
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString();
      }
      return 'Unknown';
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="card-elevated">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text font-code">Profile</h1>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="btn-primary"
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-text mb-4 font-code flex items-center gap-2">
              <div className="w-6 h-6 bg-accent-blue/20 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1 font-code">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="input disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1 font-code">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!editing}
                  className="input disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1 font-code">
                  LeetCode Username
                </label>
                <input
                  type="text"
                  value={formData.leetcodeUsername}
                  onChange={(e) => setFormData({ ...formData, leetcodeUsername: e.target.value })}
                  disabled={!editing}
                  className="input disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your LeetCode username"
                />
                <p className="text-xs text-textMuted mt-1 font-code">
                  Used to fetch your solved problems and track progress
                </p>
                {formData.leetcodeUsername && !editing && (
                  <button
                    onClick={handleSyncLeetCode}
                    disabled={syncing}
                    className="mt-2 bg-success/20 text-success px-4 py-2 rounded-lg text-sm hover:bg-success/30 disabled:opacity-50 font-medium border border-success/30 transition-all duration-200 flex items-center gap-2"
                  >
                    {syncing && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {syncing ? 'Syncing...' : 'Sync from LeetCode'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-4 font-code flex items-center gap-2">
              <div className="w-6 h-6 bg-accent-green/20 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Progress Statistics
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-900/30 border border-primary-700/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-400 font-code">{stats.totalSolved}</div>
                <div className="text-sm text-textSecondary font-code">Total Solved</div>
              </div>

              <div className="bg-accent-green/10 border border-accent-green/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent-green font-code">{stats.easySolved}</div>
                <div className="text-sm text-textSecondary font-code">Easy</div>
              </div>

              <div className="bg-accent-yellow/10 border border-accent-yellow/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent-yellow font-code">{stats.mediumSolved}</div>
                <div className="text-sm text-textSecondary font-code">Medium</div>
              </div>

              <div className="bg-accent-red/10 border border-accent-red/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent-red font-code">{stats.hardSolved}</div>
                <div className="text-sm text-textSecondary font-code">Hard</div>
              </div>
              {stats.ranking > 0 && (
                <div className="bg-accent-purple/10 border border-accent-purple/30 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-accent-purple font-code">{stats.ranking}</div>
                  <div className="text-sm text-textSecondary font-code">Ranking</div>
                </div>
              )}
              {stats.contestRating > 0 && (
                <div className="bg-accent-orange/10 border border-accent-orange/30 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-accent-orange font-code">{stats.contestRating}</div>
                  <div className="text-sm text-textSecondary font-code">Contest Rating</div>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-text mb-3 font-code flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-textSecondary font-code">
                  <span className="text-textMuted">Last active:</span> <span className="text-accent-cyan">{formatDate(userData?.lastActive)}</span>
                </div>
                <div className="text-sm text-textSecondary font-code">
                  <span className="text-textMuted">Member since:</span> <span className="text-accent-cyan">{formatDate(userData?.createdAt)}</span>
                </div>
                {userData?.lastSyncedAt && (
                  <div className="text-sm text-textSecondary font-code">
                    <span className="text-textMuted">Last LeetCode sync:</span> <span className="text-accent-cyan">{formatDate(userData.lastSyncedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}