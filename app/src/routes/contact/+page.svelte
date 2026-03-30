<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';
	import type { ContactContent } from '$lib/types/content';

	let formResult: { success?: boolean; message?: string; error?: string } = {};
	$: formResult = $page.form ?? {};

	export let data: { contact: ContactContent };
	const { contact } = data;

	let name = '';
	let email = '';
	let phone = '';
	let subject = '';
	let message = '';
</script>

<section class="border-b border-secondary/15 bg-[#f4f7f6] py-20 sm:py-24">
	<div class="section-wrap">
		<div class="max-w-3xl">
			<p class="section-eyebrow">Contact</p>
			<h1 class="section-title">{contact.title}</h1>
			<p class="section-copy">{contact.description}</p>
		</div>
	</div>
</section>

<section class="bg-white py-16 sm:py-20">
	<div class="section-wrap grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
		<aside class="flat-panel p-7 sm:p-8">
			<h2 class="text-2xl text-textcolor">Direct bereikbaar</h2>

			<div class="mt-8 space-y-6 text-sm leading-7 text-secondary">
				<div class="flex gap-3">
					<MapPin class="mt-1 h-5 w-5 flex-none text-secondary" aria-hidden="true" />
					<p>{contact.address.lines.join(', ')}</p>
				</div>
				<div class="flex gap-3">
					<PhoneIcon class="mt-1 h-5 w-5 flex-none text-secondary" aria-hidden="true" />
					<a href={`tel:${contact.phone}`} class="transition-colors hover:text-textcolor">
						{contact.phone}
					</a>
				</div>
				<div class="flex gap-3">
					<MailIcon class="mt-1 h-5 w-5 flex-none text-secondary" aria-hidden="true" />
					<a href={`mailto:${contact.email}`} class="transition-colors hover:text-textcolor">
						{contact.email}
					</a>
				</div>
			</div>

			<div class="mt-8 border-t border-secondary/20 pt-6">
				<h3 class="text-sm font-semibold uppercase tracking-[0.16em] text-secondary">Bedrijfsgegevens</h3>
				<ul class="mt-4 space-y-1 text-sm text-secondary">
					{#each contact.businessDetails as detail}
						<li>{detail}</li>
					{/each}
				</ul>
			</div>
		</aside>

		<form method="POST" use:enhance class="flat-panel p-7 sm:p-8">
			<div class="hidden" aria-hidden="true">
				<label for="sanity_check">Do not fill this out</label>
				<input type="text" name="sanity_check" id="sanity_check" tabindex="-1" autocomplete="off" />
			</div>

			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div>
					<label for="name" class="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Naam</label>
					<input
						type="text"
						name="name"
						id="name"
						bind:value={name}
						required
						class="flat-input mt-2"
						placeholder="Uw volledige naam"
					/>
				</div>

				<div>
					<label for="email" class="text-xs font-semibold uppercase tracking-[0.16em] text-secondary"
						>E-mailadres</label
					>
					<input
						type="email"
						name="email"
						id="email"
						bind:value={email}
						required
						class="flat-input mt-2"
						placeholder="uwnaam@voorbeeld.nl"
					/>
				</div>

				<div>
					<label for="phone" class="text-xs font-semibold uppercase tracking-[0.16em] text-secondary"
						>Telefoonnummer</label
					>
					<input
						type="tel"
						name="phone"
						id="phone"
						bind:value={phone}
						class="flat-input mt-2"
						placeholder="+31 6 12345678"
					/>
				</div>

				<div>
					<label for="subject" class="text-xs font-semibold uppercase tracking-[0.16em] text-secondary"
						>Onderwerp</label
					>
					<input
						type="text"
						name="subject"
						id="subject"
						bind:value={subject}
						required
						class="flat-input mt-2"
						placeholder="Korte omschrijving"
					/>
				</div>
			</div>

			<div class="mt-5">
				<label for="message" class="text-xs font-semibold uppercase tracking-[0.16em] text-secondary"
					>Bericht</label
				>
				<textarea
					name="message"
					id="message"
					bind:value={message}
					rows="6"
					required
					class="flat-input mt-2"
					placeholder="Laat hier uw bericht achter..."
				></textarea>
			</div>

			<div class="mt-7">
				<button type="submit" class="site-btn-primary w-full">Bericht versturen</button>
			</div>

			{#if formResult.success}
				<div class="mt-5 border border-emerald-300 bg-emerald-50 p-4 text-center" role="alert">
					<p class="text-sm font-medium text-emerald-800">{formResult.message}</p>
				</div>
			{:else if formResult.error}
				<div class="mt-5 border border-rose-300 bg-rose-50 p-4 text-center" role="alert">
					<p class="text-sm font-medium text-rose-800">{formResult.error}</p>
				</div>
			{/if}
		</form>
	</div>
</section>
