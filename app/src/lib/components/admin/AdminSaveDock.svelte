<script lang="ts">
	export let dirty = false;
	export let pending = false;
	export let formId: string;
	export let successMessage = '';
	export let errorMessage = '';

	$: toneClass = errorMessage
		? 'border-red-200 bg-red-50 text-red-700'
		: successMessage
			? 'border-emerald-200 bg-emerald-50 text-emerald-700'
			: 'border-black/10 bg-white text-neutral-600';
</script>

{#if dirty || pending || successMessage || errorMessage}
	<div class="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] {toneClass}">
		<div class="min-w-[8rem] text-sm">
			{#if errorMessage}
				{errorMessage}
			{:else if successMessage}
				{successMessage}
			{:else if pending}
				Opslaan...
			{:else}
				Niet opgeslagen
			{/if}
		</div>
		<button
			type="submit"
			form={formId}
			disabled={pending || !dirty}
			class="rounded-full bg-secondary px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:bg-neutral-300"
		>
			{pending ? 'Bezig' : 'Opslaan'}
		</button>
	</div>
{/if}
