<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	export let images: { src: string; alt: string }[] = [];
	export let autoplay = 0;

	let perPage = 4;
	let currentIndex = 0;
	let timer: ReturnType<typeof setInterval> | null = null;
	let paused = false;
	let activePointerId: number | null = null;
	let dragStartX = 0;
	let dragOffset = 0;
	let dragVelocity = 0;
	let dragTimestamp = 0;
	let dragging = false;

	$: totalSlides = Math.max(0, images.length - perPage + 1);

	function updatePerPage() {
		if (typeof window === 'undefined') return;
		const width = window.innerWidth;
		if (width < 640) perPage = 2;
		else if (width < 768) perPage = 3;
		else if (width < 1024) perPage = 4;
		else perPage = 5;
		currentIndex = Math.min(currentIndex, Math.max(0, images.length - perPage));
	}

	function previous() {
		currentIndex = currentIndex <= 0 ? Math.max(0, images.length - perPage) : currentIndex - 1;
	}

	function next() {
		currentIndex = currentIndex >= images.length - perPage ? 0 : currentIndex + 1;
	}

	function goTo(index: number) {
		currentIndex = index;
	}

	function beginDrag(event: PointerEvent) {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		activePointerId = event.pointerId;
		dragStartX = event.clientX;
		dragOffset = 0;
		dragVelocity = 0;
		dragTimestamp = performance.now();
		dragging = true;
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function moveDrag(event: PointerEvent) {
		if (activePointerId !== event.pointerId) return;
		const now = performance.now();
		const nextOffset = event.clientX - dragStartX;
		dragVelocity = (nextOffset - dragOffset) / Math.max(now - dragTimestamp, 1);
		dragOffset = nextOffset;
		dragTimestamp = now;
	}

	function endDrag(event: PointerEvent) {
		if (activePointerId !== event.pointerId) return;
		const shouldAdvance = Math.abs(dragOffset) > 48 || Math.abs(dragVelocity) > 0.45;
		if (shouldAdvance) {
			const steps = Math.min(2, Math.max(1, Math.round(Math.abs(dragOffset) / 180)));
			for (let step = 0; step < steps; step += 1) {
				if (dragOffset < 0) next();
				else previous();
			}
		}
		activePointerId = null;
		dragOffset = 0;
		dragVelocity = 0;
		dragging = false;
	}

	function startTimer() {
		if (autoplay && !timer) {
			timer = setInterval(() => {
				if (!paused) next();
			}, autoplay);
		}
	}

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	onMount(() => {
		updatePerPage();
		window.addEventListener('resize', updatePerPage);
		startTimer();
		return () => {
			window.removeEventListener('resize', updatePerPage);
			stopTimer();
		};
	});

	onDestroy(stopTimer);

	$: slideWidthPct = 100 / perPage;
	$: translatePct = -(currentIndex * slideWidthPct);
</script>

<div
	class="touch-pan-y overflow-hidden select-none"
	role="region"
	aria-label="Impressies carrousel"
	on:mouseenter={() => (paused = true)}
	on:mouseleave={() => (paused = false)}
	on:pointerdown={beginDrag}
	on:pointermove={moveDrag}
	on:pointerup={endDrag}
	on:pointercancel={endDrag}
	on:dragstart|preventDefault
>
	<div
		class:transition-none={dragging}
		class="flex cursor-grab transition-transform duration-500 ease-in-out active:cursor-grabbing"
		style={`transform:translateX(calc(${translatePct}% + ${dragOffset}px))`}
	>
		{#each images as image}
			<div class="shrink-0 px-1" style={`width:${slideWidthPct}%`}>
				<img
					src={image.src}
					alt={image.alt}
					loading="lazy"
					class="h-40 w-full rounded-xl object-cover sm:h-44"
				/>
				{#if image.project}
					<p class="mt-2 text-sm leading-5 text-secondary">{image.project}</p>
				{/if}
			</div>
		{/each}
	</div>
</div>

{#if totalSlides > 1}
	<div class="mt-3 flex items-center justify-between gap-6">
		<div class="flex gap-2">
			<button
				type="button"
				on:click={previous}
				class="flex h-10 items-center gap-2 rounded-lg border border-secondary/30 px-3 text-sm text-secondary transition-colors hover:border-secondary hover:bg-white hover:text-textcolor"
				aria-label="Vorige impressie"
			>
				<ChevronLeft size={16} />
				<span>Vorige</span>
			</button>
			<button
				type="button"
				on:click={next}
				class="flex h-10 items-center gap-2 rounded-lg border border-secondary/30 px-3 text-sm text-secondary transition-colors hover:border-secondary hover:bg-white hover:text-textcolor"
				aria-label="Volgende impressie"
			>
				<span>Volgende</span>
				<ChevronRight size={16} />
			</button>
		</div>
		<div class="flex gap-2" aria-label="Carrouselpositie">
			{#each { length: totalSlides } as _, index}
				<button
					type="button"
					on:click={() => goTo(index)}
					class={`h-1.5 transition-all duration-200 ${currentIndex === index ? 'w-6 bg-secondary' : 'w-1.5 bg-secondary/30'}`}
					aria-label={`Ga naar slide ${index + 1}`}
				></button>
			{/each}
		</div>
	</div>
{/if}
