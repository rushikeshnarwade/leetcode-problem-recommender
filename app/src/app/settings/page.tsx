'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface UserSettings {
  emailNotifications: boolean;
  dailyReminders: boolean;
  difficultyPreference: string;
  problemsPerDay: number;
  showRatings: boolean;
  autoMarkSolved: boolean;
}

export default function Settings() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    dailyReminders: false,
    difficultyPreference: 'mixed',
    problemsPerDay: 3,
    showRatings: true,
    autoMarkSolved: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Removed emailData state since we're removing email change functionality

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'userSettings', user.uid));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setSettings(prevSettings => ({ ...prevSettings, ...data }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, router]); // Removed settings from dependency array to fix infinite loop

  const handleSettingsUpdate = async () => {
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Create the document if it doesn't exist, or update it if it does
      await updateDoc(doc(db, 'userSettings', user.uid), {
        ...settings,
        lastUpdated: new Date(),
      }).catch(async (error) => {
        // If document doesn't exist, create it
        if (error.code === 'not-found') {
          await setDoc(doc(db, 'userSettings', user.uid), {
            ...settings,
            createdAt: new Date(),
            lastUpdated: new Date(),
          });
        } else {
          throw error;
        }
      });
      
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (error: any) {
      console.error('Settings update error:', error);
      setError('Failed to update settings: ' + (error.message || 'Unknown error'));
      setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !user.email) {
      setError('No user found. Please log in again.');
      return;
    }

    // Validation
    if (!passwordData.currentPassword.trim()) {
      setError('Please enter your current password');
      return;
    }

    if (!passwordData.newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Re-authenticate the user first
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update the password
      await updatePassword(user, passwordData.newPassword);
      
      // Clear form and show success
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
      
    } catch (error: any) {
      console.error('Password update error:', error);
      let errorMessage = 'Failed to update password';
      
      // Provide more specific error messages
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log back in, then try again';
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      setError(errorMessage);
      setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
    } finally {
      setSaving(false);
    }
  };

  // Removed email change functionality as requested

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-text font-code flex items-center gap-3">
        <div className="w-8 h-8 bg-accent-blue/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        Settings
      </h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg font-code animate-slide-up">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg font-code animate-slide-up">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* App Preferences */}
        <div className="card-elevated">
          <h2 className="text-xl font-semibold text-text mb-6 font-code flex items-center gap-2">
            <div className="w-6 h-6 bg-accent-purple/20 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            App Preferences
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
              <label className="text-sm font-medium text-textSecondary font-code">
                Email Notifications
              </label>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-200 cursor-pointer ${
                  settings.emailNotifications ? 'bg-accent-blue' : 'bg-border'
                }`} onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
              <label className="text-sm font-medium text-textSecondary font-code">
                Daily Reminders
              </label>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.dailyReminders}
                  onChange={(e) => setSettings({ ...settings, dailyReminders: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-200 cursor-pointer ${
                  settings.dailyReminders ? 'bg-accent-blue' : 'bg-border'
                }`} onClick={() => setSettings({ ...settings, dailyReminders: !settings.dailyReminders })}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                    settings.dailyReminders ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
              <label className="text-sm font-medium text-textSecondary font-code">
                Show Problem Ratings
              </label>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.showRatings}
                  onChange={(e) => setSettings({ ...settings, showRatings: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-200 cursor-pointer ${
                  settings.showRatings ? 'bg-accent-blue' : 'bg-border'
                }`} onClick={() => setSettings({ ...settings, showRatings: !settings.showRatings })}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                    settings.showRatings ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2 font-code">
                Difficulty Preference
              </label>
              <select
                value={settings.difficultyPreference}
                onChange={(e) => setSettings({ ...settings, difficultyPreference: e.target.value })}
                className="input font-code"
              >
                <option value="easy">Easy Only</option>
                <option value="medium">Medium Only</option>
                <option value="hard">Hard Only</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-3 font-code">
                Problems Per Day ({settings.problemsPerDay})
              </label>
              <div className="px-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.problemsPerDay}
                  onChange={(e) => setSettings({ ...settings, problemsPerDay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #7aa2f7 0%, #7aa2f7 ${(settings.problemsPerDay - 1) * 11.11}%, #363c5c ${(settings.problemsPerDay - 1) * 11.11}%, #363c5c 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-textMuted mt-1 font-code">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSettingsUpdate}
            disabled={saving}
            className="btn-primary w-full mt-6"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        {/* Account Security */}
        <div className="space-y-6">
          {/* Change Password */}
          <div className="card-elevated">
            <h2 className="text-xl font-semibold text-text mb-4 font-code flex items-center gap-2">
              <div className="w-6 h-6 bg-success/20 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V11a2 2 0 012-2m0 0V9a2 2 0 012-2v0a2 2 0 012-2m0 0V7a2 2 0 012-2h4a2 2 0 012 2v0M7 21h10a2 2 0 002-2V11a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              Change Password
            </h2>
            
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="input-enhanced"
              />
              
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="input-enhanced"
              />
              
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="input-enhanced"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={saving}
              className="w-full mt-6 bg-success/20 text-success py-2 px-4 rounded-lg hover:bg-success/30 disabled:opacity-50 font-medium border border-success/30 transition-all duration-200"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>

          {/* Account Info Display */}
          <div className="card-elevated">
            <h2 className="text-xl font-semibold text-text mb-4 font-code flex items-center gap-2">
              <div className="w-6 h-6 bg-accent-blue/20 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Account Information
            </h2>
            <div className="text-sm text-textSecondary font-code bg-surface p-4 rounded border border-border">
              <span className="text-textMuted">Email:</span> <span className="text-accent-cyan">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
