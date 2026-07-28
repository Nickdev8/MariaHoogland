<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  export let images: { src: string; alt: string }[] = [];
  export let autoplay: number = 0;

  let perPage = 4;
  let currentIndex = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let paused = false;
  let touchStartX = 0;
  let touchDeltaX = 0;
  let wheelDelta = 0;
  let lastWheelSlideAt = 0;
  const wheelThreshold = 80;
  const wheelCooldown = 450;

  $: totalSlides = Math.max(0, images.length - perPage + 1);

  function updatePerPage() {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    if (w < 640) perPage = 2;
    else if (w < 768) perPage = 3;
    else if (w < 1024) perPage = 4;
    else perPage = 5;
    currentIndex = Math.min(currentIndex, Math.max(0, images.length - perPage));
  }

  function prev() {
    currentIndex = currentIndex <= 0 ? Math.max(0, images.length - perPage) : currentIndex - 1;
  }

  function next() {
    currentIndex = currentIndex >= images.length - perPage ? 0 : currentIndex + 1;
  }

  function goTo(index: number) {
    currentIndex = index;
  }

  function handleWheel(event: WheelEvent) {
    const horizontal = Math.abs(event.deltaX);
    const vertical = Math.abs(event.deltaY);
    if (horizontal < 6 || horizontal < vertical * 1.25) {
      wheelDelta = 0;
      return;
    }

    event.preventDefault();
    wheelDelta += event.deltaX;
    if (Math.abs(wheelDelta) < wheelThreshold) return;

    const now = Date.now();
    if (now - lastWheelSlideAt < wheelCooldown) return;

    if (wheelDelta > 0) next();
    else prev();

    wheelDelta = 0;
    lastWheelSlideAt = now;
  }

  function handleTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0]?.clientX ?? 0;
    touchDeltaX = 0;
  }

  function handleTouchMove(event: TouchEvent) {
    const currentX = event.touches[0]?.clientX ?? 0;
    touchDeltaX = currentX - touchStartX;
  }

  function handleTouchEnd() {
    if (Math.abs(touchDeltaX) < 40) return;
    if (touchDeltaX < 0) next();
    else prev();
    touchDeltaX = 0;
  }

  function startTimer() {
    if (autoplay && !timer) {
      timer = setInterval(() => { if (!paused) next(); }, autoplay);
    }
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
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
  class="relative overflow-hidden"
  role="region"
  aria-label="Impressies carrousel"
  on:mouseenter={() => (paused = true)}
  on:mouseleave={() => (paused = false)}
  on:wheel={handleWheel}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
>
  <!-- track -->
  <div
    class="flex transition-transform duration-500 ease-in-out"
    style="transform: translateX({translatePct}%)"
  >
    {#each images as image}
      <div class="flex-shrink-0" style="width: {slideWidthPct}%; padding: 0 4px;">
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          class="h-48 w-full object-cover"
        />
      </div>
    {/each}
  </div>

  <!-- prev button -->
  <button
    on:click={prev}
    class="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-white/85 text-secondary transition-colors hover:bg-white hover:text-textcolor"
    aria-label="Vorige"
  >
    <ChevronLeft size={18} />
  </button>

  <!-- next button -->
  <button
    on:click={next}
    class="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-white/85 text-secondary transition-colors hover:bg-white hover:text-textcolor"
    aria-label="Volgende"
  >
    <ChevronRight size={18} />
  </button>
</div>

<!-- dots -->
{#if totalSlides > 1}
  <div class="mt-4 flex justify-center gap-2">
    {#each { length: totalSlides } as _, i}
      <button
        on:click={() => goTo(i)}
        class="h-1.5 transition-colors {currentIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-secondary/30'}"
        aria-label="Ga naar slide {i + 1}"
      ></button>
    {/each}
  </div>
{/if}
