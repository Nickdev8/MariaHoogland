<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import type { PageData } from './$types';

	type FormState = { error?: string } | undefined;

	export let data: PageData;
	export let form: FormState = undefined;

	const sections = [
		{
			title: 'Home',
			description: 'Hero, impressies, uitgelichte projecten, statistieken en testimonials.',
			href: '/admin/home'
		},
		{
			title: 'Over mij',
			description: 'Persoonlijke introductie, bureauverhaal en profielfoto van Maria.',
			href: '/admin/about'
		},
		{
			title: 'Portfolio',
			description: 'Portfolio-intro, projectoverzicht en individuele projectpagina’s.',
			href: '/admin/portfolio'
		},
		{
			title: 'Contact',
			description: 'Contacttekst, adresregels, contactgegevens en bedrijfsinformatie.',
			href: '/admin/contact'
		},
		{
			title: 'Footer',
			description: 'Footer-omschrijving, links, socials en credits.',
			href: '/admin/footer'
		}
	];
</script>

{#if !data.authenticated}
	<div class="min-h-screen bg-[#f5f7fb] px-6 pt-16 text-neutral-900">
		<div class="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
			<p class="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-400">Maria Hoogland</p>
			<h1 class="mt-3 text-2xl font-semibold tracking-tight">Admin login</h1>
			<p class="mt-2 text-sm leading-7 text-neutral-500">
				Log in om de website per pagina te beheren.
			</p>

			<form method="post" action="?/login" class="mt-8 space-y-4">
				<label for="admin-password" class="block text-sm font-medium text-neutral-700">
					Wachtwoord
				</label>
				<input
					id="admin-password"
					type="password"
					name="password"
					required
					class="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-neutral-900 focus:border-secondary focus:outline-none"
				/>
				{#if form?.error}
					<p class="text-sm text-red-600">{form.error}</p>
				{/if}
				<button
					type="submit"
					class="w-full rounded-full bg-secondary px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-secondary/90"
				>
					Inloggen
				</button>
			</form>
		</div>
	</div>
{:else}
	<AdminShell
		title="Admin dashboard"
		subtitle="Bewerk de site per publieke pagina in plaats van in één lange monolith."
		active="dashboard"
	>
		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each sections as section}
				<a
					href={section.href}
					class="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-secondary/40 hover:bg-[#f9fbff]"
				>
					<p class="section-eyebrow">{section.title}</p>
					<p class="mt-4 text-sm leading-7 text-secondary">{section.description}</p>
				</a>
			{/each}
		</div>
	</AdminShell>
{/if}
