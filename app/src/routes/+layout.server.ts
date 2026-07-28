import type { LayoutServerLoad } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { readContent } from '$lib/server/content';

const trim = (value: string | undefined | null) => (value ? value.trim() : '');

const resolveSiteUrl = (origin: string) => {
	const candidate =
		trim(publicEnv.PUBLIC_SITE_URL) ||
		trim(privateEnv.SITE_URL) ||
		trim(privateEnv.BASE_URL) ||
		trim(privateEnv.PUBLIC_SITE_URL);

	return (candidate || origin).replace(/\/+$/, '');
};

export const load: LayoutServerLoad = async ({ url }) => {
	const siteUrl = resolveSiteUrl(url.origin);
	const path = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
	const content = await readContent();

	return {
		site: {
			url: siteUrl
		},
		canonical: `${siteUrl}${path}`,
		contact: content.contact,
		footer: content.footer
	};
};
