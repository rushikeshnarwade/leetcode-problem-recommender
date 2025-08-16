export interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  acceptanceRate: number;
  isPremium: boolean;
  zerotracRating?: number;
  lastUpdated: Date;
  contestSlug?: string;
  problemIndex?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  leetcodeUsername?: string;
  rating: number;
  solvedProblems: string[];
  manuallyMarkedAsSolved?: string[];
  leetcodeStats?: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
  };
  leetcodeContestStats?: {
    attendedContestsCount: number;
    rating: number;
    globalRanking: number;
    totalParticipants: number;
    topPercentage: number;
    badge?: { name: string };
  };
  createdAt: Date;
  lastActive: Date;
  lastSyncedAt?: Date;
}

export interface UserProgress {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  maxStreak: number;
}