<script lang="ts">
	import { Instagram, Linkedin } from '@lucide/svelte';
	import type { FooterContent } from '$lib/types/content';

	export let content: FooterContent;

	const resolveIcon = (value: string) => {
		if (value.toLowerCase() === 'linkedin') return Linkedin;
		return Instagram;
	};

	const credit = {
		name: 'Nick Esselman',
		website: 'https://nickesselman.nl',
		email: 'info@nickesselman.nl'
	};
</script>

<footer class="border-t border-secondary/20 bg-[#e8edf4] text-textcolor">
	<div class="mx-auto max-w-7xl px-6 py-14 lg:px-8">
		<div class="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
			<div>
				<h5 class="section-eyebrow">{content.aboutTitle}</h5>
				<p class="mt-4 max-w-sm text-sm leading-7 text-secondary">
					{content.aboutDescription}
				</p>
			</div>

			<div>
				<h5 class="section-eyebrow">Snelle Links</h5>
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
				<div class="mt-4 space-y-2 text-sm text-secondary">
					<p>
						<a
							href={`mailto:${content.contactEmail}`}
							class="transition-colors hover:text-textcolor"
						>
							{content.contactEmail}
						</a>
					</p>
					<p>
						<a href={`tel:${content.contactPhone}`} class="transition-colors hover:text-textcolor">
							{content.contactPhone}
						</a>
					</p>
				</div>
			</div>

			<div>
				<h5 class="section-eyebrow">Volg Mij</h5>
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
			>. Contact:
			<a
				href={`mailto:${credit.email}`}
				class="font-semibold text-textcolor transition-colors hover:text-secondary"
				>{credit.email}</a
			>
		</div>
	</div>
</footer>
