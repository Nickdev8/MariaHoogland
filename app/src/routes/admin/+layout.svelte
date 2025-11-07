<script lang="ts">
	let { data, children } = $props<{ data: { authenticated: boolean }; children: () => unknown }>();
</script>

<div class="min-h-screen bg-[#0f172a] text-white">
	{@render children()}
</div>
