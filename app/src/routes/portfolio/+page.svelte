<script lang="ts">
	import { derived, writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import type { Project } from '$lib/data/projects.ts';
	import type { SiteContent } from '$lib/types/content';

	export let data: { projects: Project[]; content: SiteContent };

	const portfolio = data.content.portfolio;

	const categories: string[] = ['Alles', ...new Set(data.projects.map((p) => p.category))];

	const selectedCategory = writable('Alles');
	const searchQuery = writable('');

	const filteredProjects = derived(
		[selectedCategory, searchQuery],
		([$selectedCategory, $searchQuery]) => {
			let items = data.projects;

			if ($selectedCategory !== 'Alles') {
				items = items.filter((project) => project.category === $selectedCategory);
			}

			if ($searchQuery.trim()) {
				const term = $searchQuery.toLowerCase();
				items = items.filter(
					(project) =>
						project.title.toLowerCase().includes(term) ||
						project.subtitle.toLowerCase().includes(term) ||
						project.category.toLowerCase().includes(term)
				);
			}

			return items;
		}
	);

	const filterProjects = (category: string) => {
		selectedCategory.set(category);
	};
</script>

<section class="bg-[#f3efe8]">
	<div class="mx-auto max-w-5xl px-4 pb-12 pt-16 sm:px-6 sm:pb-14 sm:pt-20 lg:pb-18 lg:pt-22">
		<div class="space-y-6 text-center">
			<h1 class="font-display text-3xl leading-tight text-neutral-900 sm:text-4xl">{portfolio.title}</h1>
			<p class="mx-auto max-w-3xl text-base leading-relaxed text-neutral-700">
				{portfolio.copy}
			</p>
		</div>
	</div>
</section>

<section class="bg-white py-14 sm:py-16 lg:py-18">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="space-y-8">
			<div class="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
				<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<label class="flex w-full flex-col gap-2 text-sm font-semibold text-neutral-700 lg:max-w-md">
						<span>Zoek in projecten</span>
						<input
							bind:value={$searchQuery}
							type="text"
							name="search"
							id="search"
							class="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							placeholder={portfolio.searchPlaceholder}
						/>
					</label>

					<div class="flex flex-wrap gap-2">
						{#each categories as category}
							<button
								on:click={() => filterProjects(category)}
								class="rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30"
								class:bg-primary={$selectedCategory === category}
								class:text-white={$selectedCategory === category}
								class:bg-primary-muted={$selectedCategory !== category}
								class:text-neutral-800={$selectedCategory !== category}
								class:hover:bg-neutral-200={$selectedCategory !== category}
							>
								{category}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each $filteredProjects as project (project.slug)}
					<a
						href={`/${project.slug}`}
						class="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-primary/40 hover:shadow-sm"
						in:slide|global={{ duration: 250 }}
					>
						<div class="relative overflow-hidden">
							<img
								src={project.mainImage}
								alt={project.title}
								class="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
							/>
							<span class="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-neutral-800 shadow-sm">
								{project.category}
							</span>
						</div>
						<div class="flex flex-1 flex-col gap-3 p-5">
							<h3 class="font-display text-lg text-neutral-900">{project.title}</h3>
							<p class="text-sm leading-relaxed text-neutral-600">{project.subtitle}</p>
							<span class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
								Bekijk project
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3" />
								</svg>
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
