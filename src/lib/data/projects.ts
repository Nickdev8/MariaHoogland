
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
		sublink: 'uitbouw-haarlem'
	},
	{
		title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
		subtitle:
			'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
		src: '/images/projects/uitbouw.jpg',
		sublink: 'woning-ijburg'
	},
	{
		title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
		subtitle:
			'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
		src: '/images/projects/woning-ijburg.jpg',
		sublink: 'uitbouw-haarlem'
	}
];

export interface Project {
	slug: string;
	category: string;
	title: string;
	subtitle: string;
	description: string;
	mainImage: string;
	caption: string;
	gallery?: string[]; // optional
	testimonials?: {
		quote: string;
		name: string;
	}[]; // optional
}

export const projects: Project[] = [
	{
		slug: 'uitbouw-haarlem',
		category: 'Uitbouw',
		title: 'Haarlemse Uitbouw',
		subtitle: 'Een naadloze toevoeging aan een klassieke woning.',
		description: `Dit project omvatte het ontwerpen en realiseren van een moderne uitbouw die de leefruimte aanzienlijk vergrootte en meer daglicht in de woning bracht. De uitdaging was om de moderne esthetiek te laten harmoniëren met het klassieke karakter van het bestaande huis.`, 
		mainImage: '/images/projects/garagewoning.jpg',
		caption: 'De stalen deuren zorgen voor een sterke visuele verbinding met de tuin.',
		gallery: [
			'/images/projects/uitbouw.jpg',
			'/images/projects/woning-ijburg.jpg',
			'/images/projects/uitbouw.jpg',
			'/images/projects/garagewoning.jpg'
		],
		testimonials: [
			{
				quote: 'Maria heeft onze wensen perfect vertaald naar een prachtig ontwerp. De samenwerking was zeer prettig en professioneel.',
				name: 'Familie de Vries'
			}
		]
	},
	{
		slug: 'woning-ijburg',
		category: 'Nieuwbouw',
		title: 'Moderne Woning op IJburg',
		subtitle: 'Licht en ruimte in een nieuwbouwomgeving.',
		description: `Ontwerp van een volledige nieuwbouwwoning op IJburg, Amsterdam. De focus lag op het creëren van een open en lichte leefomgeving met een sterke relatie tussen interieur en exterieur. Duurzame materialen en energiezuinige oplossingen stonden centraal.`, 
		mainImage: '/images/projects/woning-ijburg.jpg',
		caption: 'De vide creëert een gevoel van ruimtelijkheid en verbindt de verdiepingen.',
		testimonials: [
			{
				quote: 'Vanaf het eerste gesprek voelden we ons begrepen. Maria is een creatieve en deskundige architect die ons droomhuis heeft gerealiseerd.',
				name: 'Dhr. en mevr. Jansen'
			}
		]
	},
	{
		slug: 'dakopbouw-amsterdam',
		category: 'Dakopbouw',
		title: 'Dakopbouw in Amsterdam',
		subtitle: 'Extra woonruimte met een adembenemend uitzicht.',
		description: `Beschrijving van het project komt hier. Vertel over de uitdagingen, de oplossingen en het eindresultaat. Gebruik enkele alinea's om het verhaal van het project te schetsen.`, 
		mainImage: '/images/projects/placeholder.jpg',
		caption: 'Een interessante caption voor de hoofdafbeelding.'
	},
	{
		slug: 'interieur-verbouwing-spaarnwoude',
		category: 'Verbouwing',
		title: 'Interieur Verbouwing',
		subtitle: 'Een complete transformatie van het interieur.',
		description: `Beschrijving van het project komt hier. Vertel over de uitdagingen, de oplossingen en het eindresultaat. Gebruik enkele alinea's om het verhaal van het project te schetsen.`, 
		mainImage: '/images/projects/placeholder.jpg',
		caption: 'Een interessante caption voor de hoofdafbeelding.'
	},
	{
		slug: 'schuurwoning-kennemerland',
		category: 'Nieuwbouw',
		title: 'Schuurwoning in Kennemerland',
		subtitle: 'Landelijk wonen met een moderne twist.',
		description: `Beschrijving van het project komt hier. Vertel over de uitdagingen, de oplossingen en het eindresultaat. Gebruik enkele alinea's om het verhaal van het project te schetsen.`, 
		mainImage: '/images/projects/placeholder.jpg',
		caption: 'Een interessante caption voor de hoofdafbeelding.'
	},
	{
		slug: 'monumentale-renovatie-haarlem',
		category: 'Renovatie',
		title: 'Monumentale Renovatie',
		subtitle: 'Historische elementen in een modern jasje.',
		description: `Beschrijving van het project komt hier. Vertel over de uitdagingen, de oplossingen en het eindresultaat. Gebruik enkele alinea's om het verhaal van het project te schetsen.`, 
		mainImage: '/images/projects/placeholder.jpg',
		caption: 'Een interessante caption voor de hoofdafbeelding.'
	}
];

