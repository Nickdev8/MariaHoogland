<script lang="ts">
  import '../app.css';
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
  <Header />

  <main class="pt-20 md:pt-16 flex-1">
    {@render children()}
  </main>

  <Footer />
</div>
