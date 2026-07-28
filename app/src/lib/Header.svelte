<script lang="ts">
	import { page } from '$app/stores';
	import { Menu } from '@lucide/svelte';
	let isOpen = false;
	let hoveredHref: string | null = null;
	const links = [
		{ label: 'Home', href: '/' },
		{ label: 'Over Mij', href: '/about' },
		{ label: 'Portfolio', href: '/portfolio' },
		{ label: 'Contact', href: '/contact' }
	];
	const toggle = () => (isOpen = !isOpen);
	const isActive = (href: string, pathname: string) =>
		href === '/' ? pathname === href : pathname.startsWith(href);
	const showActiveUnderline = (href: string, pathname: string) =>
		isActive(href, pathname) && (!hoveredHref || hoveredHref === href);
</script>

<header class="animate-fade-in-down fixed inset-x-0 top-0 z-50 bg-secondary shadow-md">
	<div class="flex items-center justify-between pr-4 md:pr-8">
		<a href="/" class="flex-shrink-0">
			<img src="/images/brand/header-logo.png" alt="AMH logo" class="h-14" />
		</a>

		<nav class="hidden space-x-8 md:flex">
			{#each links as { label, href }}
				<a
					{href}
					class="group relative font-light tracking-wider text-white transition hover:text-primary"
					aria-current={isActive(href, $page.url.pathname) ? 'page' : undefined}
					on:mouseenter={() => (hoveredHref = href)}
					on:mouseleave={() => (hoveredHref = null)}
				>
					{label}
					<span
						class="absolute -bottom-0.5 left-0 block h-px transition-all duration-300 {showActiveUnderline(
							href,
							$page.url.pathname
						)
							? 'w-full bg-white'
							: 'w-0 bg-primary group-hover:w-full'}"
					></span>
				</a>
			{/each}
		</nav>

		<button
			class="text-white focus:outline-none md:hidden"
			aria-label="Toggle menu"
			on:click={toggle}
		>
			<Menu size="24" />
		</button>
	</div>

	{#if isOpen}
		<nav class="bg-secondary px-4 pb-4 md:hidden">
			{#each links as { label, href }}
				<a
					{href}
					class="block py-2 text-sm font-light tracking-wider text-white transition hover:text-primary {isActive(
						href,
						$page.url.pathname
					)
						? 'underline underline-offset-4'
						: ''}"
					aria-current={isActive(href, $page.url.pathname) ? 'page' : undefined}
				>
					{label}
				</a>
			{/each}
		</nav>
	{/if}
</header>
