import type { PageServerLoad } from './$types.ts';
import { error } from '@sveltejs/kit';
import { readContent } from '$lib/server/content';
import { buildProjects } from '$lib/server/projects';

export const load: PageServerLoad = async ({ params }) => {
	const content = await readContent();
	const projects = buildProjects(content);
	const projectIndex = projects.findIndex((project) => project.slug === params.event);
	const project = projects[projectIndex];

	if (!project) {
		throw error(404, 'Project not found');
	}

	const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
	const nextProject = projects[(projectIndex + 1) % projects.length];

	return { project, previousProject, nextProject };
};
