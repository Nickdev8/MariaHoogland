import { readContent } from '$lib/server/content';
import { buildProjects } from '$lib/server/projects';

export const load = async () => {
	const content = await readContent();
	const projects = buildProjects(content);

	return {
		projects,
		portfolio: content.portfolio
	};
};
