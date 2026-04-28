import { fail, redirect } from '@sveltejs/kit';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import { readContent, writeContent } from '$lib/server/content';
import { isAdminAuthenticated } from '$lib/server/admin';
import { isNtfyConfigured, sendNtfyNotification } from '$lib/server/ntfy';
import type { SiteContent } from '$lib/types/content';

export async function loadAdminContent(cookies: Cookies) {
	if (!isAdminAuthenticated(cookies)) {
		return { authenticated: false as const };
	}

	const content = await readContent();
	return { authenticated: true as const, content };
}

export async function loadProtectedAdminContent(cookies: Cookies) {
	if (!isAdminAuthenticated(cookies)) {
		throw redirect(303, '/admin');
	}

	const content = await readContent();
	return { authenticated: true as const, content };
}

export async function saveAdminPartial(
	event: RequestEvent,
	sectionLabel: string
): Promise<{ success: true } | ReturnType<typeof fail>> {
	if (!isAdminAuthenticated(event.cookies)) {
		return fail(401, { error: 'Niet geautoriseerd.' });
	}

	const formData = await event.request.formData();
	const payload = formData.get('payload');

	if (typeof payload !== 'string') {
		return fail(400, { error: 'Ongeldige gegevens.' });
	}

	let parsed: Partial<SiteContent>;
	try {
		parsed = JSON.parse(payload) as Partial<SiteContent>;
	} catch {
		return fail(400, { error: 'Kan invoer niet lezen. Controleer de velden en probeer opnieuw.' });
	}

	const previousContent = isNtfyConfigured ? await readContent() : null;
	const current = previousContent ?? (await readContent());
	const nextContent: SiteContent = { ...current, ...parsed };

	await writeContent(nextContent);

	if (isNtfyConfigured) {
		await sendNtfyNotification({
			title: `${sectionLabel} bijgewerkt`,
			message: `Sectie opgeslagen vanuit admin: ${sectionLabel}`,
			tags: ['admin', 'content']
		});
	}

	return { success: true };
}
