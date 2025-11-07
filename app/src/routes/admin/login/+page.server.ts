import { createAdminSession, getAdminPassword, isAdminAuthenticated } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	if (isAdminAuthenticated(event.cookies)) {
		throw redirect(303, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const password = form.get('password');

		if (typeof password !== 'string' || password.trim().length === 0) {
			return fail(400, { error: 'Voer het wachtwoord in.' });
		}

		const expected = getAdminPassword();
		if (password !== expected) {
			return fail(401, { error: 'Onjuist wachtwoord.' });
		}

		createAdminSession(cookies);
		throw redirect(303, '/admin');
	}
};
