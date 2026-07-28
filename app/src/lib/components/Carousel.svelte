<script lang="ts">
	import { onMount } from 'svelte';

	export let images: { src: string; alt: string }[] = [];
	export let autoplay = 0;

	let perPage = 4;
	let currentIndex = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	function updatePerPage() {
		const width = window.innerWidth;
		if (width < 640) perPage = 2;
		else if (width < 768) perPage = 3;
		else if (width < 1024) perPage = 4;
		else perPage = 5;
		currentIndex = Math.min(currentIndex, Math.max(0, images.length - perPage));
	}

	function next() {
		currentIndex = currentIndex >= images.length - perPage ? 0 : currentIndex + 1;
	}

	onMount(() => {
		updatePerPage();
		window.addEventListener('resize', updatePerPage);

		if (autoplay && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			timer = setInterval(next, autoplay);
		}

		return () => {
			window.removeEventListener('resize', updatePerPage);
			if (timer) clearInterval(timer);
		};
	});

	$: slideWidthPct = 100 / perPage;
	$: translatePct = -(currentIndex * slideWidthPct);
</script>

<div class="overflow-hidden" role="region" aria-label="Impressies carrousel">
	<div
		class="flex transition-transform duration-700 ease-in-out"
		style={`transform:translateX(${translatePct}%)`}
	>
		{#each images as image}
			<div class="shrink-0 px-2" style={`width:${slideWidthPct}%`}>
				<img
					src={image.src}
					alt={image.alt}
					loading="lazy"
					class="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
				/>
			</div>
		{/each}
	</div>
</div>
