import { mainProjects, projects } from '$lib/server/projects';
import { testimonials } from '$lib/server/testimonials';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    mainProjects,
    projects,
    testimonials,
  };
};
