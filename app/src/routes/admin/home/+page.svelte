<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AdminImageUploader from '$lib/components/AdminImageUploader.svelte';
	import AdminSaveDock from '$lib/components/admin/AdminSaveDock.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import type { HomeContent } from '$lib/types/content';
	import type { PageData } from './$types';

	type FormState = { error?: string; success?: boolean } | undefined;

	export let data: PageData;
	export let form: FormState = undefined;

	let home: HomeContent = data.authenticated && data.content ? structuredClone(data.content.home) : ({} as HomeContent);
	let baseline = data.authenticated && data.content ? JSON.stringify(data.content.home) : '';
	let pending = false;
	let successMessage = form?.success ? 'Opgeslagen.' : '';
	let errorMessage = form?.error ?? '';
	const formId = 'admin-home-form';

	$: dirty = data.authenticated ? JSON.stringify(home) !== baseline : false;

	const saveEnhancer: SubmitFunction = ({ formData }) => {
		pending = true;
		successMessage = '';
		errorMessage = '';
		formData.set('payload', JSON.stringify({ home }));
		return async ({ result, update }) => {
			pending = false;
			if (result.type === 'success') {
				await update({ reset: false, invalidateAll: false });
				baseline = JSON.stringify(home);
				successMessage = 'Opgeslagen.';
			} else if (result.type === 'failure') {
				await update({ reset: false, invalidateAll: false });
				errorMessage =
					typeof result.data?.error === 'string' ? result.data.error : 'Opslaan mislukt.';
			} else {
				await update();
			}
		};
	};

	const addGalleryImage = () => {
		home = {
			...home,
			gallery: {
				...home.gallery,
				images: [...home.gallery.images, { src: '', alt: '' }]
			}
		};
	};

	const removeGalleryImage = (index: number) => {
		const remaining = home.gallery.images.filter((_item, i) => i !== index);
		home = {
			...home,
			gallery: { ...home.gallery, images: remaining.length ? remaining : [{ src: '', alt: '' }] }
		};
	};

	const addStat = () => {
		home = {
			...home,
			stats: [...home.stats, { label: 'Nieuw', value: 0, suffix: '' }]
		};
	};

	const removeStat = (index: number) => {
		const remaining = home.stats.filter((_item, i) => i !== index);
		home = {
			...home,
			stats: remaining.length ? remaining : [{ label: 'Nieuw', value: 0, suffix: '' }]
		};
	};

	const addTestimonial = () => {
		home = {
			...home,
			testimonials: {
				...home.testimonials,
				items: [...home.testimonials.items, { quote: '', name: '' }]
			}
		};
	};

	const removeTestimonial = (index: number) => {
		const remaining = home.testimonials.items.filter((_item, i) => i !== index);
		home = {
			...home,
			testimonials: {
				...home.testimonials,
				items: remaining.length ? remaining : [{ quote: '', name: '' }]
			}
		};
	};
</script>

{#if data.authenticated}
	<AdminShell title="Home bewerken" subtitle="Hero, impressies, featured projecten, statistieken en testimonials." active="home">
		<form id={formId} method="post" action="?/save" use:enhance={saveEnhancer} class="space-y-6">
			<input type="hidden" name="payload" />

			<section class="editor-panel">
				<h2 class="editor-panel-title">Hero</h2>
				<div class="mt-5 grid gap-4 md:grid-cols-2">
					<div class="md:col-span-2">
						<label for="hero-title" class="field-label">Titel</label>
						<input id="hero-title" class="field mt-2" bind:value={home.hero.title} />
					</div>
					<div class="md:col-span-2">
						<label for="hero-description" class="field-label">Beschrijving</label>
						<textarea id="hero-description" rows="4" class="field mt-2" bind:value={home.hero.description}></textarea>
					</div>
					<div>
						<label for="hero-primary-label" class="field-label">Primair label</label>
						<input id="hero-primary-label" class="field mt-2" bind:value={home.hero.primaryCta.label} />
					</div>
					<div>
						<label for="hero-primary-link" class="field-label">Primair link</label>
						<input id="hero-primary-link" class="field mt-2" bind:value={home.hero.primaryCta.href} />
					</div>
					<div>
						<label for="hero-secondary-label" class="field-label">Secundair label</label>
						<input id="hero-secondary-label" class="field mt-2" bind:value={home.hero.secondaryCta.label} />
					</div>
					<div>
						<label for="hero-secondary-link" class="field-label">Secundair link</label>
						<input id="hero-secondary-link" class="field mt-2" bind:value={home.hero.secondaryCta.href} />
					</div>
					<div class="md:col-span-2">
						<label for="hero-background" class="field-label">Achtergrond afbeelding</label>
						<input id="hero-background" class="field mt-2" bind:value={home.hero.backgroundImage} />
					</div>
				</div>

				<div class="mt-6 grid gap-4 md:grid-cols-2">
					{#each home.hero.images as image, index}
						<AdminImageUploader label={`Hero afbeelding ${index + 1}`} bind:url={image.src} bind:alt={image.alt} />
					{/each}
				</div>
			</section>

			<section class="editor-panel">
				<h2 class="editor-panel-title">Impressies</h2>
				<div class="mt-5 space-y-4">
					<div>
						<label for="gallery-title" class="field-label">Titel</label>
						<input id="gallery-title" class="field mt-2" bind:value={home.gallery.title} />
					</div>
					<div>
						<label for="gallery-description" class="field-label">Beschrijving</label>
						<textarea id="gallery-description" rows="3" class="field mt-2" bind:value={home.gallery.description}></textarea>
					</div>
					{#each home.gallery.images as image, index}
						<div class="grid items-start gap-4 border border-line p-4 md:grid-cols-[180px_1fr_auto]">
							<AdminImageUploader label={`Afbeelding ${index + 1}`} bind:url={image.src} bind:alt={image.alt} previewMode="portfolio" />
							<div class="space-y-2">
								<label for={`gallery-alt-${index}`} class="field-label">Alt-tekst</label>
								<input id={`gallery-alt-${index}`} class="field" bind:value={image.alt} />
								<label for={`gallery-url-${index}`} class="field-label">Afbeelding URL</label>
								<input id={`gallery-url-${index}`} class="field" bind:value={image.src} />
							</div>
							<button type="button" class="text-sm font-medium text-red-600" on:click={() => removeGalleryImage(index)}>Verwijder</button>
						</div>
					{/each}
					<button type="button" class="plain-action" on:click={addGalleryImage}>+ Afbeelding</button>
				</div>
			</section>

			<section class="editor-panel">
				<h2 class="editor-panel-title">Uitgelichte projecten</h2>
				<div class="mt-5 grid gap-4">
					<div>
						<label for="featured-title" class="field-label">Titel</label>
						<input id="featured-title" class="field mt-2" bind:value={home.featured.title} />
					</div>
					<div>
						<label for="featured-description" class="field-label">Beschrijving</label>
						<textarea id="featured-description" rows="3" class="field mt-2" bind:value={home.featured.description}></textarea>
					</div>
				</div>
			</section>

			<section class="editor-panel">
				<h2 class="editor-panel-title">Statistieken</h2>
				<div class="mt-5 space-y-4">
					{#each home.stats as stat, index}
						<div class="grid items-center gap-3 md:grid-cols-[1fr_120px_120px_auto]">
							<input class="field" placeholder="Label" bind:value={stat.label} />
							<input type="number" class="field" bind:value={stat.value} />
							<input class="field" placeholder="Suffix" bind:value={stat.suffix} />
							<button type="button" class="text-sm font-medium text-red-600" on:click={() => removeStat(index)}>Verwijder</button>
						</div>
					{/each}
					<button type="button" class="plain-action" on:click={addStat}>+ Stat</button>
				</div>
			</section>

			<section class="editor-panel">
				<h2 class="editor-panel-title">Testimonials</h2>
				<div class="mt-5 space-y-4">
					<div>
						<label for="testimonials-title" class="field-label">Titel</label>
						<input id="testimonials-title" class="field mt-2" bind:value={home.testimonials.title} />
					</div>
					<div>
						<label for="testimonials-description" class="field-label">Beschrijving</label>
						<textarea id="testimonials-description" rows="3" class="field mt-2" bind:value={home.testimonials.description}></textarea>
					</div>
					{#each home.testimonials.items as item, index}
						<div class="border border-line p-4">
							<label for={`testimonial-quote-${index}`} class="field-label">Quote</label>
							<textarea id={`testimonial-quote-${index}`} rows="3" class="field mt-2" bind:value={item.quote}></textarea>
							<label for={`testimonial-name-${index}`} class="field-label mt-3">Naam</label>
							<input id={`testimonial-name-${index}`} class="field mt-2" bind:value={item.name} />
							<button type="button" class="mt-3 text-sm font-medium text-red-600" on:click={() => removeTestimonial(index)}>Verwijder testimonial</button>
						</div>
					{/each}
					<button type="button" class="plain-action" on:click={addTestimonial}>+ Testimonial</button>
				</div>
			</section>
		</form>

		<AdminSaveDock {dirty} {pending} {formId} {successMessage} {errorMessage} />
	</AdminShell>
{/if}
