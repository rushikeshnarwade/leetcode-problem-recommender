import { getProblems, getProblemBySlug, getRelatedProblems, getNextProblem, getPreviousProblem } from '@/lib/problemService';
import ProblemDetailClient from '@/components/ProblemDetailClient';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const problems = await getProblems();
    return problems.map((problem) => ({
        slug: problem.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const problem = getProblemBySlug(params.slug);

    if (!problem) {
        return {
            title: 'Problem Not Found',
        };
    }

    return {
        title: `${problem.title} - LeetCode Problem Recommender`,
        description: `Solve ${problem.title} (${problem.difficulty}) on LeetCode. Rating: ${problem.zerotracRating || 'N/A'}. Acceptance Rate: ${problem.acceptanceRate ? (problem.acceptanceRate * 100).toFixed(1) : '-'}%.`,
        openGraph: {
            title: `${problem.title} - LeetCode Problem Recommender`,
            description: `Solve ${problem.title} (${problem.difficulty}) on LeetCode. Rating: ${problem.zerotracRating || 'N/A'}.`,
            type: 'article',
        },
    };
}

export default function ProblemPage({ params }: { params: { slug: string } }) {
    const problem = getProblemBySlug(params.slug);
    const relatedProblems = getRelatedProblems(params.slug);
    const nextProblem = getNextProblem(params.slug);
    const prevProblem = getPreviousProblem(params.slug);

    const serializedProblem = problem ? {
        ...problem,
        lastUpdated: problem.lastUpdated.toISOString()
    } : null;

    const serializedRelated = relatedProblems.map(p => ({
        ...p,
        lastUpdated: p.lastUpdated.toISOString()
    }));

    const serializedNext = nextProblem ? {
        ...nextProblem,
        lastUpdated: nextProblem.lastUpdated.toISOString()
    } : null;

    const serializedPrev = prevProblem ? {
        ...prevProblem,
        lastUpdated: prevProblem.lastUpdated.toISOString()
    } : null;

    const jsonLd = problem ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        'name': problem.title,
        'programmingLanguage': 'Algorithm',
        'author': {
            '@type': 'Organization',
            'name': 'LeetCode'
        },
        'description': `Solve ${problem.title} on LeetCode. Difficulty: ${problem.difficulty}. Rating: ${problem.zerotracRating}.`,
        'url': `https://leetcode.com/problems/${problem.slug}/`,
        'datePublished': new Date().toISOString().split('T')[0]
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProblemDetailClient
                problem={serializedProblem}
                slug={params.slug}
                relatedProblems={serializedRelated}
                nextProblem={serializedNext}
                prevProblem={serializedPrev}
            />
        </>
    );
}
