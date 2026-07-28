<script lang="ts">
	import type { ProjectWithHtml } from '$lib/server/projects';
	import type { PortfolioContent } from '$lib/types/content';
	export let data: { projects: ProjectWithHtml[]; portfolio: PortfolioContent };
</script>

<section class="bg-[#f6f8fb] px-4 py-[clamp(3.5rem,8vw,7.25rem)] text-black sm:px-6">
	<div class="mx-auto max-w-[1280px]">
		<header class="grid items-end gap-[clamp(3rem,12vw,11.25rem)] border-b border-black/15 pb-[54px] lg:grid-cols-[1fr_minmax(280px,.62fr)]">
			<div><p class="text-xs font-medium uppercase tracking-[0.08em] text-secondary">Werk</p><h1 class="mt-4 text-[clamp(3rem,6.5vw,6.3rem)] font-medium leading-[.92] tracking-[-.065em]">{data.portfolio.title}</h1></div>
			<div class="text-[1.05rem] leading-[1.65] text-secondary"><p class="m-0">{data.portfolio.description}</p><span class="mt-[22px] block text-sm text-black">{data.projects.length} {data.projects.length === 1 ? 'project' : 'projecten'}</span></div>
		</header>

		{#if data.projects.length}
			<section class="pt-[clamp(3.25rem,7vw,5.75rem)]" aria-label="Projecten">
				<div class="grid gap-x-5 gap-y-[clamp(2.125rem,4vw,3.75rem)] sm:grid-cols-2 lg:grid-cols-3">
					{#each data.projects as project}
						<a class="group block text-black no-underline" href={`/${project.slug}`}>
							<div class="overflow-hidden bg-[#e8edf4]"><img class="aspect-[4/3] w-full object-cover transition-opacity duration-200 group-hover:opacity-80" src={project.mainImage} alt={project.title} loading="lazy" /></div>
							<div class="mt-3.5 border-t border-black/15 pt-3"><p class="m-0 text-xs font-medium uppercase tracking-[0.08em] text-secondary">{project.category}</p><h2 class="mt-2 text-[1.1rem] font-semibold leading-tight tracking-tight">{project.title}</h2><p class="mt-1.5 text-sm leading-6 text-secondary">{project.subtitle}</p></div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</section>
