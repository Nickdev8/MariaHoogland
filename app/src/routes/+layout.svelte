<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import type { LayoutData } from './$types';

	const { children, data } = $props<{ children: () => unknown; data: LayoutData }>();
</script>

<svelte:head>
	{#if data?.canonical}
		<link rel="canonical" href={data.canonical} />
		<meta property="og:url" content={data.canonical} />
		<meta name="twitter:url" content={data.canonical} />
	{/if}
</svelte:head>

<div class="flex min-h-screen flex-col overflow-x-hidden">
	{#if !$page.url.pathname.startsWith('/admin')}
		<Header />
	{/if}

	<main class={`flex-1 ${$page.url.pathname.startsWith('/admin') ? '' : 'pt-14'}`}>
		{@render children()}
	</main>

	{#if data?.footer && !$page.url.pathname.startsWith('/admin')}
		<Footer content={data.footer} />
	{/if}
</div>
