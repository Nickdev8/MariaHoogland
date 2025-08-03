<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import CountUp from '$lib/CountUp.svelte';
	import { fade, slide } from 'svelte/transition';
	export let data: {
		mainProjects: typeof import('$lib/data/projects.ts').mainProjects;
	};

	interface UnderImage {
		src: string;
		alt: string;
	}

	const modules = import.meta.glob('/src/lib/mainpageimages/*.{jpg,png,webp}', {
		query: '?url',
		import: 'default',
		eager: true
	}) as Record<string, string>;

	const underImages: UnderImage[] = Object.values(modules).map((src) => ({
		src,
		alt: friendlyAlt(src)
	}));

	function friendlyAlt(src: string) {
		const file = src.split('/').pop() || '';
		const name = file.replace(/\.[^.]+$/, '');
		return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>


<div
	style="
	    background-image: url(/images/mainbg.png);  background-position: center left;  background-repeat: no-repeat;"
>
	<!-- About Section -->
	<section class="bg-white py-24 sm:py-32" in:fade={{ duration: 1000 }}>
		<div
			class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-x-16 gap-y-12 px-6 lg:grid-cols-2"
		>
			<div class="lg:pr-8">
				<div class="max-w-lg">
					<h2 class="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
						Laten we samen uw droomhuis realiseren
					</h2>
					<p class="mt-6 text-lg leading-8 text-secondary">
						Heeft u een visie voor uw perfecte ruimte? Ik help u die te realiseren. Van het eerste
						concept tot de laatste afwerking, ik ben uw toegewijde partner. Neem contact op voor
						een vrijblijvend gesprek en laten we beginnen met het bouwen van uw toekomst.
					</p>
					<div class="mt-10 flex items-center gap-x-6">
						<a
							href="/contact"
							class="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
							>Neem contact op</a
						>
						<a href="/portfolio" class="text-sm font-semibold leading-6 text-secondary"
							>Bekijk mijn werk <span aria-hidden="true">→</span></a
						>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<img
					src="/images/maria.jpg"
					alt="Portret van architect Maria Hoogland"
					class="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
					in:slide={{ y: 50, duration: 1000, delay: 200 }} />
				<img
					src="/images/projects/uitbouw.jpg"
					alt="Detail van een modern huisontwerp"
					class="md:mt-8 aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
					in:slide={{ y: 50, duration: 1000, delay: 400 }} />
			</div>
		</div>
	</section>
</div>

<!-- Stats Section -->
<section class="bg-slate-100 py-24 sm:py-32" in:fade={{ duration: 1000, delay: 500 }}>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-x-8 gap-y-12 text-center lg:grid-cols-3">
			<div>
				<h3 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"><CountUp value={2025-2004} suffix="+ " /></h3>
				<p class="mt-2 text-lg leading-8 text-gray-600">Jaren ervaring</p>
			</div>
			<div>
				<h3 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"><CountUp value={750} suffix="+ " /></h3>
				<p class="mt-2 text-lg leading-8 text-gray-600">Afgeronde projecten</p>
			</div>
			<div>
				<h3 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"><CountUp value={98} suffix="% " /></h3>
				<p class="mt-2 text-lg leading-8 text-gray-600">Klanttevredenheid</p>
			</div>
		</div>
	</div>
</section>

<!-- Featured Projects Section -->
{#if data.mainProjects.length}
	<section class="bg-white py-24 sm:py-32" in:fade={{ duration: 1000, delay: 1000 }}>
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Uitgelichte Projecten
				</h2>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					Een selectie van projecten die de diversiteit en kwaliteit van mijn werk tonen.
				</p>
			</div>
			<div
				class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3"
			>
				{#each data.mainProjects as project}
					<a href={project.sublink} class="group block">
						<div
							class="overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 group-hover:shadow-2xl"
						>
							<img
								src={project.src}
								alt={project.title}
								class="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						</div>
						<div class="p-4">
							<h3 class="mt-2 text-lg font-semibold text-gray-900">{project.title}</h3>
							<p class="mt-2 line-clamp-2 text-sm text-gray-600">{project.subtitle}</p>
							<span
								class="mt-4 inline-flex items-center font-medium text-sky-600 group-hover:text-sky-500"
							>
								Bekijk project
								<ArrowRight class="ml-2 h-4 w-4" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Gallery Section -->
{#if underImages.length}
	<section class="bg-slate-100 py-24 sm:py-32" in:fade={{ duration: 1000, delay: 1500 }}>
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Impressies</h2>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					Een visuele verzameling van details, materialen en momenten die mijn werk definiëren.
				</p>
			</div>
			<div class="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each underImages as { src, alt }}
					<div class="overflow-hidden rounded-lg">
						<img
							{src}
							{alt}
							loading="lazy"
							class="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
						/>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

