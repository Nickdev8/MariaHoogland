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

<div class="flex flex-col min-h-screen overflow-x-hidden">
  {#if !$page.url.pathname.startsWith('/admin')}
    <Header />
  {/if}

  <main class="pt-14 flex-1">
    {@render children()}
  </main>

  {#if data?.footer}
    <Footer content={data.footer} />
  {/if}
</div>
