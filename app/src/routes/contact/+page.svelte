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
	<title>Contact opnemen met architect Maria Hoogland | Spaarndam</title>
	<meta
		name="description"
		content="Neem contact op met architect Maria Hoogland in Spaarndam voor een verbouwing, nieuwbouwproject of vergunningstraject."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Contact opnemen met architect Maria Hoogland | Spaarndam" />
	<meta
		property="og:description"
		content="Neem contact op voor een verbouwing, nieuwbouwproject of vergunningstraject."
	/>
	<meta
		property="og:image"
		content="https://mariahoogland.nl/images/people/maria-garden-portrait.webp"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Contact opnemen met architect Maria Hoogland | Spaarndam" />
	<meta
		name="twitter:description"
		content="Neem contact op voor een verbouwing, nieuwbouwproject of vergunningstraject."
	/>
	<meta
		name="twitter:image"
		content="https://mariahoogland.nl/images/people/maria-garden-portrait.webp"
	/>
	{#if turnstileSiteKey}<script
			src="https://challenges.cloudflare.com/turnstile/v0/api.js"
			async
			defer
		></script>{/if}
</svelte:head>

<section
	class="min-h-[calc(100svh-3.5rem)] bg-[#f7f9fc] px-6 py-16 text-textcolor sm:px-8 sm:py-24"
>
	<div class="mx-auto max-w-7xl">
		<h1 class="sr-only">Contact opnemen met architect Maria Hoogland</h1>
		<div class="grid gap-16 lg:grid-cols-[minmax(14rem,.65fr)_minmax(0,1.35fr)] lg:gap-24">
			<aside class="text-secondary" aria-label="Contactgegevens">
				<div class="border-t border-black/15">
					<div class="grid grid-cols-[20px_1fr] gap-3.5 border-b border-black/15 py-5">
						<MapPin size={19} strokeWidth={1.5} aria-hidden="true" />
						<div>
							<h2 class="text-base font-semibold text-textcolor">Adres</h2>
							<p class="mt-1 text-sm leading-6">{contact.address.lines.join(', ')}</p>
						</div>
					</div>
					<div class="grid grid-cols-[20px_1fr] gap-3.5 border-b border-black/15 py-5">
						<PhoneIcon size={19} strokeWidth={1.5} aria-hidden="true" />
						<div>
							<h2 class="text-base font-semibold text-textcolor">Telefoon</h2>
							<a
								class="mt-1 block text-sm leading-6 hover:text-textcolor hover:underline hover:underline-offset-3"
								href={`tel:${contact.phone}`}>{contact.phone}</a
							>
						</div>
					</div>
					<div class="grid grid-cols-[20px_1fr] gap-3.5 border-b border-black/15 py-5">
						<MailIcon size={19} strokeWidth={1.5} aria-hidden="true" />
						<div>
							<h2 class="text-base font-semibold text-textcolor">E-mail</h2>
							<a
								class="mt-1 block text-sm leading-6 hover:text-textcolor hover:underline hover:underline-offset-3"
								href={`mailto:${contact.email}`}>{contact.email}</a
							>
						</div>
					</div>
				</div>
				{#if contact.businessDetails.length}<div class="mt-8">
						<h2 class="text-base font-semibold text-textcolor">Bedrijfsgegevens</h2>
						{#each contact.businessDetails as detail}<p class="mt-1 text-sm leading-5">
								{detail}
							</p>{/each}
					</div>{/if}
			</aside>

			<form method="POST" use:enhance class="border-t border-black/20 pt-5">
				<div class="grid gap-x-[18px] gap-y-4 sm:grid-cols-2">
					<label class="block"
						><span class="text-sm font-medium">Naam</span><input
							class="mt-2 w-full border border-black/20 bg-white p-3 text-base outline-none placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
							type="text"
							name="name"
							bind:value={name}
							required
							autocomplete="name"
							placeholder="Uw naam"
						/></label
					>
					<label class="block"
						><span class="text-sm font-medium">E-mailadres</span><input
							class="mt-2 w-full border border-black/20 bg-white p-3 text-base outline-none placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
							type="email"
							name="email"
							bind:value={email}
							required
							autocomplete="email"
							placeholder="naam@voorbeeld.nl"
						/></label
					>
					<label class="block"
						><span class="text-sm font-medium"
							>Telefoonnummer <em class="font-normal text-neutral-500 not-italic">optioneel</em
							></span
						><input
							class="mt-2 w-full border border-black/20 bg-white p-3 text-base outline-none placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
							type="tel"
							name="phone"
							bind:value={phone}
							autocomplete="tel"
							placeholder="06 12345678"
						/></label
					>
					<label class="block"
						><span class="text-sm font-medium">Onderwerp</span><input
							class="mt-2 w-full border border-black/20 bg-white p-3 text-base outline-none placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
							type="text"
							name="subject"
							bind:value={subject}
							required
							placeholder="Bijvoorbeeld: verbouwing woning"
						/></label
					>
					<label class="block sm:col-span-2"
						><span class="text-sm font-medium">Bericht</span><textarea
							class="mt-2 block w-full resize-y border border-black/20 bg-white p-3 text-base leading-6 outline-none placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
							name="message"
							bind:value={message}
							rows="7"
							required
							placeholder="Vertel kort wat u voor ogen heeft..."
						></textarea></label
					>
				</div>
				{#if turnstileSiteKey}<div
						class="cf-turnstile mt-7"
						data-sitekey={turnstileSiteKey}
						data-theme="light"
						data-size="flexible"
						data-action="contact"
					></div>{:else}<p
						class="mt-7 border-l-2 border-secondary pl-3 text-sm leading-5 text-secondary"
					>
						Captcha is nog niet ingesteld. Voeg eerst de Turnstile-sleutels toe aan de omgeving.
					</p>{/if}
				<button
					class="mt-7 border border-secondary bg-secondary px-[18px] py-3 text-sm text-white transition-colors hover:bg-transparent hover:text-textcolor disabled:cursor-not-allowed disabled:opacity-50"
					type="submit"
					disabled={!turnstileSiteKey}>Bericht versturen</button
				>
				{#if formResult.success}<p class="mt-5 text-sm text-emerald-800" role="alert">
						{formResult.message}
					</p>{:else if formResult.error}<p class="mt-5 text-sm text-red-700" role="alert">
						{formResult.error}
					</p>{/if}
			</form>
		</div>
	</div>
</section>
