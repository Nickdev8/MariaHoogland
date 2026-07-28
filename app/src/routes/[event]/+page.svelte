<script lang="ts">
	import type { ProjectWithHtml } from '$lib/server/projects';
	import { ArrowLeft, ChevronLeft, ChevronRight, X } from '@lucide/svelte';

	export let data: { project: ProjectWithHtml };

	let lightboxOpen = false;
	let selectedIndex = 0;
	const gallery = data.project.gallery ?? [];

	function openLightbox(index: number) {
		selectedIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function previousImage() {
		selectedIndex = selectedIndex === 0 ? gallery.length - 1 : selectedIndex - 1;
	}

	function nextImage() {
		selectedIndex = selectedIndex === gallery.length - 1 ? 0 : selectedIndex + 1;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!lightboxOpen) return;
		if (event.key === 'Escape') closeLightbox();
		if (event.key === 'ArrowLeft') previousImage();
		if (event.key === 'ArrowRight') nextImage();
	}
</script>

<svelte:window on:keydown={handleKeydown} />
<svelte:body class:overflow-hidden={lightboxOpen} />

<article class="project-page">
	<div class="project-page__intro">
		<a class="project-page__back" href="/portfolio"><ArrowLeft size={16} /> Alle projecten</a>
		<div class="project-page__heading">
			<div class="project-page__type">{data.project.category}</div>
			<h1>{data.project.title}</h1>
			<p>{data.project.subtitle}</p>
		</div>
	</div>

	<figure class="project-page__hero">
		<img src={data.project.mainImage} alt={data.project.title} />
		{#if data.project.caption}
			<figcaption>{data.project.caption}</figcaption>
		{/if}
	</figure>

	<section class="project-page__story" aria-labelledby="project-story">
		<div class="project-page__story-label">
			<p>Over dit project</p>
		</div>
		<div id="project-story" class="project-page__prose">
			{@html data.project.description}
		</div>
	</section>

	{#if gallery.length}
		<section class="project-page__gallery" aria-labelledby="gallery-title">
			<div class="project-page__gallery-heading">
				<p>Beelden van het project</p>
				<h2 id="gallery-title">Van idee tot detail.</h2>
			</div>
			<div class="project-page__gallery-grid">
				{#each gallery as image, index}
					<button class={`project-page__gallery-item ${index % 5 === 0 ? 'project-page__gallery-item--wide' : ''}`} type="button" on:click={() => openLightbox(index)} aria-label={`Bekijk afbeelding ${index + 1} van ${gallery.length}: ${data.project.title}`}>
						<img src={image} alt={`${data.project.title}, afbeelding ${index + 1}`} loading="lazy" />
					</button>
				{/each}
			</div>
		</section>
	{/if}

	<section class="project-page__contact">
		<div><p>Uw eigen project</p><h2>Een eerste idee begint met een gesprek.</h2></div>
		<a href="/contact">Neem contact op</a>
	</section>
</article>

{#if lightboxOpen}
	<div class="project-lightbox" role="dialog" aria-modal="true" aria-label={`Afbeelding ${selectedIndex + 1} van ${gallery.length}`}>
		<button class="project-lightbox__backdrop" type="button" aria-label="Sluit afbeelding" on:click={closeLightbox}></button>
		<div class="project-lightbox__content">
			<button class="project-lightbox__close" type="button" on:click={closeLightbox} aria-label="Sluit afbeelding"><X size={22} /></button>
			<img src={gallery[selectedIndex]} alt={`${data.project.title}, afbeelding ${selectedIndex + 1}`} />
			{#if gallery.length > 1}
				<button class="project-lightbox__previous" type="button" on:click={previousImage} aria-label="Vorige afbeelding"><ChevronLeft size={24} /></button>
				<button class="project-lightbox__next" type="button" on:click={nextImage} aria-label="Volgende afbeelding"><ChevronRight size={24} /></button>
			{/if}
			<p>{selectedIndex + 1} / {gallery.length}</p>
		</div>
	</div>
{/if}

<style>
	.project-page { background:#f6f8fb; color:#000; padding:32px 24px 0; }
	.project-page__intro,.project-page__hero,.project-page__story,.project-page__gallery,.project-page__contact { max-width:1280px; margin-left:auto; margin-right:auto; }
	.project-page__back { display:inline-flex; align-items:center; gap:8px; color:#555; font-size:.9rem; text-decoration:none; border-bottom:1px solid transparent; padding-bottom:3px; }.project-page__back:hover { border-color:#555; }
	.project-page__heading { max-width:900px; margin:62px 0 54px; }.project-page__type,.project-page__story-label p,.project-page__gallery-heading p,.project-page__contact p { margin:0; color:#555; font-size:.78rem; font-weight:500; letter-spacing:.08em; text-transform:uppercase; }
	h1 { max-width:850px; margin:15px 0 0; font-size:clamp(2.8rem,6.3vw,6.1rem); font-weight:500; line-height:.94; letter-spacing:-.06em; }.project-page__heading > p { max-width:620px; margin:24px 0 0; color:#555; font-size:clamp(1rem,1.8vw,1.3rem); line-height:1.55; }
	.project-page__hero { margin-left:calc(50% - 50vw); margin-right:calc(50% - 50vw); max-width:none; background:#e8edf4; }.project-page__hero img { display:block; height:min(70vw,810px); width:100%; object-fit:cover; }.project-page__hero figcaption { max-width:1280px; margin:0 auto; padding:10px 24px 0; color:#555; font-size:.82rem; }
	.project-page__story { display:grid; grid-template-columns:repeat(12,1fr); gap:24px; padding:112px 0; }.project-page__story-label { grid-column:span 3; }.project-page__prose { grid-column:5 / span 6; color:#363636; font-size:1.08rem; line-height:1.8; }.project-page__prose :global(p:first-child) { margin-top:0; }.project-page__prose :global(p) { margin:0 0 1.3em; }
	.project-page__gallery { border-top:1px solid rgba(0,0,0,.13); padding:82px 0 112px; }.project-page__gallery-heading { margin-bottom:38px; }.project-page__gallery-heading h2,.project-page__contact h2 { margin:12px 0 0; font-size:clamp(2rem,4vw,4.2rem); font-weight:500; line-height:.98; letter-spacing:-.055em; }
	.project-page__gallery-grid { display:grid; grid-template-columns:repeat(12,1fr); gap:16px; }.project-page__gallery-item { grid-column:span 4; appearance:none; border:0; padding:0; background:#e8edf4; cursor:zoom-in; overflow:hidden; }.project-page__gallery-item--wide { grid-column:span 8; }.project-page__gallery-item img { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; transition:opacity 160ms ease; }.project-page__gallery-item--wide img { aspect-ratio:16/10; }.project-page__gallery-item:hover img { opacity:.82; }
	.project-page__contact { display:flex; align-items:end; justify-content:space-between; gap:32px; border-top:1px solid rgba(0,0,0,.13); padding:72px 0 88px; }.project-page__contact h2 { max-width:700px; }.project-page__contact a { flex:none; border:1px solid #555; color:#000; padding:12px 16px; text-decoration:none; font-size:.9rem; transition:background 160ms ease,color 160ms ease; }.project-page__contact a:hover { background:#555; color:#fff; }
	.project-lightbox { position:fixed; inset:0; z-index:60; display:grid; place-items:center; padding:24px; }.project-lightbox__backdrop { position:absolute; inset:0; border:0; background:rgba(0,0,0,.9); }.project-lightbox__content { position:relative; z-index:1; max-width:min(1200px,100%); max-height:100%; }.project-lightbox__content img { display:block; max-width:100%; max-height:calc(100svh - 92px); object-fit:contain; }.project-lightbox__close,.project-lightbox__previous,.project-lightbox__next { position:absolute; border:0; color:#000; background:#fff; display:grid; place-items:center; width:40px; height:40px; }.project-lightbox__close { right:10px; top:10px; }.project-lightbox__previous { left:10px; top:50%; transform:translateY(-50%); }.project-lightbox__next { right:10px; top:50%; transform:translateY(-50%); }.project-lightbox__content p { margin:10px 0 0; color:#fff; text-align:center; font-size:.85rem; }
	@media(max-width:760px){.project-page{padding:24px 16px 0}.project-page__heading{margin:44px 0 38px}.project-page__hero figcaption{padding-left:16px;padding-right:16px}.project-page__story{display:block;padding:70px 0}.project-page__prose{margin-top:28px;font-size:1rem}.project-page__gallery{padding:60px 0 72px}.project-page__gallery-grid{grid-template-columns:repeat(2,1fr);gap:8px}.project-page__gallery-item,.project-page__gallery-item--wide{grid-column:span 1}.project-page__gallery-item img,.project-page__gallery-item--wide img{aspect-ratio:1/1}.project-page__contact{align-items:start;flex-direction:column;padding:56px 0 64px}.project-page__hero img{height:68vw}.project-lightbox{padding:12px}.project-lightbox__previous{left:0}.project-lightbox__next{right:0}}
</style>
