<script lang="ts">
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	export let data: PageData;

	const categories = [
		'Alles',
		...new Set(data.projects.map((p) => p.category))
	];

	let selectedCategory = writable('Alles');
	let filteredProjects = writable(data.projects);

	function filterProjects(category: string) {
		selectedCategory.set(category);
		if (category === 'Alles') {
			filteredProjects.set(data.projects);
		} else {
			filteredProjects.set(data.projects.filter((p) => p.category === category));
		}
	}
</script>

<div class="bg-gray-50/50">
	<div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Portfolio</h2>
			<p class="mt-6 text-lg leading-8 text-gray-600">
				Een selectie van mijn werk, van concept tot realisatie. Elk project vertelt een uniek
				verhaal van samenwerking, creativiteit en vakmanschap.
			</p>
		</div>

		<!-- Filter Buttons -->
		<div class="mt-12 flex flex-wrap justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
			{#each categories as category}
				<button
					on:click={() => filterProjects(category)}
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
					class:bg-sky-600={$selectedCategory === category}
					class:text-white={$selectedCategory === category}
					class:bg-white={$selectedCategory !== category}
					class:text-gray-600={$selectedCategory !== category}
					class:hover:bg-gray-200={$selectedCategory !== category}
				>
					{category}
				</button>
			{/each}
		</div>

		<!-- Project Grid -->
		<div
			class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
		>
			{#each $filteredProjects as project (project.slug)}
				<div in:slide|global={{ duration: 300 }}>
					<a
						href="/{project.slug}"
						class="group block rounded-xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg"
					>
						<div class="overflow-hidden rounded-t-xl">
							<img
								src={project.mainImage}
								alt={project.title}
								class="h-56 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
							/>
						</div>
						<div class="p-6">
							<p class="text-xs font-semibold uppercase tracking-wider text-sky-600">
								{project.category}
							</p>
							<h3 class="mt-2 text-lg font-bold text-gray-900">{project.title}</h3>
							<p class="mt-1 text-sm text-gray-600">{project.subtitle}</p>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>