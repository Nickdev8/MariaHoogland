<script lang="ts">
  import { Instagram, Linkedin } from '@lucide/svelte';

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio-amh' },
    { label: 'Contact', href: '/get-a-quote' },
  ];
</script>

<footer class="bg-secondary text-white mt-16">
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
        <a href="tel:+310612345678" class="hover:text-primary transition">
          +31 6 1234 5678
        </a>
      </p>
    </div>

    <!-- Socials -->
    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">Volg Ons</h5>
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
</footer>
