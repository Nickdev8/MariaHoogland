import type { RequestHandler } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { readContent } from '$lib/server/content';

const FALLBACK_SITE = 'https://mariahoogland.nl';

type RouteEntry = { path: string };

const STATIC_ROUTES: RouteEntry[] = [
	{ path: '/' },
	{ path: '/about' },
	{ path: '/portfolio' },
	{ path: '/contact' }
];

const trim = (value: string | undefined | null) => (value ? value.trim() : '');

const resolveBaseUrl = (requestOrigin: string) => {
	const envCandidates = [
		trim(publicEnv.PUBLIC_SITE_URL),
		trim(privateEnv.SITE_URL),
		trim(privateEnv.BASE_URL)
	];
	const candidate = envCandidates.find((value) => value.length > 0);
	const base = candidate ?? requestOrigin ?? FALLBACK_SITE;
	return base.replace(/\/+$/, '');
};

const createUrlSet = (baseUrl: string, routes: RouteEntry[]) =>
	routes
		.map((route) => {
			const loc = `${baseUrl}${route.path === '/' ? '/' : route.path}`;
			return `
	<url>
		<loc>${loc}</loc>
	</url>`;
		})
		.join('');

export const GET: RequestHandler = async ({ url }) => {
	const content = await readContent();
	const baseUrl = resolveBaseUrl(url.origin);
	const projectRoutes: RouteEntry[] = (content.projects ?? []).map((project) => ({
		path: `/${project.slug}`
	}));
	const allRoutes = [...STATIC_ROUTES, ...projectRoutes];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${createUrlSet(baseUrl, allRoutes)}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
