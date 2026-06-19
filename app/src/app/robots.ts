import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/profile', '/settings'],
        },
        sitemap: 'https://problem-recommender.web.app/sitemap.xml',
    };
}
