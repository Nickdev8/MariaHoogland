<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import CountUp from '$lib/CountUp.svelte';
	import { fade, slide } from 'svelte/transition';
	import type { SiteContent } from '$lib/types/content';
	import type { ProjectWithHtml } from '$lib/server/projects';

	export let data: {
		content: SiteContent;
		mainProjects: ProjectWithHtml[];
		projects: ProjectWithHtml[];
	};

	const home = data.content.home;
</script>

<section class="relative overflow-hidden border-b border-secondary/20 bg-[#ecf1ef]">
	<div class="absolute inset-0">
		<img
			src={home.hero.backgroundImage || '/images/mainbg.png'}
			alt=""
			class="h-full w-full object-cover object-left opacity-35"
		/>
		<div class="absolute inset-0 bg-gradient-to-r from-[#ecf1ef] via-[#ecf1ef]/92 to-[#ecf1ef]/50"></div>
	</div>

	<div
		class="section-wrap relative grid min-h-[calc(100svh-5rem)] grid-cols-1 items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.2fr_1fr]"
	>
		<div class="max-w-2xl" in:fade={{ duration: 500 }}>
			<p class="section-eyebrow">Architectuur AMH</p>
			<h1 class="mt-5 text-4xl leading-tight text-textcolor sm:text-5xl lg:text-6xl">
				{home.hero.title}
			</h1>
			<p class="mt-6 max-w-xl text-base leading-7 text-secondary sm:text-lg">
				{home.hero.description}
			</p>
			<div class="mt-10 flex flex-wrap gap-3">
				<a href={home.hero.primaryCta.href} class="site-btn-primary">
					{home.hero.primaryCta.label}
				</a>
				<a href={home.hero.secondaryCta.href} class="site-btn-secondary">
					{home.hero.secondaryCta.label}
					<ArrowRight class="h-4 w-4" />
				</a>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4 md:ml-auto md:max-w-xl">
			{#each home.hero.images as image, index}
				<figure
					class={`overflow-hidden border border-secondary/20 bg-white ${index === 1 ? 'mt-8' : ''}`}
					in:slide={{ duration: 450, delay: 120 + index * 140 }}
				>
					<img
						src={image.src}
						alt={image.alt}
						class="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
					/>
				</figure>
			{/each}
		</div>
	</div>
</section>

{#if home.gallery.images.length}
	<section class="border-b border-secondary/15 bg-white py-20 sm:py-24">
		<div class="section-wrap">
			<div class="max-w-3xl">
				<p class="section-eyebrow">{home.gallery.title}</p>
				<h2 class="section-title">Sfeer en materialiteit in beeld</h2>
				<p class="section-copy">{home.gallery.description}</p>
			</div>
			<div class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each home.gallery.images as image}
					<figure class="overflow-hidden border border-secondary/20 bg-[#f8faf8]">
						<img
							src={image.src}
							alt={image.alt}
							loading="lazy"
							class="h-48 w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
						/>
					</figure>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if data.mainProjects.length}
	<section class="border-b border-secondary/15 bg-[#f5f7f6] py-20 sm:py-24" in:fade={{ duration: 500 }}>
		<div class="section-wrap">
			<div class="max-w-3xl">
				<p class="section-eyebrow">{home.featured.title}</p>
				<h2 class="section-title">Projecten met context, rust en precisie</h2>
				<p class="section-copy">{home.featured.description}</p>
			</div>
			<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
				{#each data.mainProjects as project}
					<a href={`/${project.slug}`} class="group block border border-secondary/20 bg-white transition-colors hover:border-secondary/40">
						<div class="overflow-hidden border-b border-secondary/15">
							<img
								src={project.mainImage}
								alt={project.title}
								class="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
							/>
						</div>
						<div class="p-5">
							<h3 class="text-2xl text-textcolor">{project.title}</h3>
							<p class="mt-2 text-sm leading-6 text-secondary">{project.subtitle}</p>
							<span class="site-link mt-4">
								Bekijk project
								<ArrowRight class="h-4 w-4" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<section class="border-b border-secondary/15 bg-[#dee6e3] py-14 sm:py-16" in:fade={{ duration: 450, delay: 120 }}>
	<div class="section-wrap">
		<div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
			{#each home.stats as stat, index}
				<div class={`px-4 ${index > 0 ? 'md:border-l md:border-secondary/20' : ''}`}>
					<h3 class="text-4xl leading-none text-textcolor sm:text-5xl">
						<CountUp value={stat.value} suffix={stat.suffix ? `${stat.suffix} ` : ''} />
					</h3>
					<p class="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-[#f8f9f8] py-20 sm:py-24">
	<div class="section-wrap">
		<div class="max-w-3xl">
			<p class="section-eyebrow">{home.testimonials.title}</p>
			<h2 class="section-title">Ervaringen uit de praktijk</h2>
			<p class="section-copy">{home.testimonials.description}</p>
		</div>
		<div class="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
			{#each home.testimonials.items as testimonial}
				<figure class="flat-panel p-7">
					<blockquote class="text-lg leading-8 text-secondary">
						<p>“{testimonial.quote}”</p>
					</blockquote>
					<figcaption class="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-textcolor">
						{testimonial.name}
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>
