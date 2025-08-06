import type { PageLoad } from './$types.ts';
import { mainProjects, projects } from '$lib/data/projects';

export function load() {
	return {
		mainProjects,
		projects
	};
}
