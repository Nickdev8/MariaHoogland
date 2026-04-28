import { redirect, fail } from '@sveltejs/kit';
import { readContent, writeContent } from '$lib/server/content';
import { isAdminAuthenticated } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';
import type { Project, SiteContent } from '$lib/types/content';
import { sendNtfyNotification, isNtfyConfigured } from '$lib/server/ntfy';

export const load: PageServerLoad = async ({ params, cookies }) => {
	if (!isAdminAuthenticated(cookies)) {
		throw redirect(303, '/admin/portfolio');
	}

	const content = await readContent();
	const project = content.projects.find((item) => item.slug === params.slug);
	if (!project) {
		throw redirect(303, '/admin/portfolio');
	}

	return { project };
};

export const actions: Actions = {
	save: async ({ request, cookies, params }) => {
		if (!isAdminAuthenticated(cookies)) {
			return fail(401, { error: 'Niet geautoriseerd.' });
		}

		const formData = await request.formData();
		const payload = formData.get('payload');
		if (typeof payload !== 'string') {
			return fail(400, { error: 'Ongeldige gegevens.' });
		}

		let parsed: Project | null = null;
		try {
			parsed = normalizeProjectPayload(JSON.parse(payload));
		} catch {
			return fail(400, { error: 'Kan invoer niet lezen. Controleer de velden en probeer opnieuw.' });
		}

		if (!parsed) {
			return fail(400, { error: 'Onvolledige projectgegevens.' });
		}

		const previousContent = isNtfyConfigured ? await readContent() : null;
		const current = previousContent ?? (await readContent());
		const index = current.projects.findIndex((item) => item.slug === params.slug);
		if (index === -1) {
			return fail(404, { error: 'Project niet gevonden.' });
		}

		const slugConflict = current.projects.some(
			(item, itemIndex) => itemIndex !== index && item.slug === parsed.slug
		);
		if (slugConflict) {
			return fail(400, { error: 'Deze slug is al in gebruik.' });
		}

		const nextProjects = [...current.projects];
		nextProjects[index] = parsed;

		const nextContent: SiteContent = {
			...current,
			projects: nextProjects
		};

		await writeContent(nextContent);

		if (isNtfyConfigured && previousContent) {
			await sendNtfyNotification({
				title: 'Project bijgewerkt',
				message: parsed.title || parsed.slug,
				tags: ['admin', 'portfolio']
			});
		}

		if (parsed.slug !== params.slug) {
			throw redirect(303, `/admin/portfolio/${parsed.slug}`);
		}

		return { success: true };
	},
	delete: async ({ cookies, params }) => {
		if (!isAdminAuthenticated(cookies)) {
			return fail(401, { error: 'Niet geautoriseerd.' });
		}

		const current = await readContent();
		const nextProjects = current.projects.filter((item) => item.slug !== params.slug);

		if (nextProjects.length === current.projects.length) {
			return fail(404, { error: 'Project niet gevonden.' });
		}

		const nextContent: SiteContent = {
			...current,
			projects: nextProjects
		};

		await writeContent(nextContent);
		throw redirect(303, '/admin/portfolio');
	}
};

function normalizeProjectPayload(value: unknown): Project | null {
	if (!value || typeof value !== 'object') {
		return null;
	}

	const record = value as Record<string, unknown>;
	const slug = typeof record.slug === 'string' ? record.slug.trim() : '';
	const category = typeof record.category === 'string' ? record.category.trim() : '';
	const title = typeof record.title === 'string' ? record.title.trim() : '';
	const subtitle = typeof record.subtitle === 'string' ? record.subtitle : '';
	const descriptionMarkdown =
		typeof record.descriptionMarkdown === 'string' ? record.descriptionMarkdown : '';
	const mainImage = typeof record.mainImage === 'string' ? record.mainImage : '';
	const caption = typeof record.caption === 'string' ? record.caption : '';
	const featured = Boolean(record.featured);

	if (!slug || !title) {
		return null;
	}

	const gallery = Array.isArray(record.gallery)
		? record.gallery.filter((item): item is string => typeof item === 'string')
		: [];

	const project: Project = {
		slug,
		category,
		title,
		subtitle,
		descriptionMarkdown,
		mainImage,
		gallery,
		featured
	};

	if (caption) {
		project.caption = caption;
	}

	return project;
}
