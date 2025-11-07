import { isAdminAuthenticated } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
	const authenticated = isAdminAuthenticated(event.cookies);

	if (event.route.id === '/admin/login') {
		return { authenticated };
	}

	if (!authenticated) {
		throw redirect(303, '/admin/login');
	}

	return { authenticated };
};
