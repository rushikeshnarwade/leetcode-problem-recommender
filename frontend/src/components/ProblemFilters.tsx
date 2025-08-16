import React from 'react';

export interface FilterOptions {
  ratingRange: [number, number];
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  showSolvedOnly: boolean;
  showUnsolvedOnly: boolean;
}

interface ProblemFiltersProps {
  filters: FilterOptions;
  userRating: number;
  onFiltersChange: (filters: FilterOptions) => void;
}

const ProblemFilters: React.FC<ProblemFiltersProps> = ({
  filters,
  userRating,
  onFiltersChange
}) => {
  const handleRatingRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange: [number, number] = [...filters.ratingRange];
    if (type === 'min') {
      newRange[0] = value;
    } else {
      newRange[1] = value;
    }
    onFiltersChange({ ...filters, ratingRange: newRange });
  };

  const resetToUserRating = () => {
    onFiltersChange({
      ...filters,
      ratingRange: [userRating - 50, userRating + 50]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        
        {/* Rating Range */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Rating Range:</label>
          <input
            type="number"
            value={filters.ratingRange[0]}
            onChange={(e) => handleRatingRangeChange('min', parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
            min="800"
            max="3500"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            value={filters.ratingRange[1]}
            onChange={(e) => handleRatingRangeChange('max', parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
            min="800"
            max="3500"
          />
          <button
            onClick={resetToUserRating}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
          >
            Reset to ±50
          </button>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Difficulty:</label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFiltersChange({ ...filters, difficulty: e.target.value as FilterOptions['difficulty'] })}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Solved Status Filter */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.showSolvedOnly}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                showSolvedOnly: e.target.checked,
                showUnsolvedOnly: e.target.checked ? false : filters.showUnsolvedOnly
              })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Solved only</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.showUnsolvedOnly}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                showUnsolvedOnly: e.target.checked,
                showSolvedOnly: e.target.checked ? false : filters.showSolvedOnly
              })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Unsolved only</span>
          </label>
        </div>

        {/* Reset All Filters */}
        <button
          onClick={() => onFiltersChange({
            ratingRange: [userRating - 50, userRating + 50],
            difficulty: 'all',
            showSolvedOnly: false,
            showUnsolvedOnly: true
          })}
          className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default ProblemFilters;
