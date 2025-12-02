<script lang="ts">
import { Menu } from '@lucide/svelte';
import type { SiteContent } from '$lib/types/content';

let { content } = $props<{ content: SiteContent }>();
let isOpen = $state(false);

	const links = content.navigation.links;
	const logoWordmark = content.brand.logoWordmark ?? content.brand.logo;
	const logoMark = content.brand.logoMark ?? logoWordmark;

const toggle = () => {
	isOpen = !isOpen;
};

const close = () => {
	isOpen = false;
};
</script>

<header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#1f2730]/95 text-white backdrop-blur">
	<div class="flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
		<a href="/" class="flex flex-shrink-0 items-center gap-3">
			<span class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 p-2 ring-1 ring-white/10 sm:hidden">
				<img src={logoMark} alt="AMH" class="h-full w-full object-contain" />
			</span>
			<img src={logoWordmark} alt="AMH | Architect Maria Hoogland" class="hidden h-12 w-auto sm:block" />
			<div class="hidden flex-col text-left leading-tight sm:flex">
				<span class="font-display text-sm font-semibold text-white">{content.brand.company}</span>
				<span class="text-xs text-white/60">{content.brand.tagline}</span>
			</div>
		</a>

		<nav class="hidden items-center space-x-7 md:flex">
			{#each links as { label, href }}
				<a
					href={href}
					class="text-sm font-semibold text-white/80 transition hover:text-white"
				>
					{label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-3">
			<a
				href="/contact"
				class="hidden rounded-full border border-white/20 bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:border-white/40 hover:bg-primary-strong md:inline-flex"
			>
				Plaats aanvraag
			</a>
		<button
			class="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 p-2 text-white transition hover:border-white/60 hover:bg-white/15 md:hidden"
			onclick={toggle}
			aria-expanded={isOpen}
			aria-controls="mobile-nav"
		>
				{#if isOpen}
					<span class="text-lg leading-none">×</span>
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</button>
		</div>
	</div>

	{#if isOpen}
		<nav id="mobile-nav" class="md:hidden">
			<div class="space-y-1 border-t border-white/10 bg-[#1f2730]/95 px-4 pb-4 text-sm text-white shadow-md">
				{#each links as { label, href }}
					<a href={href} class="block py-2 font-semibold" onclick={close}>
						{label}
					</a>
				{/each}
				<a
					href="tel:0645776029"
					class="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
					onclick={close}
				>
					Bel direct
				</a>
			</div>
		</nav>
	{/if}
</header>
