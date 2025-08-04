
export const stats = {
	startYear: 2004,
	completedProjects: 750,
	customerSatisfaction: 98
};


// all the projects in /portfolio
export interface Project {
	slug: string;
	category: string;
	title: string;
	subtitle: string;
	description: string;
	mainImage: string;
	caption: string;
	gallery?: string[];
}
