import { readContent } from '$lib/server/content';
import { buildMainProjects, buildProjects } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const content = await readContent();
  const projects = buildProjects(content);
  const mainProjects = buildMainProjects(projects);

  return {
    content,
    projects,
    mainProjects
  };
};
