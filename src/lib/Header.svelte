<script lang="ts">
  import { fly } from 'svelte/transition';
  let isOpen = false;
  const toggle = () => (isOpen = !isOpen);
</script>

<style>
  /* Ensure logo is flush to the top-left */
  .logo-link {
    margin: 0;
    padding: 0;
  }
</style>

<header class="fixed top-0 left-0 right-0 bg-secondary shadow-md z-50 animate-fade-in-down">
  <div class="max-w-screen-xl mx-auto flex items-center justify-between px-0">
    <!-- Logo: flush to top-left -->
    <a href="/" class="logo-link flex items-start">
      <img src="/images/HeaderLogo.png" alt="AMH logo" class="h-14" />
    </a>

    <!-- Desktop nav -->
    <nav class="hidden md:flex space-x-8 py-4">
      {#each ['Home', 'Portfolio', 'Contact'] as label}
        <a
          href={
            label === 'Home'
              ? '/'
              : label === 'Portfolio'
              ? '/portfolio-amh'
              : '/get-a-quote'
          }
          class="group relative inline-block py-1 font-medium text-white hover:text-gray-200 transition"
        >
          {label}
          <span class="absolute left-0 bottom-0 h-0.5 w-0 bg-white group-hover:w-full transition-all"></span>
        </a>
      {/each}
    </nav>

    <!-- Mobile toggle -->
    <button
      class="md:hidden text-white p-4 focus:outline-none"
      aria-label="Toggle menu"
      on:click={toggle}
    >
      {#if !isOpen}
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M4 5h16M4 12h16M4 19h16" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M6 18L18 6M6 6l12 12" clip-rule="evenodd" />
        </svg>
      {/if}
    </button>
  </div>

  <!-- Mobile menu -->
  {#if isOpen}
    <nav
      class="md:hidden bg-secondary text-white px-6 pb-4"
      transition:fly={{ y: -10, duration: 200 }}
    >
      {#each [
        { label: 'Home', href: '/' },
        { label: 'Portfolio', href: '/portfolio-amh' },
        { label: 'Contact', href: '/get-a-quote' }
      ] as item}
        <a
          href={item.href}
          class="block py-2 text-base font-medium hover:text-gray-200 transition"
          on:click={() => (isOpen = false)}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  {/if}
</header>