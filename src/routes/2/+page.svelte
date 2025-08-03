<script lang="ts">
  export let data: {
    mainProjects: typeof import('$lib/data/projects.ts').mainProjects,
    underImages: typeof import('$lib/data/projects.ts').underImages
  };
</script>


<section class="bg-white py-10">
	<div class="container mx-auto px-6 text-center">
		<h1
			class="mb-3 text-4xl leading-tight font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl"
		>
			<span class="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
				Tijdloze Architectuur
			</span>
			die Generaties Inspireert en Verbindt
		</h1>
		<p class="mx-auto max-w-3xl text-base text-gray-600 sm:text-sm lg:text-lg">
			Samen met uw ideeën en mijn creativiteit en ervaring creëren we een verbouwing of
			nieuwbouwproject dat naadloos aansluit bij uw wensen, behoeftes en stijl.
		</p>
	</div>
</section>

<section
	class="bg-white py-16"
	style="
    background-image: url('/images/mainbaackgroundimage.png');
    background-position: center left;
    background-repeat: no-repeat;
  "
>
	<div class="container mx-auto flex flex-col items-center gap-8 px-6 md:flex-row">
		<!-- Left column -->
		<div class="flex flex-col items-end md:w-1/2">
			<div class="flex w-full max-w-sm flex-col items-end space-y-6 md:max-w-md">
				<!-- Text block (now inherits the same width) -->
				<div class="w-full">
					<h2 class="text-3xl font-bold text-secondary">Over Maria Hoogland</h2>
					<p class="mt-2 text-gray-700">
						Ik ben Maria Hoogland, recht door zee, met duidelijke afspraken vooraf, en altijd scherp
						op de laatste ontwikkelingen in de sterk bewegende architectuurmarkt.
					</p>
				</div>
				<!-- Image -->
				<img
					src="/images/FotoAbout-1.jpg"
					alt="Maria Hoogland"
					class="w-full rounded-lg object-cover shadow-lg"
				/>
			</div>
		</div>

		<!-- Right column -->
		<div class="flex flex-col md:w-1/2">
			<div class="flex w-full max-w-sm flex-col items-start space-y-6 md:max-w-md">
				<!-- Image -->
				<img
					src="/images/4-uitbouw-2-1-1.jpg"
					alt="Een voorbeeldproject"
					class="w-full rounded-lg object-cover shadow-lg"
				/>
				<!-- Text block -->
				<div class="w-full">
					<h2 class="text-3xl font-bold text-secondary">Hehe</h2>
					<p class="mt-2 text-gray-700">Dit is een project die ik heb gemaakt.</p>
				</div>
			</div>
		</div>
	</div>
</section>

{#if data.mainProjects.length > 0}
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto px-6">
			<h2 class="mb-12 text-center text-3xl font-bold text-textcolor">Uitgelichte Projecten</h2>
			<div class="grid gap-8 md:grid-cols-3">
				{#each data.mainProjects as project}
					<div class="flex flex-col rounded-lg bg-white shadow transition hover:shadow-lg">
						<img
							src={project.src}
							alt={project.title}
							class="h-48 w-full rounded-t-lg object-cover"
						/>
						<div class="flex flex-1 flex-col p-4">
							<div>
								<h3 class="mb-2 text-lg font-semibold text-black">{project.title}</h3>
								<h4 class="mb-4 text-sm font-normal text-secondary">{project.subtitle}</h4>
							</div>
							<a
								href={project.sublink}
								class="mt-auto self-end font-medium text-textcolor hover:underline"
							>
								Read More →
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if data.underImages.length > 0}
	<section class="py-16">
		<div class="container mx-auto px-6">
			<div class="mt-8">
				<h3 class="mb-4 text-xl font-semibold">Bonus Pictures</h3>
				<div class="columns-1 gap-4 [column-fill:balance] sm:columns-2 lg:columns-4">
					{#each data.underImages as image}
						<button
							type="button"
							class="mb-4 w-full cursor-pointer break-inside-avoid overflow-hidden rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
							style="padding:0;border:none;background:none;"
						>
							<img
								src={image.src}
								alt={image.alt}
								loading="lazy"
								class="block h-auto w-full"
								tabindex="-1"
							/>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}
