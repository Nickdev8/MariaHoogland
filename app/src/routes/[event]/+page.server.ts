import { error } from '@sveltejs/kit';
import { projects } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	const project = projects.find((p) => p.slug === event.params.event);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return { project };
};
