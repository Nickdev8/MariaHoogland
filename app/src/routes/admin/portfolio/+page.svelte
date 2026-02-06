<svelte:options runes={false} />

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
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

	let content: PortfolioDraft | null =
		data.authenticated && data.content ? normalizeContent(data.content) : null;
	let successMessage = formState?.success ? 'Wijzigingen opgeslagen.' : '';
	let errorMessage = formState?.error ?? '';
	let toastVisible = false;
	let toastMessage = '';
	let toastTone: 'info' | 'success' | 'error' = 'info';
	let toastTimeout: ReturnType<typeof setTimeout> | undefined;
	const draftKey = 'admin:draft:portfolio';
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

	const preparePayload = (event: Event) => {
		if (!content) return;
		const payload = { portfolio: content.portfolio };
		const form = event.currentTarget as HTMLFormElement;
		const hidden = form.elements.namedItem('payload');
		if (hidden instanceof HTMLInputElement) {
			hidden.value = JSON.stringify(payload);
		}
	};

	const handleSubmit = (event: Event) => {
		successMessage = '';
		errorMessage = '';
		preparePayload(event);
		showToast('Opslaan...', 'info', false);
	};

	const saveEnhancer: SubmitFunction = () => {
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

	const serializePortfolio = (value: SiteContent['portfolio']) => {
		try {
			return JSON.stringify(value);
		} catch {
			return '';
		}
	};

	const clearDraft = () => {
		if (typeof window === 'undefined') return;
		window.localStorage.removeItem(draftKey);
	};

	const scheduleDraftSave = () => {
		if (!content || typeof window === 'undefined') return;
		if (draftTimeout) {
			clearTimeout(draftTimeout);
		}
		draftTimeout = setTimeout(() => {
			window.localStorage.setItem(draftKey, serializePortfolio(content.portfolio));
		}, 600);
	};

	const markDirty = () => {
		if (!content) return;
		scheduleDraftSave();
	};

	onMount(() => {
		if (!content || typeof window === 'undefined') return;
		const draft = window.localStorage.getItem(draftKey);
		const serverSnapshot = serializePortfolio(content.portfolio);
		if (draft && draft !== serverSnapshot) {
			try {
				const parsed = JSON.parse(draft) as SiteContent['portfolio'];
				content = { ...content, portfolio: parsed };
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

{#if !data.authenticated}
	<div class="min-h-screen bg-neutral-50 text-neutral-900 flex items-start justify-center px-6 pt-16">
		<div class="w-full max-w-md rounded-3xl bg-white border border-neutral-200 p-8 shadow-sm">
			<h1 class="text-2xl font-semibold">Admin login</h1>
			<p class="mt-2 text-sm text-neutral-500">Log in om het portfolio te beheren.</p>
			<form method="post" action="?/login" class="mt-6 space-y-4">
				<label class="block text-sm text-neutral-700">
					<span class="mb-2 block">Wachtwoord</span>
					<input
						type="password"
						name="password"
						required
						class="w-full rounded-xl bg-white border border-neutral-200 px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
					/>
				</label>
				{#if form?.error}
					<p class="text-sm text-red-600">{form.error}</p>
				{/if}
				<button
					type="submit"
					class="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
				>
					Inloggen
				</button>
			</form>
		</div>
	</div>
{:else if content}
	<div class="min-h-screen bg-neutral-50 text-neutral-900">
		<header class="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
			<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
				<div>
					<p class="text-xs uppercase tracking-[0.3em] text-neutral-400">Maria Hoogland</p>
					<h1 class="text-xl font-semibold">Portfolio</h1>
				</div>
				<div class="flex items-center gap-3">
					<a
						href="/admin"
						class="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-600 hover:border-neutral-400"
					>
						Algemeen
					</a>
					<form method="post" action="?/logout">
						<button
							type="submit"
							class="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-600 hover:border-neutral-400"
						>
							Log uit
						</button>
					</form>
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

			<section class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
				<h2 class="text-lg font-semibold">Portfolio intro</h2>
				<div class="mt-4 space-y-4">
					<label class="space-y-2 text-sm">
						<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
						<input
							class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
							bind:value={content.portfolio.title}
							on:input={markDirty}
						/>
					</label>
					<label class="space-y-2 text-sm">
						<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving</span>
						<textarea
							rows="3"
							class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
							bind:value={content.portfolio.description}
							on:input={markDirty}
						></textarea>
					</label>
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

		<section class="mx-auto max-w-6xl space-y-6 px-6 pb-12">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 class="text-lg font-semibold">Projecten</h2>
				<form method="post" action="?/create">
					<button
						type="submit"
						class="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.25em]"
					>
						+ Nieuw project
					</button>
				</form>
			</div>

			<div class="space-y-4">
				{#each content.projects as project, index}
					<div class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
						<div class="flex flex-wrap items-start justify-between gap-4">
							<div class="space-y-2">
								<p class="text-xs uppercase tracking-[0.25em] text-neutral-400">
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
								{#if project.featured}
									<span
										class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-emerald-700"
									>
										Uitgelicht
									</span>
								{/if}
								<a
									href={`/${project.slug}`}
									class="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.25em] text-neutral-600 hover:border-neutral-400"
								>
									Bekijk
								</a>
								<a
									href={`/admin/portfolio/${project.slug}`}
									class="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.25em] text-neutral-600 hover:border-neutral-400"
								>
									Bewerk
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		{#if toastVisible}
			<div class={`fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl px-5 py-4 text-sm ${toastStyles}`}>
				<div class={`mb-2 h-1 w-8 rounded-full ${toastAccent}`}></div>
				{toastMessage}
			</div>
		{/if}
	</div>
{/if}
