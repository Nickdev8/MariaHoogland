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

<div class="min-h-screen bg-paper text-textcolor">
	<header class="border-b border-line bg-white">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-8">
			<div>
				<p class="text-sm text-secondary">Maria Hoogland</p>
				<h1 class="mt-1 text-xl font-semibold text-textcolor">{title}</h1>
				{#if subtitle}
					<p class="mt-1 text-sm text-secondary">{subtitle}</p>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				<a
					href="/"
					class="plain-action"
				>
					Bekijk site
				</a>
				<form method="post" action="/admin?/logout">
					<button
						type="submit"
						class="plain-action"
					>
						Log uit
					</button>
				</form>
			</div>
		</div>

		<div class="mx-auto max-w-7xl px-5 pb-3 lg:px-8">
			<nav class="flex flex-wrap gap-1">
				{#each links as link}
					<a
						href={link.href}
						class={`border px-3 py-2 text-sm transition-colors ${
							active === link.key
								? 'border-primary bg-primary text-white'
								: 'border-line bg-white text-secondary hover:text-textcolor'
						}`}
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-5 py-8 lg:px-8">
		<slot />
	</main>
</div>
