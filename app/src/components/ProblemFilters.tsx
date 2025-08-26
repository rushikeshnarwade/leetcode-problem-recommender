import React, { useState } from 'react';

export interface FilterOptions {
  ratingRange: [number, number];
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  showSolvedOnly: boolean;
  showUnsolvedOnly: boolean;
  tags: string[];
  searchQuery: string;
}

interface ProblemFiltersProps {
  filters: FilterOptions;
  userRating: number;
  availableTags: string[];
  onFiltersChange: (filters: FilterOptions) => void;
}

const ProblemFilters: React.FC<ProblemFiltersProps> = ({
  filters,
  userRating,
  availableTags,
  onFiltersChange,
}) => {
  const [showAllTags, setShowAllTags] = useState(false);
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
      ratingRange: [userRating - 50, userRating + 50],
    });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearAllTags = () => {
    onFiltersChange({ ...filters, tags: [] });
  };

  const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 10);

  return (
    <div className="card-elevated mb-8 animate-fade-in">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent-blue/20 rounded-lg">
            <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text font-code">Filters</h3>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search problems by title or tags..."
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
              className="input pl-10 w-full font-code text-sm"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onFiltersChange({ ...filters, searchQuery: '' })}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-text transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Main Filters - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Rating Range */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textSecondary font-code">Rating Range:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.ratingRange[0]}
                onChange={(e) => handleRatingRangeChange('min', parseInt(e.target.value) || 0)}
                className="input flex-1 text-center font-code text-sm"
                min="800"
                max="3500"
              />
              <span className="text-accent-blue font-code">—</span>
              <input
                type="number"
                value={filters.ratingRange[1]}
                onChange={(e) => handleRatingRangeChange('max', parseInt(e.target.value) || 0)}
                className="input flex-1 text-center font-code text-sm"
                min="800"
                max="3500"
              />
              <button
                onClick={resetToUserRating}
                className="text-xs bg-accent-blue/20 text-accent-blue px-3 py-2 rounded-lg hover:bg-accent-blue/30 transition-all duration-200 font-medium border border-accent-blue/30 hover:border-accent-blue/50 whitespace-nowrap"
                title="Reset to ±50 of your rating"
              >
                ±50
              </button>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textSecondary font-code">Difficulty:</label>
            <select
              value={filters.difficulty}
              onChange={(e) => onFiltersChange({ ...filters, difficulty: e.target.value as FilterOptions['difficulty'] })}
              className="input font-code text-sm"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Solved Status Filter */}
          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-medium text-textSecondary font-code">Status:</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.showSolvedOnly}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      showSolvedOnly: e.target.checked,
                      showUnsolvedOnly: e.target.checked ? false : filters.showUnsolvedOnly,
                    })}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                    filters.showSolvedOnly 
                      ? 'bg-success border-success shadow-success/20 shadow-lg' 
                      : 'border-border hover:border-borderLight group-hover:bg-surface/50'
                  }`}>
                    {filters.showSolvedOnly && (
                      <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-textSecondary font-code group-hover:text-success transition-colors duration-200">Solved Only</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.showUnsolvedOnly}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      showUnsolvedOnly: e.target.checked,
                      showSolvedOnly: e.target.checked ? false : filters.showSolvedOnly,
                    })}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                    filters.showUnsolvedOnly 
                      ? 'bg-accent-orange border-accent-orange shadow-accent-orange/20 shadow-lg' 
                      : 'border-border hover:border-borderLight group-hover:bg-surface/50'
                  }`}>
                    {filters.showUnsolvedOnly && (
                      <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-textSecondary font-code group-hover:text-accent-orange transition-colors duration-200">Unsolved Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-textSecondary font-code">Tags:</label>
            {filters.tags.length > 0 && (
              <button
                onClick={clearAllTags}
                className="text-xs text-accent-red hover:text-accent-red/80 transition-colors duration-200 font-medium"
              >
                Clear All ({filters.tags.length})
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {displayedTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  filters.tags.includes(tag)
                    ? 'bg-accent-blue text-white border-accent-blue shadow-lg shadow-accent-blue/20'
                    : 'bg-surface text-textSecondary border-border hover:border-borderLight hover:bg-surfaceHover hover:text-text'
                }`}
              >
                {tag}
              </button>
            ))}
            
            {availableTags.length > 10 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-dashed border-border hover:border-borderLight text-textMuted hover:text-text"
              >
                {showAllTags ? 'Show Less' : `+${availableTags.length - 10} More`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemFilters;