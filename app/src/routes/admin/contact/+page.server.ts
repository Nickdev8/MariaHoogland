import type { Actions, PageServerLoad } from './$types';
import { loadProtectedAdminContent, saveAdminPartial } from '$lib/server/admin-content';

export const load: PageServerLoad = async ({ cookies }) => loadProtectedAdminContent(cookies);

export const actions: Actions = {
	save: async (event) => saveAdminPartial(event, 'Contact')
};
