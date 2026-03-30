<script lang="ts">
  import { Menu, X } from '@lucide/svelte';
  import { page } from '$app/stores';

  let isOpen = false;

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Over Mij', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' }
  ];

  const toggle = () => (isOpen = !isOpen);
  const closeMenu = () => (isOpen = false);

  const isActive = (href: string, pathname: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };
</script>

<header class="fixed inset-x-0 top-0 z-50 border-b border-primary/20 bg-secondary backdrop-blur-sm">
  <div class="section-wrap flex h-20 items-center justify-between">
    <a href="/" class="flex-shrink-0" on:click={closeMenu}>
      <img src="/images/HeaderLogo.png" alt="AMH logo" class="h-14" />
    </a>

    <nav class="hidden items-center gap-8 md:flex">
      {#each links as { label, href }}
        {@const active = isActive(href, $page.url.pathname)}
        <a
          href={href}
          class={`group relative pb-1 text-[0.74rem] font-semibold uppercase tracking-[0.2em] transition-colors ${active ? 'text-primary' : 'text-white/85 hover:text-white'}`}
        >
          {label}
          <span
            class={`absolute inset-x-0 -bottom-0.5 h-px transition-colors ${active ? 'bg-primary' : 'bg-transparent group-hover:bg-primary'}`}
          ></span>
        </a>
      {/each}
    </nav>

    <button
      class="inline-flex items-center justify-center border border-white/35 p-2 text-white transition-colors hover:border-white hover:text-primary md:hidden"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      on:click={toggle}
    >
      {#if isOpen}
        <X size="20" />
      {:else}
        <Menu size="20" />
      {/if}
    </button>
  </div>

  {#if isOpen}
    <nav class="border-t border-white/20 bg-secondary md:hidden">
      <div class="section-wrap py-4">
        <ul class="space-y-1">
          {#each links as { label, href }}
            {@const active = isActive(href, $page.url.pathname)}
            <li>
              <a
                href={href}
                class={`block border-l-2 py-2 pl-3 text-sm font-semibold uppercase tracking-[0.14em] ${active ? 'border-primary text-primary' : 'border-transparent text-white/85'}`}
                on:click={closeMenu}
              >
                {label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </nav>
  {/if}
</header>
