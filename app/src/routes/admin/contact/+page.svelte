<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AdminSaveDock from '$lib/components/admin/AdminSaveDock.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import type { ContactContent } from '$lib/types/content';
	import type { PageData } from './$types';

	type FormState = { error?: string; success?: boolean } | undefined;

	export let data: PageData;
	export let form: FormState = undefined;

	let contact: ContactContent = data.authenticated && data.content ? structuredClone(data.content.contact) : ({} as ContactContent);
	let baseline = data.authenticated && data.content ? JSON.stringify(data.content.contact) : '';
	let pending = false;
	let successMessage = form?.success ? 'Opgeslagen.' : '';
	let errorMessage = form?.error ?? '';
	const formId = 'admin-contact-form';

	$: dirty = data.authenticated ? JSON.stringify(contact) !== baseline : false;

	const saveEnhancer: SubmitFunction = ({ formData }) => {
		pending = true;
		successMessage = '';
		errorMessage = '';
		formData.set('payload', JSON.stringify({ contact }));
		return async ({ result, update }) => {
			pending = false;
			if (result.type === 'success') {
				await update({ reset: false, invalidateAll: false });
				baseline = JSON.stringify(contact);
				successMessage = 'Opgeslagen.';
			} else if (result.type === 'failure') {
				await update({ reset: false, invalidateAll: false });
				errorMessage = typeof result.data?.error === 'string' ? result.data.error : 'Opslaan mislukt.';
			} else {
				await update();
			}
		};
	};

	const addAddressLine = () => {
		contact = { ...contact, address: { ...contact.address, lines: [...contact.address.lines, ''] } };
	};
	const removeAddressLine = (index: number) => {
		const remaining = contact.address.lines.filter((_item, i) => i !== index);
		contact = { ...contact, address: { ...contact.address, lines: remaining.length ? remaining : [''] } };
	};
	const addBusinessDetail = () => {
		contact = { ...contact, businessDetails: [...contact.businessDetails, ''] };
	};
	const removeBusinessDetail = (index: number) => {
		const remaining = contact.businessDetails.filter((_item, i) => i !== index);
		contact = { ...contact, businessDetails: remaining.length ? remaining : [''] };
	};
</script>

{#if data.authenticated}
	<AdminShell title="Contact bewerken" subtitle="Tekst, adres, telefoon, e-mail en bedrijfsgegevens." active="contact">
		<form id={formId} method="post" action="?/save" use:enhance={saveEnhancer} class="space-y-6">
			<input type="hidden" name="payload" />
			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Contactpagina</p>
				<div class="mt-5 space-y-4">
					<div>
						<label for="contact-title" class="block text-sm font-medium text-neutral-700">Titel</label>
						<input id="contact-title" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={contact.title} />
					</div>
					<div>
						<label for="contact-description" class="block text-sm font-medium text-neutral-700">Beschrijving</label>
						<textarea id="contact-description" rows="4" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={contact.description}></textarea>
					</div>
				</div>
			</section>

			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Adres en contact</p>
				<div class="mt-5 space-y-4">
					{#each contact.address.lines as line, index}
						<div class="flex items-center gap-3">
							<input class="w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={contact.address.lines[index]} />
							<button type="button" class="text-xs uppercase tracking-[0.2em] text-red-500" on:click={() => removeAddressLine(index)}>Verwijder</button>
						</div>
					{/each}
					<button type="button" class="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em]" on:click={addAddressLine}>+ Adresregel</button>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label for="contact-phone" class="block text-sm font-medium text-neutral-700">Telefoon</label>
							<input id="contact-phone" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={contact.phone} />
						</div>
						<div>
							<label for="contact-email" class="block text-sm font-medium text-neutral-700">E-mail</label>
							<input id="contact-email" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={contact.email} />
						</div>
					</div>
				</div>
			</section>

			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Bedrijfsgegevens</p>
				<div class="mt-5 space-y-4">
					{#each contact.businessDetails as detail, index}
						<div class="flex items-center gap-3">
							<input class="w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={contact.businessDetails[index]} />
							<button type="button" class="text-xs uppercase tracking-[0.2em] text-red-500" on:click={() => removeBusinessDetail(index)}>Verwijder</button>
						</div>
					{/each}
					<button type="button" class="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em]" on:click={addBusinessDetail}>+ Regel</button>
				</div>
			</section>
		</form>
		<AdminSaveDock {dirty} {pending} {formId} {successMessage} {errorMessage} />
	</AdminShell>
{/if}
