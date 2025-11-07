<script lang="ts">
  import { Instagram, Linkedin } from '@lucide/svelte';

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' },
  ];
</script>

<footer class="bg-secondary text-white mt-4">
  <div class="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    <!-- About -->
    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">Architectuur AMH</h5>
      <p class="text-sm leading-relaxed">
        Karaktervolle woningen en verrassende verbouwingen, met passie en plezier ontworpen door Maria Hoogland.
      </p>
    </div>

    <!-- Quick Links -->
    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">Snelle Links</h5>
      <ul class="space-y-2">
        {#each quickLinks as { label, href }}
          <li>
            <a
              href={href}
              class="inline-block text-base hover:text-primary transition"
            >
              {label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Contact -->
    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">Contact</h5>
      <p class="text-base">
        <a href="mailto:info@mariahoogland.nl" class="hover:text-primary transition">
          info@mariahoogland.nl
        </a>
      </p>
      <p class="text-base">
        <a href="tel:+31645776092" class="hover:text-primary transition">
          +31 6 457 760 92
        </a>
      </p>
    </div>

    <!-- Socials -->
    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">Volg Mij</h5>
      <div class="flex justify-center md:justify-start items-center space-x-6">
        <a
          href="https://nl.linkedin.com/in/maria-hoogland-499ab1b2"
          target="_blank"
          class="p-2 rounded-full hover:bg-primary/20 transition"
          aria-label="LinkedIn"
        >
          <Linkedin size="24" />
        </a>
        <a
          href="https://www.instagram.com/architect_amh/"
          target="_blank"
          class="p-2 rounded-full hover:bg-primary/20 transition"
          aria-label="Instagram"
        >
          <Instagram size="24" />
        </a>
      </div>
    </div>
  </div>
  <div class="border-t border-gray-600 py-4">
    <div class="container mx-auto px-4 text-center text-sm text-gray-300">
      <p>
        Website gemaakt door
        <a
          href="https://nickesselman.nl"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium hover:text-white transition"
        >
          Nick Esselman</a
        >. Contact:
        <a href="mailto:info@nickesselman.nl" class="font-medium hover:text-white transition"
          >info@nickesselman.nl</a
        >
      </p>
    </div>
  </div>
</footer>
