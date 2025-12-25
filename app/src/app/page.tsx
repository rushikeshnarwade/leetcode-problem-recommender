'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Problem, User as UserType } from '@/types';
import ProblemTable from '@/components/ProblemTable';
import ProblemFilters from '@/components/ProblemFilters';
import { getFilteredProblems, markProblemAsSolved, getSolvedProblems, FilterOptions } from '@/lib/problemService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [userRating, setUserRating] = useState(1500);
  const [solvedSlugs, setSolvedSlugs] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    ratingRange: [800, 3500],
    searchQuery: '',
    selectedTags: []
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

            // Load solved problems from localStorage and Firebase
            const localSolved = getSolvedProblems(user.uid);
            const firebaseSolved = data.solvedProblems || [];
            const manuallyMarked = data.manuallyMarkedAsSolved || [];
            setSolvedSlugs([...new Set([...localSolved, ...firebaseSolved, ...manuallyMarked])]);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Fetch problems when filters change
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const filteredProblems = await getFilteredProblems(filters);
        setProblems(filteredProblems);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [filters]);

  const handleToggleSolved = async (slug: string, solved: boolean) => {
    if (!user) return;

    try {
      if (solved) {
        await markProblemAsSolved(user.uid, slug);
        setSolvedSlugs(prev => [...prev, slug]);
      }
    } catch (error) {
      console.error('Error updating solved status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <ProblemFilters
          filters={filters}
          userRating={userRating}
          totalProblems={problems.length}
          onFiltersChange={setFilters}
        />

        {/* Problems Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-textSecondary">
              <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
              <span>Loading problems...</span>
            </div>
          </div>
        ) : (
          <ProblemTable
            problems={problems}
            solvedSlugs={solvedSlugs}
            onToggleSolved={handleToggleSolved}
            showSolvedToggle={!!user}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-textMuted">
            <span>
              Problem ratings from{' '}
              <a
                href="https://zerotrac.github.io/leetcode_problem_rating/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                Zerotrac
              </a>
            </span>
            <a
              href="https://github.com/rushikeshnarwade/leetcode-problem-recommender"
              target="_blank"
              rel="noopener noreferrer"
              className="text-textMuted hover:text-text transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
