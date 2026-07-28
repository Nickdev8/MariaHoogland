import type { PageServerLoad } from './$types.ts';
import { error } from '@sveltejs/kit';
import { readContent } from '$lib/server/content';
import { buildProjects } from '$lib/server/projects';

export const load: PageServerLoad = async ({ params }) => {
	const content = await readContent();
	const projects = buildProjects(content);
	const project = projects.find((p) => p.slug === params.event);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return { project };
};
