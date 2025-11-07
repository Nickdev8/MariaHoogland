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

<section class="relative overflow-hidden bg-neutral-950 text-white">
	<div class="absolute inset-0">
		<img
			src="/images/heroimageproject.jpg"
			alt="Architectonisch detail in schemerval"
			class="h-full w-full object-cover opacity-50"
		/>
		<div class="absolute inset-0 bg-neutral-950/70"></div>
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(115,199,242,0.35),rgba(15,23,42,0.95))]"></div>
	</div>

	<div class="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-18 lg:py-20">
		<h1 class="mt-5 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
			{portfolio.title}
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
			{portfolio.copy}
		</p>
	</div>
</section>

<section class="bg-[#f5f7fb] py-16 sm:py-20 lg:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="grid gap-8 lg:grid-cols-[0.7fr,1.3fr] lg:items-start">
			<div class="space-y-6 rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400">
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

				<div class="space-y-2">
					<p class="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
						Filter op categorie
					</p>
					<div class="flex flex-wrap gap-2">
						{#each categories as category}
							<button
								on:click={() => filterProjects(category)}
								class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition focus:outline-none focus:ring-2 focus:ring-primary/30"
								class:bg-primary={$selectedCategory === category}
								class:text-neutral-950={$selectedCategory === category}
								class:bg-white={$selectedCategory !== category}
								class:text-neutral-600={$selectedCategory !== category}
								class:hover:bg-neutral-200={$selectedCategory !== category}
							>
								{category}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div
				class="grid gap-8 rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:grid-cols-2"
			>
				{#each $filteredProjects as project (project.slug)}
					<a
						href={`/${project.slug}`}
						class="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
						in:slide|global={{ duration: 250 }}
					>
						<div class="relative overflow-hidden">
							<img
								src={project.mainImage}
								alt={project.title}
								class="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent"></div>
							<span class="absolute left-4 top-4 inline-flex rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-700">
								{project.category}
							</span>
						</div>
						<div class="flex flex-1 flex-col gap-3 p-5">
							<h3 class="font-display text-lg text-neutral-900">{project.title}</h3>
							<p class="text-sm leading-relaxed text-neutral-600">{project.subtitle}</p>
							<span class="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
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
