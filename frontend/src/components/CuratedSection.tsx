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
      bgColor: "bg-gradient-to-r from-blue-500 to-purple-600"
    },
    {
      title: "Weekly Focus",
      description: "Master these fundamentals",
      problems: curatedProblems.slice(1, 4),
      bgColor: "bg-gradient-to-r from-green-500 to-blue-500"
    },
    {
      title: "Challenge Zone",
      description: "Push your boundaries",
      problems: curatedProblems.slice(4, 7),
      bgColor: "bg-gradient-to-r from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Curated for You</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {curatedSections.map((section, index) => (
            <div key={index} className={`${section.bgColor} rounded-lg p-1`}>
              <div className="bg-white rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 mb-4">{section.description}</p>
                
                <div className="space-y-2">
                  {(showAll[section.title] ? section.problems : section.problems.slice(0, 1)).map((problem) => (
                    <div key={problem.slug} className="text-sm">
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <span className="font-medium truncate">{problem.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          problem.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                          problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {section.problems.length > 1 && (
                  <button 
                    onClick={() => toggleShowAll(section.title)}
                    className="w-full mt-4 bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition-colors"
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
