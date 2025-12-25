'use client';

import React, { useState, useMemo } from 'react';
import { Problem } from '@/types';

interface ProblemTableProps {
    problems: Problem[];
    solvedSlugs: string[];
    onToggleSolved?: (slug: string, solved: boolean) => void;
    showSolvedToggle?: boolean;
}

type SortField = 'id' | 'rating' | 'title';
type SortDirection = 'asc' | 'desc';

const ProblemTable: React.FC<ProblemTableProps> = ({
    problems,
    solvedSlugs,
    onToggleSolved,
    showSolvedToggle = false,
}) => {
    const [sortField, setSortField] = useState<SortField>('rating');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const sortedProblems = useMemo(() => {
        return [...problems].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'id':
                    comparison = (a.id || 0) - (b.id || 0);
                    break;
                case 'rating':
                    comparison = (a.zerotracRating || 0) - (b.zerotracRating || 0);
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [problems, sortField, sortDirection]);

    const totalPages = Math.ceil(sortedProblems.length / itemsPerPage);
    const paginatedProblems = sortedProblems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <span className="text-textMuted ml-1">↕</span>;
        }
        return (
            <span className="text-accent-blue ml-1">
                {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'text-green-400 bg-green-400/10';
            case 'medium':
                return 'text-yellow-400 bg-yellow-400/10';
            case 'hard':
                return 'text-red-400 bg-red-400/10';
            default:
                return 'text-textMuted bg-surface';
        }
    };

    return (
        <div className="space-y-4">
            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-textSecondary font-code">
                <span>
                    Total <span className="text-accent-blue font-semibold">{problems.length}</span> problems
                </span>
                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                    <thead className="bg-surface border-b border-border">
                        <tr>
                            <th
                                className="px-4 py-3 text-left font-semibold text-textSecondary cursor-pointer hover:text-text transition-colors"
                                onClick={() => handleSort('id')}
                            >
                                ID <SortIcon field="id" />
                            </th>
                            <th
                                className="px-4 py-3 text-left font-semibold text-textSecondary cursor-pointer hover:text-text transition-colors"
                                onClick={() => handleSort('title')}
                            >
                                Title <SortIcon field="title" />
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-textSecondary">
                                Difficulty
                            </th>
                            <th
                                className="px-4 py-3 text-left font-semibold text-textSecondary cursor-pointer hover:text-text transition-colors"
                                onClick={() => handleSort('rating')}
                            >
                                Rating <SortIcon field="rating" />
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-textSecondary hidden md:table-cell">
                                Tags
                            </th>
                            {showSolvedToggle && (
                                <th className="px-4 py-3 text-center font-semibold text-textSecondary">
                                    Status
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {paginatedProblems.map((problem) => {
                            const isSolved = solvedSlugs.includes(problem.slug);
                            return (
                                <tr
                                    key={problem.slug}
                                    className="bg-background hover:bg-surfaceHover transition-colors"
                                >
                                    <td className="px-4 py-3 font-mono text-textMuted">
                                        {problem.id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <a
                                            href={`https://leetcode.com/problems/${problem.slug}/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-text hover:text-accent-blue transition-colors font-medium"
                                        >
                                            {problem.title}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyClass(problem.difficulty)}`}>
                                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-accent-cyan">
                                        {problem.zerotracRating || '-'}
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {problem.tags?.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 bg-surface border border-border rounded text-xs text-textMuted"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {(problem.tags?.length || 0) > 3 && (
                                                <span className="text-xs text-textMuted">
                                                    +{(problem.tags?.length || 0) - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    {showSolvedToggle && (
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => onToggleSolved?.(problem.slug, !isSolved)}
                                                className={`w-6 h-6 rounded-full border-2 transition-all ${isSolved
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-border hover:border-green-400'
                                                    }`}
                                            >
                                                {isSolved && '✓'}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded border border-border bg-surface text-textSecondary hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        ««
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded border border-border bg-surface text-textSecondary hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        «
                    </button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1.5 rounded border transition-colors ${currentPage === pageNum
                                        ? 'bg-accent-blue text-white border-accent-blue'
                                        : 'border-border bg-surface text-textSecondary hover:bg-surfaceHover'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded border border-border bg-surface text-textSecondary hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        »
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded border border-border bg-surface text-textSecondary hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        »»
                    </button>
                </div>
            )}

            {/* Empty state */}
            {problems.length === 0 && (
                <div className="text-center py-12 text-textSecondary">
                    <div className="text-4xl mb-4">🔍</div>
                    <p>No problems found matching your filters.</p>
                    <p className="text-sm mt-2">Try adjusting the rating range or search query.</p>
                </div>
            )}
        </div>
    );
};

export default ProblemTable;
