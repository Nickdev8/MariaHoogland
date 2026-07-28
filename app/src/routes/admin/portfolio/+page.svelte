<svelte:options runes={false} />

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AdminSaveDock from '$lib/components/admin/AdminSaveDock.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import type { PageData } from './$types';
	import type { SiteContent, Project } from '$lib/types/content';
	import { onDestroy, onMount } from 'svelte';

	type FormState = { error?: string; success?: boolean } | undefined;
	type PortfolioDraft = Pick<SiteContent, 'portfolio' | 'projects'>;

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

	const normalizeContent = (input: SiteContent): PortfolioDraft => ({
		portfolio: structuredClone(input.portfolio),
		projects: (input.projects ?? []).map((project) => normalizeProject(structuredClone(project)))
	});

	const serializeDraft = (value: PortfolioDraft) => {
		try {
			return JSON.stringify(value);
		} catch {
			return '';
		}
	};

	let content: PortfolioDraft | null =
		data.authenticated && data.content ? normalizeContent(data.content) : null;
	let baselineSnapshot = data.authenticated && data.content ? serializeDraft(normalizeContent(data.content)) : '';
	let successMessage = formState?.success ? 'Wijzigingen opgeslagen.' : '';
	let errorMessage = formState?.error ?? '';
	let pending = false;
	const draftKey = 'admin:draft:portfolio';
	const formId = 'admin-portfolio-form';
	let draftTimeout: ReturnType<typeof setTimeout> | undefined;
	$: isDirty = content ? serializeDraft(content) !== baselineSnapshot : false;

	const preparePayload = (event: Event) => {
		if (!content) return;
		const form = event.currentTarget as HTMLFormElement;
		const hidden = form.elements.namedItem('payload');
		if (hidden instanceof HTMLInputElement) {
			hidden.value = JSON.stringify({ portfolio: content.portfolio, projects: content.projects });
		}
	};

	const handleSubmit = (event: Event) => {
		successMessage = '';
		errorMessage = '';
		pending = true;
		preparePayload(event);
	};

	const saveEnhancer: SubmitFunction = ({ formData }) => {
		if (content) {
			formData.set(
				'payload',
				JSON.stringify({ portfolio: content.portfolio, projects: content.projects })
			);
		}
		const startingScroll = typeof window !== 'undefined' ? window.scrollY : 0;
		return async ({ result, update }) => {
			pending = false;
			if (result.type === 'success') {
				await update({ reset: false, invalidateAll: false });
				successMessage = 'Wijzigingen opgeslagen.';
				errorMessage = '';
				clearDraft();
				baselineSnapshot = content ? serializeDraft(content) : '';
			} else if (result.type === 'failure') {
				await update({ reset: false, invalidateAll: false });
				successMessage = '';
				errorMessage =
					typeof result.data?.error === 'string' ? result.data.error : 'Opslaan mislukt.';
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
		if (!content || typeof window === 'undefined') return;
		const nextDraft = content;
		if (draftTimeout) {
			clearTimeout(draftTimeout);
		}
		draftTimeout = setTimeout(() => {
			window.localStorage.setItem(draftKey, serializeDraft(nextDraft));
		}, 600);
	};

	const markDirty = () => {
		if (!content) return;
		scheduleDraftSave();
	};

	onMount(() => {
		if (!content || typeof window === 'undefined') return;
		const draft = window.localStorage.getItem(draftKey);
		const serverSnapshot = serializeDraft(content);
		if (draft && draft !== serverSnapshot) {
			try {
				const parsed = JSON.parse(draft) as PortfolioDraft;
				content = normalizeContent({ ...data.content, ...parsed } as SiteContent);
				successMessage = 'Concept hersteld.';
				baselineSnapshot = serverSnapshot;
				return;
			} catch {
				clearDraft();
			}
		}
		baselineSnapshot = serverSnapshot;
	});

	onDestroy(() => {
		if (draftTimeout) {
			clearTimeout(draftTimeout);
			draftTimeout = undefined;
		}
	});

</script>

{#if !data.authenticated}
	<div class="min-h-screen bg-neutral-50 text-neutral-900 flex items-start justify-center px-6 pt-16">
		<div class="w-full max-w-md border border-line bg-white p-8 shadow-sm">
			<h1 class="text-2xl font-semibold">Admin login</h1>
			<p class="mt-2 text-sm text-neutral-500">Log in om het portfolio te beheren.</p>
			<form method="post" action="?/login" class="mt-6 space-y-4">
				<label class="block text-sm text-neutral-700">
					<span class="mb-2 block">Wachtwoord</span>
					<input
						type="password"
						name="password"
						required
						class="field"
					/>
				</label>
				{#if form?.error}
					<p class="text-sm text-red-600">{form.error}</p>
				{/if}
				<button
					type="submit"
					class="button-primary w-full"
				>
					Inloggen
				</button>
			</form>
		</div>
	</div>
{:else if content}
	<AdminShell title="Portfolio bewerken" subtitle="Portfolio-intro en projectoverzicht." active="portfolio">
		<form
			id={formId}
			method="post"
			action="?/save"
			use:enhance={saveEnhancer}
			on:submit={handleSubmit}
			class="space-y-10"
		>
			<input type="hidden" name="payload" />

			<section class="editor-panel">
				<h2 class="text-lg font-semibold">Portfolio intro</h2>
				<div class="mt-4 space-y-4">
					<label class="space-y-2 text-sm">
						<span class="field-label">Titel</span>
						<input
							class="field"
							bind:value={content.portfolio.title}
							on:input={markDirty}
						/>
					</label>
					<label class="space-y-2 text-sm">
						<span class="field-label">Beschrijving</span>
						<textarea
							rows="3"
							class="field"
							bind:value={content.portfolio.description}
							on:input={markDirty}
						></textarea>
					</label>
				</div>
			</section>

			{#if successMessage}
				<p class="text-sm text-emerald-600">{successMessage}</p>
			{/if}
			{#if errorMessage}
				<p class="text-sm text-red-500">{errorMessage}</p>
			{/if}
		</form>

		<section class="space-y-6 pb-12">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 class="text-lg font-semibold">Projecten</h2>
				<form method="post" action="?/create">
					<button
						type="submit"
						class="plain-action"
					>
						+ Nieuw project
					</button>
				</form>
			</div>

			<div class="space-y-4">
				{#each content.projects as project, index}
					<div class="editor-panel">
						<div class="flex flex-wrap items-start justify-between gap-4">
							<div class="space-y-2">
								<p class="field-label">
									{project.category || 'Categorie'}
								</p>
								<h3 class="text-base font-semibold">
									{project.title || `Project ${index + 1}`}
								</h3>
								<p class="text-sm text-neutral-500">
									{project.subtitle || 'Voeg een korte subtitel toe.'}
								</p>
								<p class="text-xs text-neutral-400">Slug: {project.slug}</p>
							</div>
							<div class="flex flex-wrap items-center gap-2">
								<label class="inline-flex items-center gap-2 border border-line px-3 py-2 text-sm font-medium text-secondary">
									<input
										type="checkbox"
										class="h-4 w-4 border-line text-secondary focus:ring-secondary"
										bind:checked={project.featured}
										on:change={markDirty}
									/>
									Uitgelicht
								</label>
								<a
									href={`/${project.slug}`}
									class="plain-action"
								>
									Bekijk
								</a>
								<a
									href={`/admin/portfolio/${project.slug}`}
									class="plain-action"
								>
									Bewerk
								</a>
								<form method="post" action="?/delete">
									<input type="hidden" name="slug" value={project.slug} />
									<button
										type="submit"
										class="border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:border-red-300"
										on:click={(event) => {
											if (!confirm(`Verwijder project "${project.title || project.slug}"?`)) {
												event.preventDefault();
											}
										}}
									>
										Verwijder
									</button>
								</form>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<AdminSaveDock dirty={isDirty} {pending} {formId} {successMessage} {errorMessage} />

	</AdminShell>
{/if}
