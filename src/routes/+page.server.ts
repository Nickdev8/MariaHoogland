import { readFileSync } from 'fs';
import { join } from 'path';
import { stats } from '$lib/data/projects.ts';

export const load = () => {
    console.log('--- +page.server.ts load function called ---');
  console.log('Current Working Directory:', process.cwd());
  const projectsFilePath = join(process.cwd(), 'src', 'lib', 'data', 'projects.json');
  console.log('Projects File Path:', projectsFilePath);
  const allProjects = JSON.parse(readFileSync(projectsFilePath, 'utf-8'));
  const mainProjects = allProjects.slice(0, 3);
  console.log('+page.server.ts: mainProjects loaded (' + mainProjects.length + ' projects)');
  return {
    mainProjects,
    stats: {
      ...stats,
      yearsOfExperience: new Date().getFullYear() - stats.startYear
    }
  };
};