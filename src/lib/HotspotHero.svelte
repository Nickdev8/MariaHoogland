<script lang="ts">
  export let src: string;
  export let alt: string;
</script>

<div class="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg shadow-lg">
  <img
    src={src}
    alt={alt}
    loading="lazy"
    sizes="(max-width: 768px) 100vw, 50vw"
    class="h-full w-full object-cover"
  />

  <!-- Caption at bottom -->
  <figcaption
    class="
      absolute 
      inset-x-0 
      bottom-0 
      bg-white bg-opacity-50 
      text-black 
      text-center 
      px-4 
      py-2 
      text-sm 
      backdrop-blur-sm
    "
  >
    {alt}
  </figcaption>
</div>
