'use client';

import React from 'react';
import { Problem } from '@/types';
import Link from 'next/link';

// Helper type for serialized problem (Date becomes string)
type SerializedProblem = Omit<Problem, 'lastUpdated'> & {
    lastUpdated: string;
};

interface ProblemDetailClientProps {
    problem: SerializedProblem | null;
    slug: string;
    relatedProblems: SerializedProblem[];
    nextProblem: SerializedProblem | null;
    prevProblem: SerializedProblem | null;
}

export default function ProblemDetailClient({ problem, slug, relatedProblems, nextProblem, prevProblem }: ProblemDetailClientProps) {
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

    if (!problem) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-text">
                <h1 className="text-2xl font-bold">Problem Not Found</h1>
                <p className="text-textSecondary">The problem "{slug}" could not be found.</p>
                <Link href="/" className="text-accent-blue hover:underline">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-textSecondary hover:text-text transition-colors"
                    >
                        <span className="mr-2">←</span> Back to Problems
                    </Link>

                    <div className="flex gap-4">
                        {prevProblem ? (
                            <Link
                                href={`/problem/${prevProblem.slug}`}
                                className="inline-flex items-center text-textSecondary hover:text-text transition-colors text-sm"
                            >
                                <span className="mr-1">←</span> Prev: {prevProblem.id}. {prevProblem.title}
                            </Link>
                        ) : (
                            <span className="text-textMuted text-sm cursor-not-allowed opacity-50">
                                <span className="mr-1">←</span> Prev
                            </span>
                        )}

                        <span className="text-border">|</span>

                        {nextProblem ? (
                            <Link
                                href={`/problem/${nextProblem.slug}`}
                                className="inline-flex items-center text-textSecondary hover:text-text transition-colors text-sm"
                            >
                                Next: {nextProblem.id}. {nextProblem.title} <span className="ml-1">→</span>
                            </Link>
                        ) : (
                            <span className="text-textMuted text-sm cursor-not-allowed opacity-50">
                                Next <span className="ml-1">→</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-surface border border-border rounded-lg p-8 shadow-lg mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-textMuted text-lg">#{problem.id}</span>
                                <h1 className="text-3xl font-bold text-text">{problem.title}</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded text-sm font-medium ${getDifficultyClass(problem.difficulty)}`}>
                                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                </span>
                                <span className="text-textMuted bg-surface border border-border px-3 py-1 rounded text-sm">
                                    Rating: <span className="text-accent-cyan font-mono">{problem.zerotracRating || 'N/A'}</span>
                                </span>
                            </div>
                        </div>

                        <a
                            href={`https://leetcode.com/problems/${problem.slug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-accent-blue hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-colors font-medium"
                        >
                            Solve on LeetCode
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="p-4 rounded-md bg-background border border-border">
                                <span className="text-textSecondary block mb-1">Acceptance Rate</span>
                                <span className="font-mono text-lg">{problem.acceptanceRate ? (problem.acceptanceRate * 100).toFixed(1) : '-'}%</span>
                            </div>
                            <div className="p-4 rounded-md bg-background border border-border">
                                <span className="text-textSecondary block mb-1">Total Solved</span>
                                <span className="font-mono text-lg text-textMuted">See LeetCode for details</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {problem.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-textSecondary hover:text-text hover:border-textSecondary transition-colors cursor-default"
                                    >
                                        {tag}
                                    </span>
                                )) || <span className="text-textMuted italic">No tags available</span>}
                            </div>
                        </div>

                        {problem.contestSlug && (
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-2">Contest Info</h3>
                                <p className="text-text">
                                    Appeared in <span className="font-medium text-accent-blue">{problem.contestSlug}</span>
                                    {problem.problemIndex && ` as problem ${problem.problemIndex}`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Problems Section */}
                {relatedProblems.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Similar Problems</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {relatedProblems.map((p) => (
                                <Link
                                    key={p.slug}
                                    href={`/problem/${p.slug}`}
                                    className="group block p-4 bg-surface border border-border rounded-lg hover:border-accent-blue transition-all hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg group-hover:text-accent-blue transition-colors truncate pr-2">
                                            {p.id}. {p.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getDifficultyClass(p.difficulty)}`}>
                                            {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-textSecondary">
                                        <div className="flex gap-2">
                                            <span>Rating: <span className="text-accent-cyan font-mono">{p.zerotracRating || 'N/A'}</span></span>
                                        </div>
                                        {p.tags && p.tags.length > 0 && (
                                            <span className="text-xs px-2 py-0.5 bg-background rounded border border-border/50">
                                                {p.tags.slice(0, 2).join(', ')}{p.tags.length > 2 ? ` +${p.tags.length - 2}` : ''}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
