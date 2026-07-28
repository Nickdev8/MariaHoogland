<script lang="ts">
	import { onMount } from 'svelte';
	import CountUp from '$lib/CountUp.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import type { SiteContent } from '$lib/types/content';
	import type { ProjectWithHtml } from '$lib/server/projects';
	export let data: { content: SiteContent; projects: ProjectWithHtml[] };
	const home = data.content.home;
	const galleryProjects = data.projects.filter(
		(project) => project.title !== 'Moderne Woning op IJburg'
	);
	let hero: HTMLElement;
	let statistics: HTMLElement;
	let parallaxEnabled = false;
	let backgroundOffset = 0;
	let statisticsBackgroundOffset = 0;
	let frame: number | undefined;

	function updateParallax() {
		if (!parallaxEnabled || frame) return;
		frame = requestAnimationFrame(() => {
			if (hero) {
				const top = hero.getBoundingClientRect().top;
				backgroundOffset = Math.max(-180, Math.min(180, top * -0.35));
			}
			if (statistics) {
				const top = statistics.getBoundingClientRect().top;
				statisticsBackgroundOffset = Math.max(-150, Math.min(150, top * -0.38));
			}
			frame = undefined;
		});
	}

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const setMotionPreference = () => {
			parallaxEnabled = !reducedMotion.matches;
			if (!parallaxEnabled) {
				backgroundOffset = 0;
				statisticsBackgroundOffset = 0;
			} else updateParallax();
		};
		setMotionPreference();
		reducedMotion.addEventListener('change', setMotionPreference);
		return () => {
			reducedMotion.removeEventListener('change', setMotionPreference);
			if (frame) cancelAnimationFrame(frame);
		};
	});
</script>

<svelte:window on:scroll={updateParallax} />

<svelte:head>
	<title>Architect in Spaarndam, Haarlem & Amsterdam | Maria Hoogland</title>
	<meta
		name="description"
		content="Maria Hoogland helpt met verbouwingen, nieuwbouw en vergunningen. Persoonlijke architectuur voor woningen en gebouwen in Spaarndam, Haarlem en Amsterdam."
	/>
	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="Architect in Spaarndam, Haarlem & Amsterdam | Maria Hoogland"
	/>
	<meta
		property="og:description"
		content="Persoonlijke architectuur voor verbouwingen, nieuwbouw en vergunningen."
	/>
	<meta
		property="og:image"
		content="https://mariahoogland.nl/images/people/maria-garden-portrait.webp"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Architect in Spaarndam, Haarlem & Amsterdam | Maria Hoogland"
	/>
	<meta
		name="twitter:description"
		content="Persoonlijke architectuur voor verbouwingen, nieuwbouw en vergunningen."
	/>
	<meta
		name="twitter:image"
		content="https://mariahoogland.nl/images/people/maria-garden-portrait.webp"
	/>
</svelte:head>

<section
	bind:this={hero}
	class="overflow-hidden bg-[#f7f9fc]"
	style={`background-image:url(${home.hero.backgroundImage || '/images/hero/architectural-linework.png'});background-position:left calc(50% + ${backgroundOffset}px);background-repeat:no-repeat;background-size:cover`}
>
	<div
		class="mx-auto grid min-h-[min(680px,calc(100svh-3.5rem))] max-w-7xl gap-x-16 gap-y-12 px-6 py-16 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-24"
	>
		<div class="max-w-xl lg:max-w-none">
			<p class="text-xs font-medium tracking-[.12em] text-secondary uppercase">
				Maria Hoogland Architectuur
			</p>
			<h1
				class="mt-5 max-w-none text-[clamp(2.5rem,3.8vw,4.25rem)] leading-[.98] font-medium tracking-[-.055em]"
			>
				<span class="lg:whitespace-nowrap">Zoekt u een architect</span>
				<span class="block">die bij u past?</span>
			</h1>
			<p class="mt-6 text-base leading-7 text-secondary">
				Voor verbouwingen, nieuwbouw en vergunningen.
			</p>
			<div class="mt-10 flex flex-wrap items-center gap-4">
				<a
					class="rounded-full bg-secondary px-5 py-2.5 text-sm font-light tracking-wide text-white no-underline shadow-sm transition hover:bg-secondary/80"
					href={home.hero.primaryCta.href}>{home.hero.primaryCta.label}</a
				><a
					class="rounded-full border border-secondary/40 bg-transparent px-5 py-2.5 text-sm font-light tracking-wide text-secondary no-underline transition hover:border-secondary"
					href={home.hero.secondaryCta.href}>{home.hero.secondaryCta.label}</a
				>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-4 lg:justify-self-end">
			{#each home.hero.images as image, index}
				<img
					class={`aspect-[4/5] w-full max-w-sm rounded-2xl object-cover shadow-md ${index === 1 ? 'mt-8' : ''}`}
					src={image.src}
					alt={image.alt}
					fetchpriority={index === 0 ? 'high' : 'auto'}
				/>
			{/each}
		</div>
	</div>
</section>

{#if home.gallery.images.length}
	<section class="bg-[#e8edf4] px-6 py-20 sm:px-8 sm:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="text-[clamp(2.2rem,4vw,4rem)] leading-[.98] font-medium tracking-[-.055em]">
					{home.gallery.title}
				</h2>
				<p class="mt-5 text-base leading-7 text-secondary sm:text-lg">
					{home.gallery.description}
				</p>
			</div>
			<div class="mt-12">
				<Carousel images={home.gallery.images} autoplay={4000} />
			</div>
		</div>
	</section>
{/if}

<section class="bg-[#f7f9fc] px-6 py-20 sm:px-8 sm:py-28">
	<div class="mx-auto max-w-7xl">
		<div class="flex items-end justify-between gap-6">
			<div>
				<h2 class="text-[clamp(2.4rem,4.5vw,4.6rem)] leading-[.96] font-medium tracking-[-.06em]">
					Een praktijk in beelden.
				</h2>
			</div>
			<a
				class="hidden border-b border-textcolor pb-1 text-sm text-textcolor no-underline sm:block"
				href="/portfolio">Alle projecten</a
			>
		</div>
		<div class="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
			{#each galleryProjects as project, index}<a
					class={`rounded-xl border border-transparent p-3 text-textcolor no-underline transition-colors duration-200 hover:border-black/10 hover:bg-white ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
					href={`/${project.slug}`}
					><img
						class={`w-full rounded-lg object-cover ${index === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}
						src={project.mainImage}
						alt={project.title}
						loading="lazy"
					/>
					<div class="pt-3 pb-1">
						<p class="text-xs text-secondary">{project.category}</p>
						<h3 class="mt-1 text-sm font-semibold sm:text-base">{project.title}</h3>
					</div></a
				>{/each}
		</div>
		<a
			class="mt-10 inline-block border-b border-textcolor pb-1 text-sm text-textcolor no-underline sm:hidden"
			href="/portfolio">Alle projecten</a
		>
	</div>
</section>

<section bind:this={statistics} class="relative isolate overflow-hidden bg-neutral-600 text-white">
	<img
		class="absolute inset-x-0 top-[-160px] z-0 h-[calc(100%+320px)] w-full scale-110 object-cover brightness-[.7]"
		style={`transform:translateY(${statisticsBackgroundOffset}px) scale(1.1)`}
		src="/images/projects/ijburg-riet-eiland/kitchen-dining.jpeg"
		alt=""
	/>
	<div class="absolute inset-0 z-10 bg-neutral-800/45"></div>
	<div
		class="relative z-20 mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/25 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8"
	>
		{#each home.stats as stat}<div class="py-20 text-left sm:px-8 sm:first:pl-0 sm:last:pr-0">
				<h2 class="text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
					<CountUp value={stat.value} suffix={stat.suffix ? `${stat.suffix} ` : ''} />
				</h2>
				<p class="mt-3 text-sm leading-6 text-white/75">{stat.label}</p>
			</div>{/each}
	</div>
</section>

{#if home.testimonials.items.length}
	<section class="bg-[#f7f9fc] px-6 py-20 sm:px-8 sm:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="text-[clamp(2.2rem,4vw,4rem)] leading-[.98] font-medium tracking-[-.055em]">
					{home.testimonials.title}
				</h2>
				<p class="mt-5 text-base leading-7 text-secondary sm:text-lg">
					{home.testimonials.description}
				</p>
			</div>
			<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
				{#each home.testimonials.items as testimonial}
					<article
						class="flex flex-col rounded-2xl border border-black/8 bg-white px-5 py-6 sm:px-6"
					>
						<span class="font-serif text-5xl leading-none text-secondary/25">“</span>
						<blockquote class="mt-3 flex-grow text-sm leading-7 text-textcolor">
							<p>{testimonial.quote}</p>
						</blockquote>
						<div class="mt-6 border-t border-black/10 pt-4">
							<p class="text-xs font-light tracking-[0.2em] text-secondary uppercase">
								{testimonial.name}
							</p>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}
