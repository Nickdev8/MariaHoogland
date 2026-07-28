<script lang="ts">
	import Carousel from '$lib/components/Carousel.svelte';
	import type { SiteContent } from '$lib/types/content';
	import type { ProjectWithHtml } from '$lib/server/projects';

	export let data: {
		content: SiteContent;
		mainProjects: ProjectWithHtml[];
		projects: ProjectWithHtml[];
	};

	const home = data.content.home;
	const heroImage = home.hero.images[0];
</script>

<section class="bg-paper">
	<div class="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
		<div class="max-w-xl">
			<h1 class="text-4xl font-semibold leading-tight text-textcolor sm:text-5xl lg:text-6xl">
				{home.hero.title}
			</h1>
			<p class="mt-6 text-base leading-8 text-secondary sm:text-lg">
				{home.hero.description}
			</p>
			<div class="mt-8 flex flex-wrap items-center gap-3">
				<a href={home.hero.primaryCta.href} class="button-primary">{home.hero.primaryCta.label}</a>
				<a href={home.hero.secondaryCta.href} class="button-secondary">{home.hero.secondaryCta.label}</a>
			</div>
		</div>

		<div class="lg:justify-self-end">
			<img
				src={heroImage?.src ?? '/images/maria.jpg'}
				alt={heroImage?.alt ?? 'Portret van architect Maria Hoogland'}
				class="aspect-[5/4] w-full object-cover"
			/>
		</div>
	</div>
</section>

{#if home.gallery.images.length}
	<section class="bg-stone py-16 sm:py-20">
		<div class="mx-auto max-w-7xl px-5 lg:px-8">
			<div class="max-w-2xl">
				<h2 class="section-title">
					{home.gallery.title}
				</h2>
				<p class="mt-4 text-base leading-7 text-secondary">
					{home.gallery.description}
				</p>
			</div>
			<div class="mt-10">
				<Carousel images={home.gallery.images} autoplay={4000} />
			</div>
		</div>
	</section>
{/if}

<section
	class="border-y border-line bg-paper py-14"
	style={`
		background-image: linear-gradient(90deg, rgba(246,244,239,0.9), rgba(246,244,239,0.65)), url(${home.hero.backgroundImage || '/images/mainbg.png'});
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	`}
>
	<div class="mx-auto max-w-7xl px-5 lg:px-8">
		<p class="max-w-3xl text-xl leading-9 text-textcolor sm:text-2xl">
			Een verbouwing begint meestal met een concrete vraag: waar kan ruimte bij, wat mag volgens de regels en hoe blijft het huis prettig in gebruik?
		</p>
	</div>
</section>

{#if data.mainProjects.length}
	<section class="bg-paper py-16 sm:py-20">
		<div class="mx-auto max-w-7xl px-5 lg:px-8">
			<div class="max-w-2xl">
				<h2 class="section-title">
					{home.featured.title}
				</h2>
				<p class="mt-4 text-base leading-7 text-secondary">
					{home.featured.description}
				</p>
			</div>
			<div
				class="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3"
			>
				{#each data.mainProjects.slice(0, 3) as project}
					<a href={`/${project.slug}`} class="group block">
						<div class="relative overflow-hidden bg-stone">
							<img
								src={project.mainImage}
								alt={project.title}
								class="aspect-[4/3] w-full object-cover"
							/>
						</div>
						<div class="border-b border-line pt-4 pb-5">
							<h3 class="text-base font-semibold text-textcolor">{project.title}</h3>
							<p class="mt-1.5 line-clamp-2 text-sm leading-6 text-secondary">{project.subtitle}</p>
							<span class="mt-4 inline-block text-sm font-medium text-primary transition-colors group-hover:text-textcolor">
								Bekijk project
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}



<section class="bg-stone py-12">
	<div class="mx-auto max-w-7xl px-5 lg:px-8">
		<div class="grid grid-cols-1 gap-8 border-y border-line py-8 sm:grid-cols-3">
			{#each home.stats as stat}
				<div>
					<h3 class="text-3xl font-semibold text-textcolor">
						{stat.value}{stat.suffix}
					</h3>
					<p class="mt-2 text-sm text-secondary">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>


<section class="bg-paper py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-5 lg:px-8">
		<div class="max-w-2xl">
			<h2 class="section-title">{home.testimonials.title}</h2>
			<p class="mt-4 text-base leading-7 text-secondary">
				{home.testimonials.description}
			</p>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
			{#each home.testimonials.items as testimonial}
				<article class="flex h-full flex-col bg-white px-5 py-6 sm:px-6">
					<blockquote class="flex-grow text-base leading-7 text-textcolor">
						<p>{testimonial.quote}</p>
					</blockquote>
					<div class="mt-6 border-t border-line pt-4">
						<p class="text-sm font-medium text-secondary">
							{testimonial.name}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
