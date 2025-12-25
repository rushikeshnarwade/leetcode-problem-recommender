'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getAllTags } from '@/lib/problemService';

export interface FilterOptions {
  ratingRange: [number, number];
  searchQuery: string;
  selectedTags: string[];
}

interface ProblemFiltersProps {
  filters: FilterOptions;
  userRating: number;
  totalProblems: number;
  onFiltersChange: (filters: FilterOptions) => void;
}

const ProblemFilters: React.FC<ProblemFiltersProps> = ({
  filters,
  userRating,
  totalProblems,
  onFiltersChange,
}) => {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAllTags(getAllTags());
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (tagDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [tagDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTagDropdownOpen(false);
        setTagSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return allTags;
    const search = tagSearch.toLowerCase();
    return allTags.filter(tag => tag.toLowerCase().includes(search));
  }, [allTags, tagSearch]);

  const handleRatingRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange: [number, number] = [...filters.ratingRange];
    if (type === 'min') {
      newRange[0] = value;
    } else {
      newRange[1] = value;
    }
    onFiltersChange({ ...filters, ratingRange: newRange });
  };

  const setRatingRange = (delta: number | 'all') => {
    if (delta === 'all') {
      onFiltersChange({ ...filters, ratingRange: [800, 3500] });
    } else {
      onFiltersChange({
        ...filters,
        ratingRange: [userRating - delta, userRating + delta],
      });
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const clearAllTags = () => {
    onFiltersChange({ ...filters, selectedTags: [] });
  };

  const resetFilters = () => {
    onFiltersChange({
      ratingRange: [800, 3500],
      searchQuery: '',
      selectedTags: [],
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Row 1: Search, Rating, Quick buttons, Reset */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto">
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Search
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Problem title or ID..."
                value={filters.searchQuery}
                onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-text placeholder-textMuted focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>
          </div>

          {/* Rating Range */}
          <div className="w-full lg:w-auto">
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Rating Interval
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.ratingRange[0]}
                onChange={(e) => handleRatingRangeChange('min', parseInt(e.target.value) || 800)}
                className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-center text-text focus:outline-none focus:border-accent-blue transition-colors"
                min="800"
                max="3500"
              />
              <span className="text-textMuted">—</span>
              <input
                type="number"
                value={filters.ratingRange[1]}
                onChange={(e) => handleRatingRangeChange('max', parseInt(e.target.value) || 3500)}
                className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-center text-text focus:outline-none focus:border-accent-blue transition-colors"
                min="800"
                max="3500"
              />
            </div>
          </div>

          {/* Quick Range Buttons */}
          <div className="flex gap-1.5 flex-wrap">
            {[50, 100, 200].map((delta) => {
              const isActive =
                filters.ratingRange[0] === userRating - delta &&
                filters.ratingRange[1] === userRating + delta;
              return (
                <button
                  key={delta}
                  onClick={() => setRatingRange(delta)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                    ? 'bg-accent-blue/20 border border-accent-blue/30 text-accent-blue'
                    : 'bg-background border border-border text-textSecondary hover:bg-surfaceHover hover:border-borderLight'
                    }`}
                >
                  ±{delta}
                </button>
              );
            })}
            <button
              onClick={() => setRatingRange('all')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.ratingRange[0] === 800 && filters.ratingRange[1] === 3500
                ? 'bg-accent-blue/20 border border-accent-blue/30 text-accent-blue'
                : 'bg-background border border-border text-textSecondary hover:bg-surfaceHover hover:border-borderLight'
                }`}
            >
              All
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Row 2: Tag Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="text-sm font-medium text-textSecondary whitespace-nowrap">
            Tags:
          </label>
          <div className="relative w-full sm:w-80" ref={dropdownRef}>
            <button
              onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-left text-text hover:border-borderLight transition-colors flex items-center justify-between"
            >
              <span className={filters.selectedTags.length === 0 ? 'text-textMuted' : ''}>
                {filters.selectedTags.length === 0
                  ? 'Select tags...'
                  : `${filters.selectedTags.length} tag${filters.selectedTags.length > 1 ? 's' : ''} selected`}
              </span>
              <svg
                className={`w-4 h-4 text-textMuted transition-transform ${tagDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {tagDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
                {/* Search input inside dropdown */}
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search tags..."
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-sm text-text placeholder-textMuted focus:outline-none focus:border-accent-blue transition-colors"
                    />
                  </div>
                </div>

                {/* Tags list */}
                <div className="max-h-56 overflow-y-auto">
                  {filteredTags.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-textMuted text-center">
                      No tags found
                    </div>
                  ) : (
                    filteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-surfaceHover transition-colors flex items-center gap-2 ${filters.selectedTags.includes(tag) ? 'bg-accent-blue/10 text-accent-blue' : 'text-text'
                          }`}
                      >
                        <span className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${filters.selectedTags.includes(tag)
                            ? 'bg-accent-blue border-accent-blue'
                            : 'border-border'
                          }`}>
                          {filters.selectedTags.includes(tag) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                        {tag}
                      </button>
                    ))
                  )}
                </div>

                {/* Clear all button */}
                {filters.selectedTags.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <button
                      onClick={clearAllTags}
                      className="w-full px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      Clear all tags
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected tags display */}
          {filters.selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {filters.selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded-md flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemFilters;