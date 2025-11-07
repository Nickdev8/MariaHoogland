import { clearAdminSession, isAdminAuthenticated, requireAdmin } from '$lib/server/auth';
import { readContent, writeContent } from '$lib/server/content';
import type { SiteContent } from '$lib/types/content';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	requireAdmin(cookies);
	const content = await readContent();
	return { content };
};

export const actions: Actions = {
	save: async ({ request, cookies }) => {
		if (!isAdminAuthenticated(cookies)) {
			return fail(401, { error: 'Niet gemachtigd.' });
		}

		const form = await request.formData();
		const payload = form.get('payload');

		if (typeof payload !== 'string') {
			return fail(400, { error: 'Ongeldige gegevens verzonden.' });
		}

		let parsed: SiteContent;
		try {
			parsed = JSON.parse(payload) as SiteContent;
		} catch (err) {
			console.error('Kon payload niet parsen', err);
			return fail(400, { error: 'Kon de inhoud niet verwerken.' });
		}

		await writeContent(parsed);
		return { success: true };
	},
	logout: async ({ cookies }) => {
		clearAdminSession(cookies);
		throw redirect(303, '/admin/login');
	}
};
