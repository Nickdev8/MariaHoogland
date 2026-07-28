import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'self'",
			"object-src 'none'",
			"script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data:",
			"media-src 'self'",
			"font-src 'self' data:",
			"connect-src 'self' https://challenges.cloudflare.com",
			'frame-src https://challenges.cloudflare.com',
			'upgrade-insecure-requests'
		].join('; ')
	);

	if (event.url.protocol === 'https:') {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	}

	return response;
};
