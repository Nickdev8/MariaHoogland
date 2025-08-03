
// the projects desplayed on the main page
export interface SmallProject {
	title: string;
	subtitle: string;
	src: string;
	sublink: string;
}
export const mainProjects: SmallProject[] = [
	{
		title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
		subtitle:
			'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
		src: '/images/projects/garagewoning.jpg',
		sublink: 'uitbouw'
	},
	{
		title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
		subtitle:
			'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
		src: '/images/projects/uitbouw.jpg',
		sublink: 'uitbouw'
	},
	{
		title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
		subtitle:
			'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
		src: '/images/projects/woning-ijburg.jpg',
		sublink: 'uitbouw'
	}
];


// the images in the main page at the bottom
export interface UnderImage {
	src: string;
	alt: string;
}

export const underImages: UnderImage[] = [
	{
		src: '/images/projects/garagewoning.jpg',
		alt: 'Moderne architectuur met grote glaspartijen'
	},
	{
		src: '/images/projects/uitbouw.jpg',
		alt: 'dit is een uitbouw'
	},
	{
		src: '/images/projects/woning-ijburg.jpg',
		alt: 'Moderne architectuur met grote glaspartijen'
	}
];



// all the projects in /portfolio
export interface Project {
	title: string;
	subtitle: string;
	firstimagesrc: string;
	sublink: string;
}
export const projects: Project[] = [
	{
		title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
		subtitle:
			'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
		firstimagesrc: '/images/projects/garagewoning.jpg',
		sublink: 'example'
	},
];
