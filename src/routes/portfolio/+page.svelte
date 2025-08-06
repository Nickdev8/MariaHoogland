<script lang="ts">
	import type { PageData } from './$types.ts';
	import { writable, derived } from 'svelte/store';
	import { slide } from 'svelte/transition';

	export let data: PageData;

	const categories = ['Alles', ...new Set(data.projects.map((p) => p.category))];

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

<div class="bg-gray-50/50">
	<div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Portfolio</h2>
			<p class="mt-6 text-lg leading-8 text-gray-600">
				Een selectie van mijn werk, van concept tot realisatie. Elk project vertelt een uniek
				verhaal van samenwerking, creativiteit en vakmanschap.
			</p>
		</div>

		<!-- Search Bar -->
		<div class="mt-8 mx-auto max-w-lg">
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg
						class="h-5 w-5 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<input
					bind:value={$searchQuery}
					type="text"
					name="search"
					id="search"
					class="block w-full rounded-md border-0 bg-white py-2.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
					placeholder="Zoek projecten..."
				/>
			</div>
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
			class="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
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