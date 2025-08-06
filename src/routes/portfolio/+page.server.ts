import { projects } from '$lib/server/projects.ts';

export function load() {
	return {
		projects
	};
}