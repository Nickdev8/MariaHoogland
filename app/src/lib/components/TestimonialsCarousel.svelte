<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import type { Testimonial } from '$lib/types/content';

	export let items: Testimonial[] = [];
	export let autoplay = 7000;

	let perPage = 1;
	let currentIndex = 0;
	let paused = false;
	let timer: ReturnType<typeof setInterval> | null = null;
	let activePointerId: number | null = null;
	let dragStartX = 0;
	let dragOffset = 0;
	let dragVelocity = 0;
	let dragTimestamp = 0;
	let dragging = false;

	$: maxIndex = Math.max(0, items.length - perPage);
	$: slideWidthPct = 100 / perPage;
	$: translatePct = -(currentIndex * slideWidthPct);

	function updatePerPage() {
		if (typeof window === 'undefined') return;
		perPage = window.innerWidth >= 768 ? 2 : 1;
		currentIndex = Math.min(currentIndex, Math.max(0, items.length - perPage));
	}

	function previous() {
		currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
	}

	function next() {
		currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
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
		if (Math.abs(dragOffset) > 48 || Math.abs(dragVelocity) > 0.45) {
			if (dragOffset < 0) next();
			else previous();
		}
		activePointerId = null;
		dragOffset = 0;
		dragVelocity = 0;
		dragging = false;
	}

	onMount(() => {
		updatePerPage();
		window.addEventListener('resize', updatePerPage);
		if (items.length > 1 && autoplay) {
			timer = setInterval(() => {
				if (!paused) next();
			}, autoplay);
		}
		return () => {
			window.removeEventListener('resize', updatePerPage);
			if (timer) clearInterval(timer);
		};
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<section
	class="select-none"
	aria-label="Klantervaringen"
	on:mouseenter={() => (paused = true)}
	on:mouseleave={() => (paused = false)}
>
	<div
		class="touch-pan-y overflow-hidden"
		role="group"
		aria-label="Sleep voor meer klantervaringen"
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
			{#each items as testimonial, index}
				<article class="shrink-0 px-1.5 sm:px-2" style={`width:${slideWidthPct}%`}>
					<div class="flex min-h-[18rem] flex-col border-t-2 border-textcolor bg-white px-6 py-7 sm:px-8 sm:py-8">
						<p class="text-xs font-medium text-secondary">0{index + 1}</p>
						<blockquote class="mt-8 flex-grow text-[1.05rem] leading-8 text-textcolor sm:text-lg sm:leading-8">
							<p>“{testimonial.quote}”</p>
						</blockquote>
						<cite class="mt-8 border-t border-black/10 pt-4 text-sm font-medium not-italic text-secondary">
							{testimonial.name}
						</cite>
					</div>
				</article>
			{/each}
		</div>
	</div>

	{#if maxIndex > 0}
		<div class="mt-6 flex items-center justify-between border-t border-black/15 pt-4">
			<p class="text-sm text-secondary" aria-live="polite">
				{currentIndex + 1}–{Math.min(currentIndex + perPage, items.length)} van {items.length}
			</p>
			<div class="flex gap-2">
				<button
					type="button"
					on:click={previous}
					class="inline-flex h-10 items-center gap-2 border border-secondary/30 px-3 text-sm text-secondary transition-colors hover:border-secondary hover:bg-white hover:text-textcolor"
				>
					<ArrowLeft size={16} /> Vorige
				</button>
				<button
					type="button"
					on:click={next}
					class="inline-flex h-10 items-center gap-2 border border-secondary/30 px-3 text-sm text-secondary transition-colors hover:border-secondary hover:bg-white hover:text-textcolor"
				>
					Volgende <ArrowRight size={16} />
				</button>
			</div>
		</div>
	{/if}
</section>
