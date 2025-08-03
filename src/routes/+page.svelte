<script lang="ts">
	// If you only use `data` for external props, switch to `export const data`
	export let data: {
		mainProjects: typeof import('$lib/data/projects.ts').mainProjects;
	};

	interface UnderImage {
		src: string;
		alt: string;
	}

	/**
	 * IMPORTANT: Vite’s `import.meta.glob` only processes files under `src/`, not the `static/` (public)
	 * Move your `images/projects` folder to `src/lib/mainpageimages` (or similar) so glob can see them.
	 */
	const modules = import.meta.glob('/src/lib/mainpageimages/*.{jpg,png,webp}', {
		// Eagerly load and get the raw URL string from each asset
		query: '?url',
		import: 'default',
		eager: true
	}) as Record<string, string>;

	// Convert the imported URLs into our { src, alt } format
	const underImages: UnderImage[] = Object.values(modules).map((src) => ({
		src,
		alt: friendlyAlt(src)
	}));

	// Debug: log to verify we actually have entries
	console.log('Loaded underImages:', underImages);

	/**
	 * Generate a human-friendly alt from the filename
	 * E.g. "garagewoning.jpg" → "Garagewoning"
	 */
	function friendlyAlt(src: string) {
		const file = src.split('/').pop() || '';
		const name = file.replace(/\.[^.]+$/, '');
		return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>

<div
	style="
			background-image: url('/images/mainbg.png');
			background-position: center left;
			background-repeat: no-repeat;"
>
	<!-- Hero Section -->
	<section class="bg-white py-16">
		<div class="mx-auto max-w-screen-xl px-4 text-center">
			<h1 class="text-4xl leading-tight font-extrabold sm:text-5xl">
				<span class="bg-gradient-to-r from-[#00eeee] to-[#00cccc] bg-clip-text text-transparent">
					Architect
				</span>
				Maria Hoogland
			</h1>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
				Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of
				nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.
			</p>
		</div>
	</section>

	<!-- About Section -->
	<section class="py-16">
		<div class="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2">
			<div>
				<h2 class="mb-4 text-3xl font-bold text-secondary">Over Maria Hoogland</h2>
				<p class="text-gray-700">
					Ik ben Maria Hoogland, recht door zee, met duidelijke afspraken vooraf, en altijd scherp
					op de laatste ontwikkelingen in de sterk bewegende architectuurmarkt.
				</p>
			</div>
			<div class="grid grid-cols-2">
				<img
					src="/images/maria.jpg"
					alt="Maria Hoogland"
					class="h-48 w-full rounded-l-lg object-cover shadow-lg"
				/>
				<img
					src="/images/projects/uitbouw.jpg"
					alt="Een voorbeeldproject"
					class="h-48 w-full rounded-r-lg object-cover shadow-lg"
				/>
			</div>
		</div>
	</section>

	{#if data.mainProjects.length}
		<section class="bg-cover bg-left bg-no-repeat py-16">
			<div class="mx-auto max-w-screen-xl px-4">
				<h2 class="mb-12 text-center text-4xl font-extrabold tracking-wide text-textcolor">
					Uitgelichte Projecten
				</h2>
				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.mainProjects as project}
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
								></div>
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
</div>

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
{:else}
	<!-- Optional: show a message if no images found -->
	<section class="bg-white py-16">
		<div class="mx-auto max-w-screen-xl px-4 text-center text-gray-500">
			<p>No project images found—make sure they live under <code>src/lib/mainpageimages</code>.</p>
		</div>
	</section>
{/if}
