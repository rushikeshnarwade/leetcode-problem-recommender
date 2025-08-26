'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLeetCodeUserData } from '@/lib/leetcodeService';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingUserData, setFetchingUserData] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Fetch LeetCode user data if username provided
        let leetcodeData = null;
        if (leetcodeUsername.trim()) {
          setFetchingUserData(true);
          try {
            leetcodeData = await fetchLeetCodeUserData(leetcodeUsername.trim());
            if (!leetcodeData) {
              setError('LeetCode username not found. Please check and try again.');
              return;
            }
          } catch (error) {
            console.error('Error fetching LeetCode data:', error);
            // Continue with signup even if LeetCode data fetch fails
          } finally {
            setFetchingUserData(false);
          }
        }
        
        // Create user document in Firestore
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          leetcodeUsername: leetcodeUsername.trim() || null,
          rating: leetcodeData?.stats?.totalSolved ? Math.max(800, leetcodeData.stats.totalSolved * 10) : 1200,
          solvedProblems: [],
          leetcodeStats: leetcodeData?.stats || null,
          createdAt: new Date(),
          lastActive: new Date(),
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      }
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg card-elevated animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-text font-code">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-4 font-code animate-slide-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2 font-code">
              LeetCode Username
            </label>
            <input
              type="text"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              className="input-enhanced"
              placeholder="Enter your LeetCode username"
            />
            <p className="text-xs text-textMuted mt-1 font-code">
              We'll fetch your stats and personalize recommendations
            </p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-textSecondary mb-2 font-code">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-enhanced"
            required
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textSecondary mb-2 font-code">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-enhanced"
            required
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (fetchingUserData ? 'Fetching LeetCode data...' : 'Please wait...') : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-accent-blue hover:text-primary-400 font-code transition-colors duration-200"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
      </div>
    </div>
  );
}