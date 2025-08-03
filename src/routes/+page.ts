import type { PageLoad } from './$types.ts';
import { mainProjects, underImages } from '$lib/data/projects.ts';

export const load: PageLoad = () => ({
  mainProjects,
  underImages
});
