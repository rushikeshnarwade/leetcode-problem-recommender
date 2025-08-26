#!/usr/bin/env node

/**
 * LeetCode Problems Fetcher
 * Fetches all problems from LeetCode's GraphQL API and generates problems.json
 * 
 * Usage: node fetch-all-problems.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// LeetCode's GraphQL endpoint
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

// GraphQL query to get all problems
const ALL_PROBLEMS_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        title
        titleSlug
        topicTags {
          name
          id
          slug
        }
        hasSolution
        hasVideoSolution
      }
    }
  }
`;

// Function to make GraphQL request
function makeGraphQLRequest(query, variables) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: query,
      variables: variables
    });

    const options = {
      hostname: 'leetcode.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://leetcode.com',
        'Referer': 'https://leetcode.com/problemset/all/'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error('Failed to parse JSON response: ' + error.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Function to estimate zerotrac rating based on difficulty and acceptance rate
function estimateZerotracRating(difficulty, acceptanceRate) {
  const baseRatings = {
    'Easy': 1000,
    'Medium': 1500,
    'Hard': 2000
  };
  
  const base = baseRatings[difficulty] || 1500;
  
  // Adjust based on acceptance rate (lower acceptance = higher rating)
  const acceptanceAdjustment = Math.round((0.5 - acceptanceRate) * 500);
  
  return Math.max(800, Math.min(3500, base + acceptanceAdjustment));
}

// Function to fetch all problems
async function fetchAllProblems() {
  console.log('🚀 Starting to fetch all LeetCode problems...');
  
  try {
    const allProblems = [];
    let skip = 0;
    const limit = 100; // Fetch 100 problems at a time
    let total = 0;

    do {
      console.log(`📡 Fetching problems ${skip + 1} to ${skip + limit}...`);
      
      const variables = {
        categorySlug: "",
        skip: skip,
        limit: limit,
        filters: {}
      };

      const response = await makeGraphQLRequest(ALL_PROBLEMS_QUERY, variables);
      
      if (!response.data || !response.data.problemsetQuestionList) {
        throw new Error('Invalid response structure from LeetCode API');
      }

      const data = response.data.problemsetQuestionList;
      total = data.total;
      
      console.log(`✅ Received ${data.questions.length} problems (Total: ${total})`);
      
      // Process and format the problems
      const formattedProblems = data.questions.map(problem => {
        const acceptanceRate = problem.acRate ? parseFloat(problem.acRate) / 100 : 0.5;
        
        return {
          id: parseInt(problem.frontendQuestionId),
          title: problem.title,
          slug: problem.titleSlug,
          difficulty: problem.difficulty.toLowerCase(),
          acceptanceRate: acceptanceRate,
          isPremium: problem.paidOnly || false,
          zerotracRating: estimateZerotracRating(problem.difficulty, acceptanceRate),
          tags: problem.topicTags ? problem.topicTags.map(tag => tag.name) : [],
          contestSlug: null,
          problemIndex: null
        };
      });

      allProblems.push(...formattedProblems);
      skip += limit;

      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000));

    } while (skip < total);

    console.log(`🎉 Successfully fetched ${allProblems.length} problems!`);
    
    // Sort problems by ID
    allProblems.sort((a, b) => a.id - b.id);

    // Write to JSON file
    const outputPath = path.join(__dirname, '..', 'app', 'src', 'data', 'problems.json');
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(allProblems, null, 2));
    
    console.log(`💾 Saved ${allProblems.length} problems to: ${outputPath}`);
    
    // Print some statistics
    const easyCount = allProblems.filter(p => p.difficulty === 'easy').length;
    const mediumCount = allProblems.filter(p => p.difficulty === 'medium').length;
    const hardCount = allProblems.filter(p => p.difficulty === 'hard').length;
    const premiumCount = allProblems.filter(p => p.isPremium).length;
    
    console.log('\n📊 Statistics:');
    console.log(`   Easy: ${easyCount}`);
    console.log(`   Medium: ${mediumCount}`);
    console.log(`   Hard: ${hardCount}`);
    console.log(`   Premium: ${premiumCount}`);
    console.log(`   Free: ${allProblems.length - premiumCount}`);
    
    // Get unique tags
    const allTags = new Set();
    allProblems.forEach(problem => {
      problem.tags.forEach(tag => allTags.add(tag));
    });
    
    console.log(`   Unique Tags: ${allTags.size}`);
    console.log('   Top Tags:', Array.from(allTags).slice(0, 10).join(', '));
    
    console.log('\n✅ Done! You can now use the updated problems database.');
    
    return allProblems;
    
  } catch (error) {
    console.error('❌ Error fetching problems:', error.message);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('   1. Check your internet connection');
    console.error('   2. LeetCode might be rate limiting - try again later');
    console.error('   3. The API structure might have changed');
    
    process.exit(1);
  }
}

// Alternative function using the Alpha LeetCode API as backup
async function fetchProblemsFromAlphaAPI() {
  console.log('🔄 Trying alternative Alpha LeetCode API...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'alfa-leetcode-api.onrender.com',
      path: '/problems',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const problems = JSON.parse(data);
          
          // Format the problems to match our structure
          const formattedProblems = problems.map(problem => ({
            id: problem.questionId || problem.id || 0,
            title: problem.title,
            slug: problem.titleSlug,
            difficulty: problem.difficulty ? problem.difficulty.toLowerCase() : 'medium',
            acceptanceRate: problem.acRate ? parseFloat(problem.acRate) / 100 : 0.5,
            isPremium: problem.paidOnly || false,
            zerotracRating: estimateZerotracRating(problem.difficulty || 'Medium', problem.acRate ? parseFloat(problem.acRate) / 100 : 0.5),
            tags: problem.topicTags || [],
            contestSlug: null,
            problemIndex: null
          }));
          
          resolve(formattedProblems);
        } catch (error) {
          reject(new Error('Failed to parse Alpha API response: ' + error.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Main execution
if (require.main === module) {
  console.log('🎯 LeetCode Problems Fetcher');
  console.log('==========================\n');
  
  fetchAllProblems()
    .catch(async (error) => {
      console.log('\n🔄 Primary API failed, trying backup...');
      try {
        const problems = await fetchProblemsFromAlphaAPI();
        
        const outputPath = path.join(__dirname, '..', 'app', 'src', 'data', 'problems.json');
        fs.writeFileSync(outputPath, JSON.stringify(problems, null, 2));
        
        console.log(`✅ Successfully fetched ${problems.length} problems using backup API!`);
        console.log(`💾 Saved to: ${outputPath}`);
        
      } catch (backupError) {
        console.error('❌ Both APIs failed:', backupError.message);
        process.exit(1);
      }
    });
}

module.exports = { fetchAllProblems, fetchProblemsFromAlphaAPI };