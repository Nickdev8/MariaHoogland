<script lang="ts">
  // Define your pages or routes here
  const pages = [1, 2];
</script>

<section class="container mx-auto py-8 flex justify-center space-x-4">
  {#each pages as page}
    <a href="/{page}">
      <button
        class="px-6 py-3 bg-gradient-to-r bg-black text-white font-semibold rounded-xl shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105 cursor-pointer"
        aria-label="Go to page {page}"
      >
        {page}
      </button>
    </a>
  {/each}
</section>