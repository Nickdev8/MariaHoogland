import matter from 'gray-matter';

export interface Testimonial {
  quote: string;
  name: string;
}

export interface Project {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  mainImage: string;
  caption: string;
  gallery?: string[];
  testimonials?: Testimonial[];
  featured?: boolean;
}

export interface SmallProject {
  title: string;
  subtitle: string;
  src: string;
  sublink: string;
}

const importAll = (r: Record<string, () => Promise<unknown>>) =>
  Object.entries(r).map(([path, resolver]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    return { slug, resolver };
  });

const markdownFiles = import.meta.glob('/src/content/projects/*.md', { query: '?raw', import: 'default', eager: true });

export const projects: Project[] = importAll(markdownFiles).map(({ slug, resolver }) => {
  const { data, content } = matter(resolver as string);
  const project = {
    slug,
    description: content,
    ...(data as Omit<Project, 'slug' | 'description'>),
  } as Project;
  console.log('Loaded project:', project.slug, project.title);
  return project;
});


console.log('All loaded projects:', projects);

export const mainProjects: SmallProject[] = projects
  .filter((project) => project.featured)
  .map((project) => ({
    title: project.title,
    subtitle: project.subtitle,
    src: project.mainImage,
    sublink: project.slug,
  }));
