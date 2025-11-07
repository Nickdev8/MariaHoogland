export type IconName =
	| 'arrow-up-right'
	| 'compass'
	| 'file-text'
	| 'globe'
	| 'handshake'
	| 'layers'
	| 'landmark'
	| 'lightbulb'
	| 'ruler'
	| 'sparkles'
	| 'users'
	| 'instagram'
	| 'linkedin';

export interface SiteLink {
	label: string;
	href: string;
}

export interface SiteContent {
	brand: {
		company: string;
		owner: string;
		tagline: string;
		logo: string;
		contact: {
			email: string;
			phone: string;
			address: string;
		};
		registration: string[];
		socials: Array<{
			label: string;
			href: string;
			icon: IconName;
		}>;
	};
	navigation: {
		links: SiteLink[];
	};
	home: {
		hero: {
			kicker: string;
			title: string;
			body: string;
			primaryCta: SiteLink;
			secondaryCta: SiteLink;
			stats: Array<{
				value: number;
				suffix: string;
				label: string;
			}>;
		};
		summaryPanel: {
			title: string;
			copy: string;
			bullets: Array<{
				icon: IconName;
				text: string;
			}>;
		};
		highlightsIntro: {
			kicker: string;
			title: string;
			copy: string;
		};
		highlights: Array<{
			title: string;
			description: string;
			icon: IconName;
		}>;
		projectSection: {
			kicker: string;
			title: string;
			copy: string;
			cta: SiteLink;
		};
		process: {
			kicker: string;
			title: string;
			copy: string;
			steps: Array<{
				title: string;
				description: string;
				icon: IconName;
			}>;
		};
		commitments: {
			kicker: string;
			title: string;
			copy: string;
			points: Array<{
				title: string;
				copy: string;
				icon: IconName;
			}>;
		};
		galleryIntro: {
			kicker: string;
			title: string;
			copy: string;
		};
		gallery: Array<{
			src: string;
			alt: string;
		}>;
		testimonials: {
			kicker: string;
			title: string;
			items: Array<{
				quote: string;
				name: string;
			}>;
		};
		cta: {
			title: string;
			copy: string;
			primaryCta: SiteLink;
			secondaryCta: SiteLink;
		};
	};
	about: {
		hero: {
			kicker: string;
			title: string;
			body: string;
		};
		pillars: Array<{
			title: string;
			copy: string;
			icon: IconName;
		}>;
		architect: {
			name: string;
			title: string;
			image: string;
			bio: string;
		};
	};
	portfolio: {
		title: string;
		copy: string;
		searchPlaceholder: string;
	};
	contact: {
		hero: {
			kicker: string;
			title: string;
			body: string;
		};
		form: {
			title: string;
			body: string;
		};
		info: Array<{
			type: 'address' | 'phone' | 'email';
			label: string;
			value: string;
			href?: string;
		}>;
		businessDetails: string[];
		successMessage: string;
		errorMessage: string;
	};
	footer: {
		tagline: string;
		quickLinks: SiteLink[];
		credits: {
			label: string;
			href: string;
			contactLabel: string;
			contactHref: string;
		};
	};
}
