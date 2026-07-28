<script lang="ts">
	import type { ProjectWithHtml } from '$lib/server/projects';
	import { fade } from 'svelte/transition';
	import { X } from '@lucide/svelte';

	export let data: { project: ProjectWithHtml };

	let lightboxOpen = false;
	let selectedIndex = 0;
	const images = data.project.gallery || [];

	function openLightbox(index: number) {
		selectedIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}
</script>

<svelte:body class:overflow-hidden={lightboxOpen} />

<article class="bg-paper">
	<div class="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
		<div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
			<figure>
				<img
					src={data.project.mainImage}
					alt={data.project.title}
					class="aspect-[4/3] w-full object-cover"
				/>
				{#if data.project.caption}
					<figcaption class="mt-3 text-sm text-secondary">{data.project.caption}</figcaption>
				{/if}
			</figure>

			<div class="lg:sticky lg:top-24">
				<header class="border-b border-line pb-6">
					<p class="text-sm font-medium text-secondary">{data.project.category}</p>
					<h1 class="mt-3 text-4xl font-semibold leading-tight text-textcolor md:text-5xl">
						{data.project.title}
					</h1>
					<p class="mt-4 text-lg leading-8 text-secondary">{data.project.subtitle}</p>
				</header>

				<div class="prose prose-lg mt-6 max-w-none leading-relaxed text-secondary prose-headings:text-textcolor prose-a:text-primary">
					{@html data.project.description}
				</div>
			</div>
		</div>

		{#if images.length}
			<section class="mt-14 border-t border-line pt-10">
				<h2 class="section-title">Galerij</h2>
				<div
					class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
				>
					{#each images as thumb, idx}
						<button class="overflow-hidden bg-stone text-left" on:click={() => openLightbox(idx)}>
							<img
								src={thumb}
								alt={`${data.project.title} afbeelding ${idx + 1}`}
								class="aspect-square w-full cursor-pointer object-cover opacity-95 transition-opacity hover:opacity-100"
							/>
						</button>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	{#if lightboxOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
			on:click|self={closeLightbox}
			on:keydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') closeLightbox(); }}
			role="button"
			tabindex="0"
			transition:fade
		>
			<div class="relative mx-4 max-h-full max-w-5xl p-4">
				<button
					class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center bg-white text-textcolor"
					aria-label="Sluit galerij"
					on:click={closeLightbox}
				>
					<X size={22} />
				</button>

				<img
					src={images[selectedIndex]}
					alt={`${data.project.title} afbeelding ${selectedIndex + 1}`}
					class="max-h-[86svh] w-full object-contain"
				/>
			</div>
		</div>
	{/if}
</article>
