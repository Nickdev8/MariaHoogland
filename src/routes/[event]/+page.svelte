<script lang="ts">
  import type { Project } from '$lib/data/projects.ts';
  import { fade, scale } from 'svelte/transition';
  export let data: { project: Project };

  // Lightbox state
  let lightboxOpen = false;
  let selectedIndex = 0;
  const images = [data.project.mainImage, ...(data.project.gallery || [])];

  function openLightbox(index: number) {
    selectedIndex = index;
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  function showPrev() {
    selectedIndex = (selectedIndex - 1 + images.length) % images.length;
  }

  function showNext() {
    selectedIndex = (selectedIndex + 1) % images.length;
  }
</script>

<svelte:body class:overflow-hidden={lightboxOpen} />

<article class="container mx-auto p-6 md:p-10 bg-white rounded-2xl transition-colors">
  <!-- Main section: image + content -->
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Hero image -->
    <div class="lg:w-1/2">
      <figure>
        <img
          src={data.project.mainImage}
          alt={data.project.title}
          class="w-full aspect-video object-cover rounded-2xl shadow-lg cursor-pointer transition-transform duration-300"
          on:click={() => openLightbox(0)}
        />
        {#if data.project.caption}
          <figcaption class="mt-2 text-sm text-gray-600">{data.project.caption}</figcaption>
        {/if}
      </figure>
    </div>

    <!-- Details -->
    <div class="lg:w-1/2 flex flex-col justify-center space-y-6">
      <header>
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight text-black">
          {data.project.title}
        </h1>
        <p class="mt-2 text-lg text-gray-600">{data.project.subtitle}</p>
      </header>

      <!-- Description -->
      <div class="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed">
        {@html data.project.description}
      </div>
    </div>
  </div>

  <!-- Gallery thumbnails -->
  {#if data.project.gallery?.length}
    <section class="mt-12">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Gallery</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {#each data.project.gallery as thumb, idx}
          <button
            class="overflow-hidden rounded-lg shadow-2xl"
            on:click={() => openLightbox(idx + 1)}
          >
            <img
              src={thumb}
              alt="Thumbnail of {data.project.title}"
              class="w-full aspect-square object-cover transform hover:scale-110 cursor-pointer transition-transform duration-300"
            />
          </button>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Lightbox Modal -->
  {#if lightboxOpen}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      on:click|self={closeLightbox}
      tabindex="0"
      on:keydown={(e) => e.key === 'Escape' && closeLightbox()}
      transition:fade
    >
      <div class="relative max-w-4xl max-h-full p-4 mx-4">
        <button
          class="absolute top-2 right-2 text-white text-3xl focus:outline-none"
          aria-label="Close"
          on:click={closeLightbox}
        >&times;</button>

        <img
          src={images[selectedIndex]}
          alt="{data.project.title} image {selectedIndex + 1}"
          class="w-full h-auto rounded-lg shadow-2xl"
          transition:scale
        />

        <!-- Navigation -->
        <button
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl focus:outline-none"
          aria-label="Previous"
          on:click={showPrev}
        >&lsaquo;</button>
        <button
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl focus:outline-none"
          aria-label="Next"
          on:click={showNext}
        >&rsaquo;</button>
      </div>
    </div>
  {/if}
</article>