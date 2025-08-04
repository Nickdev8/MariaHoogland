import type { PageLoad } from './$types.ts';
import { projects, stats } from '$lib/data/projects.ts';

export const load: PageLoad = () => ({
  mainProjects: projects.slice(0, 3),
  stats: {
    ...stats,
    yearsOfExperience: new Date().getFullYear() - stats.startYear
  }
});
