<script lang="ts">
	import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';
	import type { ContactContent } from '$lib/types/content';

	export let data: { contact: ContactContent };
	const { contact } = data;
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

			<div class="max-w-2xl border-t border-black/20 pt-5">
				<h2 class="text-2xl font-semibold tracking-tight text-textcolor">Stuur een e-mail</h2>
				<a
					class="mt-5 inline-block border border-secondary bg-secondary px-[18px] py-3 text-sm text-white transition-colors hover:bg-transparent hover:text-textcolor"
					href={`mailto:${contact.email}`}>E-mail {contact.email}</a
				>
			</div>
		</div>
	</div>
</section>
