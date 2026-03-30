<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { Search } from '@lucide/svelte';
	import type { ProjectWithHtml } from '$lib/server/projects';
	import type { PortfolioContent } from '$lib/types/content';

	export let data: { projects: ProjectWithHtml[]; portfolio: PortfolioContent };

	const categories: string[] = ['Alles', ...new Set(data.projects.map((p) => p.category))];

	let selectedCategory = writable('Alles');
	let searchQuery = writable('');

	const filteredProjects = derived(
		[selectedCategory, searchQuery],
		([$selectedCategory, $searchQuery]) => {
			let projects = data.projects;

			if ($selectedCategory !== 'Alles') {
				projects = projects.filter((p) => p.category === $selectedCategory);
			}

			if ($searchQuery) {
				const lowerCaseQuery = $searchQuery.toLowerCase();
				projects = projects.filter(
					(p) =>
						p.title.toLowerCase().includes(lowerCaseQuery) ||
						p.subtitle.toLowerCase().includes(lowerCaseQuery) ||
						p.category.toLowerCase().includes(lowerCaseQuery)
				);
			}

			return projects;
		}
	);

	function filterProjects(category: string) {
		selectedCategory.set(category);
	}
</script>

<section class="border-b border-secondary/15 bg-[#f4f7f6] py-20 sm:py-24">
	<div class="section-wrap">
		<div class="max-w-3xl">
			<p class="section-eyebrow">Projectoverzicht</p>
			<h1 class="section-title">{data.portfolio.title}</h1>
			<p class="section-copy">{data.portfolio.description}</p>
		</div>

		<div class="mt-10 max-w-md">
			<label for="search" class="sr-only">Zoek projecten</label>
			<div class="relative">
				<Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/80" />
				<input
					bind:value={$searchQuery}
					type="text"
					name="search"
					id="search"
					class="flat-input pl-10"
					placeholder="Zoek projecten..."
				/>
			</div>
		</div>

		<div class="mt-8 flex flex-wrap gap-2">
			{#each categories as category}
				<button
					on:click={() => filterProjects(category)}
					class={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-200 ${$selectedCategory === category ? 'border-textcolor bg-primary text-textcolor' : 'border-secondary/25 bg-white text-secondary hover:border-secondary/40 hover:text-textcolor'}`}
				>
					{category}
				</button>
			{/each}
		</div>
	</div>
</section>

<section class="bg-white py-16 sm:py-20">
	<div class="section-wrap">
		{#if $filteredProjects.length === 0}
			<div class="flat-panel p-8 text-center">
				<p class="text-sm uppercase tracking-[0.18em] text-secondary">Geen projecten gevonden</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
				{#each $filteredProjects as project (project.slug)}
					<div in:slide|global={{ duration: 250 }}>
						<a
							href={`/${project.slug}`}
							class="group block overflow-hidden border border-secondary/20 bg-[#fafcfb] transition-colors hover:border-secondary/45"
						>
							<div class="overflow-hidden border-b border-secondary/15">
								<img
									src={project.mainImage}
									alt={project.title}
									class="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
								/>
							</div>
							<div class="p-5">
								<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
									{project.category}
								</p>
								<h2 class="mt-2 text-2xl text-textcolor">{project.title}</h2>
								<p class="mt-2 text-sm leading-6 text-secondary">{project.subtitle}</p>
							</div>
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
