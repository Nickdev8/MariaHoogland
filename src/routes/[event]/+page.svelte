<script lang="ts">
	import type { Project } from '$lib/data/projects.ts';
	import { fade, scale } from 'svelte/transition';
	import { X } from '@lucide/svelte';

	export let data: { project: Project };

	// Lightbox state
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

<article class="container mx-auto rounded-2xl bg-white p-6 transition-colors md:p-10">
	<!-- Main section: image + content -->
	<div class="flex flex-col gap-8 lg:flex-row">
		<!-- Hero image -->
		<div class="lg:w-1/2">
			<figure>
				<img
					src={data.project.mainImage}
					alt={data.project.title}
					class="aspect-video w-full rounded-2xl object-cover shadow-lg"
				/>
				{#if data.project.caption}
					<figcaption class="mt-2 text-sm text-gray-600">{data.project.caption}</figcaption>
				{/if}
			</figure>
		</div>

		<!-- Details -->
		<div class="flex flex-col justify-center space-y-6 lg:w-1/2">
			<header>
				<h1 class="text-4xl leading-tight font-extrabold text-black md:text-5xl">
					{data.project.title}
				</h1>
				<p class="mt-2 text-lg text-gray-600">{data.project.subtitle}</p>
			</header>

			<!-- Description -->
			<div class="prose prose-lg prose-indigo max-w-none leading-relaxed text-gray-700">
				{@html data.project.description}
			</div>
		</div>
	</div>

	<!-- Gallery thumbnails -->
	{#if images.length}
		<section class="mt-12">
			<h2 class="mb-4 text-2xl font-semibold text-gray-800">Gallery</h2>
			<div
				class="grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
			>
				{#each images as thumb, idx}
					<button class="overflow-hidden rounded-lg shadow-2xl" on:click={() => openLightbox(idx)}>
						<img
							src={thumb}
							alt="Thumbnail of {data.project.title}"
							class="aspect-square w-full transform cursor-pointer object-cover transition-transform duration-300 hover:scale-110"
						/>
					</button>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Lightbox Modal -->
	{#if lightboxOpen}
		<div
			class="bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black/60"
			on:click|self={closeLightbox}
			transition:fade
		>
			<div class="relative mx-4 max-h-full max-w-4xl p-4">
				<!-- Prominent close button -->
				<button
					class="bg-opacity-90 absolute top-4 right-4 rounded-full bg-white p-2 shadow-lg focus:outline-none z-10"
					aria-label="Close modal"
					on:click={closeLightbox}
				>
					<X size={24} />
				</button>

				<img
					src={images[selectedIndex]}
					alt="{data.project.title} image {selectedIndex + 1}"
					class="h-auto w-full rounded-lg shadow-2xl"
					transition:scale
				/>
			</div>
		</div>
	{/if}
</article>
