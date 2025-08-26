import { Problem } from '@/types';
import problemsData from '@/data/problems.json';

export const getProblems = async (): Promise<Problem[]> => {
  try {
    console.log('Getting problems from local JSON file...');
    
    const problems = problemsData.map(data => ({
      ...data,
      difficulty: data.difficulty as 'easy' | 'medium' | 'hard',
      contestSlug: data.contestSlug || undefined,
      problemIndex: data.problemIndex || undefined,
      lastUpdated: new Date(),
    })).filter(problem => !problem.isPremium); // Exclude premium problems
    
    console.log('Loaded problems (excluding premium):', problems.length);
    return problems;
  } catch (error) {
    console.error('Error loading problems:', error);
    return [];
  }
};

export interface AdvancedFilterOptions {
  ratingRange: [number, number];
  difficulty?: 'all' | 'easy' | 'medium' | 'hard';
  showSolvedOnly?: boolean;
  showUnsolvedOnly?: boolean;
  tags?: string[];
  searchQuery?: string;
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
    
    // Get all problems from local JSON
    let problems = problemsData.map(data => ({
      ...data,
      difficulty: data.difficulty as 'easy' | 'medium' | 'hard',
      contestSlug: data.contestSlug || undefined,
      problemIndex: data.problemIndex || undefined,
      lastUpdated: new Date(),
    })).filter(problem => !problem.isPremium); // Exclude premium problems

    console.log('After premium filter:', problems.length);

    // Apply rating range filter
    if (filters.ratingRange[0] > 0 && filters.ratingRange[1] > 0) {
      problems = problems.filter(problem => 
        problem.zerotracRating && 
        problem.zerotracRating >= filters.ratingRange[0] && 
        problem.zerotracRating <= filters.ratingRange[1]
      );
      console.log('After rating filter:', problems.length);
    }

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
      problems = problems.filter(problem => problem.difficulty === filters.difficulty);
      console.log('After difficulty filter:', problems.length);
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      problems = problems.filter(problem => 
        filters.tags!.some(tag => problem.tags.includes(tag))
      );
      console.log('After tags filter:', problems.length);
    }

    // Apply search query filter
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      problems = problems.filter(problem => 
        problem.title.toLowerCase().includes(query) ||
        problem.slug.toLowerCase().includes(query) ||
        problem.tags.some(tag => tag.toLowerCase().includes(query))
      );
      console.log('After search filter:', problems.length);
    }

    const allSolved = Array.from(new Set([...solvedProblems, ...manuallyMarkedAsSolved]));

    // Apply solved/unsolved filters
    if (filters.showSolvedOnly) {
      problems = problems.filter(problem => allSolved.includes(problem.slug));
      console.log('After solved-only filter:', problems.length);
    } else if (filters.showUnsolvedOnly) {
      problems = problems.filter(problem => !allSolved.includes(problem.slug));
      console.log('After unsolved-only filter:', problems.length);
    }

    // Sort by zerotrac rating for consistency
    problems.sort((a, b) => (a.zerotracRating || 0) - (b.zerotracRating || 0));

    // Limit results for performance
    return problems.slice(0, 100);
  } catch (error) {
    console.error('Error fetching filtered problems:', error);
    return [];
  }
};

export const getCuratedProblems = async (userRating: number): Promise<Problem[]> => {
  try {
    // Get problems slightly below user rating for daily challenge
    let problems = problemsData.map(data => ({
      ...data,
      difficulty: data.difficulty as 'easy' | 'medium' | 'hard',
      contestSlug: data.contestSlug || undefined,
      problemIndex: data.problemIndex || undefined,
      lastUpdated: new Date(),
    })).filter(problem => !problem.isPremium); // Exclude premium problems
    
    // Filter by rating range
    problems = problems.filter(problem => 
      problem.zerotracRating && 
      problem.zerotracRating >= userRating - 100 && 
      problem.zerotracRating <= userRating
    );
    
    // Sort by rating descending
    problems.sort((a, b) => (b.zerotracRating || 0) - (a.zerotracRating || 0));
    
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
    // This would typically save to local storage or call an API
    // For now, we'll just log it since we removed Firebase dependency
    console.log('Marking problem as solved:', problemSlug, 'for user:', userId);
    
    // You can implement local storage here:
    const solvedProblems = JSON.parse(localStorage.getItem(`solved_${userId}`) || '[]');
    if (!solvedProblems.includes(problemSlug)) {
      solvedProblems.push(problemSlug);
      localStorage.setItem(`solved_${userId}`, JSON.stringify(solvedProblems));
    }
  } catch (error) {
    console.error('Error marking problem as solved:', error);
  }
};

// Helper function to get all available tags
export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  problemsData.forEach(problem => {
    problem.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};