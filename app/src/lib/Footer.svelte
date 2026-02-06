<script lang="ts">
  import { Instagram, Linkedin } from '@lucide/svelte';
  import type { FooterContent } from '$lib/types/content';

  export let content: FooterContent;

  const resolveIcon = (value: string) => {
    if (value.toLowerCase() === 'linkedin') return Linkedin;
    return Instagram;
  };
</script>

<footer class="bg-secondary text-white mt-4">
  <div class="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">{content.aboutTitle}</h5>
      <p class="text-sm leading-relaxed">
        {content.aboutDescription}
      </p>
    </div>

    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">Snelle Links</h5>
      <ul class="space-y-2">
        {#each content.quickLinks as { label, href }}
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

    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">Contact</h5>
      <p class="text-base">
        <a href={`mailto:${content.contactEmail}`} class="hover:text-primary transition">
          {content.contactEmail}
        </a>
      </p>
      <p class="text-base">
        <a href={`tel:${content.contactPhone}`} class="hover:text-primary transition">
          {content.contactPhone}
        </a>
      </p>
    </div>

    <div class="text-center md:text-left">
      <h5 class="text-primary text-xl font-semibold mb-3">Volg Mij</h5>
      <div class="flex justify-center md:justify-start items-center space-x-6">
        {#each content.socials as social}
          <a
            href={social.href}
            target="_blank"
            class="p-2 rounded-full hover:bg-primary/20 transition"
            aria-label={social.label}
            rel="noopener noreferrer"
          >
            <svelte:component this={resolveIcon(social.icon)} size="24" />
          </a>
        {/each}
      </div>
    </div>
  </div>
  <div class="border-t border-gray-600 py-4">
    <div class="container mx-auto px-4 text-center text-sm text-gray-300">
      <p>
        Website gemaakt door
        <a
          href={content.credit.website}
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium hover:text-white transition"
        >
          {content.credit.name}</a
        >. Contact:
        <a href={`mailto:${content.credit.email}`} class="font-medium hover:text-white transition"
          >{content.credit.email}</a
        >
      </p>
    </div>
  </div>
</footer>
