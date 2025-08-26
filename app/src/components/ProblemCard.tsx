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
  showSolvedToggle = false,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'difficulty-easy';
      case 'medium':
        return 'difficulty-medium';
      case 'hard':
        return 'difficulty-hard';
      default:
        return 'bg-surface border border-border text-textMuted';
    }
  };

  return (
    <div
      className={`card-elevated hover:card-elevated group relative overflow-hidden animate-slide-up transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
        isSolved ? 'ring-2 ring-success/50 shadow-success/20' : ''
      }`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-text truncate text-lg font-code tracking-tight group-hover:text-accent-cyan transition-colors duration-200">
            {problem.title}
          </h3>
          {problem.isPremium && (
            <span className="bg-accent-orange/20 text-accent-orange border border-accent-orange/30 text-xs px-2 py-1 rounded-full ml-2 font-medium">
              ⭐ Premium
            </span>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-4">
            <span className={getDifficultyColor(problem.difficulty)}>
              {problem.difficulty.toUpperCase()}
            </span>
            {problem.zerotracRating && (
              <span className="text-sm text-textSecondary font-code bg-surface/50 px-2 py-1 rounded border border-border/50">
                Rating: <span className="text-accent-cyan font-medium">{Math.round(problem.zerotracRating)}</span>
              </span>
            )}
          </div>

          <div className="text-sm text-textSecondary mb-4 font-code">
            <span className="text-textMuted">Acceptance:</span> <span className="text-accent-green font-medium">{(problem.acceptanceRate * 100).toFixed(1)}%</span>
          </div>

          {/* Tags */}
          {problem.tags && problem.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {problem.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2 py-1 rounded bg-surfaceElevated text-textSecondary border border-border/50 group-hover:border-borderLight transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
                {problem.tags.length > 4 && (
                  <span className="text-xs font-medium px-2 py-1 rounded bg-surface/50 text-textMuted border border-dashed border-border/30">
                    +{problem.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <a
            href={`https://leetcode.com/problems/${problem.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-center group/button relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Solve Problem
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 transform scale-x-0 group-hover/button:scale-x-100 transition-transform duration-300 origin-left"></div>
          </a>
          {showSolvedToggle && onToggleSolved && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleSolved(problem.slug, !isSolved);
              }}
              className={`p-3 rounded-lg transition-all duration-200 border ${
                isSolved
                  ? 'bg-success/10 text-success border-success/30 hover:bg-success/20 shadow-success/20'
                  : 'bg-surface hover:bg-surfaceHover text-textSecondary border-border hover:border-borderLight hover:text-accent-cyan'
              }`}
              title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;