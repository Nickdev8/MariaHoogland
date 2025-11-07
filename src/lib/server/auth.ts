import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env as privateEnv } from '$env/dynamic/private';

const COOKIE_NAME = 'mariahoogland_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const getSecret = () => {
	const secret = privateEnv.MARIAHOOGLAND_ADMIN_SECRET;
	if (!secret) {
		throw new Error('MARIAHOOGLAND_ADMIN_SECRET must be configured');
	}
	return secret;
};

export const getAdminPassword = () => {
	const password = privateEnv.MARIAHOOGLAND_ADMIN_PASSWORD;
	if (!password) {
		throw new Error('MARIAHOOGLAND_ADMIN_PASSWORD must be configured');
	}
	return password;
};

const sign = (value: string) => {
	const signature = createHmac('sha256', getSecret()).update(value).digest('hex');
	return `${value}.${signature}`;
};

const verify = (signedValue: string) => {
	const [value, signature] = signedValue.split('.');
	if (!value || !signature) return false;

	const expected = createHmac('sha256', getSecret()).update(value).digest('hex');

	try {
		return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
	} catch {
		return false;
	}
};

export const createAdminSession = (cookies: Cookies) => {
	const value = sign('active');
	cookies.set(COOKIE_NAME, value, {
		path: '/admin',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: COOKIE_MAX_AGE
	});
};

export const clearAdminSession = (cookies: Cookies) => {
	cookies.delete(COOKIE_NAME, { path: '/admin' });
};

export const isAdminAuthenticated = (cookies: Cookies) => {
	const cookie = cookies.get(COOKIE_NAME);
	if (!cookie) return false;
	return verify(cookie);
};

export const requireAdmin = (cookies: Cookies) => {
	if (!isAdminAuthenticated(cookies)) {
		throw new Error('Unauthorized');
	}
};

export const adminCookieName = COOKIE_NAME;
