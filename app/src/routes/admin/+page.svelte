<svelte:options runes={false} />

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AdminImageUploader from '$lib/components/AdminImageUploader.svelte';
	import type { PageData } from './$types';
	import type { SiteContent } from '$lib/types/content';
	import { onDestroy, onMount } from 'svelte';

	type FormState = { error?: string; success?: boolean } | undefined;

	export let data: PageData;
	export let form: FormState = undefined;
	const formState = form;

	let content: SiteContent | null =
		data.authenticated && data.content ? structuredClone(data.content) : null;
	let successMessage = formState?.success ? 'Wijzigingen opgeslagen.' : '';
	let errorMessage = formState?.error ?? '';
	let toastVisible = false;
	let toastMessage = '';
	let toastTone: 'info' | 'success' | 'error' = 'info';
	let toastTimeout: ReturnType<typeof setTimeout> | undefined;
	let hasExternalDraft = false;
	$: hasLocalChanges = content ? serializeContent(content) !== baselineSnapshot : false;
	$: isDirty = hasLocalChanges || hasExternalDraft;
	const draftKey = 'admin:draft:main';
	const portfolioDraftKey = 'admin:draft:portfolio';
	let baselineSnapshot = '';
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
		if (typeof window !== 'undefined') {
			const portfolioDraft = window.localStorage.getItem(portfolioDraftKey);
			if (portfolioDraft) {
				try {
					const parsed = JSON.parse(portfolioDraft) as Partial<SiteContent>;
					content = { ...content, ...parsed } as SiteContent;
				} catch {
					window.localStorage.removeItem(portfolioDraftKey);
				}
			}
		}
		const form = event.currentTarget as HTMLFormElement;
		const hidden = form.elements.namedItem('payload');
		if (hidden instanceof HTMLInputElement) {
			hidden.value = JSON.stringify(content);
		}
	};

	const handleSubmit = (event: Event) => {
		successMessage = '';
		errorMessage = '';
		preparePayload(event);
		showToast('Opslaan...', 'info', false);
	};

	const saveEnhancer: SubmitFunction = ({ formData }) => {
		if (content) {
			let payload: SiteContent = content;
			if (typeof window !== 'undefined') {
				const portfolioDraft = window.localStorage.getItem(portfolioDraftKey);
				if (portfolioDraft) {
					try {
						const parsed = JSON.parse(portfolioDraft) as Partial<SiteContent>;
						payload = { ...payload, ...parsed } as SiteContent;
					} catch {
						window.localStorage.removeItem(portfolioDraftKey);
					}
				}
			}
			formData.set('payload', JSON.stringify(payload));
		}
		const startingScroll = typeof window !== 'undefined' ? window.scrollY : 0;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update({ reset: false, invalidateAll: false });
				successMessage = 'Wijzigingen opgeslagen.';
				errorMessage = '';
				clearDraft();
				baselineSnapshot = content ? serializeContent(content) : '';
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

	const serializeContent = (value: SiteContent) => {
		try {
			return JSON.stringify(value);
		} catch {
			return '';
		}
	};

	const clearDraft = () => {
		if (typeof window === 'undefined') return;
		window.localStorage.removeItem(draftKey);
		window.localStorage.removeItem(portfolioDraftKey);
		hasExternalDraft = false;
	};

	const scheduleDraftSave = () => {
		if (!content || typeof window === 'undefined') return;
		if (draftTimeout) {
			clearTimeout(draftTimeout);
		}
		draftTimeout = setTimeout(() => {
			window.localStorage.setItem(draftKey, serializeContent(content));
		}, 600);
	};

	const markDirty = () => {
		if (!content) return;
		scheduleDraftSave();
	};

	onMount(() => {
		if (!content || typeof window === 'undefined') return;
		const serverSnapshot = serializeContent(content);
		const draft = window.localStorage.getItem(draftKey);
		hasExternalDraft = Boolean(window.localStorage.getItem(portfolioDraftKey));
		if (draft && draft !== serverSnapshot) {
			try {
				content = JSON.parse(draft) as SiteContent;
				showToast('Concept hersteld.', 'info');
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

	const addGalleryImage = () => {
		if (!content) return;
		content = {
			...content,
			home: {
				...content.home,
				gallery: {
					...content.home.gallery,
					images: [...content.home.gallery.images, { src: '', alt: '' }]
				}
			}
		};
	};

	const removeGalleryImage = (index: number) => {
		if (!content) return;
		const remaining = content.home.gallery.images.filter((_item, i) => i !== index);
		content = {
			...content,
			home: {
				...content.home,
				gallery: {
					...content.home.gallery,
					images: remaining.length ? remaining : [{ src: '', alt: '' }]
				}
			}
		};
	};

	const addStat = () => {
		if (!content) return;
		content = {
			...content,
			home: {
				...content.home,
				stats: [...content.home.stats, { label: 'Nieuw', value: 0, suffix: '' }]
			}
		};
	};

	const removeStat = (index: number) => {
		if (!content) return;
		const remaining = content.home.stats.filter((_item, i) => i !== index);
		content = {
			...content,
			home: {
				...content.home,
				stats: remaining.length ? remaining : [{ label: 'Nieuw', value: 0, suffix: '' }]
			}
		};
	};

	const addTestimonial = () => {
		if (!content) return;
		content = {
			...content,
			home: {
				...content.home,
				testimonials: {
					...content.home.testimonials,
					items: [...content.home.testimonials.items, { quote: '', name: '' }]
				}
			}
		};
	};

	const removeTestimonial = (index: number) => {
		if (!content) return;
		const remaining = content.home.testimonials.items.filter((_item, i) => i !== index);
		content = {
			...content,
			home: {
				...content.home,
				testimonials: {
					...content.home.testimonials,
					items: remaining.length ? remaining : [{ quote: '', name: '' }]
				}
			}
		};
	};

	const addFeature = () => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				features: [...content.about.features, { icon: 'Globe', title: '', description: '' }]
			}
		};
	};

	const removeFeature = (index: number) => {
		if (!content) return;
		const remaining = content.about.features.filter((_item, i) => i !== index);
		content = {
			...content,
			about: {
				...content.about,
				features: remaining.length ? remaining : [{ icon: 'Globe', title: '', description: '' }]
			}
		};
	};

	const addTeamMember = () => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				team: {
					...content.about.team,
					members: [
						...content.about.team.members,
						{ name: '', role: '', image: { src: '', alt: '' } }
					]
				}
			}
		};
	};

	const removeTeamMember = (index: number) => {
		if (!content) return;
		const remaining = content.about.team.members.filter((_item, i) => i !== index);
		content = {
			...content,
			about: {
				...content.about,
				team: {
					...content.about.team,
					members: remaining.length
						? remaining
						: [{ name: '', role: '', image: { src: '', alt: '' } }]
				}
			}
		};
	};

	const addAddressLine = () => {
		if (!content) return;
		content = {
			...content,
			contact: {
				...content.contact,
				address: {
					...content.contact.address,
					lines: [...content.contact.address.lines, '']
				}
			}
		};
	};

	const removeAddressLine = (index: number) => {
		if (!content) return;
		const remaining = content.contact.address.lines.filter((_item, i) => i !== index);
		content = {
			...content,
			contact: {
				...content.contact,
				address: {
					...content.contact.address,
					lines: remaining.length ? remaining : ['']
				}
			}
		};
	};

	const addBusinessDetail = () => {
		if (!content) return;
		content = {
			...content,
			contact: {
				...content.contact,
				businessDetails: [...content.contact.businessDetails, '']
			}
		};
	};

	const removeBusinessDetail = (index: number) => {
		if (!content) return;
		const remaining = content.contact.businessDetails.filter((_item, i) => i !== index);
		content = {
			...content,
			contact: {
				...content.contact,
				businessDetails: remaining.length ? remaining : ['']
			}
		};
	};

	const addQuickLink = () => {
		if (!content) return;
		content = {
			...content,
			footer: {
				...content.footer,
				quickLinks: [...content.footer.quickLinks, { label: '', href: '' }]
			}
		};
	};

	const removeQuickLink = (index: number) => {
		if (!content) return;
		const remaining = content.footer.quickLinks.filter((_item, i) => i !== index);
		content = {
			...content,
			footer: {
				...content.footer,
				quickLinks: remaining.length ? remaining : [{ label: '', href: '' }]
			}
		};
	};

	const addSocial = () => {
		if (!content) return;
		content = {
			...content,
			footer: {
				...content.footer,
				socials: [...content.footer.socials, { label: '', href: '', icon: 'Instagram' }]
			}
		};
	};

	const removeSocial = (index: number) => {
		if (!content) return;
		const remaining = content.footer.socials.filter((_item, i) => i !== index);
		content = {
			...content,
			footer: {
				...content.footer,
				socials: remaining.length ? remaining : [{ label: '', href: '', icon: 'Instagram' }]
			}
		};
	};

	const iconOptions = ['Globe', 'PenTool', 'Users', 'Lightbulb'];
	const socialIconOptions = ['Instagram', 'Linkedin'];
</script>

{#if !data.authenticated}
	<div class="min-h-screen bg-neutral-50 text-neutral-900 flex items-start justify-center px-6 pt-16">
		<div class="w-full max-w-md rounded-3xl bg-white border border-neutral-200 p-8 shadow-sm">
			<h1 class="text-2xl font-semibold">Admin login</h1>
			<p class="mt-2 text-sm text-neutral-500">
				Log in met het beheerderswachtwoord om de inhoud te bewerken.
			</p>
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
					<h1 class="text-xl font-semibold">Admin dashboard</h1>
				</div>
				<div class="flex items-center gap-3">
					<a
						href="/admin/portfolio"
						class="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-600 hover:border-neutral-400"
					>
						Portfolio
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

		<div class="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[220px_1fr]">
			<aside class="space-y-4 text-sm">
				<div class="rounded-2xl border border-neutral-200 bg-white p-4">
					<p class="text-xs uppercase tracking-[0.25em] text-neutral-400">Secties</p>
					<ul class="mt-4 space-y-2">
						<li><a href="#home" class="text-neutral-700 hover:text-rose-600">Home</a></li>
						<li><a href="#about" class="text-neutral-700 hover:text-rose-600">Over</a></li>
						<li><a href="#contact" class="text-neutral-700 hover:text-rose-600">Contact</a></li>
						<li><a href="#footer" class="text-neutral-700 hover:text-rose-600">Footer</a></li>
					</ul>
				</div>
				<div class="rounded-2xl border border-neutral-200 bg-white p-4 text-xs text-neutral-500">
					{#if isDirty}
						<p>Er zijn niet-opgeslagen wijzigingen.</p>
					{:else}
						<p>Alles is opgeslagen.</p>
					{/if}
				</div>
			</aside>

			<form
				method="post"
				action="?/save"
				use:enhance={saveEnhancer}
				on:submit={handleSubmit}
				class="space-y-10"
			>
				<input type="hidden" name="payload" />

				<section id="home" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold">Home</h2>
						<button
							type="submit"
							class="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:bg-neutral-800"
						>
							Opslaan
						</button>
					</div>

					<div class="mt-6 space-y-6">
						<div>
							<label class="text-xs uppercase tracking-[0.25em] text-neutral-400">Hero titel</label>
							<input
								class="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3"
								type="text"
								bind:value={content.home.hero.title}
								on:input={markDirty}
							/>
						</div>

						<div>
							<label class="text-xs uppercase tracking-[0.25em] text-neutral-400">Hero beschrijving</label>
							<textarea
								rows="4"
								class="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.home.hero.description}
								on:input={markDirty}
							></textarea>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Primair label</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.home.hero.primaryCta.label}
									on:input={markDirty}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Primair link</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.home.hero.primaryCta.href}
									on:input={markDirty}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Secundair label</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.home.hero.secondaryCta.label}
									on:input={markDirty}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Secundair link</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.home.hero.secondaryCta.href}
									on:input={markDirty}
								/>
							</label>
						</div>

						<div>
							<label class="text-xs uppercase tracking-[0.25em] text-neutral-400">Achtergrond afbeelding</label>
							<input
								class="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3"
								type="text"
								bind:value={content.home.hero.backgroundImage}
								on:input={markDirty}
							/>
						</div>

						<div class="grid gap-6 md:grid-cols-2">
							{#each content.home.hero.images as image, index}
								<div class="space-y-3">
									<AdminImageUploader
										label={`Hero afbeelding ${index + 1}`}
										bind:url={image.src}
										bind:alt={image.alt}
										on:change={markDirty}
									/>
								</div>
							{/each}
						</div>
					</div>

					<div class="mt-10 space-y-6">
						<div>
							<h3 class="text-base font-semibold">Impressies</h3>
							<p class="text-sm text-neutral-500">Beheer de galerij op de homepage.</p>
						</div>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
							<input
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.home.gallery.title}
								on:input={markDirty}
							/>
						</label>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving</span>
							<textarea
								rows="2"
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.home.gallery.description}
								on:input={markDirty}
							></textarea>
						</label>
						<div class="space-y-4">
							{#each content.home.gallery.images as image, index}
								<div class="grid gap-4 md:grid-cols-[180px_1fr_auto] items-start">
									<AdminImageUploader
										label={`Afbeelding ${index + 1}`}
										bind:url={image.src}
										bind:alt={image.alt}
										previewMode="portfolio"
										on:change={markDirty}
									/>
									<div class="space-y-2">
										<input
											class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
											placeholder="Alt-tekst"
											bind:value={image.alt}
											on:input={markDirty}
										/>
										<input
											class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
											placeholder="URL"
											bind:value={image.src}
											on:input={markDirty}
										/>
									</div>
									<button
										type="button"
										class="text-xs uppercase tracking-[0.2em] text-red-500"
										on:click={() => {
											removeGalleryImage(index);
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
								+ Voeg afbeelding toe
							</button>
						</div>
					</div>

					<div class="mt-10 space-y-6">
						<div>
							<h3 class="text-base font-semibold">Uitgelichte projecten</h3>
						</div>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
							<input
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.home.featured.title}
								on:input={markDirty}
							/>
						</label>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving</span>
							<textarea
								rows="2"
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.home.featured.description}
								on:input={markDirty}
							></textarea>
						</label>
					</div>

					<div class="mt-10 space-y-4">
						<div>
							<h3 class="text-base font-semibold">Stats</h3>
						</div>
						{#each content.home.stats as stat, index}
							<div class="grid gap-3 md:grid-cols-[1fr_120px_100px_auto] items-center">
								<input
									class="rounded-2xl border border-neutral-200 px-4 py-3"
									placeholder="Label"
									bind:value={stat.label}
									on:input={markDirty}
								/>
								<input
									type="number"
									class="rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={stat.value}
									on:input={markDirty}
								/>
								<input
									class="rounded-2xl border border-neutral-200 px-4 py-3"
									placeholder="Suffix"
									bind:value={stat.suffix}
									on:input={markDirty}
								/>
								<button
									type="button"
									class="text-xs uppercase tracking-[0.2em] text-red-500"
									on:click={() => {
										removeStat(index);
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
								addStat();
								markDirty();
							}}
						>
							+ Voeg stat toe
						</button>
					</div>

					<div class="mt-10 space-y-4">
						<div>
							<h3 class="text-base font-semibold">Testimonials</h3>
						</div>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
							<input
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.home.testimonials.title}
								on:input={markDirty}
							/>
						</label>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving</span>
							<textarea
								rows="2"
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.home.testimonials.description}
								on:input={markDirty}
							></textarea>
						</label>
						{#each content.home.testimonials.items as item, index}
							<div class="space-y-2 rounded-2xl border border-neutral-200 p-4">
								<textarea
									rows="3"
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									placeholder="Quote"
									bind:value={item.quote}
									on:input={markDirty}
								></textarea>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									placeholder="Naam"
									bind:value={item.name}
									on:input={markDirty}
								/>
								<button
									type="button"
									class="text-xs uppercase tracking-[0.2em] text-red-500"
									on:click={() => {
										removeTestimonial(index);
										markDirty();
									}}
								>
									Verwijder testimonial
								</button>
							</div>
						{/each}
						<button
							type="button"
							class="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.25em]"
							on:click={() => {
								addTestimonial();
								markDirty();
							}}
						>
							+ Voeg testimonial toe
						</button>
					</div>
				</section>

				<section id="about" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
					<h2 class="text-lg font-semibold">Over</h2>
					<div class="mt-6 space-y-6">
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Intro label</span>
							<input
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.about.introLabel}
								on:input={markDirty}
							/>
						</label>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
							<input
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.about.title}
								on:input={markDirty}
							/>
						</label>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving</span>
							<textarea
								rows="4"
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.about.description}
								on:input={markDirty}
							></textarea>
						</label>
						<div class="space-y-4">
							<h3 class="text-base font-semibold">Features</h3>
							{#each content.about.features as feature, index}
								<div class="space-y-2 rounded-2xl border border-neutral-200 p-4">
									<div class="grid gap-3 md:grid-cols-3">
										<select
											class="rounded-2xl border border-neutral-200 px-4 py-3"
											bind:value={feature.icon}
											on:change={markDirty}
										>
											{#each iconOptions as option}
												<option value={option}>{option}</option>
											{/each}
										</select>
										<input
											class="rounded-2xl border border-neutral-200 px-4 py-3"
											placeholder="Titel"
											bind:value={feature.title}
											on:input={markDirty}
										/>
								<textarea
									rows="2"
									class="rounded-2xl border border-neutral-200 px-4 py-3"
									placeholder="Korte beschrijving"
									bind:value={feature.description}
									on:input={markDirty}
								></textarea>
									</div>
									<button
										type="button"
										class="text-xs uppercase tracking-[0.2em] text-red-500"
										on:click={() => {
											removeFeature(index);
											markDirty();
										}}
									>
										Verwijder feature
									</button>
								</div>
							{/each}
							<button
								type="button"
								class="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.25em]"
								on:click={() => {
									addFeature();
									markDirty();
								}}
							>
								+ Voeg feature toe
							</button>
						</div>

						<div class="space-y-4">
							<h3 class="text-base font-semibold">Team</h3>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.about.team.title}
									on:input={markDirty}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving</span>
								<textarea
									rows="2"
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.about.team.description}
									on:input={markDirty}
								></textarea>
							</label>
							{#each content.about.team.members as member, index}
								<div class="space-y-3 rounded-2xl border border-neutral-200 p-4">
									<AdminImageUploader
										label={`Team foto ${index + 1}`}
										bind:url={member.image.src}
										bind:alt={member.image.alt}
										on:change={markDirty}
									/>
									<input
										class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
										placeholder="Naam"
										bind:value={member.name}
										on:input={markDirty}
									/>
									<input
										class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
										placeholder="Rol"
										bind:value={member.role}
										on:input={markDirty}
									/>
									<button
										type="button"
										class="text-xs uppercase tracking-[0.2em] text-red-500"
										on:click={() => {
											removeTeamMember(index);
											markDirty();
										}}
									>
										Verwijder teamlid
									</button>
								</div>
							{/each}
							<button
								type="button"
								class="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.25em]"
								on:click={() => {
									addTeamMember();
									markDirty();
								}}
							>
								+ Voeg teamlid toe
							</button>
						</div>
					</div>
				</section>

				<section id="contact" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
					<h2 class="text-lg font-semibold">Contact</h2>
					<div class="mt-6 space-y-6">
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
							<input
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.contact.title}
								on:input={markDirty}
							/>
						</label>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving</span>
							<textarea
								rows="3"
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.contact.description}
								on:input={markDirty}
							></textarea>
						</label>
						<div class="space-y-2">
							<p class="text-xs uppercase tracking-[0.25em] text-neutral-400">Adres regels</p>
							{#each content.contact.address.lines as line, index}
								<div class="flex items-center gap-3">
									<input
										class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
										bind:value={content.contact.address.lines[index]}
										on:input={markDirty}
									/>
									<button
										type="button"
										class="text-xs uppercase tracking-[0.2em] text-red-500"
										on:click={() => {
											removeAddressLine(index);
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
									addAddressLine();
									markDirty();
								}}
							>
								+ Voeg regel toe
							</button>
						</div>
						<div class="grid gap-4 md:grid-cols-2">
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Telefoon</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.contact.phone}
									on:input={markDirty}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">E-mail</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.contact.email}
									on:input={markDirty}
								/>
							</label>
						</div>
						<div class="space-y-2">
							<p class="text-xs uppercase tracking-[0.25em] text-neutral-400">Bedrijfsgegevens</p>
							{#each content.contact.businessDetails as detail, index}
								<div class="flex items-center gap-3">
									<input
										class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
										bind:value={content.contact.businessDetails[index]}
										on:input={markDirty}
									/>
									<button
										type="button"
										class="text-xs uppercase tracking-[0.2em] text-red-500"
										on:click={() => {
											removeBusinessDetail(index);
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
									addBusinessDetail();
									markDirty();
								}}
							>
								+ Voeg regel toe
							</button>
						</div>
					</div>
				</section>

				<section id="footer" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
					<h2 class="text-lg font-semibold">Footer</h2>
					<div class="mt-6 space-y-6">
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Titel</span>
							<input
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.footer.aboutTitle}
								on:input={markDirty}
							/>
						</label>
						<label class="space-y-2 text-sm">
							<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Beschrijving</span>
							<textarea
								rows="2"
								class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
								bind:value={content.footer.aboutDescription}
								on:input={markDirty}
							></textarea>
						</label>
						<div class="space-y-2">
							<p class="text-xs uppercase tracking-[0.25em] text-neutral-400">Snelle links</p>
							{#each content.footer.quickLinks as link, index}
								<div class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
									<input
										class="rounded-2xl border border-neutral-200 px-4 py-3"
										placeholder="Label"
										bind:value={link.label}
										on:input={markDirty}
									/>
									<input
										class="rounded-2xl border border-neutral-200 px-4 py-3"
										placeholder="/link"
										bind:value={link.href}
										on:input={markDirty}
									/>
									<button
										type="button"
										class="text-xs uppercase tracking-[0.2em] text-red-500"
										on:click={() => {
											removeQuickLink(index);
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
									addQuickLink();
									markDirty();
								}}
							>
								+ Voeg link toe
							</button>
						</div>
						<div class="grid gap-4 md:grid-cols-2">
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Contact e-mail</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.footer.contactEmail}
									on:input={markDirty}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Contact telefoon</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.footer.contactPhone}
									on:input={markDirty}
								/>
							</label>
						</div>
						<div class="space-y-2">
							<p class="text-xs uppercase tracking-[0.25em] text-neutral-400">Socials</p>
							{#each content.footer.socials as social, index}
								<div class="grid gap-3 md:grid-cols-[140px_1fr_1fr_auto]">
									<select
										class="rounded-2xl border border-neutral-200 px-4 py-3"
										bind:value={social.icon}
										on:change={markDirty}
									>
										{#each socialIconOptions as option}
											<option value={option}>{option}</option>
										{/each}
									</select>
									<input
										class="rounded-2xl border border-neutral-200 px-4 py-3"
										placeholder="Label"
										bind:value={social.label}
										on:input={markDirty}
									/>
									<input
										class="rounded-2xl border border-neutral-200 px-4 py-3"
										placeholder="https://"
										bind:value={social.href}
										on:input={markDirty}
									/>
									<button
										type="button"
										class="text-xs uppercase tracking-[0.2em] text-red-500"
										on:click={() => {
											removeSocial(index);
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
									addSocial();
									markDirty();
								}}
							>
								+ Voeg social toe
							</button>
						</div>
						<div class="grid gap-4 md:grid-cols-3">
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Credits naam</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.footer.credit.name}
									on:input={markDirty}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Credits website</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.footer.credit.website}
									on:input={markDirty}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-xs uppercase tracking-[0.25em] text-neutral-400">Credits e-mail</span>
								<input
									class="w-full rounded-2xl border border-neutral-200 px-4 py-3"
									bind:value={content.footer.credit.email}
									on:input={markDirty}
								/>
							</label>
						</div>
					</div>
				</section>

				{#if successMessage}
					<p class="text-sm text-emerald-600">{successMessage}</p>
				{/if}
				{#if errorMessage}
					<p class="text-sm text-red-500">{errorMessage}</p>
				{/if}
			</form>
		</div>

		{#if toastVisible}
			<div class={`fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl px-5 py-4 text-sm ${toastStyles}`}>
				<div class={`mb-2 h-1 w-8 rounded-full ${toastAccent}`}></div>
				{toastMessage}
			</div>
		{/if}
	</div>
{/if}
