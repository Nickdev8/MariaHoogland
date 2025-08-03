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
		sublink: 'uitbouw2'
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
	slug: string;
	title: string;
	subtitle: string;
	description: string;
	mainImage: string;
	caption: string;
	gallery?: string[]; // optional
}

export const projects: Project[] = [
	{
		slug: 'uitbouw',
		title: 'Haarlemse uitbouw',
		subtitle: 'extra stukje huis van huise',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla suscipit 
			accumsan ante sit amet molestie. Aliquam in nunc orci. Curabitur scelerisque 
			lacus vitae faucibus euismod. Phasellus varius accumsan ligula, in eleifend erat.
		`,
		mainImage: '/images/projects/garagewoning.jpg',
		caption: 'Dit is a caption. Over de foto hierboven',
		gallery: [
			'/images/projects/uitbouw.jpg',
			'/images/projects/woning-ijburg.jpg',
			'/images/projects/uitbouw.jpg',
			'/images/projects/garagewoning.jpg',
		]
	},
	{
		slug: 'uitbouw2',
		title: 'Haarlemse uitbouw',
		subtitle: 'extra stukje huis van huise',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla suscipit 
			accumsan ante sit amet molestie. Aliquam in nunc orci. Curabitur scelerisque 
			lacus vitae faucibus euismod. Phasellus varius accumsan ligula, in eleifend erat.
		`,
		mainImage: '/images/projects/garagewoning.jpg',
		caption: 'Dit is a caption. Over de foto hierboven',
	}
];
