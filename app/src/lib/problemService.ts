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

/**
 * Get a single problem by its slug
 */
export const getProblemBySlug = (slug: string): Problem | undefined => {
  const problem = problemsData.find(p => p.slug === slug);
  if (!problem) return undefined;

  return {
    ...problem,
    difficulty: problem.difficulty as 'easy' | 'medium' | 'hard',
    contestSlug: problem.contestSlug || undefined,
    problemIndex: problem.problemIndex || undefined,
    lastUpdated: new Date(),
  };
};

/**
 * Get related problems based on tags, difficulty, and rating
 */
export const getRelatedProblems = (currentSlug: string, limit: number = 5): Problem[] => {
  const currentProblem = problemsData.find(p => p.slug === currentSlug);
  if (!currentProblem) return [];

  const scoredProblems = problemsData
    .filter(p => p.slug !== currentSlug && !p.isPremium)
    .map(p => {
      let score = 0;

      // 1. Shared Tags (High weight)
      // Check if tags exist before filtering
      const currentTags = currentProblem.tags || [];
      const problemTags = p.tags || [];

      const sharedTags = problemTags.filter((tag: string) => currentTags.includes(tag)).length;
      score += sharedTags * 10;

      // 2. Rating Proximity (Medium weight)
      if (currentProblem.zerotracRating && p.zerotracRating) {
        const ratingDiff = Math.abs(currentProblem.zerotracRating - p.zerotracRating);
        if (ratingDiff <= 100) score += 5;
        else if (ratingDiff <= 200) score += 3;
        else if (ratingDiff <= 300) score += 1;
      }

      // 3. Same Difficulty (Low weight)
      if (p.difficulty === currentProblem.difficulty) {
        score += 2;
      }

      return { problem: p, score };
    });

  // Sort by score (descending) and take top N
  return scoredProblems
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({
      ...item.problem,
      difficulty: item.problem.difficulty as 'easy' | 'medium' | 'hard',
      contestSlug: item.problem.contestSlug || undefined,
      problemIndex: item.problem.problemIndex || undefined,
      lastUpdated: new Date(),
    }));
};

/**
 * Get the next problem by ID
 */
export const getNextProblem = (currentSlug: string): Problem | undefined => {
  const currentProblem = problemsData.find(p => p.slug === currentSlug);
  if (!currentProblem) return undefined;

  // Sort problems by ID to ensure consistent order
  const sortedProblems = [...problemsData]
    .filter(p => !p.isPremium)
    .sort((a, b) => a.id - b.id);

  const currentIndex = sortedProblems.findIndex(p => p.id === currentProblem.id);
  if (currentIndex === -1 || currentIndex === sortedProblems.length - 1) return undefined;

  const nextProblem = sortedProblems[currentIndex + 1];
  return {
    ...nextProblem,
    difficulty: nextProblem.difficulty as 'easy' | 'medium' | 'hard',
    contestSlug: nextProblem.contestSlug || undefined,
    problemIndex: nextProblem.problemIndex || undefined,
    lastUpdated: new Date(),
  };
};

/**
 * Get the previous problem by ID
 */
export const getPreviousProblem = (currentSlug: string): Problem | undefined => {
  const currentProblem = problemsData.find(p => p.slug === currentSlug);
  if (!currentProblem) return undefined;

  // Sort problems by ID to ensure consistent order
  const sortedProblems = [...problemsData]
    .filter(p => !p.isPremium)
    .sort((a, b) => a.id - b.id);

  const currentIndex = sortedProblems.findIndex(p => p.id === currentProblem.id);
  if (currentIndex <= 0) return undefined;

  const prevProblem = sortedProblems[currentIndex - 1];
  return {
    ...prevProblem,
    difficulty: prevProblem.difficulty as 'easy' | 'medium' | 'hard',
    contestSlug: prevProblem.contestSlug || undefined,
    problemIndex: prevProblem.problemIndex || undefined,
    lastUpdated: new Date(),
  };
};