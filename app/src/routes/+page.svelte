<script lang="ts">
	import CountUp from '$lib/CountUp.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
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

<div
	style={`
		background-image: url(${home.hero.backgroundImage || '/images/mainbg.png'});
		background-position: center left;
		background-repeat: no-repeat;
		background-size: cover;
	`}
>
	<section class="py-16 sm:py-24">
		<div
			class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-x-16 gap-y-12 px-6 lg:grid-cols-2"
		>
			<div class="lg:pr-8">
				<div class="max-w-xl">
					<h2 class="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
						{home.hero.title}
					</h2>
					<p class="mt-6 text-lg leading-8 text-secondary">
						{home.hero.description}
					</p>
					<div class="mt-10 flex items-center gap-x-4">
						<a
							href={home.hero.primaryCta.href}
							class="rounded-full bg-secondary px-5 py-2.5 text-sm font-light tracking-wide text-white shadow-sm transition hover:bg-secondary/80"
							>{home.hero.primaryCta.label}</a
						>
						<a
							href={home.hero.secondaryCta.href}
							class="rounded-full border border-secondary/40 bg-transparent px-5 py-2.5 text-sm font-light tracking-wide text-secondary transition hover:border-secondary"
							>{home.hero.secondaryCta.label}</a
						>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				{#each home.hero.images as image, index}
					<img
						src={image.src}
						alt={image.alt}
						class={`aspect-[4/5] w-full max-w-sm rounded-2xl object-cover shadow-md ${index === 1 ? 'mt-8' : ''}`}
						in:slide={{ duration: 1000, delay: 200 + index * 200 }}
					/>
				{/each}
			</div>
		</div>
	</section>
</div>

{#if home.gallery.images.length}
	<section class="bg-slate-100 py-20 sm:py-24">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="section-title">
					{home.gallery.title}
				</h2>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					{home.gallery.description}
				</p>
			</div>
			<div class="mt-12">
				<Carousel images={home.gallery.images} autoplay={4000} />
			</div>
		</div>
	</section>
{/if}


{#if data.mainProjects.length}
	<section class="bg-[#f7f9fc] py-16 sm:py-20" in:fade={{ duration: 1000, delay: 1000 }}>
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="section-title">
					{home.featured.title}
				</h2>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					{home.featured.description}
				</p>
			</div>
			<div
				class="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3"
			>
				{#each data.mainProjects.slice(0, 3) as project}
					<a href={`/${project.slug}`} class="group block rounded-2xl border border-transparent transition-all duration-300 hover:border-secondary/20">
						<div class="relative overflow-hidden rounded-2xl">
							<img
								src={project.mainImage}
								alt={project.title}
								class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
							/>
						</div>
						<div class="px-1 pt-4 pb-5">
							<h3 class="text-base font-semibold tracking-tight text-textcolor">{project.title}</h3>
							<p class="mt-1.5 line-clamp-2 text-sm leading-6 text-secondary">{project.subtitle}</p>
							<span class="mt-4 inline-block text-xs font-light tracking-widest text-secondary uppercase transition group-hover:text-textcolor">
								Bekijk project →
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}



<section class="bg-slate-100 py-16 sm:py-20" in:fade={{ duration: 1000, delay: 500 }}>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-x-8 gap-y-12 text-center lg:grid-cols-3">
			{#each home.stats as stat}
				<div>
					<h3 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						<CountUp value={stat.value} suffix={stat.suffix ? `${stat.suffix} ` : ''} />
					</h3>
					<p class="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>


<section class="bg-[#f7f9fc] py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="section-title">{home.testimonials.title}</h2>
			<p class="mt-4 text-base leading-7 text-secondary sm:text-lg">
				{home.testimonials.description}
			</p>
		</div>
		<div class="mx-auto mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
			{#each home.testimonials.items as testimonial}
				<article class="flex h-full flex-col border border-black/8 bg-white px-5 py-6 sm:px-6">
					<span class="font-serif text-5xl leading-none text-secondary/20">"</span>
					<blockquote class="mt-3 flex-grow text-base leading-7 text-textcolor">
						<p>{testimonial.quote}</p>
					</blockquote>
					<div class="mt-6 border-t border-black/10 pt-4">
						<p class="text-xs font-light uppercase tracking-[0.24em] text-secondary">
							{testimonial.name}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
