'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
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

  const [emailData, setEmailData] = useState({
    newEmail: '',
    currentPassword: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'userSettings', user.uid));
        if (settingsDoc.exists()) {
          setSettings({ ...settings, ...settingsDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, router, settings]);

  const handleSettingsUpdate = async () => {
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'userSettings', user.uid), settings);
      setSuccess('Settings updated successfully!');
    } catch (error: any) {
      setError('Failed to update settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !user.email) return;

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
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Password updated successfully!');
    } catch (error: any) {
      setError('Failed to update password: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async () => {
    if (!user || !user.email) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const credential = EmailAuthProvider.credential(user.email, emailData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, emailData.newEmail);
      
      setEmailData({ newEmail: '', currentPassword: '' });
      setSuccess('Email updated successfully!');
    } catch (error: any) {
      setError('Failed to update email: ' + error.message);
    } finally {
      setSaving(false);
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* App Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">App Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Daily Reminders
              </label>
              <input
                type="checkbox"
                checked={settings.dailyReminders}
                onChange={(e) => setSettings({ ...settings, dailyReminders: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Show Problem Ratings
              </label>
              <input
                type="checkbox"
                checked={settings.showRatings}
                onChange={(e) => setSettings({ ...settings, showRatings: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Preference
              </label>
              <select
                value={settings.difficultyPreference}
                onChange={(e) => setSettings({ ...settings, difficultyPreference: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="easy">Easy Only</option>
                <option value="medium">Medium Only</option>
                <option value="hard">Hard Only</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problems Per Day ({settings.problemsPerDay})
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.problemsPerDay}
                onChange={(e) => setSettings({ ...settings, problemsPerDay: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={handleSettingsUpdate}
            disabled={saving}
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        {/* Account Security */}
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
            
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={saving}
              className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>

          {/* Change Email */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Email</h2>
            <p className="text-sm text-gray-600 mb-4">Current: {user.email}</p>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="New Email"
                value={emailData.newEmail}
                onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              
              <input
                type="password"
                placeholder="Current Password"
                value={emailData.currentPassword}
                onChange={(e) => setEmailData({ ...emailData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handleEmailChange}
              disabled={saving}
              className="w-full mt-4 bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
