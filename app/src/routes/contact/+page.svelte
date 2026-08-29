<script lang="ts">
	import { onMount } from 'svelte';
	import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';
	import { revealContactDetail } from '$lib/obfuscation';
	import type { ContactContent } from '$lib/types/content';

	export let data: { contact: ContactContent };
	const { contact } = data;
	let detailsReady = false;
	$: addressLines = detailsReady ? contact.address.lines.map(revealContactDetail) : [];
	$: phone = detailsReady ? revealContactDetail(contact.phone) : '';
	$: email = detailsReady ? revealContactDetail(contact.email) : '';
	$: emailParts = email.split('@');
	$: phoneParts = phone.split(' ');
	$: businessDetails = detailsReady ? contact.businessDetails.map(revealContactDetail) : [];

	onMount(() => {
		detailsReady = true;
	});
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

<section class="bg-[#f7f9fc] px-6 py-16 text-textcolor sm:px-8 sm:py-24">
	<div class="mx-auto max-w-5xl">
		<header class="border-b border-black/15 pb-8 sm:pb-10">
			<h1 class="text-[clamp(2.5rem,4.8vw,4.75rem)] leading-[.96] font-medium tracking-[-.055em]">
				{contact.title}
			</h1>
		</header>

		<div class="grid border-b border-black/15 md:grid-cols-2">
			<section
				class="border-b border-black/15 py-8 md:border-r md:border-b-0 md:py-10 md:pr-10"
				aria-label="E-mail"
			>
				<div class="grid grid-cols-[20px_1fr] gap-3.5">
					<MailIcon size={19} strokeWidth={1.5} aria-hidden="true" />
					<div>
						<h2 class="text-base font-semibold text-textcolor">E-mail</h2>
						{#if detailsReady}<a
								class="mt-2 inline-block text-lg leading-7 text-secondary underline decoration-black/25 underline-offset-4 transition-colors hover:text-textcolor hover:decoration-textcolor"
								href={`mailto:${email}`}
								><span>{emailParts[0]}</span><span aria-hidden="true">@</span><span
									>{emailParts[1]}</span
								></a
							>{/if}
					</div>
				</div>
			</section>

			<section class="py-8 md:py-10 md:pl-10" aria-label="Adres en telefoon">
				<div class="grid gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
					<div class="grid grid-cols-[20px_1fr] gap-3.5">
						<MapPin size={19} strokeWidth={1.5} aria-hidden="true" />
						<div>
							<h2 class="text-base font-semibold text-textcolor">Adres</h2>
							{#if detailsReady}<div class="mt-1 text-sm leading-6 text-secondary">
									{#each addressLines as line}<p>{line}</p>{/each}
								</div>{/if}
						</div>
					</div>
					<div class="grid grid-cols-[20px_1fr] gap-3.5">
						<PhoneIcon size={19} strokeWidth={1.5} aria-hidden="true" />
						<div>
							<h2 class="text-base font-semibold text-textcolor">Telefoon</h2>
							{#if detailsReady}<a
									class="mt-1 flex flex-wrap gap-x-1 text-sm leading-6 text-secondary underline decoration-black/20 underline-offset-3 transition-colors hover:text-textcolor hover:decoration-textcolor"
									href={`tel:${phone}`}
									>{#each phoneParts as part}<span>{part}</span>{/each}</a
								>{/if}
						</div>
					</div>
				</div>
			</section>
		</div>

		{#if detailsReady && businessDetails.length}<section
				class="grid gap-5 py-8 sm:grid-cols-[minmax(10rem,.55fr)_minmax(0,1.45fr)] sm:py-10"
				aria-label="Bedrijfsgegevens"
			>
				<h2 class="text-base font-semibold text-textcolor">Bedrijfsgegevens</h2>
				<div class="grid gap-x-8 gap-y-1 text-sm leading-6 text-secondary sm:grid-cols-2">
					{#each businessDetails as detail}<p>{detail}</p>{/each}
				</div>
			</section>{/if}
	</div>
</section>
