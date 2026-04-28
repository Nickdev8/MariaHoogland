import { redirect, fail } from '@sveltejs/kit';
import { readContent, writeContent } from '$lib/server/content';
import { ADMIN_COOKIE, isAdminAuthenticated } from '$lib/server/admin';
import type { SiteContent } from '$lib/types/content';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { sendNtfyNotification, isNtfyConfigured } from '$lib/server/ntfy';

const ADMIN_PASSWORD = env.ADMIN_PASSWORD ?? 'mariahoogland';

export const load: PageServerLoad = async ({ cookies }) => {
	const authenticated = isAdminAuthenticated(cookies);
	if (!authenticated) {
		return { authenticated: false };
	}

	const content = await readContent();
	return { authenticated: true, content };
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

		throw redirect(303, '/admin/portfolio');
	},
	logout: async ({ cookies }) => {
		cookies.delete(ADMIN_COOKIE, { path: '/' });
		throw redirect(303, '/admin/portfolio');
	},
	save: async ({ request, cookies }) => {
		if (!isAdminAuthenticated(cookies)) {
			return fail(401, { error: 'Niet geautoriseerd.' });
		}

		const previousContent = isNtfyConfigured ? await readContent() : null;
		const formData = await request.formData();
		const payload = formData.get('payload');

		if (typeof payload !== 'string') {
			return fail(400, { error: 'Ongeldige gegevens.' });
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(payload) as unknown;
		} catch (error) {
			return fail(400, { error: 'Kan invoer niet lezen. Controleer de velden en probeer opnieuw.' });
		}

		const isFullContent =
			parsed &&
			typeof parsed === 'object' &&
			'home' in parsed &&
			'about' in parsed &&
			'portfolio' in parsed &&
			'contact' in parsed &&
			'footer' in parsed &&
			'projects' in parsed;

		const current = await readContent();
		const nextContent: SiteContent = isFullContent
			? (parsed as SiteContent)
			: {
				...current,
				...(parsed as Partial<SiteContent>)
			};

		await writeContent(nextContent);

		if (isNtfyConfigured && previousContent) {
			const summary = summarizeSiteContentChanges(previousContent, nextContent);
			if (summary) {
				await sendNtfyNotification({
					title: 'Maria Hoogland bijgewerkt',
					message: summary,
					tags: ['admin', 'content']
				});
			}
		}

		return { success: true };
	},
	create: async ({ cookies }) => {
		if (!isAdminAuthenticated(cookies)) {
			return fail(401, { error: 'Niet geautoriseerd.' });
		}

		const current = await readContent();
		const base = 'nieuw-project';
		let slug = `${base}-${Date.now()}`;
		while (current.projects.some((project) => project.slug === slug)) {
			slug = `${base}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		}

		const project: SiteContent['projects'][number] = {
			slug,
			category: 'Nieuw',
			title: 'Nieuw project',
			subtitle: '',
			descriptionMarkdown: '',
			mainImage: '',
			gallery: []
		};

		const nextContent: SiteContent = {
			...current,
			projects: [...current.projects, project]
		};

		await writeContent(nextContent);

		throw redirect(303, `/admin/portfolio/${slug}`);
	},
	delete: async ({ request, cookies }) => {
		if (!isAdminAuthenticated(cookies)) {
			return fail(401, { error: 'Niet geautoriseerd.' });
		}

		const formData = await request.formData();
		const slug = formData.get('slug');

		if (typeof slug !== 'string' || slug.trim() === '') {
			return fail(400, { error: 'Projectslug ontbreekt.' });
		}

		const current = await readContent();
		const nextProjects = current.projects.filter((project) => project.slug !== slug);

		if (nextProjects.length === current.projects.length) {
			return fail(404, { error: 'Project niet gevonden.' });
		}

		const nextContent: SiteContent = {
			...current,
			projects: nextProjects
		};

		await writeContent(nextContent);
		return { success: true };
	}
};

function summarizeSiteContentChanges(previous: SiteContent, next: SiteContent): string | null {
	if (deepEqual(previous, next)) {
		return null;
	}

	const changedSections = collectChangedSections(previous, next);
	if (changedSections.length === 0) {
		return null;
	}

	const intro =
		changedSections.length <= 4
			? `Bijgewerkte secties: ${changedSections.join(', ')}.`
			: `Bijgewerkte ${changedSections.length} secties (o.a. ${changedSections.slice(0, 4).join(', ')}).`;

	const detailParts: string[] = [];
	appendArrayChange(detailParts, 'Projecten', previous.projects, next.projects);
	return detailParts.length ? `${intro} ${detailParts.join(' · ')}` : intro;
}

function collectChangedSections(previous: SiteContent, next: SiteContent): string[] {
	const keys = new Set([...Object.keys(previous ?? {}), ...Object.keys(next ?? {})]);
	const result: string[] = [];
	for (const key of keys) {
		const prevValue = (previous as Record<string, unknown>)[key];
		const nextValue = (next as Record<string, unknown>)[key];
		if (!deepEqual(prevValue, nextValue)) {
			result.push(key);
		}
	}
	return result;
}

function appendArrayChange(target: string[], label: string, previous: unknown, next: unknown): void {
	const beforeCount = Array.isArray(previous) ? previous.length : 0;
	const afterCount = Array.isArray(next) ? next.length : 0;
	if (beforeCount !== afterCount) {
		target.push(`${label}: ${beforeCount}→${afterCount}`);
	}
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepEqual(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) {
		return true;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}
		return a.every((value, index) => deepEqual(value, b[index]));
	}

	if (isPlainObject(a) && isPlainObject(b)) {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) {
			return false;
		}
		return keysA.every((key) => deepEqual(a[key], b[key]));
	}

	return false;
}
