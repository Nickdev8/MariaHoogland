<script lang="ts">
	import type { ProjectWithHtml } from '$lib/server/projects';
	import { fade, scale } from 'svelte/transition';
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

<section class="border-b border-secondary/15 bg-[#f4f7f6] py-20 sm:py-24">
	<div class="section-wrap">
		<p class="section-eyebrow">{data.project.category}</p>
		<h1 class="section-title">{data.project.title}</h1>
		<p class="section-copy">{data.project.subtitle}</p>
	</div>
</section>

<article class="bg-white py-14 sm:py-16">
	<div class="section-wrap">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
			<figure class="overflow-hidden border border-secondary/20 bg-[#f7f9f8]">
				<img src={data.project.mainImage} alt={data.project.title} class="aspect-video w-full object-cover" />
				{#if data.project.caption}
					<figcaption class="border-t border-secondary/15 px-4 py-3 text-sm text-secondary">
						{data.project.caption}
					</figcaption>
				{/if}
			</figure>

			<div class="flat-panel p-7 sm:p-8">
				<div class="prose prose-lg max-w-none leading-relaxed text-secondary prose-headings:text-textcolor prose-a:text-textcolor">
					{@html data.project.description}
				</div>
			</div>
		</div>

		{#if images.length}
			<section class="mt-12">
				<h2 class="text-3xl text-textcolor">Galerij</h2>
				<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{#each images as thumb, idx}
						<button
							type="button"
							class="overflow-hidden border border-secondary/20 bg-[#f7f9f8]"
							on:click={() => openLightbox(idx)}
						>
							<img
								src={thumb}
								alt="Thumbnail of {data.project.title}"
								class="aspect-square w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-[1.05]"
							/>
						</button>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</article>

{#if lightboxOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
		on:click|self={closeLightbox}
		on:keydown={(e) => {
			if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') closeLightbox();
		}}
		role="button"
		tabindex="0"
		transition:fade
	>
		<div class="relative mx-4 w-full max-w-5xl border border-white/40 bg-black/30 p-4">
			<button
				type="button"
				class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center border border-white/50 bg-black/40 text-white"
				aria-label="Close modal"
				on:click={closeLightbox}
			>
				<X size={20} />
			</button>

			<img
				src={images[selectedIndex]}
				alt="{data.project.title} image {selectedIndex + 1}"
				class="h-auto w-full object-contain"
				transition:scale={{ duration: 180 }}
			/>
		</div>
	</div>
{/if}
