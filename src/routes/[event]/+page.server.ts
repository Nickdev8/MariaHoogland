import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { projects } from '$lib/server/projects';

export const load: PageLoad = ({ params }) => {
  const project = projects.find((p) => p.slug === params.event);

  if (!project) {
    throw error(404, 'Project not found');
  }

  return { project };
};