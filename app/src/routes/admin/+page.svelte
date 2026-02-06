<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import UploadDropzone from '$lib/components/admin/UploadDropzone.svelte';
	import type { IconName, SiteContent } from '$lib/types/content';

	let { data } = $props<{ data: { content: SiteContent } }>();

let draft = $state(structuredClone(data.content));
let feedback = $state<{ success?: string; error?: string }>({});

	const iconOptions: IconName[] = [
		'compass',
		'layers',
		'sparkles',
		'users',
		'lightbulb',
		'ruler',
		'handshake',
		'landmark',
		'file-text',
		'globe',
		'arrow-up-right',
		'instagram',
		'linkedin'
	];

	const navGroups = [
		{
			label: 'Algemeen',
			items: [
				{ id: 'brand-navigation', label: 'Merk & Navigatie' },
				{ id: 'footer', label: 'Footer' }
			]
		},
		{
			label: "Pagina's",
			items: [
				{ id: 'contact', label: 'Contactpagina' },
				{ id: 'portfolio', label: 'Portfoliopagina' },
				{ id: 'about', label: 'Over pagina' }
			]
		},
		{
			label: 'Home',
			items: [
				{ id: 'home-hero', label: 'Hero & intro' },
				{ id: 'home-highlights', label: 'Hoogtepunten' },
				{ id: 'home-project', label: 'Projectsectie' },
				{ id: 'home-process', label: 'Proces' },
				{ id: 'home-commitments', label: 'Beloften' },
				{ id: 'home-gallery', label: 'Galerij' },
				{ id: 'home-testimonials', label: 'Referenties' },
				{ id: 'home-cta', label: 'Oproep tot actie' }
			]
		}
	] as const;

	let navSearch = $state('');
	const filteredNav = $derived(
		navGroups
			.map((group) => {
				const term = navSearch.trim().toLowerCase();
				if (!term) return group;
				const items = group.items.filter((item) => item.label.toLowerCase().includes(term));
				return { ...group, items };
			})
			.filter((group) => group.items.length > 0)
	);

	const enhanceSubmit: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update();
			feedback.success = undefined;
			feedback.error = undefined;

			if (result.type === 'success') {
				feedback.success = 'Inhoud opgeslagen.';
			} else if (result.type === 'failure') {
				feedback.error = result.data?.error ?? 'Opslaan mislukt.';
			} else if (result.type === 'error') {
				feedback.error = 'Opslaan mislukt.';
			}
		};
	};

	const resetDraft = () => {
		Object.assign(draft, structuredClone(data.content));
		feedback.success = undefined;
		feedback.error = undefined;
	};

	const addItem = <T>(list: T[], item: T) => {
		list.push(item);
	};

	const removeItem = <T>(list: T[], index: number) => {
		list.splice(index, 1);
	};

	const moveItem = <T>(list: T[], from: number, to: number) => {
		if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
		const [entry] = list.splice(from, 1);
		list.splice(to, 0, entry);
	};

	let dragState: { group: string; index: number } | null = null;

	const handleDragStart = (group: string, index: number) => {
		dragState = { group, index };
	};

	const handleDragOver = <T>(event: DragEvent, group: string, index: number, list: T[]) => {
		event.preventDefault();
		if (!dragState || dragState.group !== group || dragState.index === index) return;
		moveItem(list, dragState.index, index);
		dragState = { group, index };
	};

	const handleDragEnd = () => {
		dragState = null;
	};

</script>

<div class="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 text-white">
	<header class="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="font-display text-2xl uppercase tracking-[0.4em] text-primary">Beheer</h1>
			<p class="mt-2 text-sm text-white/70">Werk de website-inhoud direct bij en sla wijzigingen op in één klik.</p>
		</div>
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<button
				type="button"
				onclick={resetDraft}
				class="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white hover:bg-white/10"
			>
				Herstel wijzigingen
			</button>
			<button
				type="submit"
				form="content-form"
				class="rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-950 transition hover:bg-primary-strong hover:text-white"
			>
				Opslaan
			</button>
			<form method="POST" action="?/logout">
				<button
					type="submit"
					class="rounded-full border border-red-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
				>
					Log uit
				</button>
			</form>
		</div>
	</header>

	<div class="flex flex-col gap-8 lg:flex-row">
		<nav
			class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl lg:sticky lg:top-10 lg:w-72 lg:self-start"
			aria-label="Admin secties"
		>
			<h2 class="font-display text-lg uppercase tracking-[0.35em] text-primary">Snel naar</h2>
			<p class="mt-2 text-xs text-white/60">Spring direct naar het onderdeel dat je wilt bewerken.</p>
			<label class="mt-4 flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
				<span>Zoek</span>
				<input
					type="search"
					placeholder="Secties zoeken"
					bind:value={navSearch}
					class="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
			</label>
			<div class="mt-6 space-y-6">
				{#each filteredNav as group}
					<div class="space-y-2">
						<p class="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">{group.label}</p>
						<ul class="space-y-1">
							{#each group.items as item}
								<li>
									<a
										href={`#${item.id}`}
										class="block rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
									>
										{item.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</nav>

		<form id="content-form" method="POST" action="?/save" use:enhance={enhanceSubmit} class="flex-1 space-y-10">
			<input type="hidden" name="payload" value={JSON.stringify(draft)} />

			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Algemeen</h2>
				<p class="mt-2 text-xs text-white/60">Merk, navigatie en footer-instellingen.</p>
			</div>

			<section id="brand-navigation" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Merk &amp; Navigatie</h2>
				<p class="mt-2 text-xs text-white/60">Pas bedrijfsgegevens, social links en navigatie-items aan.</p>
			</div>
			<div class="grid gap-6 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Bedrijfsnaam</span>
					<input
						type="text"
						bind:value={draft.brand.company}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Eigenaar</span>
					<input
						type="text"
						bind:value={draft.brand.owner}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Tagline</span>
				<input
					type="text"
					bind:value={draft.brand.tagline}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
			</label>
			<div class="grid gap-4 sm:grid-cols-3">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Email</span>
					<input
						type="email"
						bind:value={draft.brand.contact.email}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Telefoon</span>
					<input
						type="text"
						bind:value={draft.brand.contact.phone}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Adres</span>
					<input
						type="text"
						bind:value={draft.brand.contact.address}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Registraties</h3>
					<button
						type="button"
						onclick={() => addItem(draft.brand.registration, '')}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-2">
					{#each draft.brand.registration as item, index}
						<li class="flex items-center gap-2">
							<input
								type="text"
								bind:value={draft.brand.registration[index]}
								class="flex-1 rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<button
								type="button"
								onclick={() => removeItem(draft.brand.registration, index)}
								class="rounded-full border border-red-300 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
							>
								Verwijder
							</button>
						</li>
					{/each}
				</ul>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Socials</h3>
					<button
						type="button"
						onclick={() => addItem(draft.brand.socials, { label: 'Nieuw', href: '', icon: 'linkedin' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.brand.socials as social, index}
						<li class="grid gap-2 sm:grid-cols-[1fr,1fr,140px,auto]">
							<input
								type="text"
								bind:value={social.label}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<input
								type="text"
								bind:value={social.href}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<select
								bind:value={social.icon}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							>
								{#each iconOptions as icon}
									<option value={icon}>{icon}</option>
								{/each}
							</select>
							<button
								type="button"
								onclick={() => removeItem(draft.brand.socials, index)}
								class="rounded-full border border-red-300 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
							>
								Verwijder
							</button>
						</li>
					{/each}
				</ul>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Navigatie</h3>
					<button
						type="button"
						onclick={() => addItem(draft.navigation.links, { label: 'Nieuw', href: '/' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.navigation.links as link, index}
						<li class="grid gap-2 sm:grid-cols-[1fr,1fr,auto]">
							<input
								type="text"
								bind:value={link.label}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<input
								type="text"
								bind:value={link.href}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<button
								type="button"
								onclick={() => removeItem(draft.navigation.links, index)}
								class="rounded-full border border-red-300 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
							>
								Verwijder
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<section id="footer" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Footer</h2>
				<p class="mt-2 text-xs text-white/60">Tagline, links en credits.</p>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Tagline</span>
				<textarea
					bind:value={draft.footer.tagline}
					rows="2"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Snelle links</h3>
					<button
						type="button"
						onclick={() => addItem(draft.footer.quickLinks, { label: 'Nieuw', href: '/' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.footer.quickLinks as link, index}
						<li class="grid gap-2 sm:grid-cols-[1fr,1fr,auto]">
							<input
								type="text"
								bind:value={link.label}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<input
								type="text"
								bind:value={link.href}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<button
								type="button"
								onclick={() => removeItem(draft.footer.quickLinks, index)}
								class="rounded-full border border-red-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
							>
								Verwijder
							</button>
						</li>
					{/each}
				</ul>
			</div>
			<div class="grid gap-4 lg:grid-cols-3">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Credits label</span>
					<input
						type="text"
						bind:value={draft.footer.credits.label}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Credits link</span>
					<input
						type="text"
						bind:value={draft.footer.credits.href}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Contactlabel</span>
					<input
						type="text"
						bind:value={draft.footer.credits.contactLabel}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Contact link</span>
				<input
					type="text"
					bind:value={draft.footer.credits.contactHref}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
			</label>
		</section>

			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Pagina's</h2>
				<p class="mt-2 text-xs text-white/60">Contact-, portfolio- en over-pagina.</p>
			</div>

		<section id="contact" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Contactpagina</h2>
				<p class="mt-2 text-xs text-white/60">Hero, formuliertekst, contactinfo en meldingen.</p>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Hero kicker</span>
					<input
						type="text"
						bind:value={draft.contact.hero.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Hero titel</span>
					<input
						type="text"
						bind:value={draft.contact.hero.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Hero tekst</span>
				<textarea
					bind:value={draft.contact.hero.body}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Formulier titel</span>
					<input
						type="text"
						bind:value={draft.contact.form.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Formulier tekst</span>
					<textarea
						bind:value={draft.contact.form.body}
						rows="3"
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					></textarea>
				</label>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Contactitems</h3>
					<button
						type="button"
						onclick={() => addItem(draft.contact.info, { type: 'address', label: 'Nieuw', value: '', href: '' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.contact.info as item, index}
						<li class="grid gap-2 lg:grid-cols-[160px,160px,1fr,auto]">
							<select
								bind:value={item.type}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							>
								<option value="address">address</option>
								<option value="phone">phone</option>
								<option value="email">email</option>
							</select>
							<input
								type="text"
								bind:value={item.label}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<input
								type="text"
								bind:value={item.value}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<input
								type="text"
								bind:value={item.href}
								placeholder="optioneel"
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<button
								type="button"
								onclick={() => removeItem(draft.contact.info, index)}
								class="rounded-full border border-red-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
							>
								Verwijder
							</button>
						</li>
					{/each}
				</ul>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Bedrijfsgegevens</h3>
					<button
						type="button"
						onclick={() => addItem(draft.contact.businessDetails, '')}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-2">
					{#each draft.contact.businessDetails as line, index}
						<li class="flex items-center gap-2">
							<input
								type="text"
								bind:value={draft.contact.businessDetails[index]}
								class="flex-1 rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<button
								type="button"
								onclick={() => removeItem(draft.contact.businessDetails, index)}
								class="rounded-full border border-red-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
							>
								Verwijder
							</button>
						</li>
					{/each}
				</ul>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Succesmelding</span>
					<input
						type="text"
						bind:value={draft.contact.successMessage}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Foutmelding</span>
					<input
						type="text"
						bind:value={draft.contact.errorMessage}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
		</section>

		<section id="portfolio" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Portfolio pagina</h2>
				<p class="mt-2 text-xs text-white/60">Aanpassen van titel, tekst en zoekplaceholder.</p>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Titel</span>
				<input
					type="text"
					bind:value={draft.portfolio.title}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
			</label>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Tekst</span>
				<textarea
					bind:value={draft.portfolio.copy}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Zoek placeholder</span>
				<input
					type="text"
					bind:value={draft.portfolio.searchPlaceholder}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
			</label>
		</section>

		<section id="about" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Over pagina</h2>
				<p class="mt-2 text-xs text-white/60">Hero, pijlers en architectprofiel.</p>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Hero kicker</span>
					<input
						type="text"
						bind:value={draft.about.hero.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Hero titel</span>
					<input
						type="text"
						bind:value={draft.about.hero.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Hero tekst</span>
				<textarea
					bind:value={draft.about.hero.body}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Pijlers</h3>
					<button
						type="button"
						onclick={() => addItem(draft.about.pillars, { title: 'Nieuw', copy: 'Omschrijving', icon: 'globe' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.about.pillars as pillar, index}
						<li class="grid gap-2 lg:grid-cols-[160px,1fr,auto]">
							<select
								bind:value={pillar.icon}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							>
								{#each iconOptions as icon}
									<option value={icon}>{icon}</option>
								{/each}
							</select>
							<div class="grid gap-2">
								<input
									type="text"
									bind:value={pillar.title}
									class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								/>
								<textarea
									bind:value={pillar.copy}
									rows="2"
									class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								></textarea>
							</div>
							<div class="flex items-center justify-end gap-2">
								<button
									type="button"
									onclick={() => moveItem(draft.about.pillars, index, index - 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↑
								</button>
								<button
									type="button"
									onclick={() => moveItem(draft.about.pillars, index, index + 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↓
								</button>
								<button
									type="button"
									onclick={() => removeItem(draft.about.pillars, index)}
									class="rounded-full border border-red-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
								>
									X
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Architect naam</span>
					<input
						type="text"
						bind:value={draft.about.architect.name}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Architect titel</span>
					<input
						type="text"
						bind:value={draft.about.architect.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Biografie</span>
				<textarea
					bind:value={draft.about.architect.bio}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Afbeelding pad</span>
				<input
					type="text"
					bind:value={draft.about.architect.image}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
			</label>
		</section>

			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Homepagina</h2>
				<p class="mt-2 text-xs text-white/60">Hero, hoogtepunten, proces en afsluitende oproep tot actie.</p>
			</div>

		<section id="home-hero" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Hero &amp; intro</h2>
				<p class="mt-2 text-xs text-white/60">Beheer de hero-tekst, knoppen en de samenvattende bullets.</p>
			</div>
			<div class="grid gap-6 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Hero kicker</span>
					<input
						type="text"
						bind:value={draft.home.hero.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Hero titel</span>
					<textarea
						bind:value={draft.home.hero.title}
						rows="3"
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					></textarea>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Hero tekst</span>
				<textarea
					bind:value={draft.home.hero.body}
					rows="4"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Primaire knop label</span>
					<input
						type="text"
						bind:value={draft.home.hero.primaryCta.label}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Primaire knop link</span>
					<input
						type="text"
						bind:value={draft.home.hero.primaryCta.href}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Secundaire knop label</span>
					<input
						type="text"
						bind:value={draft.home.hero.secondaryCta.label}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Secundaire knop link</span>
					<input
						type="text"
						bind:value={draft.home.hero.secondaryCta.href}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Hero statistieken</h3>
					<button
						type="button"
						onclick={() => addItem(draft.home.hero.stats, { value: 0, suffix: '+', label: 'Nieuwe statistiek' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.home.hero.stats as stat, index}
						<li class="grid gap-2 sm:grid-cols-[120px,80px,1fr,auto]">
							<input
								type="number"
								bind:value={stat.value}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<input
								type="text"
								bind:value={stat.suffix}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<input
								type="text"
								bind:value={stat.label}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<div class="flex items-center justify-end gap-2">
								<button
									type="button"
									onclick={() => moveItem(draft.home.hero.stats, index, index - 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↑
								</button>
								<button
									type="button"
									onclick={() => moveItem(draft.home.hero.stats, index, index + 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↓
								</button>
								<button
									type="button"
									onclick={() => removeItem(draft.home.hero.stats, index)}
									class="rounded-full border border-red-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
								>
									X
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Samenvatting titel</span>
					<input
						type="text"
						bind:value={draft.home.summaryPanel.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60 lg:col-span-2">
					<span>Samenvatting tekst</span>
					<textarea
						bind:value={draft.home.summaryPanel.copy}
						rows="3"
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					></textarea>
				</label>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Samenvatting bullets</h3>
					<button
						type="button"
						onclick={() => addItem(draft.home.summaryPanel.bullets, { icon: 'compass', text: 'Nieuw punt' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.home.summaryPanel.bullets as bullet, index}
						<li class="grid gap-2 sm:grid-cols-[160px,1fr,auto]">
							<select
								bind:value={bullet.icon}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							>
								{#each iconOptions as icon}
									<option value={icon}>{icon}</option>
								{/each}
							</select>
							<input
								type="text"
								bind:value={bullet.text}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<button
								type="button"
								onclick={() => removeItem(draft.home.summaryPanel.bullets, index)}
								class="rounded-full border border-red-300 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
							>
								Verwijder
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</section>
		<section id="home-highlights" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Hoogtepunten</h2>
				<p class="mt-2 text-xs text-white/60">Pas de intro en de highlight-kaarten aan.</p>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Intro kicker</span>
					<input
						type="text"
						bind:value={draft.home.highlightsIntro.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Intro titel</span>
					<input
						type="text"
						bind:value={draft.home.highlightsIntro.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Intro tekst</span>
				<textarea
					bind:value={draft.home.highlightsIntro.copy}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Highlight kaarten</h3>
					<button
						type="button"
						onclick={() => addItem(draft.home.highlights, { title: 'Nieuw', description: 'Omschrijving', icon: 'compass' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.home.highlights as highlight, index}
						<li class="grid gap-2 lg:grid-cols-[160px,1fr,auto]">
							<select
								bind:value={highlight.icon}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							>
								{#each iconOptions as icon}
									<option value={icon}>{icon}</option>
								{/each}
							</select>
							<div class="grid gap-2">
								<input
									type="text"
									bind:value={highlight.title}
									class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								/>
								<textarea
									bind:value={highlight.description}
									rows="2"
									class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								></textarea>
							</div>
							<div class="flex items-center justify-end gap-2">
								<button
									type="button"
									onclick={() => moveItem(draft.home.highlights, index, index - 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↑
								</button>
								<button
									type="button"
									onclick={() => moveItem(draft.home.highlights, index, index + 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↓
								</button>
								<button
									type="button"
									onclick={() => removeItem(draft.home.highlights, index)}
									class="rounded-full border border-red-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
								>
									X
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</section>
		<section id="home-project" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Projectsectie</h2>
				<p class="mt-2 text-xs text-white/60">Titel, tekst en knop voor uitgelichte projecten.</p>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Kicker</span>
					<input
						type="text"
						bind:value={draft.home.projectSection.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Titel</span>
					<input
						type="text"
						bind:value={draft.home.projectSection.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Tekst</span>
				<textarea
					bind:value={draft.home.projectSection.copy}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Knop label</span>
					<input
						type="text"
						bind:value={draft.home.projectSection.cta.label}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Knop link</span>
					<input
						type="text"
						bind:value={draft.home.projectSection.cta.href}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
		</section>
		<section id="home-process" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Proces</h2>
				<p class="mt-2 text-xs text-white/60">Stap-voor-stap aanpak en begeleidende tekst.</p>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Kicker</span>
					<input
						type="text"
						bind:value={draft.home.process.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Titel</span>
					<input
						type="text"
						bind:value={draft.home.process.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Tekst</span>
				<textarea
					bind:value={draft.home.process.copy}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Stappen</h3>
					<button
						type="button"
						onclick={() => addItem(draft.home.process.steps, { title: 'Nieuwe stap', description: 'Omschrijving', icon: 'lightbulb' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.home.process.steps as step, index}
						<li class="grid gap-2 lg:grid-cols-[160px,1fr,auto]">
							<select
								bind:value={step.icon}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							>
								{#each iconOptions as icon}
									<option value={icon}>{icon}</option>
								{/each}
							</select>
							<div class="grid gap-2">
								<input
									type="text"
									bind:value={step.title}
									class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								/>
								<textarea
									bind:value={step.description}
									rows="2"
									class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								></textarea>
							</div>
							<div class="flex items-center justify-end gap-2">
								<button
									type="button"
									onclick={() => moveItem(draft.home.process.steps, index, index - 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↑
								</button>
								<button
									type="button"
									onclick={() => moveItem(draft.home.process.steps, index, index + 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↓
								</button>
								<button
									type="button"
									onclick={() => removeItem(draft.home.process.steps, index)}
									class="rounded-full border border-red-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
								>
									X
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</section>
		<section id="home-commitments" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Beloften</h2>
				<p class="mt-2 text-xs text-white/60">Intro en items voor beloften-sectie.</p>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Kicker</span>
					<input
						type="text"
						bind:value={draft.home.commitments.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Titel</span>
					<input
						type="text"
						bind:value={draft.home.commitments.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Tekst</span>
				<textarea
					bind:value={draft.home.commitments.copy}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Punten</h3>
					<button
						type="button"
						onclick={() => addItem(draft.home.commitments.points, { title: 'Nieuw', copy: 'Omschrijving', icon: 'landmark' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-3">
					{#each draft.home.commitments.points as point, index}
						<li class="grid gap-2 lg:grid-cols-[160px,1fr,auto]">
							<select
								bind:value={point.icon}
								class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							>
								{#each iconOptions as icon}
									<option value={icon}>{icon}</option>
								{/each}
							</select>
							<div class="grid gap-2">
								<input
									type="text"
									bind:value={point.title}
									class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								/>
								<textarea
									bind:value={point.copy}
									rows="2"
									class="rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								></textarea>
							</div>
							<div class="flex items-center justify-end gap-2">
								<button
									type="button"
									onclick={() => moveItem(draft.home.commitments.points, index, index - 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↑
								</button>
								<button
									type="button"
									onclick={() => moveItem(draft.home.commitments.points, index, index + 1)}
									class="rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.3em] hover:border-white"
								>
									↓
								</button>
								<button
									type="button"
									onclick={() => removeItem(draft.home.commitments.points, index)}
									class="rounded-full border border-red-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-200 hover:text-white"
								>
									X
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</section>
		<section id="home-gallery" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Galerij</h2>
				<p class="mt-2 text-xs text-white/60">Introductietekst en afbeeldingen voor de gallerij.</p>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Kicker</span>
					<input
						type="text"
						bind:value={draft.home.galleryIntro.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Titel</span>
					<input
						type="text"
						bind:value={draft.home.galleryIntro.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Tekst</span>
				<textarea
					bind:value={draft.home.galleryIntro.copy}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Afbeeldingen</h3>
					<button
						type="button"
						onclick={() => addItem(draft.home.gallery, { src: '', alt: 'Nieuwe afbeelding' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="grid gap-4 sm:grid-cols-2">
					{#each draft.home.gallery as item, index}
						<li
							draggable="true"
							ondragstart={() => handleDragStart('gallery', index)}
							ondragover={(event) => handleDragOver(event, 'gallery', index, draft.home.gallery)}
							ondragend={handleDragEnd}
							class="space-y-3 rounded-3xl border border-white/15 bg-white/10 p-4"
						>
							<UploadDropzone
								label={`Afbeelding ${index + 1}`}
								value={item.src}
								on:select={({ detail }) => (draft.home.gallery[index].src = detail.dataUrl)}
							/>
							<label class="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60">
								<span>Alt tekst</span>
								<input
									type="text"
									bind:value={item.alt}
									class="rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
								/>
							</label>
							<div class="flex justify-between text-[10px] uppercase tracking-[0.3em] text-white/50">
								<span class="cursor-move">Sleep om te ordenen</span>
								<button
									type="button"
									onclick={() => removeItem(draft.home.gallery, index)}
									class="rounded-full border border-red-300 px-3 py-1 text-red-200 transition hover:border-red-200 hover:text-white"
								>
									Verwijder
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</section>
		<section id="home-testimonials" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Referenties</h2>
				<p class="mt-2 text-xs text-white/60">Pas de intro en de quotes aan. Sleep om te herschikken.</p>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Kicker</span>
					<input
						type="text"
						bind:value={draft.home.testimonials.kicker}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Titel</span>
					<input
						type="text"
						bind:value={draft.home.testimonials.title}
						class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					/>
				</label>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Quotes</h3>
					<button
						type="button"
						onclick={() => addItem(draft.home.testimonials.items, { quote: 'Nieuwe quote', name: 'Naam' })}
						class="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
					>
						Toevoegen
					</button>
				</div>
				<ul class="space-y-4">
					{#each draft.home.testimonials.items as testimonial, index}
						<li
							draggable="true"
							ondragstart={() => handleDragStart('testimonials', index)}
							ondragover={(event) => handleDragOver(event, 'testimonials', index, draft.home.testimonials.items)}
							ondragend={handleDragEnd}
							class="space-y-3 rounded-3xl border border-white/15 bg-white/10 p-4"
						>
							<textarea
								bind:value={testimonial.quote}
								rows="3"
								class="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							></textarea>
							<input
								type="text"
								bind:value={testimonial.name}
								class="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
							/>
							<div class="flex justify-between text-[10px] uppercase tracking-[0.3em] text-white/50">
								<span class="cursor-move">Sleep om te ordenen</span>
								<button
									type="button"
									onclick={() => removeItem(draft.home.testimonials.items, index)}
									class="rounded-full border border-red-300 px-3 py-1 text-red-200 transition hover:border-red-200 hover:text-white"
								>
									Verwijder
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</section>
		<section id="home-cta" class="scroll-mt-24 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
			<div>
				<h2 class="font-display text-xl uppercase tracking-[0.35em] text-primary">Oproep tot actie</h2>
				<p class="mt-2 text-xs text-white/60">Aanpassen van afsluitende oproep tot actie.</p>
			</div>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Titel</span>
				<input
					type="text"
					bind:value={draft.home.cta.title}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
			</label>
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Tekst</span>
				<textarea
					bind:value={draft.home.cta.copy}
					rows="3"
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				></textarea>
			</label>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Primair label</span>
					<input
					type="text"
					bind:value={draft.home.cta.primaryCta.label}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Primair link</span>
					<input
					type="text"
					bind:value={draft.home.cta.primaryCta.href}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Secundair label</span>
					<input
					type="text"
					bind:value={draft.home.cta.secondaryCta.label}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
				</label>
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
					<span>Secundair link</span>
					<input
					type="text"
					bind:value={draft.home.cta.secondaryCta.href}
					class="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
				/>
				</label>
			</div>
		</section>

		{#if feedback.success}
			<p class="rounded-3xl border border-emerald-300/70 bg-emerald-500/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
				{feedback.success}
			</p>
	{:else if feedback.error}
		<p class="rounded-3xl border border-red-300/70 bg-red-500/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-red-200">
			{feedback.error}
		</p>
	{/if}
	</form>
	</div>
</div>
