import type { PageLoad } from './$types';
import { mainProjects, projects } from '$lib/server/projects';

export const load: PageLoad = () => {
	return {
		mainProjects,
		projects
	};
};