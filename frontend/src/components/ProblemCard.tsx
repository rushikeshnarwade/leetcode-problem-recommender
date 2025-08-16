import React from 'react';
import { Problem } from '@/types';

interface ProblemCardProps {
  problem: Problem;
  isSolved?: boolean;
  onToggleSolved?: (slug: string, solved: boolean) => void;
  showSolvedToggle?: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ 
  problem, 
  isSolved = false, 
  onToggleSolved,
  showSolvedToggle = false 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
      isSolved ? 'bg-green-50 border-2 border-green-200' : 'bg-white'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-lg font-semibold truncate ${
          isSolved ? 'text-green-800' : 'text-gray-800'
        }`}>
          {problem.title}
          {isSolved && <span className="ml-2 text-green-600">✓</span>}
        </h3>
        <div className="flex items-center gap-2">
          {problem.isPremium && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              Premium
            </span>
          )}
          {showSolvedToggle && onToggleSolved && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleSolved(problem.slug, !isSolved);
              }}
              className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                isSolved 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
            >
              {isSolved ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Done
                </>
              ) : 'Mark Solved'}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
        </span>
        {problem.zerotracRating && (
          <span className="text-sm text-gray-500">
            Rating: {Math.round(problem.zerotracRating)}
          </span>
        )}
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        Acceptance: {(problem.acceptanceRate * 100).toFixed(1)}%
      </div>
      
      <a
        href={`https://leetcode.com/problems/${problem.slug}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center block"
      >
        Solve Problem
      </a>
    </div>
  );
};

export default ProblemCard;
