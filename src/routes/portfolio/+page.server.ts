import { readFileSync } from 'fs';
import { join } from 'path';

export function load() {
  const projectsFilePath = join(process.cwd(), 'src', 'lib', 'data', 'projects.json');
  const projects = JSON.parse(readFileSync(projectsFilePath, 'utf-8'));
  return {
    projects
  };
}