<svelte:options runes={false} />

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AdminImageUploader from '$lib/components/AdminImageUploader.svelte';
	import type { PageData } from './$types';
	import type { Project } from '$lib/types/content';
	import { onDestroy, onMount } from 'svelte';

	type FormState = { error?: string; success?: boolean } | undefined;

	export let data: PageData;
	export let form: FormState = undefined;
	const formState = form;

	const normalizeProject = (project: Project): Project => ({
		...project,
		caption: project.caption ?? '',
		featured: Boolean(project.featured),
		gallery: Array.isArray(project.gallery) ? project.gallery : [],
		testimonials: Array.isArray(project.testimonials) ? project.testimonials : []
	});

	let project: Project = normalizeProject(structuredClone(data.project));
	let successMessage = formState?.success ? 'Wijzigingen opgeslagen.' : '';
	let errorMessage = formState?.error ?? '';
	let toastVisible = false;
	let toastMessage = '';
	let toastTone: 'info' | 'success' | 'error' = 'info';
	let toastTimeout: ReturnType<typeof setTimeout> | undefined;
	const draftKey = `admin:draft:project:${data.project.slug}`;
	let draftTimeout: ReturnType<typeof setTimeout> | undefined;

	$: toastStyles =
		toastTone === 'success'
			? 'bg-emerald-600 text-white shadow-[0_20px_45px_rgba(16,185,129,0.35)]'
			: toastTone === 'error'
				? 'bg-red-500 text-white shadow-[0_20px_45px_rgba(239,68,68,0.35)]'
				: 'bg-neutral-900 text-white shadow-[0_26px_65px_rgba(15,23,42,0.32)]';
	$: toastAccent =
		toastTone === 'success'
			? 'bg-emerald-300'
			: toastTone === 'error'
				? 'bg-red-300'
				: 'bg-white/80';

	const clearToastTimeout = () => {
		if (toastTimeout) {
			clearTimeout(toastTimeout);
			toastTimeout = undefined;
		}
	};

	const showToast = (
		message: string,
		tone: 'info' | 'success' | 'error',
		autoHide = true,
		duration = 2600
	) => {
		toastMessage = message;
		toastTone = tone;
		toastVisible = true;
		clearToastTimeout();
		if (autoHide) {
			toastTimeout = setTimeout(() => {
				toastVisible = false;
				toastTimeout = undefined;
			}, duration);
		}
	};

	const serializeProject = (value: Project) => {
		try {
			return JSON.stringify(value);
		} catch {
			return '';
		}
	};

	const preparePayload = (event: Event) => {
		const form = event.currentTarget as HTMLFormElement;
		const hidden = form.elements.namedItem('payload');
		if (hidden instanceof HTMLInputElement) {
			hidden.value = serializeProject(project);
		}
	};

	const handleSubmit = (event: Event) => {
		successMessage = '';
		errorMessage = '';
		preparePayload(event);
		showToast('Opslaan...', 'info', false);
	};

	const saveEnhancer: SubmitFunction = ({ formData }) => {
		formData.set('payload', serializeProject(project));
		const startingScroll = typeof window !== 'undefined' ? window.scrollY : 0;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update({ reset: false, invalidateAll: false });
				successMessage = 'Wijzigingen opgeslagen.';
				errorMessage = '';
				clearDraft();
				showToast('Opgeslagen!', 'success');
			} else if (result.type === 'failure') {
				await update({ reset: false, invalidateAll: false });
				successMessage = '';
				errorMessage =
					typeof result.data?.error === 'string' ? result.data.error : 'Opslaan mislukt.';
				showToast(errorMessage, 'error', false);
			} else {
				await update();
			}
			if (typeof window !== 'undefined') {
				requestAnimationFrame(() => {
					window.scrollTo({ top: startingScroll });
				});
			}
		};
	};

	const clearDraft = () => {
		if (typeof window === 'undefined') return;
		window.localStorage.removeItem(draftKey);
	};

	const scheduleDraftSave = () => {
		if (typeof window === 'undefined') return;
		if (draftTimeout) {
			clearTimeout(draftTimeout);
		}
		draftTimeout = setTimeout(() => {
			window.localStorage.setItem(draftKey, serializeProject(project));
		}, 600);
	};

	const markDirty = () => {
		scheduleDraftSave();
	};

	const addGalleryImage = () => {
		project = {
			...project,
			gallery: [...project.gallery, '']
		};
	};

	const removeGalleryImage = (imageIndex: number) => {
		project = {
			...project,
			gallery: project.gallery.filter((_item, index) => index !== imageIndex)
		};
	};

	onMount(() => {
		if (typeof window === 'undefined') return;
		const serverSnapshot = serializeProject(project);
		const draft = window.localStorage.getItem(draftKey);
		if (draft && draft !== serverSnapshot) {
			try {
				project = normalizeProject(JSON.parse(draft) as Project);
				showToast('Concept hersteld.', 'info');
				return;
			} catch {
				clearDraft();
			}
		}
	});

	onDestroy(() => {
		if (draftTimeout) {
			clearTimeout(draftTimeout);
			draftTimeout = undefined;
		}
	});
</script>

<div class="min-h-screen bg-neutral-50 text-neutral-900">
	<header class="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
			<div>
				<p class="text-xs uppercase tracking-[0.3em] text-neutral-400">Maria Hoogland</p>
				<h1 class="text-xl font-semibold">Project bewerken</h1>
			</div>
			<div class="flex items-center gap-3">
				<a
					href="/admin/portfolio"
					class="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-600 hover:border-neutral-400"
				>
					Overzicht
				</a>
				<a
					href={`/${project.slug}`}
					class="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-600 hover:border-neutral-400"
				>
					Bekijk
				</a>
			</div>
		</div>
	</header>

	<form
		method="post"
		action="?/save"
		use:enhance={saveEnhancer}
		on:submit={handleSubmit}
		class="mx-auto max-w-6xl space-y-10 px-6 py-10"
	>
		<input type="hidden" name="payload" />

		<section class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 space-y-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 class="text-lg font-semibold">Basisinformatie</h2>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Slug</span>
					<input
						class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
						bind:value={project.slug}
						on:input={markDirty}
					/>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Categorie</span>
					<input
						class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
						bind:value={project.category}
						on:input={markDirty}
					/>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
					<input
						class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
						bind:value={project.title}
						on:input={markDirty}
					/>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Subtitel</span>
					<input
						class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
						bind:value={project.subtitle}
						on:input={markDirty}
					/>
				</label>
			</div>

			<label class="space-y-2 text-sm">
				<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving (markdown)</span>
				<textarea
					rows="6"
					class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
					bind:value={project.descriptionMarkdown}
					on:input={markDirty}
				></textarea>
			</label>
		</section>

		<section class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 space-y-6">
			<h2 class="text-lg font-semibold">Afbeeldingen</h2>
			<div class="grid gap-6 md:grid-cols-2">
				<AdminImageUploader
					label="Hoofdafbeelding"
					bind:url={project.mainImage}
					on:change={markDirty}
				/>
				<label class="space-y-2 text-sm">
					<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Caption</span>
					<input
						class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
						bind:value={project.caption}
						on:input={markDirty}
					/>
				</label>
			</div>

			<label class="flex items-center gap-3 text-sm">
				<input type="checkbox" bind:checked={project.featured} on:change={markDirty} />
				<span>Uitgelicht op home</span>
			</label>

			<div class="space-y-4">
				<h3 class="text-sm font-semibold">Galerij</h3>
				{#each project.gallery as image, imageIndex}
					<div class="grid gap-4 md:grid-cols-[180px_1fr_auto] items-start">
						<AdminImageUploader
							label={`Galerij ${imageIndex + 1}`}
							bind:url={project.gallery[imageIndex]}
							previewMode="portfolio"
							on:change={markDirty}
						/>
						<input
							class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
							placeholder="URL"
							bind:value={project.gallery[imageIndex]}
							on:input={markDirty}
						/>
						<button
							type="button"
							class="text-xs uppercase tracking-[0.2em] text-red-500"
							on:click={() => {
								removeGalleryImage(imageIndex);
								markDirty();
							}}
						>
							Verwijder
						</button>
					</div>
				{/each}
				<button
					type="button"
					class="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.25em]"
					on:click={() => {
						addGalleryImage();
						markDirty();
					}}
				>
					+ Voeg galerijafbeelding toe
				</button>
			</div>
		</section>

		<div class="flex justify-end">
			<button
				type="submit"
				class="rounded-full bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:bg-neutral-800"
			>
				Opslaan
			</button>
		</div>

		{#if successMessage}
			<p class="text-sm text-emerald-600">{successMessage}</p>
		{/if}
		{#if errorMessage}
			<p class="text-sm text-red-500">{errorMessage}</p>
		{/if}
	</form>

	{#if toastVisible}
		<div class={`fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl px-5 py-4 text-sm ${toastStyles}`}>
			<div class={`mb-2 h-1 w-8 rounded-full ${toastAccent}`}></div>
			{toastMessage}
		</div>
	{/if}
</div>
