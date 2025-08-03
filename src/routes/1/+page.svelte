<script lang="ts">
	const mainProjects = [
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
		}
	];

	const underImages = [
		{ src: '/images/hero.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
		{
			src: '/images/6-woning-ijburg-3-1-890x664.jpg',
			alt: 'Moderne architectuur met grote glaspartijen'
		},
		{
			src: '/images/3-garagewoning-6-890x664.jpg',
			alt: 'Moderne architectuur met grote glaspartijen'
		},
		{ src: '/images/4-uitbouw-2--890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
		{ src: '/images/hero.jpg', alt: 'Moderne architectuur met grote glaspartijen' },
		{
			src: '/images/6-woning-ijburg-3-1-890x664.jpg',
			alt: 'Moderne architectuur met grote glaspartijen'
		},
		{
			src: '/images/3-garagewoning-6-890x664.jpg',
			alt: 'Moderne architectuur met grote glaspartijen'
		},
		{ src: '/images/4-uitbouw-2--890x664.jpg', alt: 'Moderne architectuur met grote glaspartijen' }
	];
</script>

<!-- Hero Section -->
<section class="bg-white py-16">
	<div class="mx-auto max-w-screen-xl px-4 text-center">
		<h1 class="text-4xl leading-tight font-extrabold sm:text-5xl">
			<span class="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
				Tijdloze Architectuur
			</span>
			die Generaties Inspireert en Verbindt
		</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
			Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of
			nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.
		</p>
	</div>
</section>

<!-- About Section -->
<section class="bg-gray-50 py-16">
	<div class="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2">
		<div>
			<h2 class="mb-4 text-3xl font-bold text-secondary">Over Maria Hoogland</h2>
			<p class="text-gray-700">
				Ik ben Maria Hoogland, recht door zee, met duidelijke afspraken vooraf, en altijd scherp op
				de laatste ontwikkelingen in de sterk bewegende architectuurmarkt.
			</p>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<img
				src="/images/FotoAbout-1.jpg"
				alt="Maria Hoogland"
				class="h-48 w-full rounded-lg object-cover shadow-lg"
			/>
			<img
				src="/images/4-uitbouw-2-1-1.jpg"
				alt="Een voorbeeldproject"
				class="h-48 w-full rounded-lg object-cover shadow-lg"
			/>
		</div>
	</div>
</section>
{#if mainProjects.length}
	<section
		class="bg-cover bg-left bg-no-repeat py-16"
		style="background-image: url('/images/mainbackgroundimage.png')"
	>
		<div class="mx-auto max-w-screen-xl px-4">
			<h2 class="mb-12 text-center text-4xl font-extrabold tracking-wide text-textcolor">
				Uitgelichte Projecten
			</h2>
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each mainProjects as project}
					<a
						href={project.sublink}
						class="group block transform overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-2xl"
					>
						<div class="relative overflow-hidden">
							<img
								src={project.src}
								alt={project.title}
								class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<!-- gradient overlay -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-50"
							/>
						</div>
						<div class="flex h-full flex-col p-6">
							<h3
								class="mb-2 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-black"
							>
								{project.title}
							</h3>
							<p class="mb-6 line-clamp-3 flex-1 text-gray-600">
								{project.subtitle}
							</p>
							<span
								class="inline-block translate-y-2 font-medium text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
							>
								Lees meer →
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Gallery Section -->
{#if underImages.length}
	<section class="bg-white py-16">
		<div class="mx-auto max-w-screen-xl px-4">
			<h2 class="mb-6 text-2xl font-semibold">Pictures</h2>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
				{#each underImages as { src, alt }}
					<button type="button" class="transform transition hover:scale-105 focus:outline-none">
						<img {src} {alt} loading="lazy" class="h-40 w-full rounded-lg object-cover shadow" />
					</button>
				{/each}
			</div>
		</div>
	</section>
{/if}
