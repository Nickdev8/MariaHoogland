import type { PageLoad } from './$types.ts';
import { error } from '@sveltejs/kit';
import { projects } from '$lib/data/projects.ts';

export const load: PageLoad = ({ params }) => {
  const project = projects.find((p) => p.slug === params.event);

  if (!project) {
    throw error(404, 'Project not found');
  }

  return { project };
};
