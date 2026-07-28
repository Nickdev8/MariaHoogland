<script lang="ts">
	import { LayoutGrid, List } from '@lucide/svelte';
	import type { ProjectWithHtml } from '$lib/server/projects';
	import type { PortfolioContent } from '$lib/types/content';

	export let data: { projects: ProjectWithHtml[]; portfolio: PortfolioContent };

	const leadProject = data.projects[0];
	const projectCount = data.projects.length;
	let viewMode: 'grid' | 'list' = 'grid';
</script>

<section class="bg-[#f6f8fb]">
	<div class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
		<div class="grid gap-12 border-b border-black/10 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
			<div class="max-w-xl">
				<p class="section-eyebrow">Portfolio</p>
				<h1 class="mt-4 text-4xl font-semibold tracking-tight text-textcolor sm:text-5xl">
					{data.portfolio.title}
				</h1>
				<p class="mt-6 text-base leading-8 text-secondary sm:text-lg">
					{data.portfolio.description}
				</p>
			</div>

			<div class="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
				<div class="relative overflow-hidden rounded-xl bg-[#e8edf4]">
					<img
						src={leadProject?.mainImage}
						alt={leadProject?.title ?? 'Portfolio project'}
						class="aspect-[16/10] w-full object-cover"
					/>
				</div>
				<div class="min-w-[9rem] border-t border-black/10 pt-4 sm:border-t-0 sm:border-l sm:pl-5 sm:pt-0">
					<p class="text-[0.68rem] font-light uppercase tracking-[0.28em] text-secondary">
						Projecten
					</p>
					<p class="mt-2 text-4xl font-semibold tracking-tight text-textcolor">
						{projectCount}
					</p>
					<p class="mt-2 max-w-[10rem] text-sm leading-6 text-secondary">
						Kleine en grote ingrepen, elk met een eigen context.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-10">
			<div class="flex items-center justify-between gap-6 border-b border-black/10 pb-5">
				<p class="text-sm leading-6 text-secondary">
					Alle projecten van Maria Hoogland in een compacte index.
				</p>
				<div class="flex items-center gap-2">
					<button
						type="button"
						on:click={() => (viewMode = 'grid')}
						class={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition ${
							viewMode === 'grid'
								? 'border-secondary bg-secondary text-white'
								: 'border-black/10 bg-white/80 text-secondary'
						}`}
						aria-pressed={viewMode === 'grid'}
					>
						<LayoutGrid size={14} />
						Grid
					</button>
					<button
						type="button"
						on:click={() => (viewMode = 'list')}
						class={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition ${
							viewMode === 'list'
								? 'border-secondary bg-secondary text-white'
								: 'border-black/10 bg-white/80 text-secondary'
						}`}
						aria-pressed={viewMode === 'list'}
					>
						<List size={14} />
						Lijst
					</button>
				</div>
			</div>

			{#if viewMode === 'grid'}
				<div class="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
					{#each data.projects as project}
						<a href={`/${project.slug}`} class="group block">
							<div class="overflow-hidden rounded-lg bg-[#e8edf4]">
								<img
									src={project.mainImage}
									alt={project.title}
									class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
								/>
							</div>
							<div class="pt-3">
								<p class="text-[0.62rem] font-light uppercase tracking-[0.24em] text-secondary">
									{project.category}
								</p>
								<h2 class="mt-1.5 text-base font-semibold tracking-tight text-textcolor">
									{project.title}
								</h2>
								<p class="mt-1 text-sm leading-6 text-secondary">
									{project.subtitle}
								</p>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="mt-6 grid gap-0">
					{#each data.projects as project}
						<a
							href={`/${project.slug}`}
							class="group grid gap-4 border-b border-black/10 py-5 transition-colors duration-200 hover:bg-white/60 sm:px-2 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center md:gap-6"
						>
							<div class="overflow-hidden rounded-lg bg-[#e8edf4]">
								<img
									src={project.mainImage}
									alt={project.title}
									class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
								/>
							</div>

							<div class="max-w-2xl">
								<p class="text-[0.68rem] font-light uppercase tracking-[0.26em] text-secondary">
									{project.category}
								</p>
								<h2 class="mt-2 text-xl font-semibold tracking-tight text-textcolor">
									{project.title}
								</h2>
								<p class="mt-1.5 text-sm leading-7 text-secondary">
									{project.subtitle}
								</p>
							</div>

							<div class="text-sm font-light uppercase tracking-[0.22em] text-secondary transition group-hover:text-primary">
								Bekijk
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
