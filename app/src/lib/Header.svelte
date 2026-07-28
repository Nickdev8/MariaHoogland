<script lang="ts">
  import { page } from '$app/stores';
  import { Menu, X } from '@lucide/svelte';
  let isOpen = false;
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Over Mij', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' },
  ];
  const toggle = () => (isOpen = !isOpen);
  const isActive = (href: string, pathname: string) => href === '/' ? pathname === href : pathname.startsWith(href);
</script>

<header class="fixed inset-x-0 top-0 z-50 bg-[#555555]">
  <div class="flex h-16 items-center justify-between pr-5 md:pr-8">
    <a href="/" class="block self-start" aria-label="Architect Maria Hoogland">
      <img src="/images/HeaderLogo.png" alt="AMH logo" class="h-16 w-auto" />
    </a>

    <nav class="hidden items-center gap-7 md:flex">
      {#each links as { label, href }}
        <a
          href={href}
          class={`border-b py-1 text-sm transition-colors ${
            isActive(href, $page.url.pathname)
              ? 'border-white font-semibold text-white'
              : 'border-transparent text-white/75 hover:text-white'
          }`}
          aria-current={isActive(href, $page.url.pathname) ? 'page' : undefined}
        >
          {label}
        </a>
      {/each}
    </nav>

    <button
      class="inline-flex h-9 w-9 items-center justify-center border border-white/35 text-white md:hidden"
      aria-label={isOpen ? 'Sluit menu' : 'Open menu'}
      on:click={toggle}
    >
      {#if isOpen}
        <X size="18" />
      {:else}
        <Menu size="18" />
      {/if}
    </button>
  </div>

  {#if isOpen}
    <nav class="border-t border-white/15 bg-[#555555] px-5 py-3 md:hidden">
      {#each links as { label, href }}
        <a
          href={href}
          class={`block py-2 text-sm ${
            isActive(href, $page.url.pathname) ? 'font-semibold text-white' : 'text-white/75'
          }`}
          aria-current={isActive(href, $page.url.pathname) ? 'page' : undefined}
        >
          {label}
        </a>
      {/each}
    </nav>
  {/if}
</header>
