import { mainProjects, projects } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    mainProjects,
    projects,
  };
};
