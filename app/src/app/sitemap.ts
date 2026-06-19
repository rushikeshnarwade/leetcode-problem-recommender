import { getProblems } from '@/lib/problemService';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://problem-recommender.web.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const problems = await getProblems();

    const problemUrls = problems.map((problem) => ({
        url: `${BASE_URL}/problem/${problem.slug}/`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: `${BASE_URL}/`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily',
            priority: 1,
        },
        ...problemUrls,
    ];
}
