<script lang="ts">
	export let title: string;
	export let subtitle = '';
	export let active:
		| 'dashboard'
		| 'home'
		| 'about'
		| 'portfolio'
		| 'contact'
		| 'footer' = 'dashboard';

	const links = [
		{ key: 'dashboard', label: 'Dashboard', href: '/admin' },
		{ key: 'home', label: 'Home', href: '/admin/home' },
		{ key: 'about', label: 'Over mij', href: '/admin/about' },
		{ key: 'portfolio', label: 'Portfolio', href: '/admin/portfolio' },
		{ key: 'contact', label: 'Contact', href: '/admin/contact' },
		{ key: 'footer', label: 'Footer', href: '/admin/footer' }
	] as const;
</script>

<div class="min-h-screen bg-[#f5f7fb] text-neutral-900">
	<header class="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
			<div>
				<p class="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-400">Maria Hoogland</p>
				<h1 class="mt-1 text-xl font-semibold tracking-tight text-neutral-950">{title}</h1>
				{#if subtitle}
					<p class="mt-1 text-sm text-neutral-500">{subtitle}</p>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				<a
					href="/"
					class="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600 transition hover:border-neutral-400"
				>
					Bekijk site
				</a>
				<form method="post" action="/admin?/logout">
					<button
						type="submit"
						class="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600 transition hover:border-neutral-400"
					>
						Log uit
					</button>
				</form>
			</div>
		</div>

		<div class="mx-auto max-w-7xl px-6 pb-4">
			<nav class="flex flex-wrap gap-2">
				{#each links as link}
					<a
						href={link.href}
						class={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition ${
							active === link.key
								? 'bg-secondary text-white'
								: 'border border-black/10 bg-white text-neutral-600 hover:border-neutral-400'
						}`}
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-6 py-8">
		<slot />
	</main>
</div>
