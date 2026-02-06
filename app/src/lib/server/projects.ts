import MarkdownIt from 'markdown-it';
import type { Project, SiteContent } from '$lib/types/content';

const md = new MarkdownIt({ breaks: true });

export type ProjectWithHtml = Omit<Project, 'descriptionMarkdown'> & { description: string };

export const buildProjects = (content: SiteContent): ProjectWithHtml[] =>
	(content.projects ?? []).map((project) => {
		const { descriptionMarkdown, ...rest } = project;
		return {
			...rest,
			description: md.render(descriptionMarkdown || '')
		};
	});

export const buildMainProjects = (projects: ProjectWithHtml[]) =>
	projects.filter((project) => project.featured);
