import { readFileSync } from 'fs';
import { join } from 'path';
import { error } from '@sveltejs/kit';

export function load({ params }) {
  const projectsFilePath = join(process.cwd(), 'src', 'lib', 'data', 'projects.json');
  const projects = JSON.parse(readFileSync(projectsFilePath, 'utf-8'));
  const project = projects.find((p: any) => p.slug === params.event);

  if (!project) {
    error(404, 'Not found');
  }

  return {
    project
  };
}