import React, { useEffect, useState } from 'react';
import { Problem } from '@/types';
import ProblemCard from './ProblemCard';
import { getCuratedProblems } from '@/lib/problemService';

interface CuratedSectionProps {
  userRating: number;
}

const CuratedSection: React.FC<CuratedSectionProps> = ({ userRating }) => {
  const [curatedProblems, setCuratedProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCurated = async () => {
      try {
        const problems = await getCuratedProblems(userRating);
        setCuratedProblems(problems);
      } catch (error) {
        console.error('Error fetching curated problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurated();
  }, [userRating]);

  const toggleShowAll = (title: string) => {
    setShowAll(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const curatedSections = [
    {
      title: "Today's Challenge",
      description: "A carefully selected problem for your skill level",
      problems: curatedProblems.slice(0, 1),
      bgColor: "bg-gradient-to-r from-primary-500 to-accent-purple"
    },
    {
      title: "Weekly Focus",
      description: "Master these fundamentals",
      problems: curatedProblems.slice(1, 4),
      bgColor: "bg-gradient-to-r from-accent-green to-accent-cyan"
    },
    {
      title: "Challenge Zone",
      description: "Push your boundaries",
      problems: curatedProblems.slice(4, 7),
      bgColor: "bg-gradient-to-r from-accent-red to-accent-orange"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text font-code flex items-center gap-2">
        <div className="w-6 h-6 bg-accent-cyan/20 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        Curated for You
      </h2>
      
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-surface rounded-lg animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {curatedSections.map((section, index) => (
            <div key={index} className={`${section.bgColor} rounded-xl p-1 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="card h-full">
                <h3 className="text-xl font-semibold text-text mb-2 font-code">
                  {section.title}
                </h3>
                <p className="text-textSecondary mb-4 font-code">{section.description}</p>
                
                <div className="space-y-2">
                  {(showAll[section.title] ? section.problems : section.problems.slice(0, 1)).map((problem) => (
                    <div key={problem.slug} className="text-sm">
                      <div className="flex justify-between items-center p-3 hover:bg-surfaceHover rounded-lg border border-border/50 hover:border-borderLight transition-all duration-200">
                        <span className="font-medium truncate text-text font-code">{problem.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                          problem.difficulty === 'easy' ? 'difficulty-easy' :
                          problem.difficulty === 'medium' ? 'difficulty-medium' :
                          'difficulty-hard'
                        }`}>
                          {problem.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {section.problems.length > 1 && (
                  <button 
                    onClick={() => toggleShowAll(section.title)}
                    className="btn-secondary w-full mt-4"
                  >
                    {showAll[section.title] ? 'Show Less' : 'View All'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CuratedSection;
