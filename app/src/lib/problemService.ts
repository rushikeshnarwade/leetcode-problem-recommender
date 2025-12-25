import { Problem } from '@/types';
import problemsData from '@/data/problems.json';

export interface FilterOptions {
  ratingRange: [number, number];
  searchQuery: string;
  selectedTags: string[];
}

/**
 * Get all unique tags from problems
 */
export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  problemsData.forEach(problem => {
    problem.tags?.forEach((tag: string) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

/**
 * Get all non-premium problems from the local JSON file
 */
export const getProblems = async (): Promise<Problem[]> => {
  try {
    const problems = problemsData.map(data => ({
      ...data,
      difficulty: data.difficulty as 'easy' | 'medium' | 'hard',
      contestSlug: data.contestSlug || undefined,
      problemIndex: data.problemIndex || undefined,
      lastUpdated: new Date(),
    })).filter(problem => !problem.isPremium);

    return problems;
  } catch (error) {
    console.error('Error loading problems:', error);
    return [];
  }
};

/**
 * Filter problems by rating range, search query, and tags
 */
export const getFilteredProblems = async (
  filters: FilterOptions
): Promise<Problem[]> => {
  try {
    let problems = await getProblems();

    // Apply rating range filter
    if (filters.ratingRange[0] > 0 || filters.ratingRange[1] > 0) {
      problems = problems.filter(problem =>
        problem.zerotracRating &&
        problem.zerotracRating >= filters.ratingRange[0] &&
        problem.zerotracRating <= filters.ratingRange[1]
      );
    }

    // Apply tag filter
    if (filters.selectedTags && filters.selectedTags.length > 0) {
      problems = problems.filter(problem =>
        problem.tags?.some(tag => filters.selectedTags.includes(tag))
      );
    }

    // Apply search query filter (title or ID)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      problems = problems.filter(problem =>
        problem.title.toLowerCase().includes(query) ||
        problem.id?.toString().includes(query) ||
        problem.slug.toLowerCase().includes(query)
      );
    }

    // Sort by rating ascending
    problems.sort((a, b) => (a.zerotracRating || 0) - (b.zerotracRating || 0));

    return problems;
  } catch (error) {
    console.error('Error filtering problems:', error);
    return [];
  }
};

/**
 * Mark a problem as solved (stored in localStorage)
 */
export const markProblemAsSolved = async (userId: string, problemSlug: string): Promise<void> => {
  try {
    const key = `solved_${userId}`;
    const solvedProblems = JSON.parse(localStorage.getItem(key) || '[]');
    if (!solvedProblems.includes(problemSlug)) {
      solvedProblems.push(problemSlug);
      localStorage.setItem(key, JSON.stringify(solvedProblems));
    }
  } catch (error) {
    console.error('Error marking problem as solved:', error);
  }
};

/**
 * Get solved problems for a user from localStorage
 */
export const getSolvedProblems = (userId: string): string[] => {
  try {
    const key = `solved_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    console.error('Error getting solved problems:', error);
    return [];
  }
};