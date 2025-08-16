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

// Note: This uses a GraphQL query similar to what LeetCode's frontend uses
// In production, you might want to use a proxy server to avoid CORS issues
export const fetchLeetCodeUserData = async (username: string): Promise<LeetCodeUserData | null> => {
  try {
    // GraphQL query to get user stats and recent submissions
    const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
          }
        }
        recentSubmissionList(username: $username) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    const response = await fetch('/api/leetcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    if (!data.data.matchedUser) {
      throw new Error('User not found');
    }

    const matchedUser = data.data.matchedUser;
    const allQuestions = data.data.allQuestionsCount;
    const recentSubmissions = data.data.recentSubmissionList || [];

    // Parse submission stats
    const acSubmissions = matchedUser.submitStats.acSubmissionNum;
    const totalSolved = acSubmissions.find((s: any) => s.difficulty === 'All')?.count || 0;
    const easySolved = acSubmissions.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = acSubmissions.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = acSubmissions.find((s: any) => s.difficulty === 'Hard')?.count || 0;

    const totalEasy = allQuestions.find((q: any) => q.difficulty === 'Easy')?.count || 0;
    const totalMedium = allQuestions.find((q: any) => q.difficulty === 'Medium')?.count || 0;
    const totalHard = allQuestions.find((q: any) => q.difficulty === 'Hard')?.count || 0;

    // Get solved problems from recent submissions (accepted ones)
    const solvedProblems = recentSubmissions
      .filter((s: LeetCodeSubmission) => s.statusDisplay === 'Accepted')
      .map((s: LeetCodeSubmission) => s.titleSlug);

    return {
      username: matchedUser.username,
      stats: {
        totalSolved,
        totalQuestions: totalEasy + totalMedium + totalHard,
        easySolved,
        totalEasy,
        mediumSolved,
        totalMedium,
        hardSolved,
        totalHard,
        ranking: matchedUser.profile.ranking || 0
      },
      recentSubmissions,
      solvedProblems: [...new Set(solvedProblems)] // Remove duplicates
    };

  } catch (error) {
    console.error('Error fetching LeetCode user data:', error);
    return null;
  }
};

export const fetchLeetCodeContestData = async (username: string): Promise<LeetCodeContestData | null> => {
  try {
    const query = `
      query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
      }
    `;

    const response = await fetch('/api/leetcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    if (!data.data.userContestRanking) {
      throw new Error('Contest data not found');
    }

    const contestRanking = data.data.userContestRanking;
    console.log('Raw LeetCode contest data:', contestRanking);

    return {
      attendedContestsCount: contestRanking.attendedContestsCount,
      rating: contestRanking.rating,
      globalRanking: contestRanking.globalRanking,
      totalParticipants: contestRanking.totalParticipants,
      topPercentage: contestRanking.topPercentage,
      badge: contestRanking.badge,
    };

  } catch (error) {
    console.error('Error fetching LeetCode contest data:', error);
    return null;
  }
};

// Alternative method using LeetCode's public API (might be more reliable)
export const fetchLeetCodeUserStats = async (username: string): Promise<Partial<LeetCodeUserData> | null> => {
  try {
    // This endpoint is more reliable but provides less data
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return {
      username,
      stats: {
        totalSolved: data.totalSolved,
        totalQuestions: data.totalQuestions,
        easySolved: data.easySolved,
        totalEasy: data.totalEasy,
        mediumSolved: data.mediumSolved,
        totalMedium: data.totalMedium,
        hardSolved: data.hardSolved,
        totalHard: data.totalHard,
        ranking: data.ranking || 0
      },
      recentSubmissions: [],
      solvedProblems: [] // This API doesn't provide individual solved problems
    };

  } catch (error) {
    console.error('Error fetching LeetCode user stats:', error);
    return null;
  }
};