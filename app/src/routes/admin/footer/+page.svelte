<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AdminSaveDock from '$lib/components/admin/AdminSaveDock.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import type { FooterContent } from '$lib/types/content';
	import type { PageData } from './$types';

	type FormState = { error?: string; success?: boolean } | undefined;

	export let data: PageData;
	export let form: FormState = undefined;

	let footer: FooterContent = data.authenticated && data.content ? structuredClone(data.content.footer) : ({} as FooterContent);
	let baseline = data.authenticated && data.content ? JSON.stringify(data.content.footer) : '';
	let pending = false;
	let successMessage = form?.success ? 'Opgeslagen.' : '';
	let errorMessage = form?.error ?? '';
	const formId = 'admin-footer-form';
	const socialIconOptions = ['Instagram', 'Linkedin'];

	$: dirty = data.authenticated ? JSON.stringify(footer) !== baseline : false;

	const saveEnhancer: SubmitFunction = ({ formData }) => {
		pending = true;
		successMessage = '';
		errorMessage = '';
		formData.set('payload', JSON.stringify({ footer }));
		return async ({ result, update }) => {
			pending = false;
			if (result.type === 'success') {
				await update({ reset: false, invalidateAll: false });
				baseline = JSON.stringify(footer);
				successMessage = 'Opgeslagen.';
			} else if (result.type === 'failure') {
				await update({ reset: false, invalidateAll: false });
				errorMessage = typeof result.data?.error === 'string' ? result.data.error : 'Opslaan mislukt.';
			} else {
				await update();
			}
		};
	};

	const addQuickLink = () => {
		footer = { ...footer, quickLinks: [...footer.quickLinks, { label: '', href: '' }] };
	};
	const removeQuickLink = (index: number) => {
		const remaining = footer.quickLinks.filter((_item, i) => i !== index);
		footer = { ...footer, quickLinks: remaining.length ? remaining : [{ label: '', href: '' }] };
	};
	const addSocial = () => {
		footer = { ...footer, socials: [...footer.socials, { label: '', href: '', icon: 'Instagram' }] };
	};
	const removeSocial = (index: number) => {
		const remaining = footer.socials.filter((_item, i) => i !== index);
		footer = { ...footer, socials: remaining.length ? remaining : [{ label: '', href: '', icon: 'Instagram' }] };
	};
</script>

{#if data.authenticated}
	<AdminShell title="Footer bewerken" subtitle="Footertekst, links, socials en credits." active="footer">
		<form id={formId} method="post" action="?/save" use:enhance={saveEnhancer} class="space-y-6">
			<input type="hidden" name="payload" />
			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Basis</p>
				<div class="mt-5 space-y-4">
					<div>
						<label for="footer-title" class="block text-sm font-medium text-neutral-700">Titel</label>
						<input id="footer-title" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={footer.aboutTitle} />
					</div>
					<div>
						<label for="footer-description" class="block text-sm font-medium text-neutral-700">Beschrijving</label>
						<textarea id="footer-description" rows="3" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={footer.aboutDescription}></textarea>
					</div>
				</div>
			</section>

			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Snelle links</p>
				<div class="mt-5 space-y-4">
					{#each footer.quickLinks as link, index}
						<div class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
							<input class="rounded-2xl border border-black/10 px-4 py-3" placeholder="Label" bind:value={link.label} />
							<input class="rounded-2xl border border-black/10 px-4 py-3" placeholder="/link" bind:value={link.href} />
							<button type="button" class="text-xs uppercase tracking-[0.2em] text-red-500" on:click={() => removeQuickLink(index)}>Verwijder</button>
						</div>
					{/each}
					<button type="button" class="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em]" on:click={addQuickLink}>+ Link</button>
				</div>
			</section>

			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Contact en socials</p>
				<div class="mt-5 grid gap-4 md:grid-cols-2">
					<div>
						<label for="footer-email" class="block text-sm font-medium text-neutral-700">Contact e-mail</label>
						<input id="footer-email" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={footer.contactEmail} />
					</div>
					<div>
						<label for="footer-phone" class="block text-sm font-medium text-neutral-700">Contact telefoon</label>
						<input id="footer-phone" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={footer.contactPhone} />
					</div>
				</div>
				<div class="mt-5 space-y-4">
					{#each footer.socials as social, index}
						<div class="grid gap-3 md:grid-cols-[140px_1fr_1fr_auto]">
							<select class="rounded-2xl border border-black/10 px-4 py-3" bind:value={social.icon}>
								{#each socialIconOptions as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
							<input class="rounded-2xl border border-black/10 px-4 py-3" placeholder="Label" bind:value={social.label} />
							<input class="rounded-2xl border border-black/10 px-4 py-3" placeholder="https://" bind:value={social.href} />
							<button type="button" class="text-xs uppercase tracking-[0.2em] text-red-500" on:click={() => removeSocial(index)}>Verwijder</button>
						</div>
					{/each}
					<button type="button" class="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em]" on:click={addSocial}>+ Social</button>
				</div>
			</section>
		</form>
		<AdminSaveDock {dirty} {pending} {formId} {successMessage} {errorMessage} />
	</AdminShell>
{/if}
