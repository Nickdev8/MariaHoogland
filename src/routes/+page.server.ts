import { readFileSync } from 'fs';
import { join } from 'path';
import { stats } from '$lib/data/projects.ts';

export const load = () => {
  console.log('\n--- +page.server.ts load function called ---');
  const projectsFilePath = join(process.cwd(), 'src', 'lib', 'data', 'projects.json');
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