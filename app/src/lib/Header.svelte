<script lang="ts">
import { Menu } from '@lucide/svelte';
import type { SiteContent } from '$lib/types/content';

let { content } = $props<{ content: SiteContent }>();
let isOpen = $state(false);

	const links = content.navigation.links;

const toggle = () => {
	isOpen = !isOpen;
};

const close = () => {
	isOpen = false;
};
</script>

<header class="fixed inset-x-0 top-0 z-50 bg-neutral-950/95 text-white shadow-md">
	<div class="flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
		<a href="/" class="flex flex-shrink-0 items-center">
			<img src={content.brand.logo} alt={content.brand.company} class="h-14 w-auto" />
		</a>

		<nav class="hidden items-center space-x-8 md:flex">
			{#each links as { label, href }}
				<a
					href={href}
					class="relative text-sm font-medium uppercase tracking-[0.28em] text-white/70 transition hover:text-white"
				>
					{label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-3">
			<a
				href="/contact"
				class="hidden rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-950 transition hover:bg-primary-strong hover:text-white md:inline-flex"
			>
				Plaats aanvraag
			</a>
		<button
			class="inline-flex items-center justify-center rounded-full border border-white/30 p-2 text-white transition hover:border-white hover:bg-white/10 md:hidden"
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
			<div class="space-y-1 border-t border-white/10 bg-neutral-950/95 px-4 pb-4 text-sm text-white">
				{#each links as { label, href }}
					<a href={href} class="block py-2 font-semibold uppercase tracking-[0.3em]" onclick={close}>
						{label}
					</a>
				{/each}
				<a
					href="tel:0645776029"
					class="mt-3 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-950 transition hover:bg-primary-strong hover:text-white"
					onclick={close}
				>
					Bel direct
				</a>
			</div>
		</nav>
	{/if}
</header>
