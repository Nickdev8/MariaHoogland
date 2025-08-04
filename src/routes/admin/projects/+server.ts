import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

const projectsFilePath = join(process.cwd(), 'src', 'lib', 'data', 'projects.json');

export const GET: RequestHandler = async () => {
  try {
    const projects = JSON.parse(readFileSync(projectsFilePath, 'utf-8'));
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    console.error('Error reading projects.json:', error);
    return new Response(JSON.stringify({ error: 'Failed to load projects' }), { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const newProject = await request.json();
    const projects = JSON.parse(readFileSync(projectsFilePath, 'utf-8'));

    const existingIndex = projects.findIndex((p: any) => p.slug === newProject.slug);
    if (existingIndex !== -1) {
      projects[existingIndex] = newProject; // Update existing project
    } else {
      projects.push(newProject); // Add new project
    }

    writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2));
    return new Response(JSON.stringify({ message: 'Project saved successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error saving project:', error);
    return new Response(JSON.stringify({ error: 'Failed to save project' }), { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { slug } = await request.json();
    let projects = JSON.parse(readFileSync(projectsFilePath, 'utf-8'));

    const initialLength = projects.length;
    projects = projects.filter((p: any) => p.slug !== slug);

    if (projects.length === initialLength) {
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
    }

    writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2));
    return new Response(JSON.stringify({ message: 'Project deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete project' }), { status: 500 });
  }
};
