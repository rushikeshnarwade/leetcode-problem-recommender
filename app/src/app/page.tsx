'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Problem, User as UserType, FilterOptions } from '@/types';
import ProblemTable from '@/components/ProblemTable';
import ProblemFilters from '@/components/ProblemFilters';
import { getFilteredProblems, getSolvedProblems } from '@/lib/problemService';
import { arrayRemove, arrayUnion, deleteField, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(1500);
  const [solvedSlugs, setSolvedSlugs] = useState<string[]>([]);
  const [progressError, setProgressError] = useState('');
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    ratingRange: [800, 3500],
    searchQuery: '',
    selectedTags: []
  });
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Load filters from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('leetcode_recommender_filters');
      if (saved) {
        setFilters(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error parsing filters from local storage:', error);
    }
    setFiltersLoaded(true);
  }, []);

  // Keep progress current across devices and migrate progress saved by older versions.
  useEffect(() => {
    setSolvedSlugs([]);
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    let migrationStarted = false;
    let filtersInitialized = false;
    return onSnapshot(userRef, async snapshot => {
      if (!snapshot.exists()) return;
      const data = snapshot.data() as UserType;
      setUserRating(data.leetcodeContestStats?.rating || 1500);
      if (!filtersInitialized) {
        filtersInitialized = true;
        if (data.savedFilters) setFilters(data.savedFilters);
        setLoadedUserId(user.uid);
      }
      const remoteSolved = data.solvedProblems || [];
      const legacySolved = data.manuallyMarkedAsSolved || [];
      const localSolved = getSolvedProblems(user.uid);
      const toMigrate = [...new Set([...legacySolved, ...localSolved])];
      setSolvedSlugs([...new Set([...remoteSolved, ...toMigrate])]);

      if (!migrationStarted && (toMigrate.length || data.manuallyMarkedAsSolved)) {
        migrationStarted = true;
        try {
          await updateDoc(userRef, {
            ...(toMigrate.length ? { solvedProblems: arrayUnion(...toMigrate) } : {}),
            manuallyMarkedAsSolved: deleteField(),
          });
          localStorage.removeItem(`solved_${user.uid}`);
        } catch (error) {
          setProgressError('Could not sync saved progress. Please check your connection.');
          console.error('Error migrating solved problems:', error);
        }
      }
    }, error => {
      setProgressError('Could not load saved progress. Please check your connection.');
      console.error('Error loading user data:', error);
    });
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

  // Save filters to local storage and Firestore when they change
  useEffect(() => {
    if (!filtersLoaded || (user && loadedUserId !== user.uid)) return;
    
    localStorage.setItem('leetcode_recommender_filters', JSON.stringify(filters));

    const timeoutId = setTimeout(() => {
      if (user) {
        updateDoc(doc(db, 'users', user.uid), { savedFilters: filters })
          .catch(err => console.error('Error saving filters to DB:', err));
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [filters, user, filtersLoaded, loadedUserId]);

  const handleToggleSolved = async (slug: string, solved: boolean) => {
    if (!user) return;
    setProgressError('');
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        solvedProblems: solved ? arrayUnion(slug) : arrayRemove(slug),
      });
    } catch (error) {
      setProgressError('Could not save solved status. Please try again.');
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
        {progressError && <p role="alert" className="mb-4 text-red-400">{progressError}</p>}
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
