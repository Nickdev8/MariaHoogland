<script lang="ts">
	import '../app.css';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import type { LayoutData } from './$types';

	const { children, data } = $props<{ children: () => unknown; data: LayoutData }>();

	const toInternationalPhone = (phone: string) => {
		const digits = phone.replace(/\D/g, '');
		return digits.startsWith('0') ? `+31${digits.slice(1)}` : `+${digits}`;
	};

	const structuredData = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'ProfessionalService',
					'@id': `${data.site.url}/#organisatie`,
					name: 'Maria Hoogland Architectuur',
					alternateName: 'Architectuur AMH',
					url: data.site.url,
					logo: `${data.site.url}/images/brand/header-logo.png`,
					image: `${data.site.url}/images/people/maria-garden-portrait.webp`,
					telephone: toInternationalPhone(data.contact.phone),
					email: data.contact.email,
					address: {
						'@type': 'PostalAddress',
						streetAddress: data.contact.address.lines[0],
						postalCode: '2064 KT',
						addressLocality: 'Spaarndam',
						addressRegion: 'Noord-Holland',
						addressCountry: 'NL'
					},
					areaServed: ['Spaarndam', 'Haarlem', 'Amsterdam'],
					knowsAbout: ['verbouwing', 'nieuwbouw', 'vergunningen', 'woningrenovatie'],
					sameAs: data.footer.socials.map((social) => social.href),
					founder: { '@id': `${data.site.url}/about#persoon` }
				},
				{
					'@type': 'Person',
					'@id': `${data.site.url}/about#persoon`,
					name: 'Maria Hoogland',
					jobTitle: 'Architect',
					worksFor: { '@id': `${data.site.url}/#organisatie` },
					url: `${data.site.url}/about`,
					image: `${data.site.url}/images/people/maria-sunset-portrait-cropped.webp`,
					sameAs: data.footer.socials.map((social) => social.href)
				},
				{
					'@type': 'WebSite',
					'@id': `${data.site.url}/#website`,
					url: data.site.url,
					name: 'Maria Hoogland Architectuur',
					inLanguage: 'nl-NL',
					publisher: { '@id': `${data.site.url}/#organisatie` }
				}
			]
		}).replace(/</g, '\\u003c')
	);
</script>

<svelte:head>
	<meta name="robots" content="index,follow" />
	<meta property="og:site_name" content="Maria Hoogland Architectuur" />
	<meta property="og:locale" content="nl_NL" />
	{#if data?.canonical}
		<link rel="canonical" href={data.canonical} />
		<meta property="og:url" content={data.canonical} />
		<meta name="twitter:url" content={data.canonical} />
	{/if}
	{@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

<div class="flex min-h-screen flex-col overflow-x-hidden">
	<Header />

	<main class="flex-1 pt-14">
		{@render children()}
	</main>

	{#if data?.footer}
		<Footer content={data.footer} />
	{/if}
</div>
