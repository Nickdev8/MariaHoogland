import type { PageLoad } from './$types.ts';
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ data }) => {
  if (!data.project) {
    throw error(404, 'Project not found');
  }

  return { project: data.project };
};