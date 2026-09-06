<script lang="ts">
	import type { ProjectWithHtml } from '$lib/server/projects';
	import type { PortfolioContent } from '$lib/types/content';
	export let data: { projects: ProjectWithHtml[]; portfolio: PortfolioContent };
</script>

<svelte:head>
	<title>Mijn werk | Verbouwing, nieuwbouw & renovatie</title>
	<meta
		name="description"
		content="Bekijk projecten van Maria Hoogland Architectuur: verbouwingen, nieuwbouw, woningrenovaties en architectuur in Noord-Holland."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Mijn werk | Maria Hoogland" />
	<meta
		property="og:description"
		content="Projecten in verbouwing, nieuwbouw en woningrenovatie in Noord-Holland."
	/>
	<meta
		property="og:image"
		content="https://mariahoogland.nl/images/people/maria-garden-portrait.webp"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Mijn werk | Maria Hoogland" />
	<meta
		name="twitter:description"
		content="Projecten in verbouwing, nieuwbouw en woningrenovatie in Noord-Holland."
	/>
	<meta
		name="twitter:image"
		content="https://mariahoogland.nl/images/people/maria-garden-portrait.webp"
	/>
</svelte:head>

<section class="bg-[#f6f8fb] px-6 py-12 text-textcolor sm:px-8 sm:py-16">
	<div class="mx-auto max-w-7xl">
		<header class="border-b border-black/15 pb-6">
			<h1
				class="max-w-3xl text-[clamp(2.5rem,4.8vw,4.75rem)] leading-[.96] font-medium tracking-[-.055em]"
			>
				{data.portfolio.title}
			</h1>
		</header>

		{#if data.projects.length}
			<section class="pt-8 sm:pt-10" aria-label="Projecten">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
					{#each data.projects as project}
						<a
							class="group rounded-xl border border-transparent p-3 text-textcolor no-underline transition-colors duration-200 hover:border-black/10 hover:bg-white"
							href={`/${project.slug}`}
						>
							<div class="overflow-hidden rounded-lg bg-[#e8edf4]">
								<img
									class="aspect-[4/3] w-full object-cover transition-opacity duration-200 group-hover:opacity-85"
									style={`object-position:${project.mainImagePosition ?? 'center'}`}
									src={project.mainImage}
									alt={project.title}
									loading="lazy"
								/>
							</div>
							<div class="pt-3 pb-1">
								<p class="m-0 text-xs text-secondary">
									{project.category}
								</p>
								<h2 class="mt-1.5 text-lg leading-tight font-medium tracking-[-.02em]">
									{project.title}
								</h2>
								<p class="mt-1 text-sm leading-6 text-secondary">{project.subtitle}</p>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</section>
