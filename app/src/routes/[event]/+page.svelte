<script lang="ts">
	import type { ProjectWithHtml } from '$lib/server/projects';
	import { ArrowLeft, ChevronLeft, ChevronRight, X } from '@lucide/svelte';
	export let data: {
		project: ProjectWithHtml;
		previousProject: ProjectWithHtml;
		nextProject: ProjectWithHtml;
	};
	let lightboxOpen = false;
	let selectedIndex = 0;
	const gallery = data.project.gallery ?? [];
	const openLightbox = (index: number) => {
		selectedIndex = index;
		lightboxOpen = true;
	};
	const closeLightbox = () => {
		lightboxOpen = false;
	};
	const previousImage = () => {
		selectedIndex = selectedIndex === 0 ? gallery.length - 1 : selectedIndex - 1;
	};
	const nextImage = () => {
		selectedIndex = selectedIndex === gallery.length - 1 ? 0 : selectedIndex + 1;
	};
	function handleKeydown(event: KeyboardEvent) {
		if (!lightboxOpen) return;
		if (event.key === 'Escape') closeLightbox();
		if (event.key === 'ArrowLeft') previousImage();
		if (event.key === 'ArrowRight') nextImage();
	}
</script>

<svelte:head>
	<title>{data.project.title} | Maria Hoogland Architectuur</title>
	<meta name="description" content={data.project.subtitle} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={`${data.project.title} | Maria Hoogland Architectuur`} />
	<meta property="og:description" content={data.project.subtitle} />
	<meta property="og:image" content={`https://mariahoogland.nl${data.project.mainImage}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${data.project.title} | Maria Hoogland Architectuur`} />
	<meta name="twitter:description" content={data.project.subtitle} />
	<meta name="twitter:image" content={`https://mariahoogland.nl${data.project.mainImage}`} />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />
<svelte:body class:overflow-hidden={lightboxOpen} />

<article class="bg-[#f6f8fb] px-4 pt-8 text-textcolor sm:px-6">
	<div class="mx-auto max-w-[1280px]">
		<a
			class="inline-flex items-center gap-2 border-b border-transparent pb-1 text-sm text-secondary hover:border-secondary"
			href="/portfolio"><ArrowLeft size={16} /> Mijn werk</a
		>
		<header class="my-[54px] max-w-[900px]">
			<p class="text-xs font-medium tracking-[0.08em] text-secondary uppercase">
				{data.project.category}
			</p>
			<h1
				class="mt-4 max-w-[850px] text-[clamp(2.8rem,6.3vw,6.1rem)] leading-[.94] font-medium tracking-[-.06em]"
			>
				{data.project.title}
			</h1>
			<p class="mt-6 max-w-[620px] text-[clamp(1rem,1.8vw,1.3rem)] leading-[1.55] text-secondary">
				{data.project.subtitle}
			</p>
		</header>
	</div>
	<figure class="relative left-1/2 w-screen -translate-x-1/2 bg-[#e8edf4]">
		<img
			class="h-[min(70vw,810px)] w-full object-cover"
			style={`object-position:${data.project.mainImagePosition ?? 'center'}`}
			src={data.project.mainImage}
			alt={data.project.title}
		/>{#if data.project.caption}<figcaption
				class="mx-auto max-w-[1280px] px-4 pt-2.5 text-xs text-secondary sm:px-6"
			>
				{data.project.caption}
			</figcaption>{/if}
	</figure>
	<section
		class="mx-auto grid max-w-[1280px] gap-6 py-[112px] md:grid-cols-12"
		aria-labelledby="project-story"
	>
		<div class="md:col-span-3">
			<p class="m-0 text-xs font-medium tracking-[0.08em] text-secondary uppercase">
				Over dit project
			</p>
		</div>
		<div
			id="project-story"
			class="prose prose-lg mt-7 max-w-none leading-[1.8] text-textcolor md:col-span-6 md:col-start-5 md:mt-0 prose-p:mt-0 prose-p:mb-[1.3em]"
		>
			{@html data.project.description}
		</div>
	</section>
	{#if gallery.length}
		<section
			class="mx-auto max-w-[1280px] border-t border-black/15 py-[clamp(3.75rem,7vw,7rem)]"
			aria-labelledby="gallery-title"
		>
			<div class="mb-10">
				<p class="m-0 text-xs font-medium tracking-[0.08em] text-secondary uppercase">
					Beelden van het project
				</p>
				<h2
					id="gallery-title"
					class="mt-3 text-[clamp(2rem,4vw,4.2rem)] leading-[.98] font-medium tracking-[-.055em]"
				>
					Projectbeelden
				</h2>
			</div>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-12 md:gap-4">
				{#each gallery as image, index}<button
						class={`col-span-1 overflow-hidden bg-[#e8edf4] p-0 ${index % 5 === 0 ? 'md:col-span-8' : 'md:col-span-4'}`}
						type="button"
						on:click={() => openLightbox(index)}
						aria-label={`Bekijk afbeelding ${index + 1} van ${gallery.length}: ${data.project.title}`}
						><img
							class={`w-full object-cover transition-opacity duration-200 hover:opacity-80 ${index % 5 === 0 ? 'aspect-square md:aspect-[16/10]' : 'aspect-square md:aspect-[4/3]'}`}
							src={image}
							alt={`${data.project.title}, afbeelding ${index + 1}`}
							loading="lazy"
						/></button
					>{/each}
			</div>
		</section>
	{/if}
	{#if data.previousProject.slug !== data.project.slug}
		<nav
			class="mx-auto max-w-[1280px] border-t border-black/15 py-12 sm:py-16"
			aria-label="Meer projecten"
		>
			<div class="grid grid-cols-2 gap-3 sm:gap-5">
				<a
					class="group relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary text-white no-underline"
					href={`/${data.previousProject.slug}`}
				>
					<img
						class="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
						src={data.previousProject.mainImage}
						alt={data.previousProject.title}
						loading="lazy"
					/>
					<div class="absolute inset-0 flex flex-col justify-between bg-black/35 p-4 sm:p-6">
						<span class="text-xs">Vorig project</span>
						<span class="text-base leading-tight font-medium sm:text-xl">
							{data.previousProject.title}
						</span>
					</div>
				</a>
				<a
					class="group relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary text-white no-underline"
					href={`/${data.nextProject.slug}`}
				>
					<img
						class="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
						src={data.nextProject.mainImage}
						alt={data.nextProject.title}
						loading="lazy"
					/>
					<div class="absolute inset-0 flex flex-col justify-between bg-black/35 p-4 sm:p-6">
						<span class="text-right text-xs">Volgend project</span>
						<span class="text-right text-base leading-tight font-medium sm:text-xl">
							{data.nextProject.title}
						</span>
					</div>
				</a>
			</div>
		</nav>
	{/if}
</article>

{#if lightboxOpen}
	<div
		class="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6"
		role="dialog"
		aria-modal="true"
		aria-label={`Afbeelding ${selectedIndex + 1} van ${gallery.length}`}
	>
		<button
			class="absolute inset-0 border-0 bg-black/90"
			type="button"
			aria-label="Sluit afbeelding"
			on:click={closeLightbox}
		></button>
		<div class="relative z-10 max-h-full max-w-[min(1200px,100%)]">
			<button
				class="absolute top-2.5 right-2.5 grid h-10 w-10 place-items-center border-0 bg-white text-textcolor"
				type="button"
				on:click={closeLightbox}
				aria-label="Sluit afbeelding"><X size={22} /></button
			><img
				class="block max-h-[calc(100svh-92px)] max-w-full object-contain"
				src={gallery[selectedIndex]}
				alt={`${data.project.title}, afbeelding ${selectedIndex + 1}`}
			/>{#if gallery.length > 1}<button
					class="absolute top-1/2 left-0 grid h-10 w-10 -translate-y-1/2 place-items-center border-0 bg-white text-textcolor sm:left-2.5"
					type="button"
					on:click={previousImage}
					aria-label="Vorige afbeelding"><ChevronLeft size={24} /></button
				><button
					class="absolute top-1/2 right-0 grid h-10 w-10 -translate-y-1/2 place-items-center border-0 bg-white text-textcolor sm:right-2.5"
					type="button"
					on:click={nextImage}
					aria-label="Volgende afbeelding"><ChevronRight size={24} /></button
				>{/if}
			<p class="mt-2.5 text-center text-sm text-white">{selectedIndex + 1} / {gallery.length}</p>
		</div>
	</div>
{/if}
