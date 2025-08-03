<script lang="ts">
  import { Menu } from '@lucide/svelte';
  let isOpen = false;
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio-amh' },
    { label: 'Contact', href: '/get-a-quote' },
  ];
  const toggle = () => (isOpen = !isOpen);
</script>

<header class="fixed inset-x-0 top-0 z-50 bg-secondary shadow-md animate-fade-in-down">
  <div class="flex items-center justify-between pr-4 md:pr-8">
    <!-- logo flush to corner -->
    <a href="/" class="flex-shrink-0">
      <img src="/images/HeaderLogo.png" alt="AMH logo" class="h-14" />
    </a>

    <!-- desktop nav -->
    <nav class="hidden md:flex space-x-8">
      {#each links as { label, href }}
        <a
          href={href}
          class="relative font-medium text-white hover:text-primary transition"
        >
          {label}
          <span class="absolute bottom-0 left-0 block h-0.5 w-0 bg-white transition-all group-hover:w-full"></span>
        </a>
      {/each}
    </nav>

    <!-- mobile toggle -->
    <button
      class="md:hidden focus:outline-none text-white"
      aria-label="Toggle menu"
      on:click={toggle}
    >
      <Menu size="24" />
    </button>
  </div>

  <!-- mobile menu -->
  {#if isOpen}
    <nav class="md:hidden bg-secondary px-4 pb-4">
      {#each links as { label, href }}
        <a
          href={href}
          class="block py-2 text-base font-medium text-white hover:text-gray-200 transition"
        >
          {label}
        </a>
      {/each}
    </nav>
  {/if}
</header>
