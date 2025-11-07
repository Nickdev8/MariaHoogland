<script lang="ts">
	import { Instagram, Linkedin } from '@lucide/svelte';
	import type { SiteContent } from '$lib/types/content';

	let { content } = $props<{ content: SiteContent }>();

	const socials = content.brand.socials;
	const quickLinks = content.footer.quickLinks;
</script>

<footer class="mt-20 bg-neutral-950 text-white">
	<div
		class="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:grid lg:grid-cols-[1.1fr,0.9fr,0.9fr] lg:items-start lg:gap-16"
	>
		<div class="space-y-5">
			<a href="/" class="inline-flex items-center gap-3">
				<img src={content.brand.logo} alt={content.brand.company} class="h-12 w-auto" />
				<div class="flex flex-col leading-tight">
					<span class="font-display text-sm font-semibold uppercase tracking-[0.35em] text-primary"
						>{content.brand.owner}</span
					>
					<span class="text-xs uppercase tracking-[0.25em] text-white/50">{content.brand.tagline}</span>
				</div>
			</a>
			<p class="max-w-md text-sm leading-relaxed text-white/70">{content.footer.tagline}</p>
			<div class="flex flex-wrap gap-3">
				{#each socials as social}
					{#if social.icon === 'linkedin'}
						<a
							href={social.href}
							target="_blank"
							rel="noreferrer"
							class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white hover:bg-white/20"
							aria-label={social.label}
						>
							<Linkedin class="h-5 w-5" />
						</a>
					{:else if social.icon === 'instagram'}
						<a
							href={social.href}
							target="_blank"
							rel="noreferrer"
							class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white hover:bg-white/20"
							aria-label={social.label}
						>
							<Instagram class="h-5 w-5" />
						</a>
					{/if}
				{/each}
			</div>
		</div>

		<div class="mt-12 space-y-4 lg:mt-0">
			<h3 class="font-display text-sm uppercase tracking-[0.35em] text-white/60">Navigatie</h3>
			<ul class="space-y-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
				{#each quickLinks as { label, href }}
					<li>
						<a href={href} class="transition hover:text-white">{label}</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="mt-12 space-y-4 lg:mt-0">
			<h3 class="font-display text-sm uppercase tracking-[0.35em] text-white/60">Contact</h3>
			<ul class="space-y-3 text-sm text-white/70">
				<li>
					<a href={`mailto:${content.brand.contact.email}`} class="transition hover:text-white"
						>{content.brand.contact.email}</a
					>
				</li>
				<li>
					<a href={`tel:${content.brand.contact.phone.replace(/\\s+/g, '')}`} class="transition hover:text-white"
						>{content.brand.contact.phone}</a
					>
				</li>
				<li class="text-white/60">{content.brand.contact.address}</li>
			</ul>
			<ul class="mt-6 space-y-2 text-xs uppercase tracking-[0.25em] text-white/40">
				{#each content.brand.registration as line}
					<li>{line}</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="border-t border-white/10">
		<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs uppercase tracking-[0.25em] text-white/40 sm:flex-row">
			<span>{content.brand.company} © {new Date().getFullYear()}</span>
			<a href={content.footer.credits.href} target="_blank" rel="noreferrer" class="transition hover:text-white">
				{content.footer.credits.label}
			</a>
			<a href={content.footer.credits.contactHref} class="transition hover:text-white">
				{content.footer.credits.contactLabel}
			</a>
		</div>
	</div>
</footer>
