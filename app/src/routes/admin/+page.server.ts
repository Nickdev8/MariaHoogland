import { redirect, fail } from '@sveltejs/kit';
import { ADMIN_COOKIE, isAdminAuthenticated } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const ADMIN_PASSWORD = env.ADMIN_PASSWORD ?? 'mariahoogland';

export const load: PageServerLoad = async ({ cookies }) => {
	const authenticated = isAdminAuthenticated(cookies);
	if (!authenticated) {
		return { authenticated: false };
	}
	return { authenticated: true };
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const password = formData.get('password');

		if (typeof password !== 'string' || password.trim() === '') {
			return fail(400, { error: 'Voer een wachtwoord in.' });
		}

		if (password !== ADMIN_PASSWORD) {
			return fail(401, { error: 'Onjuist wachtwoord.' });
		}

		cookies.set(ADMIN_COOKIE, 'true', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 8
		});

		throw redirect(303, '/admin/home');
	},
	logout: async ({ cookies }) => {
		cookies.delete(ADMIN_COOKIE, { path: '/' });
		throw redirect(303, '/admin');
	}
};
