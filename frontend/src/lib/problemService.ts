import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { Problem } from '@/types';

export const getProblems = async (): Promise<Problem[]> => {
  try {
    console.log('Getting problems from Firestore...');
    const problemsRef = collection(db, 'problems');
    console.log('Collection reference created');
    const snapshot = await getDocs(problemsRef);
    console.log('Snapshot retrieved, docs count:', snapshot.docs.length);
    
    const problems = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        difficulty: data.difficulty,
        acceptanceRate: data.acceptanceRate,
        isPremium: data.isPremium,
        zerotracRating: data.zerotracRating,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        contestSlug: data.contestSlug,
        problemIndex: data.problemIndex,
      } as Problem;
    });
    
    console.log('Mapped problems:', problems.length);
    return problems;
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

export interface AdvancedFilterOptions {
  ratingRange: [number, number];
  difficulty?: 'all' | 'easy' | 'medium' | 'hard';
  showSolvedOnly?: boolean;
  showUnsolvedOnly?: boolean;
}

export const getFilteredProblems = async (
  userRating: number, 
  solvedProblems: string[],
  manuallyMarkedAsSolved: string[]
): Promise<Problem[]> => {
  return getAdvancedFilteredProblems({
    ratingRange: [userRating - 50, userRating + 50],
    difficulty: 'all',
    showSolvedOnly: false,
    showUnsolvedOnly: true
  }, solvedProblems, manuallyMarkedAsSolved);
};

export const getAdvancedFilteredProblems = async (
  filters: AdvancedFilterOptions,
  solvedProblems: string[],
  manuallyMarkedAsSolved: string[]
): Promise<Problem[]> => {
  try {
    console.log('Applying advanced filters:', filters);
    const problemsRef = collection(db, 'problems');
    
    let q = query(problemsRef);
    
    // Apply rating range filter if zerotrac ratings exist
    if (filters.ratingRange[0] > 0 && filters.ratingRange[1] > 0) {
      q = query(
        problemsRef,
        where('zerotracRating', '>=', filters.ratingRange[0]),
        where('zerotracRating', '<=', filters.ratingRange[1]),
        orderBy('zerotracRating')
      );
    }
    
    const snapshot = await getDocs(q);
    console.log('Raw query results:', snapshot.docs.length);
    
    let problems = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        difficulty: data.difficulty,
        acceptanceRate: data.acceptanceRate,
        isPremium: data.isPremium,
        zerotracRating: data.zerotracRating,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        contestSlug: data.contestSlug,
        problemIndex: data.problemIndex,
      } as Problem;
    });

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
      problems = problems.filter(problem => problem.difficulty === filters.difficulty);
      console.log('After difficulty filter:', problems.length);
    }

    const allSolved = [...new Set([...solvedProblems, ...manuallyMarkedAsSolved])];

    // Apply solved/unsolved filters
    if (filters.showSolvedOnly) {
      problems = problems.filter(problem => allSolved.includes(problem.slug));
      console.log('After solved-only filter:', problems.length);
    } else if (filters.showUnsolvedOnly) {
      problems = problems.filter(problem => !allSolved.includes(problem.slug));
      console.log('After unsolved-only filter:', problems.length);
    }

    // Limit results for performance
    return problems.slice(0, 100);
  } catch (error) {
    console.error('Error fetching filtered problems:', error);
    return [];
  }
};

export const getCuratedProblems = async (userRating: number): Promise<Problem[]> => {
  try {
    const problemsRef = collection(db, 'problems');
    
    // Get problems slightly below user rating for daily challenge
    const dailyQuery = query(
      problemsRef,
      where('zerotracRating', '>=', userRating - 100),
      where('zerotracRating', '<=', userRating),
      orderBy('zerotracRating', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(dailyQuery);
    
    const problems = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        difficulty: data.difficulty,
        acceptanceRate: data.acceptanceRate,
        isPremium: data.isPremium,
        zerotracRating: data.zerotracRating,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        contestSlug: data.contestSlug,
        problemIndex: data.problemIndex,
      } as Problem;
    });
    
    // Shuffle and return first 7 for curated sections
    const shuffled = problems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  } catch (error) {
    console.error('Error fetching curated problems:', error);
    return [];
  }
};

export const markProblemAsSolved = async (userId: string, problemSlug: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      manuallyMarkedAsSolved: arrayUnion(problemSlug)
    });
  } catch (error) {
    console.error('Error marking problem as solved:', error);
  }
};