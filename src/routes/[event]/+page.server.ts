import { readFileSync } from 'fs';
import { join } from 'path';
import { error } from '@sveltejs/kit';

export const load = ({ params }) => {
  console.log('\n--- [event]/+page.server.ts load function called for slug:', params.event, '---');
  const projectsFilePath = join(process.cwd(), 'src', 'lib', 'data', 'projects.json');
  const projects = JSON.parse(readFileSync(projectsFilePath, 'utf-8'));
  const project = projects.find((p: any) => p.slug === params.event);

  if (!project) {
    console.error('[event]/+page.server.ts: Project not found for slug:', params.event);
    throw error(404, 'Project not found');
  }
  console.log('[event]/+page.server.ts: Found project:', project.title);
  return { project };
};