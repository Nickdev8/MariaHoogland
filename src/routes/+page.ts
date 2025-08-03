import type { PageLoad } from './$types.ts';
import { mainProjects } from '$lib/data/projects.ts';

export const load: PageLoad = () => ({
  mainProjects
});
