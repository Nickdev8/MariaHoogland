<script lang="ts">
	import type { ProjectWithHtml } from '$lib/server/projects';
	import { ArrowLeft, ChevronLeft, ChevronRight, X } from '@lucide/svelte';
	export let data: { project: ProjectWithHtml };
	let lightboxOpen = false;
	let selectedIndex = 0;
	const gallery = data.project.gallery ?? [];
	const openLightbox = (index: number) => { selectedIndex = index; lightboxOpen = true; };
	const closeLightbox = () => { lightboxOpen = false; };
	const previousImage = () => { selectedIndex = selectedIndex === 0 ? gallery.length - 1 : selectedIndex - 1; };
	const nextImage = () => { selectedIndex = selectedIndex === gallery.length - 1 ? 0 : selectedIndex + 1; };
	function handleKeydown(event: KeyboardEvent) { if (!lightboxOpen) return; if (event.key === 'Escape') closeLightbox(); if (event.key === 'ArrowLeft') previousImage(); if (event.key === 'ArrowRight') nextImage(); }
</script>

<svelte:window on:keydown={handleKeydown} />
<svelte:body class:overflow-hidden={lightboxOpen} />

<article class="bg-[#f6f8fb] px-4 pt-8 text-black sm:px-6">
	<div class="mx-auto max-w-[1280px]"><a class="inline-flex items-center gap-2 border-b border-transparent pb-1 text-sm text-secondary hover:border-secondary" href="/portfolio"><ArrowLeft size={16} /> Alle projecten</a><header class="my-[54px] max-w-[900px]"><p class="text-xs font-medium uppercase tracking-[0.08em] text-secondary">{data.project.category}</p><h1 class="mt-4 max-w-[850px] text-[clamp(2.8rem,6.3vw,6.1rem)] font-medium leading-[.94] tracking-[-.06em]">{data.project.title}</h1><p class="mt-6 max-w-[620px] text-[clamp(1rem,1.8vw,1.3rem)] leading-[1.55] text-secondary">{data.project.subtitle}</p></header></div>
	<figure class="relative left-1/2 w-screen -translate-x-1/2 bg-[#e8edf4]"><img class="h-[min(70vw,810px)] w-full object-cover" src={data.project.mainImage} alt={data.project.title} />{#if data.project.caption}<figcaption class="mx-auto max-w-[1280px] px-4 pt-2.5 text-xs text-secondary sm:px-6">{data.project.caption}</figcaption>{/if}</figure>
	<section class="mx-auto grid max-w-[1280px] gap-6 py-[112px] md:grid-cols-12" aria-labelledby="project-story"><div class="md:col-span-3"><p class="m-0 text-xs font-medium uppercase tracking-[0.08em] text-secondary">Over dit project</p></div><div id="project-story" class="prose prose-lg mt-7 max-w-none leading-[1.8] text-neutral-700 prose-p:mb-[1.3em] prose-p:mt-0 md:col-start-5 md:col-span-6 md:mt-0">{@html data.project.description}</div></section>
	{#if gallery.length}
		<section class="mx-auto max-w-[1280px] border-t border-black/15 py-[clamp(3.75rem,7vw,7rem)]" aria-labelledby="gallery-title"><div class="mb-10"><p class="m-0 text-xs font-medium uppercase tracking-[0.08em] text-secondary">Beelden van het project</p><h2 id="gallery-title" class="mt-3 text-[clamp(2rem,4vw,4.2rem)] font-medium leading-[.98] tracking-[-.055em]">Van idee tot detail.</h2></div><div class="grid grid-cols-2 gap-2 md:grid-cols-12 md:gap-4">{#each gallery as image, index}<button class={`col-span-1 overflow-hidden bg-[#e8edf4] p-0 ${index % 5 === 0 ? 'md:col-span-8' : 'md:col-span-4'}`} type="button" on:click={() => openLightbox(index)} aria-label={`Bekijk afbeelding ${index + 1} van ${gallery.length}: ${data.project.title}`}><img class={`w-full object-cover transition-opacity duration-200 hover:opacity-80 ${index % 5 === 0 ? 'aspect-square md:aspect-[16/10]' : 'aspect-square md:aspect-[4/3]'}`} src={image} alt={`${data.project.title}, afbeelding ${index + 1}`} loading="lazy" /></button>{/each}</div></section>
	{/if}
	<section class="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 border-t border-black/15 py-[72px] md:flex-row md:items-end"><div><p class="m-0 text-xs font-medium uppercase tracking-[0.08em] text-secondary">Uw eigen project</p><h2 class="mt-3 max-w-[700px] text-[clamp(2rem,4vw,4.2rem)] font-medium leading-[.98] tracking-[-.055em]">Een eerste idee begint met een gesprek.</h2></div><a class="border border-secondary px-4 py-3 text-sm text-black no-underline transition-colors hover:bg-secondary hover:text-white" href="/contact">Neem contact op</a></section>
</article>

{#if lightboxOpen}
	<div class="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Afbeelding ${selectedIndex + 1} van ${gallery.length}`}><button class="absolute inset-0 border-0 bg-black/90" type="button" aria-label="Sluit afbeelding" on:click={closeLightbox}></button><div class="relative z-10 max-h-full max-w-[min(1200px,100%)]"><button class="absolute right-2.5 top-2.5 grid h-10 w-10 place-items-center border-0 bg-white text-black" type="button" on:click={closeLightbox} aria-label="Sluit afbeelding"><X size={22} /></button><img class="block max-h-[calc(100svh-92px)] max-w-full object-contain" src={gallery[selectedIndex]} alt={`${data.project.title}, afbeelding ${selectedIndex + 1}`} />{#if gallery.length > 1}<button class="absolute left-0 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center border-0 bg-white text-black sm:left-2.5" type="button" on:click={previousImage} aria-label="Vorige afbeelding"><ChevronLeft size={24} /></button><button class="absolute right-0 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center border-0 bg-white text-black sm:right-2.5" type="button" on:click={nextImage} aria-label="Volgende afbeelding"><ChevronRight size={24} /></button>{/if}<p class="mt-2.5 text-center text-sm text-white">{selectedIndex + 1} / {gallery.length}</p></div></div>
{/if}
