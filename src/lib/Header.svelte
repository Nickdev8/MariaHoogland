<script lang="ts">
  let isOpen = false;
  const toggle = () => (isOpen = !isOpen);
</script>

<header class="fixed w-full bg-secondary shadow-md z-50 animate-fade-in-down">
  <div class="container flex items-center justify-between">
    <a href="/" class="flex items-center h-[-webkit-fill-available] items-start">
      <img src="/images/HeaderLogo.png" alt="AMH logo" class="h-14" />
    </a>

    <!-- desktop menu -->
    <nav class="hidden md:flex space-x-8 text-white py-4 px-6">
      {#each ['Home','Portfolio','Contact'] as label, i}
        <a
          href={label==='Home'?'/': label==='Portfolio'?'/portfolio-amh':'/get-a-quote'}
          class="relative inline-block py-1 font-medium text-white hover:text-gray-200 transition"
        >
          {label}
          <span class="absolute left-0 bottom-0 h-0.5 w-0 bg-white group-hover:w-full transition-all"></span>
        </a>
      {/each}
    </nav>

    <!-- mobile toggle -->
    <button
      class="md:hidden text-white focus:outline-none"
      aria-label="Toggle menu"
      on:click={toggle}
    >
      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path
          fill-rule="evenodd"
          d="M4 5h16M4 12h16M4 19h16"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>

  <!-- mobile menu -->
  <div class={`md:hidden bg-white px-6 pb-4 ${isOpen ? 'block' : 'hidden'}`}>
    <nav class="flex flex-col space-y-2">
      <a href="/" class="py-2 text-base font-medium text-white hover:text-gray-200">Home</a>
      <a href="/portfolio-amh" class="py-2 text-base font-medium text-white hover:text-gray-200">Portfolio</a>
      <a href="/get-a-quote" class="py-2 text-base font-medium text-white hover:text-gray-200">Contact</a>
    </nav>
  </div>
</header>
