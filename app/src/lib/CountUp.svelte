<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let value: number;
  export let duration: number = 1000;
  export let prefix: string = '';
  export let suffix: string = '';
  export let decimalPlaces: number = 0;

  const displayedValue = tweened(0, { duration, easing: cubicOut });
  let element: HTMLElement;
  let hasIntersected = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasIntersected) {
          displayedValue.set(value);
          hasIntersected = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  });
</script>

<span bind:this={element}>
  {prefix}{($displayedValue).toFixed(decimalPlaces)}{suffix}
</span>
