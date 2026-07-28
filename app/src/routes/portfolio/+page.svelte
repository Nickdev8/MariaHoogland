<script lang="ts">
	import { LayoutGrid, List } from '@lucide/svelte';
	import type { ProjectWithHtml } from '$lib/server/projects';
	import type { PortfolioContent } from '$lib/types/content';

	export let data: { projects: ProjectWithHtml[]; portfolio: PortfolioContent };

	const leadProject = data.projects[0];
	const projectCount = data.projects.length;
	let viewMode: 'grid' | 'list' = 'grid';
</script>

<section class="bg-paper">
	<div class="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
		<div class="grid gap-12 border-b border-line pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
			<div class="max-w-xl">
				<h1 class="text-4xl font-semibold text-textcolor sm:text-5xl">
					{data.portfolio.title}
				</h1>
				<p class="mt-6 text-base leading-8 text-secondary sm:text-lg">
					{data.portfolio.description}
				</p>
			</div>

			<div class="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
				<div class="relative overflow-hidden bg-stone">
					<img
						src={leadProject?.mainImage}
						alt={leadProject?.title ?? 'Portfolio project'}
						class="aspect-[16/10] w-full object-cover"
					/>
				</div>
				<div class="min-w-[9rem] border-t border-line pt-4 sm:border-t-0 sm:border-l sm:pl-5 sm:pt-0">
					<p class="text-sm font-medium text-secondary">Projecten</p>
					<p class="mt-2 text-4xl font-semibold text-textcolor">
						{projectCount}
					</p>
					<p class="mt-2 max-w-[10rem] text-sm leading-6 text-secondary">
						Kleine en grote ingrepen, elk met een eigen context.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-10">
			<div class="flex items-center justify-end gap-3 border-b border-line pb-5">
				<div class="flex items-center gap-2">
					<button
						type="button"
						on:click={() => (viewMode = 'grid')}
						class={`inline-flex items-center gap-2 border px-3 py-2 text-sm transition-colors ${
							viewMode === 'grid'
								? 'border-primary bg-primary text-white'
								: 'border-line bg-white text-secondary hover:text-textcolor'
						}`}
						aria-pressed={viewMode === 'grid'}
					>
						<LayoutGrid size={14} />
						Grid
					</button>
					<button
						type="button"
						on:click={() => (viewMode = 'list')}
						class={`inline-flex items-center gap-2 border px-3 py-2 text-sm transition-colors ${
							viewMode === 'list'
								? 'border-primary bg-primary text-white'
								: 'border-line bg-white text-secondary hover:text-textcolor'
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
							<div class="overflow-hidden bg-stone">
								<img
									src={project.mainImage}
									alt={project.title}
									class="aspect-[4/3] w-full object-cover"
								/>
							</div>
							<div class="pt-3">
								<p class="text-sm text-secondary">
									{project.category}
								</p>
								<h2 class="mt-1.5 text-base font-semibold text-textcolor">
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
							class="group grid gap-4 border-b border-line py-5 transition-colors duration-200 hover:bg-white/60 sm:px-2 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center md:gap-6"
						>
							<div class="overflow-hidden bg-stone">
								<img
									src={project.mainImage}
									alt={project.title}
									class="aspect-[4/3] w-full object-cover"
								/>
							</div>

							<div class="max-w-2xl">
								<p class="text-sm text-secondary">
									{project.category}
								</p>
								<h2 class="mt-2 text-xl font-semibold text-textcolor">
									{project.title}
								</h2>
								<p class="mt-1.5 text-sm leading-7 text-secondary">
									{project.subtitle}
								</p>
							</div>

							<div class="text-sm font-medium text-primary transition-colors group-hover:text-textcolor">
								Bekijk
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
