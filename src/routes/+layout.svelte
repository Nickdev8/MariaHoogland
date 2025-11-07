<script lang="ts">
	import '../app.css';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import { page } from '$app/stores';
	import type { SiteContent } from '$lib/types/content';

	let { children, data } = $props<{
		children: () => unknown;
		data: { content: SiteContent };
	}>();

	const isAdminRoute = $derived($page.route.id?.startsWith('/admin') ?? false);
</script>

<div class="flex min-h-screen flex-col overflow-x-hidden bg-[#f5f7fb]">
	{#if !isAdminRoute}
		<Header content={data.content} />
	{/if}

	<main class={`flex-1 ${isAdminRoute ? '' : 'pt-20 sm:pt-22'}`}>
		{@render children()}
	</main>

	{#if !isAdminRoute}
		<Footer content={data.content} />
	{/if}
</div>
