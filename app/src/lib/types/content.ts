export type Link = {
	label: string;
	href: string;
};

export type Image = {
	src: string;
	alt: string;
};

export type Stat = {
	label: string;
	value: number;
	suffix?: string;
};

export type Testimonial = {
	quote: string;
	name: string;
};

export type HomeContent = {
	hero: {
		title: string;
		description: string;
		primaryCta: Link;
		secondaryCta: Link;
		backgroundImage: string;
		images: Image[];
	};
	gallery: {
		title: string;
		images: Image[];
	};
	featured: {
		title: string;
		description: string;
	};
	stats: Stat[];
	testimonials: {
		title: string;
		items: Testimonial[];
	};
};

export type AboutFeature = {
	icon: string;
	title: string;
	description: string;
};

export type TeamMember = {
	name: string;
	role: string;
	image: Image;
};

export type AboutContent = {
	introLabel: string;
	title: string;
	description: string;
	features: AboutFeature[];
	team: {
		title: string;
		description: string;
		members: TeamMember[];
	};
};

export type PortfolioContent = {
	title: string;
	description: string;
};

export type ContactContent = {
	title: string;
	description: string;
	address: {
		lines: string[];
	};
	phone: string;
	email: string;
	businessDetails: string[];
};

export type FooterSocial = {
	label: string;
	href: string;
	icon: string;
};

export type FooterContent = {
	aboutTitle: string;
	quickLinks: Link[];
	contactEmail: string;
	contactPhone: string;
	socials: FooterSocial[];
};

export type ProjectTestimonial = {
	quote: string;
	name: string;
};

export type Project = {
	slug: string;
	category: string;
	title: string;
	subtitle: string;
	descriptionMarkdown: string;
	mainImage: string;
	caption?: string;
	gallery: string[];
	testimonials?: ProjectTestimonial[];
	featured?: boolean;
};

export type SiteContent = {
	home: HomeContent;
	about: AboutContent;
	portfolio: PortfolioContent;
	contact: ContactContent;
	footer: FooterContent;
	projects: Project[];
};
