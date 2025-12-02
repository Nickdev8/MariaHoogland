<script lang="ts">
	import { Instagram, Linkedin } from '@lucide/svelte';
	import type { SiteContent } from '$lib/types/content';

let { content } = $props<{ content: SiteContent }>();

	const logoWordmark = content.brand.logoWordmark ?? content.brand.logo;
	const logoMark = content.brand.logoMark ?? logoWordmark;

	const socials = content.brand.socials;
	const quickLinks = content.footer.quickLinks;
</script>

<footer class="mt-20 bg-[#1f2730] text-white">
	<div class="mx-auto max-w-7xl px-6 py-14 sm:py-18">
		<div class="grid gap-10 lg:grid-cols-[1.2fr,1fr] lg:items-start lg:gap-14">
			<div class="space-y-6">
				<a href="/" class="inline-flex items-center gap-3">
					<img src={logoWordmark} alt="AMH | Architect Maria Hoogland" class="hidden h-12 w-auto sm:block" />
					<span class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 p-2 ring-1 ring-white/10 sm:hidden">
						<img src={logoMark} alt="AMH" class="h-full w-full object-contain" />
					</span>
					<div class="flex flex-col leading-tight">
						<span class="font-display text-sm font-semibold text-primary">{content.brand.owner}</span>
						<span class="text-xs text-white/60">{content.brand.tagline}</span>
					</div>
				</a>
				<p class="max-w-2xl text-sm leading-relaxed text-white/70">{content.footer.tagline}</p>
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

			<div class="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-2">
				<div class="space-y-4">
					<h3 class="font-display text-sm font-semibold text-white/70">Navigatie</h3>
					<ul class="space-y-3 text-sm font-semibold text-white/80">
						{#each quickLinks as { label, href }}
							<li>
								<a href={href} class="transition hover:text-white">{label}</a>
							</li>
						{/each}
					</ul>
				</div>

				<div class="space-y-4">
					<h3 class="font-display text-sm font-semibold text-white/70">Contact</h3>
					<ul class="space-y-3 text-sm text-white/80">
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
					<ul class="mt-6 space-y-2 text-xs text-white/50">
						{#each content.brand.registration as line}
							<li>{line}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="border-t border-white/10">
		<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/60 sm:flex-row sm:text-sm">
			<span>{content.brand.company} © {new Date().getFullYear()}</span>
			<div class="flex flex-wrap items-center gap-3">
				<a href={content.footer.credits.href} target="_blank" rel="noreferrer" class="transition hover:text-white">
					{content.footer.credits.label}
				</a>
				<a href={content.footer.credits.contactHref} class="transition hover:text-white">
					{content.footer.credits.contactLabel}
				</a>
			</div>
		</div>
	</div>
</footer>
