<script lang="ts">
	import { onMount } from 'svelte';
	import { ExternalLink, Instagram, Linkedin } from '@lucide/svelte';
	import { revealContactDetail } from '$lib/obfuscation';
	import type { FooterContent } from '$lib/types/content';

	export let content: FooterContent;

	const resolveIcon = (value: string) => {
		if (value.toLowerCase() === 'linkedin') return Linkedin;
		return Instagram;
	};

	const credit = {
		name: 'Nick Esselman',
		website: 'https://nickesselman.nl'
	};
	let detailsReady = false;
	$: email = detailsReady ? revealContactDetail(content.contactEmail) : '';
	$: emailParts = email.split('@');
	$: phone = detailsReady ? revealContactDetail(content.contactPhone) : '';
	$: phoneParts = phone.split(' ');

	onMount(() => {
		detailsReady = true;
	});
</script>

<footer class="border-t border-secondary/20 bg-[#e8edf4] text-textcolor">
	<div class="mx-auto max-w-7xl px-6 py-14 lg:px-8">
		<div class="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
			<div>
				<h5 class="section-eyebrow">{content.aboutTitle}</h5>
			</div>

			<div>
				<h5 class="section-eyebrow">Snelle links</h5>
				<ul class="mt-4 space-y-2">
					{#each content.quickLinks as { label, href }}
						<li>
							<a {href} class="site-link">{label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h5 class="section-eyebrow">Contact</h5>
				{#if detailsReady}
					<div class="mt-4 space-y-2 text-sm text-secondary">
						<p>
							<a href={`mailto:${email}`} class="transition-colors hover:text-textcolor"
								><span>{emailParts[0]}</span><span aria-hidden="true">@</span><span
									>{emailParts[1]}</span
								></a
							>
						</p>
						<p>
							<a
								href={`tel:${phone}`}
								class="flex flex-wrap gap-x-1 transition-colors hover:text-textcolor"
								>{#each phoneParts as part}<span>{part}</span>{/each}</a
							>
						</p>
					</div>
				{/if}
			</div>

			<div>
				<h5 class="section-eyebrow">Volg mij</h5>
				<div class="mt-4 flex items-center gap-3">
					{#each content.socials as social}
						<a
							href={social.href}
							target="_blank"
							class="inline-flex h-10 w-10 items-center justify-center border border-secondary/30 text-secondary transition-colors hover:border-secondary hover:text-textcolor"
							aria-label={social.label}
							rel="noopener noreferrer"
						>
							<svelte:component this={resolveIcon(social.icon)} size="18" />
						</a>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-12 border-t border-secondary/20 pt-5 text-xs text-secondary">
			Website gemaakt door
			<a
				href={credit.website}
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-textcolor transition-colors hover:text-secondary">{credit.name}</a
			>. <a
				href={credit.website}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1 font-semibold text-textcolor transition-colors hover:text-secondary"
				>nickesselman.nl <ExternalLink size={13} aria-hidden="true" /></a
			>
		</div>
	</div>
</footer>
