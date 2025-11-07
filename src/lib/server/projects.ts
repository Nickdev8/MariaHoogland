import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ breaks: true });

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

const markdownFiles = import.meta.glob('/src/content/projects/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export const projects: Project[] = Object.entries(markdownFiles).map(([path, rawContent]) => {
	const slug = path.split('/').pop()?.replace('.md', '') ?? '';
	const { data, content } = matter(rawContent);
	return {
		slug,
		description: md.render(content),
		...(data as Omit<Project, 'slug' | 'description'>)
	};
});

export const mainProjects: SmallProject[] = projects
  .filter((project) => project.featured)
  .map((project) => ({
    title: project.title,
    subtitle: project.subtitle,
    src: project.mainImage,
    sublink: project.slug,
  }));
