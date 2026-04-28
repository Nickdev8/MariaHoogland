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
							class="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
							>{home.hero.primaryCta.label}</a
						>
						<a
							href={home.hero.secondaryCta.href}
							class="text-sm font-semibold leading-6 text-sky-700"
							>{home.hero.secondaryCta.label} <span aria-hidden="true">→</span></a
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
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					{home.gallery.title}
				</h2>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					{home.gallery.description}
				</p>
			</div>
			<div class="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each home.gallery.images as image}
					<div class="overflow-hidden rounded-lg">
						<img
							src={image.src}
							alt={image.alt}
							loading="lazy"
							class="h-48 w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
						/>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}


{#if data.mainProjects.length}
	<section class="bg-white py-16 sm:py-20" in:fade={{ duration: 1000, delay: 1000 }}>
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					{home.featured.title}
				</h2>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					{home.featured.description}
				</p>
			</div>
			<div
				class="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3"
			>
				{#each data.mainProjects as project}
					<a href={`/${project.slug}`} class="group block">
						<div
							class="overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 group-hover:shadow-lg"
						>
							<img
								src={project.mainImage}
								alt={project.title}
								class="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
							/>
						</div>
						<div class="p-5">
							<h3 class="mt-2 text-lg font-semibold text-gray-900">{project.title}</h3>
							<p class="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{project.subtitle}</p>
							<span
								class="mt-4 inline-flex items-center font-medium text-sky-600 group-hover:text-sky-500"
							>
								Bekijk project
								<ArrowRight class="ml-2 h-4 w-4" />
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


<section class="bg-slate-50 py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
				{home.testimonials.title}
			</h2>
			<p class="mt-6 text-lg leading-8 text-gray-600">
				{home.testimonials.description}
			</p>
		</div>
		<div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
			{#each home.testimonials.items as testimonial}
				<div class="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm">
					<blockquote class="flex-grow text-lg leading-8 text-gray-700">
						<p>“{testimonial.quote}”</p>
					</blockquote>
					<footer class="mt-6">
						<div class="font-semibold text-gray-900">{testimonial.name}</div>
					</footer>
				</div>
			{/each}
		</div>
	</div>
</section>
