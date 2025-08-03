<script lang="ts">
  interface Project {
    title: string;
    subtitle: string;
    src: string;
    sublink: string;
  }

  interface ImageItem {
    src: string;
    alt: string;
  }

  const mainProjects: Project[] = [
    {
      title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
      subtitle:
        'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
      src: '/images/3-garagewoning-6-890x664.jpg',
      sublink: 'uitbouw'
    },
    {
      title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
      subtitle:
        'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
      src: '/images/3-garagewoning-6-890x664.jpg',
      sublink: 'uitbouw'
    },
    {
      title: 'Tijdloze Architectuur die Generaties Inspireert en Verbindt',
      subtitle:
        'Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.',
      src: '/images/3-garagewoning-6-890x664.jpg',
      sublink: 'uitbouw'
    },
  ];

  const underImages: ImageItem[] = [
    { src: '/images/hero.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
    { src: '/images/6-woning-ijburg-3-1-890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
    { src: '/images/3-garagewoning-6-890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
    { src: '/images/4-uitbouw-2--890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
    { src: '/images/hero.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
    { src: '/images/6-woning-ijburg-3-1-890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
    { src: '/images/3-garagewoning-6-890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
    { src: '/images/4-uitbouw-2--890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
  ];
</script>

<main class="space-y-20">
  <!-- Hero Section -->
  <section class="bg-white py-16">
    <div class="max-w-screen-xl mx-auto px-4 text-center mt-8">
      <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight">
        <span class="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Tijdloze Architectuur
        </span>
        die Generaties Inspireert en Verbindt
      </h1>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.
      </p>
    </div>
  </section>

  <!-- About Section -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 class="text-3xl font-bold text-secondary mb-4">Over Maria Hoogland</h2>
        <p class="text-gray-700">
          Ik ben Maria Hoogland, recht door zee, met duidelijke afspraken vooraf, en altijd scherp op de laatste ontwikkelingen in de sterk bewegende architectuurmarkt.
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <img
          src="/images/FotoAbout-1.jpg"
          alt="Maria Hoogland"
          class="rounded-lg shadow-lg w-full h-48 object-cover"
        />
        <img
          src="/images/4-uitbouw-2-1-1.jpg"
          alt="Een voorbeeldproject"
          class="rounded-lg shadow-lg w-full h-48 object-cover"
        />
      </div>
    </div>
  </section>

  <!-- Featured Projects -->
  {#if mainProjects.length}
    <section class="py-16">
      <div class="max-w-screen-xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-textcolor mb-12">Uitgelichte Projecten</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each mainProjects as project}
            <div class="group bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <img
                src={project.src}
                alt={project.title}
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="p-6 flex flex-col h-full">
                <h3 class="text-xl font-semibold text-black mb-2">{project.title}</h3>
                <p class="text-secondary flex-1 mb-4">{project.subtitle}</p>
                <a
                  href={project.sublink}
                  class="mt-auto inline-block font-medium text-primary hover:underline"
                >
                  Lees meer →
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- Gallery Section -->
  {#if underImages.length}
    <section class="py-16 bg-white">
      <div class="max-w-screen-xl mx-auto px-4">
        <h2 class="text-2xl font-semibold mb-6">Bonus Pictures</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {#each underImages as { src, alt }}
            <button type="button" class="focus:outline-none transform hover:scale-105 transition">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                class="rounded-lg shadow w-full h-40 object-cover"
              />
            </button>
          {/each}
        </div>
      </div>
    </section>
  {/if}
</main>
