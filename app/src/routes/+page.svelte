<script lang="ts">
	import CountUp from '$lib/CountUp.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import { fade, slide } from 'svelte/transition';
	import type { SiteContent } from '$lib/types/content';

	export let data: {
		content: SiteContent;
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
	<section class="bg-[#e8edf4] py-20 sm:py-24">
		<div class="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(220px,.7fr)_minmax(0,1.3fr)] lg:items-end lg:px-8">
			<div class="max-w-sm">
				<p class="text-xs font-medium uppercase tracking-[0.12em] text-secondary">In beeld</p>
				<h2 class="mt-4 text-[clamp(2rem,3.5vw,3.5rem)] font-medium leading-[.98] tracking-[-.05em] text-textcolor">{home.gallery.title}</h2>
				<p class="mt-5 text-base leading-7 text-secondary">{home.gallery.description}</p>
			</div>
			<div><Carousel images={home.gallery.images} autoplay={4000} /></div>
		</div>
	</section>
{/if}

<section class="border-y border-black/10 bg-white" in:fade={{ duration: 1000, delay: 500 }}>
	<div class="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-black/10 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
		{#each home.stats as stat}
			<div class="py-10 text-left sm:px-8 sm:first:pl-0 sm:last:pr-0">
				<h3 class="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"><CountUp value={stat.value} suffix={stat.suffix ? `${stat.suffix} ` : ''} /></h3>
				<p class="mt-3 text-sm leading-6 text-secondary">{stat.label}</p>
			</div>
		{/each}
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
