<script lang="ts">
	export let dirty = false;
	export let pending = false;
	export let formId: string;
	export let successMessage = '';
	export let errorMessage = '';

	$: toneClass = errorMessage
		? 'border-red-200 bg-red-50 text-red-700'
		: successMessage
			? 'border-primary/30 bg-stone text-textcolor'
			: 'border-line bg-white text-secondary';
</script>

{#if dirty || pending || successMessage || errorMessage}
	<div class="fixed right-5 bottom-5 z-40 flex items-center gap-3 border px-4 py-3 shadow-sm {toneClass}">
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
			class="button-primary px-4 py-2 disabled:cursor-not-allowed disabled:border-line disabled:bg-stone disabled:text-secondary"
		>
			{pending ? 'Bezig' : 'Opslaan'}
		</button>
	</div>
{/if}
