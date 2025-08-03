export interface Project {
	title: string;
	subtitle: string;
	src: string;
	sublink: string;
}

export const mainProjects: Project[] = [
	{
		title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
		subtitle:
			'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
		src: '/images/3-garagewoning-6-890x664.jpg',
		sublink: 'uitbouw'
	},
	{
		title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
		subtitle:
			'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
		src: '/images/3-garagewoning-6-890x664.jpg',
		sublink: 'uitbouw'
	}
];

// if you also want underImages here:
export interface UnderImage {
	src: string;
	alt: string;
}

export const underImages: UnderImage[] = [
	{ src: '/images/hero.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
	{
		src: '/images/6-woning-ijburg-3-1-890x664.jpg',
		alt: 'Moderne architectuur met grote glaspartijen'
	},
	{
		src: '/images/3-garagewoning-6-890x664.jpg',
		alt: 'Moderne architectuur met grote glaspartijen'
	},
	{ src: '/images/4-uitbouw-2--890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
	{ src: '/images/hero.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
	{
		src: '/images/6-woning-ijburg-3-1-890x664.jpg',
		alt: 'Moderne architectuur met grote glaspartijen'
	},
	{
		src: '/images/3-garagewoning-6-890x664.jpg',
		alt: 'Moderne architectuur met grote glaspartijen'
	},
	{ src: '/images/4-uitbouw-2--890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' }
];
