'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Problem, User as UserType } from '@/types';
import ProblemCard from '@/components/ProblemCard';
import CuratedSection from '@/components/CuratedSection';
import ProblemFilters, { FilterOptions } from '@/components/ProblemFilters';
import { getProblems, getAdvancedFilteredProblems, markProblemAsSolved, getAllTags } from '@/lib/problemService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [userRating, setUserRating] = useState(1500); // Default rating
  const [filters, setFilters] = useState<FilterOptions>({
    ratingRange: [1450, 1550],
    difficulty: 'all',
    showSolvedOnly: false,
    showUnsolvedOnly: true,
    tags: [],
    searchQuery: ''
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch user data when user logs in
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserType;
            setUserData(data);
            const rating = data.leetcodeContestStats?.rating || 1500;
            setUserRating(rating);
            setFilters(prev => ({
              ...prev,
              ratingRange: [rating - 50, rating + 50]
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Load available tags on component mount
  useEffect(() => {
    const tags = getAllTags();
    setAvailableTags(tags);
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        console.log('Fetching problems...');
        // Always fetch problems regardless of authentication status
        const allProblems = await getProblems();
        console.log('All problems fetched:', allProblems.length);
        
        if (user && userData) {
          console.log('User logged in, applying filters');
          const solvedProblems = userData.solvedProblems || [];
          const manuallyMarkedAsSolved = userData.manuallyMarkedAsSolved || [];
          console.log('User has solved', solvedProblems.length, 'problems');
          const filteredProblems = await getAdvancedFilteredProblems(filters, solvedProblems, manuallyMarkedAsSolved);
          console.log('Filtered problems:', filteredProblems.length);
          setProblems(filteredProblems.length > 0 ? filteredProblems : allProblems.slice(0, 20));
        } else {
          console.log('No user or user data, showing sample problems');
          setProblems(allProblems.slice(0, 20)); // Show first 20 problems for non-logged users
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [user, userData, userRating, filters]);

  const handleToggleSolved = async (slug: string, solved: boolean) => {
    if (!user || !userData) return;

    try {
      // Only allow marking as solved for now, as per the new logic
      if (solved) {
        await markProblemAsSolved(user.uid, slug);

        // Update local state
        const updatedManuallyMarked = [...(userData.manuallyMarkedAsSolved || []), slug];
        setUserData({
          ...userData,
          manuallyMarkedAsSolved: updatedManuallyMarked,
        });
        console.log('Marked as solved:', slug);
      }
    } catch (error) {
      console.error('Error updating solved problems:', error);
    }
  };

  if (!user) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text mb-8 font-code">
            Welcome to <span className="text-accent-blue">LeetCode Problem Recommender</span>
          </h1>
          <p className="text-xl text-textSecondary mb-8 font-code">
            Get personalized problem recommendations based on your skill level and progress
          </p>
          <Link
            href="/login"
            className="btn-primary text-lg px-8 py-3"
          >
            Get Started
          </Link>
        </div>

        {/* Show sample problems even for non-authenticated users */}
        {problems.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-text mb-6 font-code flex items-center gap-2">
              <div className="w-6 h-6 bg-accent-cyan/20 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Sample Problems
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {problems.map((problem) => (
                <ProblemCard 
                  key={problem.slug} 
                  problem={problem}
                  isSolved={false}
                  showSolvedToggle={false}
                />
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-surface rounded-lg animate-pulse border border-border" />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center card p-8">
        <h1 className="text-3xl font-bold text-text mb-4 font-code">
          Welcome back, <span className="text-accent-blue">{userData?.displayName || user.email?.split('@')[0]}</span>!
        </h1>
        <p className="text-textSecondary font-code">
          Here are your personalized problem recommendations
        </p>
        {userData?.leetcodeUsername && (
          <p className="text-sm text-textMuted mt-2 font-code">
            Connected to LeetCode: <span className="text-accent-cyan">{userData.leetcodeUsername}</span>
          </p>
        )}
      </div>

      <CuratedSection userRating={userRating} />

      <ProblemFilters
        filters={filters}
        userRating={userRating}
        availableTags={availableTags}
        onFiltersChange={setFilters}
      />

      <div>
        <h2 className="text-2xl font-semibold text-text mb-6 font-code flex items-center gap-2">
          <div className="w-6 h-6 bg-accent-purple/20 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          Recommended Problems for You
        </h2>
        <p className="text-sm text-textMuted mb-6 font-code bg-surface p-3 rounded-lg border border-border">
          Problems filtered by your preferences {userData?.solvedProblems?.length ? 
            `(${userData.solvedProblems.length} solved problems excluded)` : ''}
          <span className="text-accent-green ml-2">• Premium questions excluded</span>
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-surface rounded-lg animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {problems.map((problem) => (
              <ProblemCard 
                key={problem.slug} 
                problem={problem}
                isSolved={userData?.solvedProblems?.includes(problem.slug) || userData?.manuallyMarkedAsSolved?.includes(problem.slug) || false}
                onToggleSolved={handleToggleSolved}
                showSolvedToggle={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
