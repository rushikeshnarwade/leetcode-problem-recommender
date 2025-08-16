'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Problem, User as UserType } from '@/types';
import ProblemCard from '@/components/ProblemCard';
import CuratedSection from '@/components/CuratedSection';
import ProblemFilters, { FilterOptions } from '@/components/ProblemFilters';
import { getProblems, getAdvancedFilteredProblems, markProblemAsSolved } from '@/lib/problemService';
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
    showUnsolvedOnly: true
  });

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
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Welcome to LeetCode Problem Recommender
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get personalized problem recommendations based on your skill level and progress
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Show sample problems even for non-authenticated users */}
        {problems.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Sample Problems
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome back!
        </h1>
        <p className="text-gray-600">
          Here are your personalized problem recommendations
        </p>
      </div>

      <CuratedSection userRating={userRating} />

      <ProblemFilters
        filters={filters}
        userRating={userRating}
        onFiltersChange={setFilters}
      />

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recommended Problems for You
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Problems filtered by your preferences {userData?.solvedProblems?.length ? 
            `(${userData.solvedProblems.length} solved problems excluded)` : ''}
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
