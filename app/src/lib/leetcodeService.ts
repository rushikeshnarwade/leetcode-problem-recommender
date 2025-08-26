interface LeetCodeUserStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
}

interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: number;
  statusDisplay: string;
  lang: string;
}

export interface LeetCodeUserData {
  username: string;
  stats: LeetCodeUserStats;
  recentSubmissions: LeetCodeSubmission[];
  solvedProblems: string[];
}

export interface LeetCodeContestData {
  attendedContestsCount: number;
  rating: number;
  globalRanking: number;
  totalParticipants: number;
  topPercentage: number;
  badge?: { name: string };
}

// Frontend-only LeetCode data fetching using public APIs
// No backend/API routes required - works with Firebase free tier
export const fetchLeetCodeUserData = async (username: string): Promise<LeetCodeUserData | null> => {
  try {
    console.log('Fetching LeetCode data for username:', username);
    // Use the public LeetCode stats API which doesn't have CORS issues
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Unknown API error');
    }
    
    if (!data || typeof data.totalSolved === 'undefined') {
      throw new Error('Invalid response data from API');
    }

    return {
      username,
      stats: {
        totalSolved: data.totalSolved || 0,
        totalQuestions: data.totalQuestions || 0,
        easySolved: data.easySolved || 0,
        totalEasy: data.totalEasy || 0,
        mediumSolved: data.mediumSolved || 0,
        totalMedium: data.totalMedium || 0,
        hardSolved: data.hardSolved || 0,
        totalHard: data.totalHard || 0,
        ranking: data.ranking || 0
      },
      recentSubmissions: [], // Not available from this API
      solvedProblems: [] // Not available from this API
    };

  } catch (error) {
    console.error('Error fetching LeetCode user data:', error);
    return null;
  }
};

// Contest data fetching using alfa-leetcode-api
export const fetchLeetCodeContestData = async (username: string): Promise<LeetCodeContestData | null> => {
  try {
    console.log(`Fetching contest data for ${username} from alfa-leetcode-api`);
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Contest API response:', data);
    
    // Check if the response indicates user not found or error
    if (!data || data.errors) {
      console.log('No contest data available for user');
      return null;
    }

    return {
      attendedContestsCount: data.contestAttend || 0,
      rating: Math.round(data.contestRating || 0), // Round to nearest integer
      globalRanking: data.contestGlobalRanking || 0,
      totalParticipants: data.totalParticipants || 0,
      topPercentage: data.contestTopPercentage || 0,
    };

  } catch (error) {
    console.error('Error fetching LeetCode contest data:', error);
    console.log(`Contest data not available for ${username} - using fallback`);
    return null;
  }
};

// Simplified stats function that uses the same implementation
export const fetchLeetCodeUserStats = async (username: string): Promise<Partial<LeetCodeUserData> | null> => {
  return await fetchLeetCodeUserData(username);
};