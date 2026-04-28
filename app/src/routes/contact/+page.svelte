<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';
	import type { ContactContent } from '$lib/types/content';

	let formResult: { success?: boolean; message?: string; error?: string } = {};
	$: formResult = $page.form ?? {};

	export let data: { contact: ContactContent; turnstileSiteKey: string };
	const { contact } = data;
	const turnstileSiteKey = data.turnstileSiteKey;

	let name = '';
	let email = '';
	let phone = '';
	let subject = '';
	let message = '';
</script>

<svelte:head>
	{#if turnstileSiteKey}
		<script
			src="https://challenges.cloudflare.com/turnstile/v0/api.js"
			async
			defer
		></script>
	{/if}
</svelte:head>

<div class="bg-[#f7f9fc]">
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
		<div class="max-w-xl lg:max-w-lg">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900">{contact.title}</h2>
			<p class="mt-4 text-base leading-7 text-gray-600">
				{contact.description}
			</p>

			<div class="mt-10 space-y-6 text-base leading-7 text-gray-600">
				<div class="flex gap-x-4">
					<div class="flex-none">
						<span class="sr-only">Adres</span>
						<MapPin class="h-6 w-6 text-gray-400" aria-hidden="true" />
					</div>
					<p>{contact.address.lines.join(', ')}</p>
				</div>
				<div class="flex gap-x-4">
					<div class="flex-none">
						<span class="sr-only">Telefoon</span>
						<PhoneIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
					</div>
					<a href={`tel:${contact.phone}`} class="hover:text-gray-900">{contact.phone}</a>
				</div>
				<div class="flex gap-x-4">
					<div class="flex-none">
						<span class="sr-only">Email</span>
						<MailIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
					</div>
					<a href={`mailto:${contact.email}`} class="hover:text-gray-900">{contact.email}</a>
				</div>
			</div>

			<div class="mt-10 border-t border-gray-200 pt-8">
				<h3 class="text-base font-semibold text-gray-800">Bedrijfsgegevens</h3>
				<ul class="mt-4 space-y-1 text-sm text-gray-500">
					{#each contact.businessDetails as detail}
						<li>{detail}</li>
					{/each}
				</ul>
			</div>
		</div>

		<form
			method="POST"
			use:enhance
			class="space-y-8 rounded-2xl border border-black/10 bg-white/90 px-8 pt-5 pb-8 lg:max-w-none lg:px-10 lg:pt-5 lg:pb-10"
		>
			<div class="hidden" aria-hidden="true">
				<label for="sanity_check">Do not fill this out</label>
				<input type="text" name="sanity_check" id="sanity_check" tabindex="-1" autocomplete="off" />
			</div>
			<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
				<div>
					<label for="name" class="block text-sm font-semibold leading-6 text-gray-900">
						Naam
					</label>
					<div class="mt-2.5">
						<input
							type="text"
							name="name"
							id="name"
							bind:value={name}
							required
							class="block w-full rounded-xl border border-black/10 bg-[#fbfcfe] px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none sm:text-sm sm:leading-6"
							placeholder="Uw volledige naam"
						/>
					</div>
				</div>

				<div>
					<label for="email" class="block text-sm font-semibold leading-6 text-gray-900">
						E-mailadres
					</label>
					<div class="mt-2.5">
						<input
							type="email"
							name="email"
							id="email"
							bind:value={email}
							required
							class="block w-full rounded-xl border border-black/10 bg-[#fbfcfe] px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none sm:text-sm sm:leading-6"
							placeholder="uwnaam@voorbeeld.nl"
						/>
					</div>
				</div>

				<div>
					<label for="phone" class="block text-sm font-semibold leading-6 text-gray-900">
						Telefoonnummer
					</label>
					<div class="mt-2.5">
						<input
							type="tel"
							name="phone"
							id="phone"
							bind:value={phone}
							class="block w-full rounded-xl border border-black/10 bg-[#fbfcfe] px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none sm:text-sm sm:leading-6"
							placeholder="+31 6 12345678"
						/>
					</div>
				</div>

				<div>
					<label for="subject" class="block text-sm font-semibold leading-6 text-gray-900">
						Onderwerp
					</label>
					<div class="mt-2.5">
						<input
							type="text"
							name="subject"
							id="subject"
							bind:value={subject}
							required
							class="block w-full rounded-xl border border-black/10 bg-[#fbfcfe] px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none sm:text-sm sm:leading-6"
							placeholder="Korte omschrijving"
						/>
					</div>
				</div>
			</div>

			<div class="sm:col-span-2">
				<label for="message" class="block text-sm font-semibold leading-6 text-gray-900"
					>Bericht</label
				>
				<div class="mt-2.5">
					<textarea
						name="message"
						id="message"
						bind:value={message}
						rows="6"
						required
						class="block w-full rounded-xl border border-black/10 bg-[#fbfcfe] px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none sm:text-sm sm:leading-6"
						placeholder="Laat hier uw bericht achter..."
					></textarea>
				</div>
			</div>

			{#if turnstileSiteKey}
				<div
					class="cf-turnstile"
					data-sitekey={turnstileSiteKey}
					data-theme="light"
					data-size="flexible"
					data-action="contact"
				></div>
			{:else}
				<div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
					<p class="text-sm text-amber-800">
						Captcha is nog niet ingesteld. Voeg eerst de Turnstile-sleutels toe aan de omgeving.
					</p>
				</div>
			{/if}

			<div class="mt-10">
				<button
					type="submit"
					disabled={!turnstileSiteKey}
					class="block w-full rounded-full border border-secondary bg-secondary px-3.5 py-3 text-center text-sm font-semibold text-white transition hover:bg-secondary/85"
				>
					Bericht versturen
				</button>
			</div>

			{#if formResult.success}
				<div
					class="rounded-xl border border-primary/50 bg-primary/12 p-4 text-center"
					role="alert"
				>
					<p class="text-sm font-medium text-textcolor">{formResult.message}</p>
				</div>
			{:else if formResult.error}
				<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-center" role="alert">
					<p class="text-sm font-medium text-red-800">{formResult.error}</p>
				</div>
			{/if}
		</form>
	</div>
</div>
